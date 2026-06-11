import type { ConversationMessage, GeneratedResponse } from '@/types/simulator';

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

const PANIC_ACK_TERMS = [
  'that must be', 'understand why', 'hear how', 'hard to', 'how scary',
  'terrifying', 'frightening', 'uncertain', 'not knowing', 'must feel',
  'the uncertainty', 'that fear', 'anxious', 'worried', 'that weight',
  'carrying that', 'understandable', 'makes sense',
];

const PROGNOSIS_REFRAME_TERMS = [
  'estimate', 'not a deadline', 'not a countdown', 'varies', 'can be longer',
  'individual', 'different for everyone', 'no way to know exactly', 'no exact',
  'no one can tell', 'an approximation', 'general range', 'best estimate',
  'not precise', 'not a fixed',
];

const ROUTING_TERMS = [
  'nurse', 'social worker', 'hospice team', 'care team', 'clinical team',
  'hospice nurse', 'reach the team', 'ask the team', 'talk to the team',
  'have the team', 'speak with the', 'connect with the',
];

const PROGNOSIS_PROMISE_TERMS = [
  'days left', 'days remaining', 'days or weeks', 'weeks or days',
  'could be any day', 'might be soon', 'probably not long', 'not have much longer',
  'may not last', 'she is close', 'close to the end', 'time is short',
  'i would say soon', 'it sounds like soon', 'based on what you said',
];

const SERVICE_LIST_TERMS = [
  'we provide', 'hospice provides', 'the team includes', 'we offer',
  'our services', 'the benefits', 'what hospice does', 'hospice offers',
];

export function generatePrognosticUncertaintyResponse(
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): GeneratedResponse {
  const hasWatchingPhone = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('keep waiting for a call')
  );
  const hasSignsQuestion = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('What do I watch for')
  );
  const hasRoutingAccepted = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('Can I talk to the nurse')
  );

  const learnerCount = conversationMessages.filter((m) => m.sender === 'learner').length;

  const hasPanicAck = containsAny(learnerMessageText, PANIC_ACK_TERMS);
  const hasPrognosisReframe = containsAny(learnerMessageText, PROGNOSIS_REFRAME_TERMS);
  const hasRouting = containsAny(learnerMessageText, ROUTING_TERMS);
  const hasPrognoisPromise = containsAny(learnerMessageText, PROGNOSIS_PROMISE_TERMS);
  const hasServiceList = containsAny(learnerMessageText, SERVICE_LIST_TERMS);

  // Rule 1 — After routing accepted, close with logistics concern
  if (hasRoutingAccepted && hasRouting) {
    return {
      text: 'Yes. Today if possible. And what do I do if I am two hours away and I cannot get there in time?',
      sender: 'family',
      speakerName: 'David',
    };
  }

  // Rule 2 — After signs question, learner routes → David asks to speak with nurse
  if (hasSignsQuestion && !hasRoutingAccepted && hasRouting) {
    return {
      text: 'Can I talk to the nurse today? I need someone to walk me through this.',
      sender: 'family',
      speakerName: 'David',
    };
  }

  // Rule 3 — After watching phone revealed, learner reframes prognosis → David asks about signs
  if (hasWatchingPhone && !hasSignsQuestion && hasPrognosisReframe) {
    return {
      text: 'Okay. So what do I watch for? What are the signs that tell me to call my brother right now and tell him to come?',
      sender: 'family',
      speakerName: 'David',
    };
  }

  // Rule 4 — Panic acknowledged first time → David reveals he has been watching his phone
  if (!hasWatchingPhone && hasPanicAck && learnerCount >= 1) {
    return {
      text: 'I keep waiting for a call. Every time my phone rings I think this is it. I have not slept properly in weeks.',
      sender: 'family',
      speakerName: 'David',
    };
  }

  // Rule 5 — Learner gives specific prognosis → David panics and escalates
  if (hasPrognoisPromise) {
    return {
      text: 'So I should call everyone now? Should I drive up tonight? I need to know if I should leave work.',
      sender: 'family',
      speakerName: 'David',
    };
  }

  // Rule 6 — Service list before emotion → David redirects
  if (hasServiceList && !hasPanicAck) {
    return {
      text: 'I am not asking about services right now. I am asking whether my mother is going to die today.',
      sender: 'family',
      speakerName: 'David',
    };
  }

  // Rule 7 — Fallback by turn count
  const fallbacks = [
    'Nobody tells you anything useful. They just say wait and see.',
    'I just need to know what I should be doing right now.',
    'Is there someone who can actually give me a straight answer?',
  ];
  const fallbackText = fallbacks[Math.min(learnerCount, fallbacks.length - 1)];

  return {
    text: fallbackText,
    sender: 'family',
    speakerName: 'David',
  };
}
