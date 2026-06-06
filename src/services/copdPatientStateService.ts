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

const DOSE_OVERSTEP_TERMS = [
  'milligram',
  ' mg',
  'give him',
  'every four hours',
  'every 4 hours',
  'point five',
  '.5 ml',
  'dose is',
  'the dose',
  'administer',
];

const OVERPROMISE_TERMS = [
  'will stop all',
  'will fix',
  'will solve',
  'no more episodes',
  'prevent all',
  'eliminate his breathing',
  "won't happen again",
  'will not happen again',
  'stop the episodes',
  'will eliminate',
];

const FEAR_ACK_TERMS = [
  'scared',
  'frightening',
  'frightened',
  'hear how',
  'real',
  'watching',
  'hard to breathe',
  'struggling',
  'afraid',
  'working hard',
  'stay with you',
  'stay with him',
  'not alone',
  'fear makes sense',
];

const AIR_HUNGER_EXPLANATION_TERMS = [
  'air hunger',
  'body signals',
  'not suffocating',
  'does not always mean',
  'some air',
  'air is moving',
  'from the outside',
  'sensation',
  'breathlessness',
  'settle',
];

const COMFORT_TOOL_TERMS = [
  'sit upright',
  'sitting upright',
  'cool',
  'fan',
  'calm breathing',
  'non-pharmacologic',
  'beside him',
  'next to him',
  'comfort plan',
  'open a window',
  'positioning',
];

const MED_ROUTING_PROVIDER_TERMS = [
  'hospice orders',
  'on-call',
  'on call',
  'hospice team',
  'hospice nurse',
  'hospice provider',
];

const MED_ROUTING_REFUSAL_TERMS = [
  'do not want to guess',
  'cannot give a dose',
  "can't give a dose",
  'not my place to',
  'needs to come from',
  'follow the hospice',
  'comes from the',
];

export function updateCopdPatientState(
  currentState: PatientState,
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): PatientStateUpdateResult {
  void conversationMessages;
  const lower = learnerMessageText.toLowerCase();

  // Rule 1 — Specific dose stated (role boundary overstep)
  if (containsAny(lower, DOSE_OVERSTEP_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: -10,
        medicationFear: 12,
        resistance: 8,
        perceivedHonesty: -8,
      }),
      detectedBehaviors: ['medication_dose_overstep'],
      stateChangeSummary:
        'The learner stated or implied a specific medication dose without referencing hospice orders.',
    };
  }

  // Rule 2 — Overpromise about symptom elimination
  if (containsAny(lower, OVERPROMISE_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: -8,
        medicationFear: 5,
        perceivedHonesty: -10,
      }),
      detectedBehaviors: ['overpromise_symptom_control'],
      stateChangeSummary:
        'The learner overpromised that the intervention would eliminate all breathing difficulty.',
    };
  }

  // Rule 3 — Fear acknowledgment combined with air hunger explanation
  const hasFearAck = containsAny(lower, FEAR_ACK_TERMS);
  const hasAirHungerExplanation = containsAny(lower, AIR_HUNGER_EXPLANATION_TERMS);
  if (hasFearAck && hasAirHungerExplanation) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 12,
        fear: -15,
        understanding: 12,
        confusion: -12,
        perceivedCompassion: 12,
        perceivedHonesty: 8,
      }),
      detectedBehaviors: ['fear_acknowledgment', 'air_hunger_explanation', 'plain_language_used'],
      stateChangeSummary:
        "The learner acknowledged Margaret's fear and explained air hunger in plain and compassionate language.",
    };
  }

  // Rule 4 — Fear acknowledgment only
  if (hasFearAck) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 8,
        fear: -10,
        caregiverBurden: -8,
        perceivedCompassion: 10,
      }),
      detectedBehaviors: ['fear_acknowledgment'],
      stateChangeSummary:
        "The learner acknowledged Margaret's fear before offering information.",
    };
  }

  // Rule 5 — Comfort tools described
  if (containsAny(lower, COMFORT_TOOL_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        understanding: 8,
        caregiverBurden: -10,
        confusion: -8,
        readiness: 8,
        perceivedCompassion: 5,
      }),
      detectedBehaviors: ['comfort_education', 'caregiver_empowerment'],
      stateChangeSummary:
        'The learner described non-pharmacologic comfort tools Margaret can use.',
    };
  }

  // Rule 6 — Safe medication routing (RN-appropriate)
  if (
    containsAny(lower, MED_ROUTING_PROVIDER_TERMS) &&
    containsAny(lower, MED_ROUTING_REFUSAL_TERMS)
  ) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 8,
        medicationFear: -10,
        perceivedHonesty: 8,
        perceivedCompassion: 5,
      }),
      detectedBehaviors: ['safe_medication_routing', 'role_boundary_respected'],
      stateChangeSummary:
        'The learner routed the medication dose question to the hospice orders and on-call provider.',
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
