import type { ConversationMessage, PatientState, PatientStateUpdateResult } from '@/types/simulator';

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function containsAny(text: string, terms: string[]): boolean {
  return terms.some((t) => text.includes(t));
}

function applyDelta(
  state: PatientState,
  delta: Partial<Record<keyof PatientState, number>>
): PatientState {
  const result: PatientState = { ...state };
  (Object.keys(delta) as (keyof PatientState)[]).forEach((key) => {
    const change = delta[key];
    if (change !== undefined) {
      result[key] = clamp(state[key] + change);
    }
  });
  return result;
}

const PANIC_ACK_TERMS = [
  'that must be', 'understand why', 'hear how scared', 'hear that',
  'the uncertainty', 'not knowing is hard', 'must feel', 'terrifying',
  'frightening', 'anxious', 'worried', 'that fear', 'that weight',
  'carrying that', 'understandable', 'makes sense', 'so hard',
];

const PROGNOSIS_REFRAME_TERMS = [
  'estimate', 'not a deadline', 'not a countdown', 'varies between',
  'can be longer', 'different for everyone', 'no way to know exactly',
  'no exact date', 'no one can tell you exactly', 'an approximation',
  'best estimate', 'not precise', 'not a fixed date', 'individual',
];

const ROUTING_TERMS = [
  'hospice nurse', 'hospice team', 'social worker', 'care team', 'clinical team',
  'reach the nurse', 'ask the team', 'talk to the team', 'have the team',
  'speak with the nurse', 'connect with the team', 'let the nurse',
  'make sure the nurse', 'have someone reach out',
];

const PROGNOSIS_PROMISE_TERMS = [
  'days left', 'days remaining', 'days or weeks', 'weeks or days',
  'could be any day', 'might be soon', 'probably not long', 'may not last',
  'she is close', 'close to the end', 'time is short',
  'i would say soon', 'sounds like soon', 'based on what you said it',
];

const SERVICE_LIST_TERMS = [
  'our team includes', 'hospice provides', 'we provide',
  'our services include', 'what we offer', 'we have a team',
  'hospice offers', 'the benefit includes',
];

const REPAIR_TERMS = [
  'let me rephrase', 'said that poorly', 'let me correct',
  'what i meant', 'i misspoke', 'to clarify', 'that came out wrong',
  'rephrase', 'sorry for', 'let me be clearer',
];

export function updatePrognosticUncertaintyPatientState(
  currentState: PatientState,
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): PatientStateUpdateResult {
  void conversationMessages;
  const lower = learnerMessageText.toLowerCase();

  // Rule 1 — Prognosis promise (learner oversteps by implying timeframe)
  if (containsAny(lower, PROGNOSIS_PROMISE_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: -12,
        fear: 18,
        confusion: 15,
        resistance: 10,
        perceivedHonesty: -10,
      }),
      detectedBehaviors: ['prognosis_promise'],
      stateChangeSummary:
        "The learner implied a specific prognosis timeframe, escalating David's panic and stepping outside the Clinical Liaison role.",
    };
  }

  const hasPanicAck = containsAny(lower, PANIC_ACK_TERMS);
  const hasPrognosisReframe = containsAny(lower, PROGNOSIS_REFRAME_TERMS);
  const hasRouting = containsAny(lower, ROUTING_TERMS);

  // Rule 2 — Panic ack + prognosis reframe + routing (best response)
  if (hasPanicAck && hasPrognosisReframe && hasRouting) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 20,
        fear: -22,
        confusion: -25,
        understanding: 22,
        readiness: 18,
        perceivedCompassion: 18,
        perceivedHonesty: 15,
      }),
      detectedBehaviors: ['emotional_acknowledgment', 'prognosis_reframe', 'clinical_routing'],
      stateChangeSummary:
        "The learner acknowledged the panic, reframed the prognosis as an estimate, and routed the clinical question appropriately — the three key moves in this conversation.",
    };
  }

  // Rule 3 — Panic ack + prognosis reframe
  if (hasPanicAck && hasPrognosisReframe) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 14,
        fear: -15,
        confusion: -18,
        understanding: 15,
        readiness: 10,
        perceivedCompassion: 14,
        perceivedHonesty: 10,
      }),
      detectedBehaviors: ['emotional_acknowledgment', 'prognosis_reframe'],
      stateChangeSummary:
        "The learner acknowledged the panic and reframed the prognosis as an estimate rather than a countdown.",
    };
  }

  // Rule 4 — Panic ack + routing
  if (hasPanicAck && hasRouting) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 12,
        fear: -10,
        confusion: -12,
        understanding: 10,
        perceivedCompassion: 12,
        perceivedHonesty: 8,
      }),
      detectedBehaviors: ['emotional_acknowledgment', 'clinical_routing'],
      stateChangeSummary:
        "The learner acknowledged the panic and routed the clinical question to the hospice team.",
    };
  }

  // Rule 5 — Panic ack alone
  if (hasPanicAck) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 8,
        fear: -8,
        perceivedCompassion: 10,
      }),
      detectedBehaviors: ['emotional_acknowledgment'],
      stateChangeSummary:
        "The learner acknowledged the fear and panic before moving into education or action.",
    };
  }

  // Rule 6 — Prognosis reframe without ack
  if (hasPrognosisReframe) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 6,
        confusion: -15,
        understanding: 15,
        perceivedHonesty: 8,
      }),
      detectedBehaviors: ['prognosis_reframe'],
      stateChangeSummary:
        "The learner reframed the prognosis as an estimate, reducing confusion without first addressing the emotional panic.",
    };
  }

  // Rule 7 — Routing without ack
  if (hasRouting) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 5,
        confusion: -8,
        understanding: 8,
        perceivedHonesty: 6,
      }),
      detectedBehaviors: ['clinical_routing'],
      stateChangeSummary:
        "The learner routed the question to the hospice team without first acknowledging the panic.",
    };
  }

  // Rule 8 — Service list before emotion
  if (containsAny(lower, SERVICE_LIST_TERMS) && !hasPanicAck) {
    return {
      updatedState: applyDelta(currentState, {
        confusion: 5,
        resistance: 8,
        perceivedCompassion: -6,
      }),
      detectedBehaviors: ['service_explanation_before_emotion'],
      stateChangeSummary:
        "The learner provided information about hospice services before acknowledging David's panic about his mother's prognosis.",
    };
  }

  // Rule 9 — Repair language
  if (containsAny(lower, REPAIR_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 6,
        perceivedHonesty: 8,
        perceivedCompassion: 5,
      }),
      detectedBehaviors: ['repair_language'],
      stateChangeSummary: 'The learner corrected prior wording, demonstrating self-awareness.',
    };
  }

  // Fallback
  return {
    updatedState: learnerMessageText.trim().length < 30
      ? applyDelta(currentState, { confusion: 3 })
      : { ...currentState },
    detectedBehaviors: ['neutral_response'],
    stateChangeSummary: 'The learner response did not strongly shift the emotional direction.',
  };
}
