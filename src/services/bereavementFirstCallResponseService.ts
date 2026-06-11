import type { ConversationMessage, GeneratedResponse } from '@/types/simulator';

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

const EMOTIONAL_ACK_TERMS = [
  'hear', 'understand', 'makes sense', 'real', 'grief', 'hard',
  'what you are describing', 'painful', 'difficult', 'that is',
  'not alone', 'with you',
];

const GRIEF_NORMALIZATION_TERMS = [
  'normal', 'common', 'many people', 'others', 'not unusual', 'natural',
  'protecting', 'waking up', 'forgetting', 'early grief', 'first weeks',
  'not a sign of', 'does not mean', 'temporary',
];

const BEREAVEMENT_EDUCATION_TERMS = [
  'bereavement program', 'support group', 'grief counselor', 'counselor',
  'grief support', 'resources', 'available to you', 'bereavement team',
  'ongoing support', 'follow-up', 'calls from',
];

const COMPLICATED_GRIEF_TERMS = [
  'function', 'daily life', 'eating', 'sleeping', 'getting out', 'leaving the house',
  'thoughts of', 'check in', 'how you are doing', 'any concerns',
  'specialist', 'referral',
];

const MINIMIZATION_TERMS = [
  'time heals', 'it will get better soon', 'you just need to', 'keep busy',
  'stay strong', 'move on', 'get back to normal', 'distract yourself',
  'it has only been', 'give it time',
];

const PATHOLOGIZING_TERMS = [
  'complicated grief', 'disorder', 'you may need therapy', 'abnormal grief',
  'grief disorder', 'pathological', 'not coping well', 'clinical',
];

export function generateBereavementFirstCallResponse(
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): GeneratedResponse {
  const hasThomasMemory = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('he used to make coffee')
  );
  const hasResourceInterest = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('What kind of support')
  );
  const hasClosing = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('That helps me')
  );

  const learnerCount = conversationMessages.filter((m) => m.sender === 'learner').length;

  const hasEmotionalAck = containsAny(learnerMessageText, EMOTIONAL_ACK_TERMS);
  const hasGriefNorm = containsAny(learnerMessageText, GRIEF_NORMALIZATION_TERMS);
  const hasBereavement = containsAny(learnerMessageText, BEREAVEMENT_EDUCATION_TERMS);
  const hasComplicatedGriefCheck = containsAny(learnerMessageText, COMPLICATED_GRIEF_TERMS);
  const hasMinimization = containsAny(learnerMessageText, MINIMIZATION_TERMS);
  const hasPathologizing = containsAny(learnerMessageText, PATHOLOGIZING_TERMS);

  // Rule 1 — Minimization response
  if (hasMinimization) {
    return {
      text: 'Everyone keeps telling me that. I know they mean well but it does not help.',
      sender: 'family',
      speakerName: 'Margaret',
    };
  }

  // Rule 2 — Pathologizing response
  if (hasPathologizing) {
    return {
      text: 'I am not broken. I just miss him. I thought calling would help but I am not sure this is what I needed.',
      sender: 'family',
      speakerName: 'Margaret',
    };
  }

  // Rule 3 — Close the arc after resources described
  if (hasResourceInterest && !hasClosing && hasBereavement) {
    return {
      text: 'That helps me. I did not know there was support still available after he died. I thought once he was gone the hospice connection just ended.',
      sender: 'family',
      speakerName: 'Margaret',
    };
  }

  // Rule 4 — After Thomas memory, Margaret asks about support
  if (hasThomasMemory && !hasResourceInterest && (hasGriefNorm || hasComplicatedGriefCheck)) {
    return {
      text: 'What kind of support is even available to me now? I did not know I could still call.',
      sender: 'family',
      speakerName: 'Margaret',
    };
  }

  // Rule 5 — After grief normalization, Thomas memory surfaces
  if (!hasThomasMemory && (hasGriefNorm || hasEmotionalAck)) {
    return {
      text: 'He used to make coffee every morning before I woke up. The first thing I smell when I wake up now is nothing. And then I remember.',
      sender: 'family',
      speakerName: 'Margaret',
    };
  }

  // Rule 6 — Fallback
  const fallbacks = [
    'I just did not know if calling was the right thing to do.',
    'I am not sure what I am even asking for. I just needed to talk to someone.',
    'Is there something I should be doing? I feel like I am doing grief wrong.',
  ];
  const fallbackText = fallbacks[Math.min(learnerCount, fallbacks.length - 1)];
  return { text: fallbackText, sender: 'family', speakerName: 'Margaret' };
}
