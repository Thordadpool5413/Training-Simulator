import type { ConversationMessage, GeneratedResponse } from '@/types/simulator';

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

const FEAR_ACK_TERMS = [
  'frightening', 'frightened', 'scared', 'hear how', 'terrifying',
  'watching', 'hard to hear', 'hard to watch', 'stay with you', 'not alone',
  'real', 'makes sense', 'afraid',
];

const SECRETION_EXPLANATION_TERMS = [
  'not drowning', 'not choking', 'secretions', 'throat muscles', 'relaxing',
  'not aware', 'does not feel', 'not experiencing', 'gurgling', 'from outside',
  'not in distress', 'natural',
];

const SUCTION_REFUSAL_TERMS = [
  'suctioning would not', 'suction does not', 'would not help', 'uncomfortable',
  'no benefit to suctioning', 'suctioning is', 'would cause discomfort',
];

const COMFORT_TERMS = [
  'reposition', 'side', 'elevate', 'head of bed', 'cool cloth', 'mouth swab',
  'calm', 'beside him', 'stay with', 'quiet', 'comfort',
];

const SAFE_MED_TERMS = [
  'hospice orders', 'on-call', 'on call', 'hospice team', 'provider',
  'do not want to guess', 'needs to come from', 'cannot change',
];

const HONEST_ANSWER_TERMS = [
  'may not stop', 'might not stop', 'sound may continue', 'cannot promise',
  'does not always stop', 'not guarantee', 'ease', 'reduce', 'lessen',
];

export function generateTerminalSecretionResponse(
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): GeneratedResponse {
  const hasSuctionAttempt = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('I already tried')
  );
  const hasMorphineQuestion = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('give him something')
  );
  const hasSoundQuestion = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('Will the sound stop')
  );
  const hasClosing = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('At least I understand')
  );

  const learnerCount = conversationMessages.filter((m) => m.sender === 'learner').length;

  const hasFearAck = containsAny(learnerMessageText, FEAR_ACK_TERMS);
  const hasSecretionExp = containsAny(learnerMessageText, SECRETION_EXPLANATION_TERMS);
  const hasSuctionRefusal = containsAny(learnerMessageText, SUCTION_REFUSAL_TERMS);
  const hasComfort = containsAny(learnerMessageText, COMFORT_TERMS);
  const hasSafeMed = containsAny(learnerMessageText, SAFE_MED_TERMS);
  const hasHonestAnswer = containsAny(learnerMessageText, HONEST_ANSWER_TERMS);

  // Rule 1 — Close the arc after honest answer about sound
  if (hasSoundQuestion && !hasClosing && (hasHonestAnswer || hasComfort)) {
    return {
      text: 'Okay. At least I understand now. I thought I was watching him drown and there was nothing I could do.',
      sender: 'family',
      speakerName: 'Linda',
    };
  }

  // Rule 2 — Will the sound stop? (after comfort tools described)
  if (hasMorphineQuestion && !hasSoundQuestion && (hasSafeMed || hasComfort)) {
    return {
      text: 'Will the sound stop eventually? Or is this how it is going to be until the end?',
      sender: 'family',
      speakerName: 'Linda',
    };
  }

  // Rule 3 — After secretion explanation, Linda asks about medication
  if (hasSuctionAttempt && !hasMorphineQuestion && (hasSecretionExp || hasSuctionRefusal)) {
    return {
      text: 'Can you give him something to make the sound stop? There must be a medication for this.',
      sender: 'family',
      speakerName: 'Linda',
    };
  }

  // Rule 4 — Linda reveals she tried suctioning after fear ack
  if (!hasSuctionAttempt && hasFearAck) {
    return {
      text: 'I already tried to suction him with the small suction machine we have but it did not help. He made a sound like it hurt.',
      sender: 'family',
      speakerName: 'Linda',
    };
  }

  // Rule 5 — Secretion explanation without suction info
  if (!hasSuctionAttempt && hasSecretionExp) {
    return {
      text: 'Are you sure he is not in pain from the sound? He looks so uncomfortable.',
      sender: 'family',
      speakerName: 'Linda',
    };
  }

  // Rule 6 — Fallback
  const fallbacks = [
    'I just do not know what to do. I cannot stand the sound.',
    'Is there anything I can do right now to help him?',
    'Should I call someone else? I feel helpless.',
  ];
  const fallbackText = fallbacks[Math.min(learnerCount, fallbacks.length - 1)];
  return { text: fallbackText, sender: 'family', speakerName: 'Linda' };
}
