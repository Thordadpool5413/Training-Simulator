import type { ConversationMessage, GeneratedResponse } from '@/types/simulator';

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

const SAFE_ROUTING_TERMS = [
  'hospice orders',
  'on-call provider',
  'on call provider',
  'do not want to guess',
  "don't want to guess",
  'cannot change',
  "can't change",
  'need to check',
  'provider should walk through',
  'follow the hospice orders',
  'i cannot change',
];

const MED_CONTEXT_TERMS = [
  'dose',
  'morphine',
  'medicine',
  'medication',
  'amount',
];

const FEAR_ACK_TERMS = [
  'hear how frightened',
  'hear how scared',
  'sounds frightening',
  'that must be scary',
  'watching someone struggle',
  'i can only imagine',
  'terrifying',
  'frightening',
  'hard to watch',
  'that is so hard',
  'must be so hard',
  'must feel so',
  'you are not alone',
  'that sounds hard',
  'so difficult',
  'scared',
  'frightened',
];

const AIR_HUNGER_TERMS = [
  'air hunger',
  'does not always mean',
  'can still look',
  'inside she may',
  'the sensation',
  'body signals',
  'even when the medication',
  'medication is helping',
  'still uncomfortable',
  'ease the sensation',
  'brain signal',
  'not the same as suffocating',
  'look distressed',
  'signaling distress',
];

const COMFORT_TOOL_TERMS = [
  'fan',
  'sitting up',
  'sit upright',
  'upright',
  'cool',
  'calm presence',
  'open window',
  'position',
  'sit beside',
  'stay beside',
  'comfortable position',
];

const WHEN_TO_CALL_TERMS = [
  'call the',
  'on-call',
  'on call',
  'hospice team',
  'not getting better',
  'not improving',
  'watch for',
  'signs to watch',
  'call hospice',
  'when to call',
];

const CLOSING_TERMS = [
  'not alone',
  'we are here',
  'stay with',
  'keep watching',
  'right beside',
  'close by',
  'with you',
  'you are doing',
  'you have done',
  'that is enough',
  'rest',
];

export function generateTerminalDyspneaResponse(
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): GeneratedResponse {
  const lower = learnerMessageText.toLowerCase();

  const hasEleanorSpoken = conversationMessages.some((m) => m.sender === 'patient');
  const hasWhenToCallAppeared = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('keeps getting worse')
  );
  const hasComfortToolsAppeared = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('use the fan')
  );
  const hasAirHungerEdAppeared = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('still look uncomfortable even when')
  );
  const hasEmotionalValidationAppeared = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('sitting with her for two hours')
  );
  const hasSafeRoutingResponseAppeared = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('do not want anyone guessing')
  );

  // Rule 1 — Safe medication routing recovery (highest priority)
  const hasMedContext = containsAny(lower, MED_CONTEXT_TERMS);
  const hasSafeRouting = containsAny(lower, SAFE_ROUTING_TERMS);
  if (hasMedContext && hasSafeRouting && !hasSafeRoutingResponseAppeared) {
    return {
      text: 'Okay. I do not want anyone guessing either. I just need to know who to call and what to watch for while we wait.',
      sender: 'family',
      speakerName: 'Carol',
    };
  }

  // Rule 2 — Emotional validation
  if (!hasEmotionalValidationAppeared && containsAny(lower, FEAR_ACK_TERMS)) {
    return {
      text: 'I have been sitting with her for two hours. I feel like I am watching her suffer and I cannot do anything about it.',
      sender: 'family',
      speakerName: 'Carol',
    };
  }

  // Rule 3 — Air hunger follow-up education
  if (
    (hasEmotionalValidationAppeared || hasSafeRoutingResponseAppeared) &&
    !hasAirHungerEdAppeared &&
    containsAny(lower, AIR_HUNGER_TERMS)
  ) {
    return {
      text: 'So it is possible for her to still look uncomfortable even when the medicine is helping her feel less panicked inside?',
      sender: 'family',
      speakerName: 'Carol',
    };
  }

  // Rule 4 — Comfort tools
  if (hasAirHungerEdAppeared && !hasComfortToolsAppeared && containsAny(lower, COMFORT_TOOL_TERMS)) {
    return {
      text: 'So I should use the fan and keep her sitting up? What else can I do right now?',
      sender: 'family',
      speakerName: 'Carol',
    };
  }

  // Rule 5 — When to call hospice
  if (hasComfortToolsAppeared && !hasWhenToCallAppeared && containsAny(lower, WHEN_TO_CALL_TERMS)) {
    return {
      text: 'What if it keeps getting worse? What if the on-call team says we need to change the dose?',
      sender: 'family',
      speakerName: 'Carol',
    };
  }

  // Rule 6 — Closing reassurance (Eleanor speaks) — must not fire too early
  if (hasWhenToCallAppeared && !hasEleanorSpoken && containsAny(lower, CLOSING_TERMS)) {
    return {
      text: 'I just want to rest.',
      sender: 'patient',
      speakerName: 'Eleanor',
    };
  }

  // Rule 7 — Fallback
  return {
    text: 'I just need someone to tell me what to do. I do not want to make the wrong call.',
    sender: 'family',
    speakerName: 'Carol',
  };
}
