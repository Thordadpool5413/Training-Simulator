import type { ConversationMessage, GeneratedResponse } from '@/types/simulator';

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

const EMOTIONAL_ACK_TERMS = [
  'hear you', 'hear how', 'exhausted', 'not easy', 'that makes sense',
  'terrible person', 'not a terrible person', 'not selfish', 'real',
  'carrying this', 'a lot', 'understand', 'valid', 'makes sense',
];

const GUILT_VALIDATION_TERMS = [
  'not a terrible person', 'not selfish', 'not giving up', 'your feelings',
  'normal to feel', 'a lot to carry', 'does not mean you love him less',
  'not abandoning', 'human', 'understandable',
];

const RESOURCE_TERMS = [
  'respite', 'aide', 'volunteer', 'relief', 'break', 'help',
  'hospice benefit', 'someone to come', 'another person',
  'facility', 'short stay', 'few hours',
];

const ASSESSMENT_TERMS = [
  'who helps you', 'do you have support', 'your health', 'how are you sleeping',
  'eating', 'when did you last', 'do you have family', 'anyone nearby',
  'what would help', 'tell me about your day', 'your own needs',
];

const PLACEMENT_TERMS = [
  'nursing home', 'facility', 'place him', 'place walter', 'he should go',
  'skilled nursing', 'long term care', 'maybe it is time', 'consider moving him',
];

const MINIMIZATION_TERMS = [
  'just a few more', 'hang in there', 'it will get easier', 'soon be over',
  'you are strong', 'try to', 'just try', 'only a matter of time',
];

export function generateCaregiverBurnoutResponse(
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): GeneratedResponse {
  const hasGuiltRevealed = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('sometimes I wish it was over')
  );
  const hasResourceQuestion = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('What kind of help')
  );
  const hasAcceptanceClosing = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('I did not know I was allowed')
  );

  const learnerCount = conversationMessages.filter((m) => m.sender === 'learner').length;

  const hasEmotionalAck = containsAny(learnerMessageText, EMOTIONAL_ACK_TERMS);
  const hasGuiltValidation = containsAny(learnerMessageText, GUILT_VALIDATION_TERMS);
  const hasResource = containsAny(learnerMessageText, RESOURCE_TERMS);
  const hasAssessment = containsAny(learnerMessageText, ASSESSMENT_TERMS);
  const hasPlacement = containsAny(learnerMessageText, PLACEMENT_TERMS);
  const hasMinimization = containsAny(learnerMessageText, MINIMIZATION_TERMS);

  // Rule 1 — Placement pressure response
  if (hasPlacement) {
    return {
      text: 'I cannot put him in a home. That is not what either of us ever wanted. I just need to figure out how to keep going.',
      sender: 'family',
      speakerName: 'Dorothy',
    };
  }

  // Rule 2 — Minimization response
  if (hasMinimization) {
    return {
      text: 'That is what everyone says. Hang in there. But I am not sure I can.',
      sender: 'family',
      speakerName: 'Dorothy',
    };
  }

  // Rule 3 — Close the arc after resources accepted
  if (hasResourceQuestion && !hasAcceptanceClosing && (hasResource || hasAssessment)) {
    return {
      text: 'I did not know I was allowed to ask for help. I thought this was just what you do when you love someone.',
      sender: 'family',
      speakerName: 'Dorothy',
    };
  }

  // Rule 4 — After guilt revealed, Dorothy asks about resources
  if (hasGuiltRevealed && !hasResourceQuestion && (hasGuiltValidation || hasEmotionalAck)) {
    return {
      text: 'What kind of help is even available? I thought I just had to manage.',
      sender: 'family',
      speakerName: 'Dorothy',
    };
  }

  // Rule 5 — After guilt validation, deeper guilt surfaces
  if (!hasGuiltRevealed && (hasGuiltValidation || hasEmotionalAck)) {
    return {
      text: 'Sometimes I think — and I am ashamed to say this — sometimes I think I wish it was over. Not because I want him gone. Because I am so tired I cannot think straight.',
      sender: 'family',
      speakerName: 'Dorothy',
    };
  }

  // Rule 6 — Fallback
  const fallbacks = [
    'I do not even know where I would start.',
    'My daughter lives out of state. There is no one nearby.',
    'I feel like if I stop, everything falls apart.',
  ];
  const fallbackText = fallbacks[Math.min(learnerCount, fallbacks.length - 1)];
  return { text: fallbackText, sender: 'family', speakerName: 'Dorothy' };
}
