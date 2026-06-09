import type { ConversationMessage, GeneratedResponse } from '@/types/simulator';

function containsAny(text: string, terms: string[]): boolean {
  return terms.some((t) => text.includes(t));
}

const EMOTIONAL_VALIDATION_TERMS = [
  'hard',
  'difficult',
  'understand',
  'hear',
  'love',
  'protect',
  'worry',
  'scared',
  'afraid',
  'carry',
  'weight',
];

const REVOCATION_TERMS = [
  'revoke',
  'can change',
  'change your mind',
  'change course',
  'not permanent',
  'not locked',
  'your choice',
  'can stop',
  'withdraw',
  'undo',
  'take back',
];

const SUPPORT_TERMS = [
  'nurse',
  'team',
  'aide',
  'social worker',
  'chaplain',
  'visit',
  'support',
  'help',
];

const REFRAME_TERMS = [
  'does not mean',
  'focus changes',
  'comfort',
  'continues',
  'will not stop',
  'not alone',
  'still here',
  'still care',
  'still support',
];

const REPAIR_TERMS = [
  'said that poorly',
  'sorry',
  'let me correct',
  'what i meant',
  'misspoke',
  'clarify',
  'rephrase',
];

const MED_CONTEXT_TERMS = [
  'medication',
  'medications',
  'morphine',
  'medicine',
  'dose',
];

const MED_ROUTING_TERMS = [
  'provider',
  'nurse',
  'hospice orders',
  'do not want to guess',
  'walk through',
];

export function generateHusbandResponse(
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): GeneratedResponse {
  void conversationMessages;
  const lower = learnerMessageText.toLowerCase();

  // Rule 1 — Emotional validation
  if (containsAny(lower, EMOTIONAL_VALIDATION_TERMS)) {
    return {
      sender: 'family',
      speakerName: 'Frank',
      text: 'I have been her husband for forty-three years. I just need to know we are doing right by her.',
    };
  }

  // Rule 2 — Revocation and choice education
  if (containsAny(lower, REVOCATION_TERMS)) {
    return {
      sender: 'family',
      speakerName: 'Frank',
      text: 'So this is not permanent? We could actually stop and ask for different care if something changed?',
    };
  }

  // Rule 3 — Support and services
  if (containsAny(lower, SUPPORT_TERMS)) {
    return {
      sender: 'family',
      speakerName: 'Frank',
      text: 'She would still have people coming to see her? She would not just be left alone?',
    };
  }

  // Rule 4 — Hospice reframe
  if (containsAny(lower, REFRAME_TERMS)) {
    return {
      sender: 'family',
      speakerName: 'Frank',
      text: 'I did not know that. I thought once we signed, everyone would just step back.',
    };
  }

  // Rule 5 — Repair language
  if (containsAny(lower, REPAIR_TERMS)) {
    return {
      sender: 'family',
      speakerName: 'Frank',
      text: 'I appreciate you being straight with me. I just need to be sure before I can say yes.',
    };
  }

  // Rule 6 — Safe medication routing
  const hasMedContext = containsAny(lower, MED_CONTEXT_TERMS);
  const hasRoutingOrRefusal = containsAny(lower, MED_ROUTING_TERMS);
  if (hasMedContext && hasRoutingOrRefusal) {
    return {
      sender: 'family',
      speakerName: 'Frank',
      text: 'That makes sense. I do not want anyone guessing with her medications either. I just need to know the right person will walk us through it.',
    };
  }

  // Fallback
  return {
    sender: 'family',
    speakerName: 'Frank',
    text: 'I just need to know we can still protect her if something changes.',
  };
}
