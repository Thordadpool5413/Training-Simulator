import type { ConversationMessage, GeneratedResponse } from '@/types/simulator';

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

const GRIEF_ACK_TERMS = [
  'ambiguous', 'still here but', 'grieving while', 'grief while',
  'mourning', 'anticipatory grief', 'loss before', 'missing someone who is still',
  'that kind of loss', 'that is grief', 'in between', 'already grieving',
  'both at once', 'real grief', 'hard to explain', 'no category',
];

const EMOTIONAL_ACK_TERMS = [
  'hear you', 'understand', 'must feel', 'must be', 'hard to watch',
  'hard to see', 'that makes sense', 'valid', 'real', 'painful',
  'that weight', 'carrying', 'exhausting', 'so hard', 'devastating',
  'truly difficult', 'deeply',
];

const HOSPICE_REFRAME_TERMS = [
  'not giving up', 'not abandoning', 'comfort and dignity', 'still there for her',
  'not about giving up', 'about being present', 'about support', 'she still needs',
  'comfort focused', 'dignity', 'reduce her distress', 'you can be present',
  'not alone', 'support for you', 'support for her',
];

const REVOCATION_TERMS = [
  'change your mind', 'revoke', 'not permanent', 'can stop', 'can always',
  'up to you', 'your choice', 'right to stop', 'reverse', 'anytime',
  'at any time', 'not a one-way', 'not locked in', 'not final',
];

const SERVICE_LIST_TERMS = [
  'we provide', 'hospice provides', 'the team includes', 'we offer',
  'our services', 'the benefits', 'what hospice does', 'hospice offers',
  'nursing visits', 'aide visits', 'chaplain', 'social worker visits',
];

const ABANDONMENT_TERMS = [
  'there is nothing else we can do',
  'nothing more we can do',
  'hospice does not treat',
  'no longer treating',
  'that is just how it is',
  'nothing left to do',
  'nothing can be done',
];

export function generateAdvancedDementiaGriefResponse(
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): GeneratedResponse {
  const hasGratefulComment = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('Everyone keeps telling me')
  );
  const hasHospiceQuestion = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('What would that actually look like')
  );
  const hasRevocationQuestion = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('So if I changed my mind')
  );

  const learnerCount = conversationMessages.filter((m) => m.sender === 'learner').length;

  const hasGriefAck = containsAny(learnerMessageText, GRIEF_ACK_TERMS);
  const hasEmotionalAck = containsAny(learnerMessageText, EMOTIONAL_ACK_TERMS);
  const hasHospiceReframe = containsAny(learnerMessageText, HOSPICE_REFRAME_TERMS);
  const hasRevocation = containsAny(learnerMessageText, REVOCATION_TERMS);
  const hasServiceList = containsAny(learnerMessageText, SERVICE_LIST_TERMS);
  const hasAbandonmentLanguage = containsAny(learnerMessageText, ABANDONMENT_TERMS);

  // Rule 1 — After revocation question, learner confirms it → Anne asks about next steps
  if (hasRevocationQuestion && hasRevocation) {
    return {
      text: 'Okay. What would the next step actually be? What does starting hospice look like for someone in her condition?',
      sender: 'family',
      speakerName: 'Anne',
    };
  }

  // Rule 2 — After hospice question, learner reframes + revocation → Anne asks about reversibility
  if (hasHospiceQuestion && !hasRevocationQuestion && hasRevocation) {
    return {
      text: 'So if I changed my mind I could stop it? I did not know that.',
      sender: 'family',
      speakerName: 'Anne',
    };
  }

  // Rule 3 — After grateful pushback, learner reframes hospice → Anne asks what it looks like
  if (hasGratefulComment && !hasHospiceQuestion && hasHospiceReframe) {
    return {
      text: 'What would that actually look like? Would she be in a facility? Would anyone be there with her?',
      sender: 'family',
      speakerName: 'Anne',
    };
  }

  // Rule 4 — Grief acknowledged (especially ambiguous loss) → Anne reveals the social isolation
  if (!hasGratefulComment && (hasGriefAck || hasEmotionalAck) && learnerCount >= 1) {
    return {
      text: 'Everyone keeps telling me I should be grateful she is still here. But it does not feel like she is still here.',
      sender: 'family',
      speakerName: 'Anne',
    };
  }

  // Rule 5 — Abandonment language → Anne validates her own fear
  if (hasAbandonmentLanguage) {
    return {
      text: 'See. That is exactly what I thought. Everyone just wants to give up on her.',
      sender: 'family',
      speakerName: 'Anne',
    };
  }

  // Rule 6 — Service list before emotion
  if (hasServiceList && !hasEmotionalAck && !hasGriefAck) {
    return {
      text: 'I am not asking about the paperwork or what it costs. I need to know if choosing hospice means I am abandoning her.',
      sender: 'family',
      speakerName: 'Anne',
    };
  }

  // Rule 7 — Fallback by turn count
  const fallbacks = [
    'I just need to know if this is the right thing to do.',
    'She raised me. I cannot just stop fighting for her.',
    'Nobody told me it would feel like this.',
  ];
  const fallbackText = fallbacks[Math.min(learnerCount, fallbacks.length - 1)];

  return {
    text: fallbackText,
    sender: 'family',
    speakerName: 'Anne',
  };
}
