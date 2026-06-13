import { createServer } from 'node:http';

type JsonObject = Record<string, any>;
type NamedMessage = { sender?: string; speakerName?: string; text?: string };
type UploadedFile = { buffer: any; filename: string; mimeType: string };

const PORT = Number(process.env.PORT ?? process.env.BACKEND_PORT ?? 3000);
const CLIENT_ID = process.env.BACKEND_CLIENT_ID ?? 'client_hospice_simulator';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim() ?? '';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY?.trim() ?? '';
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL?.trim() || 'claude-haiku-4-5';
const ANTHROPIC_EVALUATION_MODEL = process.env.ANTHROPIC_EVALUATION_MODEL?.trim() || 'claude-sonnet-4-6';
const OPENAI_TRANSCRIPTION_MODEL = process.env.OPENAI_TRANSCRIPTION_MODEL?.trim() || 'gpt-4o-mini-transcribe';
const OPENAI_SPEECH_MODEL = process.env.OPENAI_SPEECH_MODEL?.trim() || 'gpt-4o-mini-tts';

const ROLE_LABELS: Record<string, string> = {
  clinical_liaison: 'Clinical Liaison',
  rn: 'RN',
  social_worker: 'Social Worker',
};

const FALLBACK_TRANSCRIPTS = [
  'I want to understand what hospice will mean for my family.',
  'I am worried that choosing hospice means giving up.',
  'Can you help me understand what happens next?',
  'I hear the concern, but I still need more information.',
];

const EMPATHY_PHRASES = [
  'I hear how hard this is.',
  'That sounds really frightening.',
  'I can understand why that feels overwhelming.',
  'You are not alone in this.',
];

const COACH_PHRASES = [
  'Name the emotion before you explain the plan.',
  'Validate the fear, then give one clear next step.',
  'Stay within your role and route technical questions appropriately.',
  'Keep your wording concrete, calm, and compassionate.',
];

createServer(async (req: any, res: any) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

  setCommonHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (url.pathname === '/healthz') {
    sendJson(res, 200, {
      status: 'ok',
      mode: OPENAI_API_KEY || ANTHROPIC_API_KEY ? 'live-fallback' : 'local-seed',
      clientId: CLIENT_ID,
      providers: {
        openai: !!OPENAI_API_KEY,
        anthropic: !!ANTHROPIC_API_KEY,
      },
    });
    return;
  }

  const clientId = String(req.headers['x_client_id'] ?? req.headers['x-client-id'] ?? '');
  if (clientId !== CLIENT_ID) {
    sendJson(res, 401, { error: 'Unauthorized client' });
    return;
  }

  const rawBody = await readBody(req);
  const bodyText = rawBody.toString('utf8');
  const body = tryParseJson(bodyText);

  if (url.pathname === '/anthropic/simulate-response' && req.method === 'POST') {
    const liveText = await generatePatientResponse(body);
    sendJson(res, 200, { text: liveText ?? buildPatientResponse(body) });
    return;
  }

  if (url.pathname === '/anthropic/coach-hint' && req.method === 'POST') {
    const liveHint = await generateCoachHint(body);
    sendJson(res, 200, { hint: liveHint ?? buildCoachHint(body) });
    return;
  }

  if (url.pathname === '/anthropic/evaluate-simulation' && req.method === 'POST') {
    const liveEvaluation = await generateEvaluation(body);
    const fallbackEvaluation = buildEvaluation(body);
    sendJson(res, 200, liveEvaluation ? mergeEvaluation(fallbackEvaluation, liveEvaluation) : fallbackEvaluation);
    return;
  }

  if (url.pathname === '/openai/mobile-transcribe' && req.method === 'POST') {
    const uploadedFile = parseMultipartUpload(rawBody, req.headers['content-type']);
    const transcript = uploadedFile ? await transcribeAudio(uploadedFile) : null;
    sendJson(res, 200, {
      userTranscript: transcript ?? buildTranscript(bodyText),
    });
    return;
  }

  if (url.pathname === '/openai/speak' && req.method === 'POST') {
    const text = String(body?.text ?? '');
    const liveSpeech = text ? await generateSpeech(text, String(body?.voice ?? 'alloy')) : null;
    sendJson(res, 200, {
      audioBase64: liveSpeech?.audioBase64 ?? makeToneWavBase64(body?.text),
      audioMimeType: liveSpeech?.audioMimeType ?? 'audio/wav',
    });
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
}).listen(PORT, () => {
  console.log(`[backend] Hospice simulator proxy listening on http://localhost:${PORT}`);
});

function setCommonHeaders(res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x_client_id, x-client-id');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
}

function sendJson(res: any, status: number, payload: JsonObject) {
  res.writeHead(status);
  res.end(JSON.stringify(payload));
}

function readBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    let size = 0;
    req.on('data', (chunk: any) => {
      const buffer = typeof chunk === 'string' ? Buffer.from(chunk) : chunk;
      chunks.push(buffer);
      size += buffer.length;
      if (size > 15_000_000) {
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function tryParseJson(text: string): JsonObject {
  if (!text.trim()) return {};
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === 'object' ? (parsed as JsonObject) : {};
  } catch {
    return {};
  }
}

async function generatePatientResponse(body: JsonObject): Promise<string | null> {
  const prompt = [
    'Scenario context:',
    JSON.stringify(
      {
        scenarioId: body.scenarioId,
        scenarioTitle: body.scenarioTitle,
        setting: body.setting,
        role: body.role,
        learnerObjective: body.learnerObjective,
        hiddenFamilyFear: body.hiddenFamilyFear,
        recentClinicalChange: body.recentClinicalChange,
        whoIsPresent: body.whoIsPresent,
        patientState: body.patientState,
        conversationHistory: body.conversationHistory,
      },
      null,
      2
    ),
    '',
    'Write the next response as the patient or family member in one or two short sentences.',
    'Stay emotionally realistic, avoid mentioning that you are an AI, and do not add coaching or labels.',
  ].join('\n');

  return callAnthropicText({
    model: ANTHROPIC_MODEL,
    maxTokens: 120,
    temperature: 0.7,
    system:
      'You are a fictional hospice patient or family member in a training simulator. Respond only with the next line of dialogue.',
    prompt,
  });
}

async function generateCoachHint(body: JsonObject): Promise<string | null> {
  const prompt = [
    'Learner context:',
    JSON.stringify(
      {
        scenarioId: body.scenarioId,
        scenarioTitle: body.scenarioTitle,
        role: body.role,
        learnerObjective: body.learnerObjective,
        recentTranscript: body.recentTranscript,
      },
      null,
      2
    ),
    '',
    'Return one short coaching hint, no more than 18 words.',
    'Focus on the next best communication move. Do not mention scoring or policy.',
  ].join('\n');

  return callAnthropicText({
    model: ANTHROPIC_MODEL,
    maxTokens: 80,
    temperature: 0.2,
    system:
      'You are a concise hospice communication coach. Give one practical next-step hint.',
    prompt,
  });
}

async function generateEvaluation(body: JsonObject): Promise<JsonObject | null> {
  const prompt = [
    'Evaluate this hospice training session and return only JSON.',
    'Required keys: overallImpression, topStrength, topGrowthArea, coachingNotes, modelResponse.',
    'coachingNotes must be an array of three short strings.',
    'Do not include markdown, fences, or extra commentary.',
    '',
    JSON.stringify(
      {
        scenarioId: body.scenarioId,
        scenarioTitle: body.scenarioTitle,
        role: body.role,
        learnerObjective: body.learnerObjective,
        roleReminder: body.roleReminder,
        hiddenFamilyFear: body.hiddenFamilyFear,
        successCriteria: body.successCriteria,
        failureCriteria: body.failureCriteria,
        transcript: body.transcript,
        safetyEventCount: body.safetyEventCount,
        overallScore: body.overallScore,
      },
      null,
      2
    ),
  ].join('\n');

  const text = await callAnthropicText({
    model: ANTHROPIC_EVALUATION_MODEL,
    maxTokens: 450,
    temperature: 0.25,
    system:
      'You are grading a hospice communication simulation. Return a concise JSON object only.',
    prompt,
  });

  if (!text) return null;
  return parseLooseJson(text);
}

async function generateSpeech(
  text: string,
  voice: string
): Promise<{ audioBase64: string; audioMimeType: string } | null> {
  if (!OPENAI_API_KEY) return null;
  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_SPEECH_MODEL,
        input: text,
        voice,
      }),
    });

    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    return {
      audioBase64: Buffer.from(arrayBuffer).toString('base64'),
      audioMimeType: response.headers.get('content-type') ?? 'audio/mpeg',
    };
  } catch {
    return null;
  }
}

async function transcribeAudio(file: UploadedFile): Promise<string | null> {
  if (!OPENAI_API_KEY) return null;
  try {
    const formData = new FormData();
    formData.set('model', OPENAI_TRANSCRIPTION_MODEL);
    formData.set('file', new Blob([file.buffer], { type: file.mimeType }), file.filename);

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) return null;
    const data = (await response.json()) as { text?: string };
    const transcript = typeof data.text === 'string' ? data.text.trim() : '';
    return transcript || null;
  } catch {
    return null;
  }
}

function mergeEvaluation(fallback: JsonObject, live: JsonObject): JsonObject {
  const coachingNotes = Array.isArray(live.coachingNotes)
    ? live.coachingNotes.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean).slice(0, 3)
    : fallback.coachingNotes;

  return {
    ...fallback,
    overallImpression:
      typeof live.overallImpression === 'string' && live.overallImpression.trim()
        ? live.overallImpression.trim()
        : fallback.overallImpression,
    topStrength:
      typeof live.topStrength === 'string' && live.topStrength.trim()
        ? live.topStrength.trim()
        : fallback.topStrength,
    topGrowthArea:
      typeof live.topGrowthArea === 'string' && live.topGrowthArea.trim()
        ? live.topGrowthArea.trim()
        : fallback.topGrowthArea,
    coachingNotes,
    modelResponse:
      typeof live.modelResponse === 'string' && live.modelResponse.trim()
        ? live.modelResponse.trim()
        : fallback.modelResponse,
  };
}

function parseLooseJson(text: string): JsonObject | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  try {
    const parsed = JSON.parse(trimmed);
    return parsed && typeof parsed === 'object' ? (parsed as JsonObject) : null;
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      const parsed = JSON.parse(match[0]);
      return parsed && typeof parsed === 'object' ? (parsed as JsonObject) : null;
    } catch {
      return null;
    }
  }
}

async function callAnthropicText(params: {
  system: string;
  prompt: string;
  model: string;
  maxTokens: number;
  temperature: number;
}): Promise<string | null> {
  if (!ANTHROPIC_API_KEY) return null;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: params.model,
        max_tokens: params.maxTokens,
        temperature: params.temperature,
        system: params.system,
        messages: [
          {
            role: 'user',
            content: params.prompt,
          },
        ],
      }),
    });

    if (!response.ok) return null;
    const data = (await response.json()) as { content?: Array<{ type?: string; text?: string }> };
    const text = (data.content ?? [])
      .map((block) => (block.type === 'text' && typeof block.text === 'string' ? block.text : ''))
      .join('')
      .trim();
    return text || null;
  } catch {
    return null;
  }
}

function parseMultipartUpload(body: any, contentType: string | undefined): UploadedFile | null {
  if (!contentType) return null;
  const boundaryMatch = /boundary="?([^";]+)"?/i.exec(contentType);
  if (!boundaryMatch) return null;

  const boundary = Buffer.from(`--${boundaryMatch[1]}`);
  const separator = Buffer.from('\r\n\r\n');
  const closingBoundary = Buffer.from(`--${boundaryMatch[1]}--`);
  let cursor = 0;

  while (cursor < body.length) {
    const start = body.indexOf(boundary, cursor);
    if (start === -1) break;

    const afterBoundary = start + boundary.length;
    if (body.slice(afterBoundary, afterBoundary + 2).toString('utf8') === '--') break;

    const headerStart = body.slice(afterBoundary, afterBoundary + 2).toString('utf8') === '\r\n'
      ? afterBoundary + 2
      : afterBoundary;
    const headerEnd = body.indexOf(separator, headerStart);
    if (headerEnd === -1) break;

    const nextBoundary = body.indexOf(boundary, headerEnd + separator.length);
    const partEnd = nextBoundary === -1 ? body.length : nextBoundary - 2;
    const headersText = body.slice(headerStart, headerEnd).toString('utf8');
    const disposition = /content-disposition:\s*form-data;\s*name="([^"]+)"(?:;\s*filename="([^"]+)")?/i.exec(headersText);
    const mime = /content-type:\s*([^\r\n;]+)/i.exec(headersText);
    const content = body.slice(headerEnd + separator.length, partEnd);

    if (disposition?.[1]) {
      const fieldName = disposition[1];
      const filename = disposition[2] || `${fieldName}.bin`;
      if (fieldName === 'audio' || disposition[2]) {
        return {
          buffer: content,
          filename,
          mimeType: mime?.[1] || 'application/octet-stream',
        };
      }
    }

    cursor = nextBoundary === -1 ? body.length : nextBoundary;
  }

  if (body.indexOf(closingBoundary) !== -1) return null;
  return null;
}

function buildPatientResponse(body: JsonObject): string {
  const scenarioTitle = String(body.scenarioTitle ?? 'this scenario');
  const role = String(body.role ?? 'clinician');
  const roleLabel = ROLE_LABELS[role] ?? role;
  const conversation = Array.isArray(body.conversationHistory)
    ? (body.conversationHistory as NamedMessage[])
    : [];
  const lastLearner = [...conversation].reverse().find((message) => message.sender === 'learner')?.text ?? '';
  const lastLower = lastLearner.toLowerCase();
  const fear = String(body.hiddenFamilyFear ?? 'what hospice will mean for my family');

  if (containsAny(lastLower, ['medication', 'dose', 'prescribe', 'order'])) {
    return `I do not want to miss anything. Can the ${roleLabel} explain the medication part in plain language?`;
  }

  if (containsAny(lastLower, ['hospice', 'giving up', 'stop', 'bad news'])) {
    return `It still feels like hospice means giving up. ${fear.charAt(0).toUpperCase()}${fear.slice(1)} is what I keep coming back to.`;
  }

  if (containsAny(lastLower, ['understand', 'hear', 'support', 'sorry', 'scared'])) {
    return `${pick(EMPATHY_PHRASES)} I am listening, but I still need to understand what happens next.`;
  }

  if (conversation.length <= 1) {
    return `I am overwhelmed and trying to understand what hospice would actually do for us.`;
  }

  return `I hear you, but I am still not sure what hospice would look like for my family. Can you walk me through it more clearly?`;
}

function buildCoachHint(body: JsonObject): string {
  const role = String(body.role ?? 'clinician');
  const roleLabel = ROLE_LABELS[role] ?? role;
  const transcript = String(body.recentTranscript ?? '').toLowerCase();

  if (!transcript.trim()) {
    return `Open with a reflective statement, then ask a question that surfaces the family's main fear.`;
  }

  if (containsAny(transcript, ['medication', 'dose', 'prescribe', 'order']) && role !== 'rn') {
    return `Stay within ${roleLabel} scope. Validate the concern, then route medication questions to the hospice nurse or provider.`;
  }

  if (!containsAny(transcript, ['hear', 'understand', 'sorry', 'support', 'can imagine'])) {
    return `Slow down and name the emotion before moving into education.`;
  }

  return pick(COACH_PHRASES);
}

function buildEvaluation(body: JsonObject): JsonObject {
  const role = String(body.role ?? 'clinician');
  const roleLabel = ROLE_LABELS[role] ?? role;
  const transcript = String(body.transcript ?? '').toLowerCase();
  const overallScore = Number(body.overallScore ?? 0);
  const successCriteria = Array.isArray(body.successCriteria) ? (body.successCriteria as string[]) : [];
  const failureCriteria = Array.isArray(body.failureCriteria) ? (body.failureCriteria as string[]) : [];

  const empathyScore = clamp(
    1 +
      (containsAny(transcript, ['hear', 'understand', 'sorry', 'support', 'can imagine']) ? 2 : 0) +
      (containsAny(transcript, ['emotion', 'fear', 'scared', 'worried']) ? 1 : 0) +
      (containsAny(transcript, ['thank', 'appreciate']) ? 1 : 0),
    1,
    5
  );

  const clarityScore = clamp(
    2 +
      (transcript.length > 120 ? 1 : 0) +
      (transcript.length > 60 ? 1 : 0) +
      (transcript.length > 260 ? -1 : 0) +
      (containsAny(transcript, ['next step', 'here is', 'what will happen']) ? 1 : 0),
    1,
    5
  );

  const professionalismScore = clamp(
    2 +
      (containsAny(transcript, ['please', 'thank', 'understand', 'help']) ? 1 : 0) +
      (containsAny(transcript, ['medication']) && role !== 'rn' ? -1 : 0) +
      (containsAny(transcript, ['i can', 'we can', 'let me']) ? 1 : 0),
    1,
    5
  );

  const criteriaResults = [
    ...successCriteria.slice(0, 4).map((criterion) => ({
      criterion,
      met: criterionLooksMet(criterion, transcript),
    })),
    ...failureCriteria.slice(0, 4).map((criterion) => ({
      criterion: `Avoid: ${criterion}`,
      met: !criterionLooksMet(criterion, transcript),
    })),
  ];

  const coachingNotes = [
    containsAny(transcript, ['hear', 'understand', 'sorry', 'support'])
      ? 'You opened with empathy, which helped lower the emotional temperature.'
      : 'Start by reflecting the emotion before adding information.',
    containsAny(transcript, ['next step', 'will happen', 'here is'])
      ? 'Your next step was clear and easy to follow.'
      : 'Offer one concrete next step so the family is not left guessing.',
    containsAny(transcript, ['medication']) && role !== 'rn'
      ? 'Medication questions need role-safe routing to the hospice nurse or provider.'
      : 'Keep your scope boundaries crisp and reassuring.',
  ];

  const summaryLead =
    empathyScore >= 4
      ? 'You stayed present and grounded the conversation with compassion.'
      : professionalismScore >= 4
      ? 'You kept the conversation structured, but there is room to make it warmer.'
      : 'You have a good starting point, but the conversation needs more emotional attunement.';

  const growthArea =
    empathyScore < clarityScore
      ? 'Lead with a more explicit reflection of the family fear.'
      : professionalismScore < 4
      ? 'Tighten your role boundaries and route technical questions to the right team member.'
      : 'Make your next step more concrete and easier to follow.';

  return {
    overallImpression: `${summaryLead} ${roleLabel ? `This ${roleLabel.toLowerCase()} response is strongest when it balances reassurance with clarity.` : ''}`.trim(),
    empathyScore,
    clarityScore,
    professionalismScore,
    topStrength:
      empathyScore >= clarityScore && empathyScore >= professionalismScore
        ? 'Empathy and presence'
        : clarityScore >= professionalismScore
        ? 'Clear direction'
        : 'Professional boundaries',
    topGrowthArea: growthArea,
    coachingNotes,
    criteriaResults,
    modelResponse: buildModelResponse(roleLabel),
    overallScore: overallScore || undefined,
  };
}

function buildModelResponse(roleLabel: string): string {
  return `A strong ${roleLabel.toLowerCase()} response might sound like: "I hear how frightening this feels. Hospice is about comfort, support, and staying with you through this."`;
}

function buildTranscript(rawBody: string): string {
  const index = hashString(rawBody) % FALLBACK_TRANSCRIPTS.length;
  return FALLBACK_TRANSCRIPTS[index] ?? FALLBACK_TRANSCRIPTS[0];
}

function makeToneWavBase64(text?: string): string {
  const durationSeconds = clamp((text?.length ?? 60) / 260, 0.24, 0.72);
  const sampleRate = 22050;
  const channels = 1;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const sampleCount = Math.max(1, Math.floor(sampleRate * durationSeconds));
  const dataSize = sampleCount * bytesPerSample * channels;
  const buffer = Buffer.alloc(44 + dataSize);
  const amplitude = 0.045;
  const frequency = 220;

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * channels * bytesPerSample, 28);
  buffer.writeUInt16LE(channels * bytesPerSample, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < sampleCount; i += 1) {
    const sample = Math.round(Math.sin((2 * Math.PI * frequency * i) / sampleRate) * 32767 * amplitude);
    buffer.writeInt16LE(sample, 44 + i * 2);
  }

  return buffer.toString('base64');
}

function criterionLooksMet(criterion: string, transcript: string): boolean {
  const keywords = extractKeywords(criterion);
  if (keywords.length === 0) return false;
  return keywords.some((keyword) => transcript.includes(keyword));
}

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((token) => token.length > 3 && !STOP_WORDS.has(token))
    .slice(0, 5);
}

function containsAny(text: string, needles: string[]): boolean {
  return needles.some((needle) => text.includes(needle));
}

function pick(values: string[]): string {
  return values[hashString(values.join('|')) % values.length] ?? values[0] ?? '';
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

const STOP_WORDS = new Set([
  'this',
  'that',
  'with',
  'from',
  'your',
  'will',
  'have',
  'about',
  'there',
  'their',
  'would',
  'could',
  'should',
  'family',
  'hospice',
  'please',
  'patient',
  'scenario',
]);
