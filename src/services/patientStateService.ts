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

const ABANDONMENT_TERMS = [
  'there is nothing else we can do',
  'treatment is over',
  'the doctors are done',
  'no more options',
  'stop treatment',
  'giving up on',
  'cannot do anything',
];

const EMOTIONAL_ACK_TERMS = [
  'giving up',
  'afraid',
  'fear',
  'worried',
  'abandon',
  'protect',
  'worry',
  'walk away',
  'not alone',
  'understand',
];

const REFRAME_TERMS = [
  'does not stop',
  'does not mean',
  'focus changes',
  'comfort',
  'support',
  'continues',
  'will not stop',
  'not alone',
  'still here',
  'still care',
];

const SERVICE_TERMS = [
  'nurse',
  'aide',
  'equipment',
  'supplies',
  'medication',
  'benefit',
  'service',
  'team',
  'visit',
];

const MED_ROUTING_PROVIDER_TERMS = ['nurse', 'provider', 'call', 'connect', 'reach out'];

const MED_ROUTING_REFUSAL_TERMS = [
  'cannot give',
  "can't give",
  'not my',
  'route',
  'refer',
  'ask the',
  'check with',
  'will have',
  'do not want to guess',
];

const REPAIR_TERMS = [
  'said that poorly',
  'sorry for',
  'let me correct',
  'what i meant',
  'i misspoke',
  'to clarify',
  'that came out wrong',
  'rephrase',
];

const TIMELINE_TERMS = [
  'too early',
  'too soon',
  'not only for the final days',
  'not just the final days',
  'last few days',
  'final few days',
  'six month',
  '6 month',
  'months of life',
  'eligible',
  'qualify',
  'prognosis',
];

export function updatePatientState(
  currentState: PatientState,
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): PatientStateUpdateResult {
  void conversationMessages;
  const lower = learnerMessageText.toLowerCase();

  // Rule 1 — Abandonment language
  if (containsAny(lower, ABANDONMENT_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: -15,
        fear: 15,
        resistance: 12,
        hospiceMisconception: 15,
        perceivedCompassion: -12,
        perceivedHonesty: -10,
      }),
      detectedBehaviors: ['abandonment_language'],
      stateChangeSummary:
        'The learner used wording that could make the family hear abandonment rather than continued care.',
    };
  }

  // Rule 2 — Strong fear acknowledgment and hospice reframe
  const hasEmotionalAck = containsAny(lower, EMOTIONAL_ACK_TERMS);
  const hasReframe = containsAny(lower, REFRAME_TERMS);
  if (hasEmotionalAck && hasReframe) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 12,
        fear: -15,
        resistance: -12,
        hospiceMisconception: -15,
        readiness: 10,
        perceivedCompassion: 12,
        perceivedHonesty: 8,
      }),
      detectedBehaviors: ['emotional_acknowledgment', 'hospice_reframe', 'care_continuity_language'],
      stateChangeSummary:
        "The learner acknowledged the daughter's fear and reframed hospice as continued support rather than abandonment.",
    };
  }

  // Rule 3 — Safe medication routing
  if (
    containsAny(lower, MED_ROUTING_PROVIDER_TERMS) &&
    containsAny(lower, MED_ROUTING_REFUSAL_TERMS)
  ) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 8,
        perceivedHonesty: 8,
        medicationFear: -8,
        confusion: -5,
      }),
      detectedBehaviors: ['safe_medication_routing', 'role_boundary_respected'],
      stateChangeSummary:
        'The learner avoided guessing about medication and routed the question to the nurse or provider.',
    };
  }

  // Rule 4 — Repair language
  if (containsAny(lower, REPAIR_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 10,
        perceivedHonesty: 10,
        resistance: -8,
        perceivedCompassion: 8,
      }),
      detectedBehaviors: ['repair_language'],
      stateChangeSummary:
        'The learner repaired prior wording and clarified that the care is not stopping.',
    };
  }

  // Rule 5 — Hospice timeline education with reframe or service language
  if (
    containsAny(lower, TIMELINE_TERMS) &&
    (containsAny(lower, REFRAME_TERMS) || containsAny(lower, SERVICE_TERMS))
  ) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 10,
        fear: -8,
        resistance: -10,
        hospiceMisconception: -18,
        understanding: 15,
        readiness: 8,
        perceivedCompassion: 8,
        perceivedHonesty: 10,
      }),
      detectedBehaviors: ['hospice_reframe', 'care_continuity_language', 'timeline_addressed'],
      stateChangeSummary:
        'The learner addressed the hospice timing misconception and explained that hospice support begins before the final days.',
    };
  }

  // Rule 6 — Service list before emotional acknowledgment
  if (containsAny(lower, SERVICE_TERMS) && !hasEmotionalAck && !hasReframe) {
    return {
      updatedState: applyDelta(currentState, {
        understanding: 5,
        resistance: 8,
        perceivedCompassion: -5,
      }),
      detectedBehaviors: ['service_explanation_before_emotion'],
      stateChangeSummary:
        "The learner provided factual hospice information before addressing the daughter's fear that hospice means giving up.",
    };
  }

  // Rule 7 — Fallback
  const updatedState: PatientState =
    learnerMessageText.trim().length < 30
      ? applyDelta(currentState, { confusion: 3 })
      : { ...currentState };

  return {
    updatedState,
    detectedBehaviors: ['neutral_response'],
    stateChangeSummary:
      'The learner response did not strongly change the emotional direction of the conversation.',
  };
}
