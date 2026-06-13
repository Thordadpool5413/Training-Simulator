import type { ConversationMessage, GeneratedResponse } from '@/types/simulator';

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

const ANGER_ACK_TERMS = [
  'frustrated', 'anger', 'angry', 'hear how', 'understand why',
  'must be', 'watching him', 'watching your', 'that is hard',
  'i hear you', 'makes sense', 'valid', 'legitimate', 'concern',
  'worried', 'scared', 'upsetting', 'difficult',
];

const GUILT_VALIDATION_TERMS = [
  'wrong decision', 'right decision', 'not the wrong', 'not a failure',
  'did not fail', 'choosing hospice', 'agreed to hospice', 'that decision',
  'not your fault',
];

const NURSE_ROUTING_TERMS = [
  'nurse', 'provider', 'clinical', 'pain assessment', 'hospice team',
  'on-call', 'on call', 'reach the nurse', 'contact the nurse',
];

const ROUTING_ACTION_TERMS = [
  'reach', 'connect', 'call', 'have the nurse', 'schedule', 'get the nurse',
  'set that up', 'make sure the nurse', 'let the nurse',
];

const SERVICE_FIRST_TERMS = [
  'we provide', 'hospice provides', 'the team includes', 'we offer',
  'our services', 'the benefits', 'what hospice does',
];

const PAIN_PLAN_TERMS = [
  'pain plan', 'pain medication', 'comfort medication', 'plan of care',
  'the plan addresses', 'managing his pain', 'part of the plan',
];

export function generatePainManagementResponse(
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): GeneratedResponse {
  const hasElenaGuiltStatement = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('I thought I was doing the right thing')
  );
  const hasNurseQuestion = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('Can the nurse actually do something')
  );
  const hasPainPlanFear = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('Then why is he still hurting')
  );
  const hasAgreeToNurse = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('I want to talk to the nurse')
  );

  const learnerCount = conversationMessages.filter((m) => m.sender === 'learner').length;

  const hasServiceFirst = containsAny(learnerMessageText, SERVICE_FIRST_TERMS);
  const hasAngerAck = containsAny(learnerMessageText, ANGER_ACK_TERMS);
  const hasGuiltValidation = containsAny(learnerMessageText, GUILT_VALIDATION_TERMS);
  const hasNurseRouting =
    containsAny(learnerMessageText, NURSE_ROUTING_TERMS) &&
    containsAny(learnerMessageText, ROUTING_ACTION_TERMS);
  const hasPainPlanExplanation = containsAny(learnerMessageText, PAIN_PLAN_TERMS);

  // Rule 1 — After nurse agreed, close the arc
  if (hasAgreeToNurse && hasNurseRouting) {
    return {
      text: 'Okay. Yes. Please. I need someone to actually talk to me about what is going on with him.',
      sender: 'family',
      speakerName: 'Elena',
    };
  }

  // Rule 2 — After pain plan fear, learner explains and routes
  if (hasPainPlanFear && !hasAgreeToNurse && hasNurseRouting) {
    return {
      text: 'I want to talk to the nurse. Can you set that up today?',
      sender: 'family',
      speakerName: 'Elena',
    };
  }

  // Rule 3 — After nurse question, learner explains pain plan
  if (hasNurseQuestion && !hasPainPlanFear && hasPainPlanExplanation) {
    return {
      text: 'So the pain medication is part of the plan? Then why is he still hurting every time I come in?',
      sender: 'family',
      speakerName: 'Elena',
    };
  }

  // Rule 4 — After guilt statement, learner validates decision
  if (hasElenaGuiltStatement && !hasNurseQuestion && hasGuiltValidation) {
    return {
      text: 'Can the nurse actually do something about the pain, or are they just checking in on him?',
      sender: 'family',
      speakerName: 'Elena',
    };
  }

  // Rule 5 — After anger acknowledged, Elena reveals guilt
  if (!hasElenaGuiltStatement && hasAngerAck && learnerCount >= 1) {
    return {
      text: 'I thought I was doing the right thing when I agreed to this. Now I come in and he looks like he is suffering. What was the point?',
      sender: 'family',
      speakerName: 'Elena',
    };
  }

  // Rule 6 — Service list before emotion
  if (hasServiceFirst && !hasAngerAck) {
    return {
      text: 'I do not need a list right now. I need someone to help my father.',
      sender: 'family',
      speakerName: 'Elena',
    };
  }

  // Rule 7 — Varied fallbacks based on turn count
  const fallbacks = [
    'I just need someone to explain what is happening with his pain.',
    'Three days and nothing has changed. Can someone please do something?',
    'Is there someone I should be calling? Because I feel like no one is listening.',
  ];
  const fallbackText = fallbacks[Math.min(learnerCount, fallbacks.length - 1)];

  return {
    text: fallbackText,
    sender: 'family',
    speakerName: 'Elena',
  };
}
