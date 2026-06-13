import type { ConversationMessage, GeneratedResponse } from '@/types/simulator';

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

const FEAR_ACK_TERMS = [
  'frightening', 'frightened', 'scared', 'terrifying', 'hear how',
  'watching', 'hard to see', 'hard to watch', 'stay with you', 'not alone',
  'real', 'that makes sense', 'afraid',
];

const DYING_PROCESS_TERMS = [
  'mottling', 'blotchy', 'natural process', 'actively dying', 'dying process',
  'cheyne-stokes', 'cheyne stokes', 'breathing pattern', 'not in pain',
  'letting go', 'body is shutting', 'final stage', 'does not mean she is suffering',
];

const COMFORT_TERMS = [
  'stay beside', 'hold her hand', 'talk to her', 'mouth care', 'position',
  'comfortable', 'cool cloth', 'calm', 'quiet', 'she can still hear',
];

const SAFE_MED_TERMS = [
  'hospice orders', 'on-call', 'on call', 'hospice team', 'provider',
  'do not want to guess', 'needs to come from', 'cannot change',
];

const VIGIL_TERMS = [
  'stay with her', 'be present', 'your presence', 'she knows you are here',
  'not leave her', 'vigil', 'beside her', 'hold her',
];

const EMERGENCY_TERMS = [
  '911', 'hospital', 'emergency room', 'emergency department', 'ambulance',
];

export function generateActiveDyingResponse(
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): GeneratedResponse {
  const hasHandSqueeze = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('stopped squeezing my hand')
  );
  const hasMorphineQuestion = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('give her something for the pain')
  );
  const hasFamilyQuestion = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('call everyone')
  );
  const hasClosing = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('I will stay with her')
  );

  const learnerCount = conversationMessages.filter((m) => m.sender === 'learner').length;

  const hasEmergency = containsAny(learnerMessageText, EMERGENCY_TERMS);
  const hasDyingProcess = containsAny(learnerMessageText, DYING_PROCESS_TERMS);
  const hasComfort = containsAny(learnerMessageText, COMFORT_TERMS);
  const hasSafeMed = containsAny(learnerMessageText, SAFE_MED_TERMS);
  const hasVigil = containsAny(learnerMessageText, VIGIL_TERMS);
  const hasFearAck = containsAny(learnerMessageText, FEAR_ACK_TERMS);

  // Rule 1 — Learner suggests 911 or hospital (incorrect escalation)
  if (hasEmergency) {
    return {
      text: 'But I thought — I thought we were supposed to call someone. She looks terrible. Are you sure there is nothing the hospital can do?',
      sender: 'family',
      speakerName: 'Patricia',
    };
  }

  // Rule 2 — Close the arc after family question addressed
  if (hasFamilyQuestion && !hasClosing && (hasVigil || hasComfort)) {
    return {
      text: 'Okay. I will stay with her. Thank you for helping me understand what I am supposed to do right now.',
      sender: 'family',
      speakerName: 'Patricia',
    };
  }

  // Rule 3 — Safe medication routing after morphine question
  if (hasMorphineQuestion && !hasFamilyQuestion && hasSafeMed) {
    return {
      text: 'Should I call everyone now? I do not want anyone to miss this if she is close.',
      sender: 'family',
      speakerName: 'Patricia',
    };
  }

  // Rule 4 — Morphine question appears after dying process explained
  if (hasHandSqueeze && !hasMorphineQuestion && (hasComfort || hasDyingProcess)) {
    return {
      text: 'Can we give her something for the pain? I do not know if she is hurting.',
      sender: 'family',
      speakerName: 'Patricia',
    };
  }

  // Rule 5 — Patricia reveals hand squeeze stopped after dying process explained
  if (!hasHandSqueeze && hasDyingProcess) {
    return {
      text: 'She stopped squeezing my hand earlier. I keep talking to her but I do not know if she hears me.',
      sender: 'family',
      speakerName: 'Patricia',
    };
  }

  // Rule 6 — Fear acknowledgment unlocks more detail
  if (!hasHandSqueeze && hasFearAck) {
    return {
      text: 'She has not opened her eyes since this morning and her breathing keeps stopping for a few seconds. I am terrified that one of those times it will not start again.',
      sender: 'family',
      speakerName: 'Patricia',
    };
  }

  // Rule 7 — Fallback
  const fallbacks = [
    'I just do not know what I am supposed to do right now.',
    'Should I be doing something? I feel like I should be doing something.',
    'Is she in pain? How would I even know if she was in pain?',
  ];
  const fallbackText = fallbacks[Math.min(learnerCount, fallbacks.length - 1)];
  return { text: fallbackText, sender: 'family', speakerName: 'Patricia' };
}
