import { BACKEND_URL, CLIENT_ID } from '@/constants/api';
import type { ConversationMessage } from '@/types/simulator';

export async function fetchCoachHint(params: {
  scenarioId: string;
  scenarioTitle: string;
  role: string;
  learnerObjective: string;
  recentMessages: ConversationMessage[];
}): Promise<string | null> {
  try {
    const transcript = params.recentMessages
      .filter((m) => m.sender !== 'system')
      .map((m) => `${m.speakerName}: ${m.text}`)
      .join('\n');

    const response = await fetch(`${BACKEND_URL}/anthropic/coach-hint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        x_client_id: CLIENT_ID,
      },
      body: JSON.stringify({
        scenarioId: params.scenarioId,
        scenarioTitle: params.scenarioTitle,
        role: params.role,
        learnerObjective: params.learnerObjective,
        recentTranscript: transcript,
      }),
    });

    if (!response.ok) return null;
    const data = (await response.json()) as { hint?: string };
    return typeof data.hint === 'string' && data.hint.trim() ? data.hint.trim() : null;
  } catch {
    return null;
  }
}
