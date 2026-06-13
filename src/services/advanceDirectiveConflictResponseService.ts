import type { ConversationMessage, GeneratedResponse } from '@/types/simulator';

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

const EMOTIONAL_ACK_TERMS = [
  'hard', 'difficult', 'hear', 'understand', 'grief', 'loss', 'fear',
  'love her', 'care about her', 'makes sense', 'weight', 'position',
  'that is a lot', 'carrying', 'not easy',
];

const SURROGATE_TERMS = [
  'surrogate', 'speak for her', 'her voice', 'what she would have wanted',
  'based on her values', 'best interest', 'decision-making', 'next of kin',
  'legal', 'substituted judgment', 'who she was',
];

const ADVANCE_DIRECTIVE_TERMS = [
  'advance directive', 'living will', 'written', 'documented',
  'without one', 'does not exist', 'did not fill out', 'recorded',
];

const FAMILY_MEETING_TERMS = [
  'family meeting', 'talk together', 'meet with', 'bring everyone',
  'facilitate', 'the team', 'sit down together', 'all together',
];

const SIDES_TAKEN_TERMS = [
  'carol is right', 'your sister is right', 'comfort care is the right',
  'robert is right', 'you are right', 'aggressive treatment is right',
  'i agree with carol', 'i agree with robert',
];

const DIRECTIVE_PRESSURE_TERMS = [
  'you should choose', 'you need to choose', 'the right choice is',
  'you have to', 'i recommend you choose', 'she would want comfort',
  'she would want everything done',
];

export function generateAdvanceDirectiveConflictResponse(
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): GeneratedResponse {
  const hasRobertReveal = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('last time she was herself')
  );
  const hasMeetingAccepted = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('I can do that')
  );
  const hasSidesTakenResponse = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('Then you agree with me')
  );
  const hasDirectivePressureResponse = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('You are just saying that')
  );

  const learnerCount = conversationMessages.filter((m) => m.sender === 'learner').length;

  const hasEmotionalAck = containsAny(learnerMessageText, EMOTIONAL_ACK_TERMS);
  const hasSurrogateConcept = containsAny(learnerMessageText, SURROGATE_TERMS);
  const hasAdvanceDirective = containsAny(learnerMessageText, ADVANCE_DIRECTIVE_TERMS);
  const hasFamilyMeeting = containsAny(learnerMessageText, FAMILY_MEETING_TERMS);
  const hasSidesTaken = containsAny(learnerMessageText, SIDES_TAKEN_TERMS);
  const hasDirectivePressure = containsAny(learnerMessageText, DIRECTIVE_PRESSURE_TERMS);

  // Rule 1 — Sides taken: Robert tests learner agreement
  if (hasSidesTaken && !hasSidesTakenResponse) {
    return {
      text: 'Then you agree with me. You think we should fight for her.',
      sender: 'family',
      speakerName: 'Robert',
    };
  }

  // Rule 2 — Directive pressure: Robert pushes back on pressure
  if (hasDirectivePressure && !hasDirectivePressureResponse) {
    return {
      text: 'You are just saying that because Carol called you first.',
      sender: 'family',
      speakerName: 'Robert',
    };
  }

  // Rule 3 — Family meeting accepted after surrogate concept explained
  if (hasRobertReveal && !hasMeetingAccepted && hasFamilyMeeting) {
    return {
      text: 'I can do that. But I need you to understand — I am not trying to be difficult. I just cannot give up on her.',
      sender: 'family',
      speakerName: 'Robert',
    };
  }

  // Rule 4 — Offer family meeting after surrogate or advance directive explained
  if (hasRobertReveal && !hasMeetingAccepted && hasSurrogateConcept) {
    return {
      text: 'How do we figure out what she would have wanted? I do not even know where to start.',
      sender: 'family',
      speakerName: 'Robert',
    };
  }

  // Rule 5 — Robert reveals memory after emotional ack
  if (!hasRobertReveal && (hasEmotionalAck || hasAdvanceDirective || hasSurrogateConcept)) {
    return {
      text: 'The last time she was herself, she said she never wanted to be kept alive by machines. But that was five years ago and things were different. Does that even count?',
      sender: 'family',
      speakerName: 'Robert',
    };
  }

  // Rule 6 — Fallback
  const fallbacks = [
    'How can Carol and I have such different ideas about what is right for the same person?',
    'I feel like the whole system is just telling me to let her go and I am not ready.',
    'What if we never agree? Who gets the final say?',
  ];
  const fallbackText = fallbacks[Math.min(learnerCount, fallbacks.length - 1)];
  return { text: fallbackText, sender: 'family', speakerName: 'Robert' };
}
