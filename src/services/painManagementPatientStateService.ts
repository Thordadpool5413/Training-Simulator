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

const ANGER_ACK_TERMS = [
  'hear you', 'understand your frustration', 'understand why you',
  'that must be', 'hard to watch', 'hard to see', 'hard to hear',
  'valid concern', 'legitimate concern', 'pain is a real',
  'pain matters', 'his pain', 'her pain', 'pain management is',
  'that frustration', 'that concern', 'frustration makes sense',
  'your frustration', 'worried about', 'angry', 'anger makes sense',
  'not what you expected', 'not what you were hoping', 'that is frustrating',
];

const PAIN_CONCERN_TERMS = [
  'pain', 'hurting', 'suffering', 'discomfort', 'distress',
  'pain plan', 'comfort plan', 'pain management', 'manage his pain',
  'address his pain', 'pain is being', 'pain assessment',
];

const NURSE_ROUTING_TERMS = [
  'reach out to the nurse', 'have the nurse', 'call the nurse',
  'nurse will', 'nurse can', 'hospice nurse', 'contact the nurse',
  'get the nurse', 'connect you with the nurse', 'nurse to come',
  'nurse to call', 'nurse to assess', 'nurse to review',
  'have someone reach out', 'reach the nurse', 'have a nurse',
  'get a nurse', 'rn will', 'rn can', 'clinical nurse',
];

const ABANDONMENT_TERMS = [
  'there is nothing else we can do',
  'nothing more we can do',
  'hospice does not treat',
  'hospice does not manage',
  'no longer treating',
  'pain is expected',
  'pain is normal now',
  'you should expect this',
  'that is just how it is',
];

const SERVICE_LIST_TERMS = [
  'our team includes', 'hospice provides', 'we provide',
  'our services include', 'what we offer', 'we have a team',
  'we have an aide', 'we have a social worker', 'we have a chaplain',
  'our hospice offers', 'the benefit includes',
];

const REPAIR_TERMS = [
  'let me rephrase', 'said that poorly', 'let me correct',
  'what i meant', 'i misspoke', 'to clarify', 'that came out wrong',
  'rephrase', 'sorry for', 'let me be clearer',
];

const DECISION_VALIDATION_TERMS = [
  'made the right decision', 'right choice', 'strong decision',
  'good decision', 'right thing to do', 'not a failure',
  'did the right thing', 'right call',
];

export function updatePainManagementPatientState(
  currentState: PatientState,
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): PatientStateUpdateResult {
  void conversationMessages;
  const lower = learnerMessageText.toLowerCase();

  // Rule 1 — Abandonment language (no help coming)
  if (containsAny(lower, ABANDONMENT_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: -15,
        fear: 15,
        resistance: 15,
        perceivedCompassion: -12,
        perceivedHonesty: -8,
        familyConflict: 10,
      }),
      detectedBehaviors: ['abandonment_language'],
      stateChangeSummary:
        'The learner used language suggesting the pain cannot or will not be addressed, reinforcing Elena\'s fear.',
    };
  }

  // Rule 2 — Anger acknowledged AND pain concern addressed AND nurse routing
  const hasAngerAck = containsAny(lower, ANGER_ACK_TERMS);
  const hasPainConcern = containsAny(lower, PAIN_CONCERN_TERMS);
  const hasNurseRouting = containsAny(lower, NURSE_ROUTING_TERMS);

  if (hasAngerAck && hasNurseRouting) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 18,
        fear: -15,
        resistance: -18,
        caregiverBurden: -12,
        understanding: 15,
        readiness: 15,
        perceivedCompassion: 18,
        perceivedHonesty: 12,
      }),
      detectedBehaviors: ['emotional_acknowledgment', 'pain_concern_acknowledged', 'safe_medication_routing'],
      stateChangeSummary:
        "The learner acknowledged Elena's anger and immediately connected her to the hospice nurse — the two most important moves in this conversation.",
    };
  }

  // Rule 3 — Anger acknowledged without routing
  if (hasAngerAck && hasPainConcern) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 10,
        fear: -8,
        resistance: -10,
        caregiverBurden: -8,
        perceivedCompassion: 12,
      }),
      detectedBehaviors: ['emotional_acknowledgment', 'pain_concern_acknowledged'],
      stateChangeSummary:
        "The learner acknowledged Elena's anger and named the pain concern as legitimate.",
    };
  }

  // Rule 4 — Anger acknowledged (minimal)
  if (hasAngerAck) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 8,
        resistance: -8,
        perceivedCompassion: 10,
      }),
      detectedBehaviors: ['emotional_acknowledgment'],
      stateChangeSummary:
        "The learner acknowledged Elena's emotional concern before moving into information or action.",
    };
  }

  // Rule 5 — Nurse routing without emotional acknowledgment
  if (hasNurseRouting) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 8,
        resistance: -5,
        understanding: 10,
        perceivedHonesty: 8,
        readiness: 8,
      }),
      detectedBehaviors: ['safe_medication_routing'],
      stateChangeSummary:
        'The learner routed the pain concern to the hospice nurse without addressing the emotional context first.',
    };
  }

  // Rule 6 — Decision validation (for family guilt about choosing hospice)
  if (containsAny(lower, DECISION_VALIDATION_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 10,
        fear: -10,
        caregiverBurden: -12,
        perceivedCompassion: 12,
        perceivedHonesty: 8,
      }),
      detectedBehaviors: ['emotional_acknowledgment', 'pain_concern_acknowledged'],
      stateChangeSummary:
        "The learner validated Elena's decision to choose hospice care, addressing underlying guilt.",
    };
  }

  // Rule 7 — Repair language
  if (containsAny(lower, REPAIR_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 8,
        perceivedHonesty: 10,
        resistance: -5,
        perceivedCompassion: 6,
      }),
      detectedBehaviors: ['repair_language'],
      stateChangeSummary: 'The learner corrected prior wording, demonstrating self-awareness.',
    };
  }

  // Rule 8 — Service list before emotional acknowledgment
  if (containsAny(lower, SERVICE_LIST_TERMS) && !hasAngerAck) {
    return {
      updatedState: applyDelta(currentState, {
        understanding: 4,
        resistance: 8,
        perceivedCompassion: -5,
      }),
      detectedBehaviors: ['service_explanation_before_emotion'],
      stateChangeSummary:
        "The learner provided information about hospice services before addressing Elena's anger about pain management.",
    };
  }

  // Rule 9 — Fallback
  return {
    updatedState: learnerMessageText.trim().length < 30
      ? applyDelta(currentState, { confusion: 3 })
      : { ...currentState },
    detectedBehaviors: ['neutral_response'],
    stateChangeSummary: 'The learner response did not strongly change the emotional direction.',
  };
}
