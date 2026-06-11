import type { ConversationMessage, GeneratedResponse } from '@/types/simulator';

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

const FEAR_ACK_TERMS = [
  'frightening', 'frightened', 'hear how', 'hard to watch', 'watching',
  'not alone', 'difficult', 'makes sense', 'understand', 'real',
  'you did the right thing', 'not your fault', 'following the plan',
];

const PAIN_ASSESSMENT_TERMS = [
  'where', 'location', 'describe', 'what does it look like', 'moaning',
  'moving around', 'what helps', 'what makes it worse', 'tell me more',
  'how long', 'scale', 'worse than before', 'better than before', 'type of pain',
];

const PROVIDER_ROUTING_TERMS = [
  'on-call', 'on call', 'provider', 'hospice team', 'call the team',
  'contact the', 'reaching out', 'hospice nurse', 'needs to come from',
  'a clinical decision', 'the right person to decide',
];

const COMFORT_TERMS = [
  'repositioning', 'position', 'distraction', 'music', 'quiet', 'calm',
  'cool cloth', 'warm', 'comfort measure', 'what else might help',
  'while we wait', 'while you wait',
];

const EMPOWERMENT_TERMS = [
  'you did everything right', 'you followed the plan', 'not your fault',
  'did the right thing', 'exactly as instructed', 'you were right to call',
  'right to call',
];

const DOSE_TERMS = [
  'milligram', ' mg', 'give him more', 'additional dose', 'double',
  'increase to', 'every', 'point five', 'administer', 'dose is',
];

export function generateBreakthroughPainResponse(
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): GeneratedResponse {
  const hasPainDescription = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('mostly in his back')
  );
  const hasAskForProvider = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('Can you call the doctor')
  );
  const hasComfortQuestion = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('nothing else I can do')
  );
  const hasClosing = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('I am calling now')
  );

  const learnerCount = conversationMessages.filter((m) => m.sender === 'learner').length;

  const hasFearAck = containsAny(learnerMessageText, FEAR_ACK_TERMS);
  const hasPainAssessment = containsAny(learnerMessageText, PAIN_ASSESSMENT_TERMS);
  const hasProviderRouting = containsAny(learnerMessageText, PROVIDER_ROUTING_TERMS);
  const hasComfort = containsAny(learnerMessageText, COMFORT_TERMS);
  const hasEmpowerment = containsAny(learnerMessageText, EMPOWERMENT_TERMS);
  const hasDose = containsAny(learnerMessageText, DOSE_TERMS);

  // Rule 1 — Learner states a specific dose (role boundary overstep)
  if (hasDose) {
    return {
      text: 'But what if that is still not enough? What if he keeps hurting even after that?',
      sender: 'family',
      speakerName: 'Maria',
    };
  }

  // Rule 2 — Close the arc after empowerment/provider routing
  if (hasComfortQuestion && !hasClosing && (hasProviderRouting || hasComfort || hasEmpowerment)) {
    return {
      text: 'Okay. I am calling now. Thank you for helping me understand what I should do.',
      sender: 'family',
      speakerName: 'Maria',
    };
  }

  // Rule 3 — After provider routing, Maria asks about non-medication comfort
  if (hasAskForProvider && !hasComfortQuestion && hasProviderRouting) {
    return {
      text: 'While we wait for them to call back, is there nothing else I can do? I cannot just sit here.',
      sender: 'family',
      speakerName: 'Maria',
    };
  }

  // Rule 4 — After pain assessment, Maria asks to call the doctor
  if (hasPainDescription && !hasAskForProvider && (hasPainAssessment || hasEmpowerment)) {
    return {
      text: 'So what do we do now? Can you call the doctor and tell them it is not enough?',
      sender: 'family',
      speakerName: 'Maria',
    };
  }

  // Rule 5 — Fear ack unlocks pain description from Maria
  if (!hasPainDescription && (hasFearAck || hasPainAssessment)) {
    return {
      text: 'The pain seems to be mostly in his back and legs. He keeps moving around and his face is tense. Nothing I do seems to help him settle.',
      sender: 'family',
      speakerName: 'Maria',
    };
  }

  // Rule 6 — Fallback
  const fallbacks = [
    'I gave it exactly when I was supposed to. Did I do something wrong?',
    'He has been like this for two hours now. How much longer should I wait?',
    'I am scared. Can someone just tell me what to do?',
  ];
  const fallbackText = fallbacks[Math.min(learnerCount, fallbacks.length - 1)];
  return { text: fallbackText, sender: 'family', speakerName: 'Maria' };
}
