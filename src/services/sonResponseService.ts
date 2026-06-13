import type { ConversationMessage, GeneratedResponse } from '@/types/simulator';

function containsAny(text: string, terms: string[]): boolean {
  return terms.some((t) => text.includes(t));
}

const EMOTIONAL_VALIDATION_TERMS = [
  'understand',
  'love',
  'protect',
  'hope',
  'hard',
  'difficult',
  'scared',
  'worried',
];

const TIMING_TERMS = [
  'six month',
  '6 month',
  'months',
  'prognosis',
  'eligible',
  'qualify',
  'not only for the final days',
  'not just the final days',
];

const SUPPORT_TERMS = [
  'nurse',
  'team',
  'visit',
  'social worker',
  'chaplain',
  'equipment',
  'supplies',
  'support',
];

const COMFORT_TERMS = [
  'comfort',
  'quality of life',
  'feel like herself',
  'every day',
  'focus',
];

const REFRAME_TERMS = [
  'not giving up',
  'still support',
  'more support',
  'alongside',
  'care continues',
];

export function generateSonResponse(
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): GeneratedResponse {
  void conversationMessages;
  const lower = learnerMessageText.toLowerCase();

  // Rule 1 — Emotional validation
  if (containsAny(lower, EMOTIONAL_VALIDATION_TERMS)) {
    return {
      sender: 'family',
      speakerName: 'Marcus',
      text: 'I just do not want to give up on her too soon. She is still herself.',
    };
  }

  // Rule 2 — Hospice timing education
  if (containsAny(lower, TIMING_TERMS)) {
    return {
      sender: 'family',
      speakerName: 'Marcus',
      text: 'So hospice can start before someone is down to the last few days?',
    };
  }

  // Rule 3 — Hospice support explanation
  if (containsAny(lower, SUPPORT_TERMS)) {
    return {
      sender: 'family',
      speakerName: 'Marcus',
      text: 'Would she still get help with symptoms, or does that stop when treatment stops?',
    };
  }

  // Rule 4 — Quality of life or comfort focus
  if (containsAny(lower, COMFORT_TERMS)) {
    return {
      sender: 'family',
      speakerName: 'Marcus',
      text: 'She keeps telling me she just wants to feel like herself. I thought there was more time.',
    };
  }

  // Rule 5 — Reframe
  if (containsAny(lower, REFRAME_TERMS)) {
    return {
      sender: 'family',
      speakerName: 'Marcus',
      text: 'I never thought of it that way. I figured once you call hospice, that means there is no going back.',
    };
  }

  // Fallback
  return {
    sender: 'family',
    speakerName: 'Marcus',
    text: 'I hear what you are saying, but are you telling me she is already at that point?',
  };
}
