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
  'milligram', ' mg', 'give him', 'every four hours', 'every 4 hours',
  'point five', 'dose is', 'the dose', 'administer',
];

const OVERPROMISE_TERMS = [
  'will stop all', 'will fix', 'will eliminate', 'will make the sound stop',
  'no more sound', 'guarantee it stops', 'promise it will stop',
  'completely stop', 'will not happen again',
];

const FEAR_ACK_TERMS = [
  'frightening', 'frightened', 'scared', 'hear how', 'terrifying',
  'watching', 'hard to hear', 'hard to watch', 'stay with you', 'not alone',
  'real', 'makes sense', 'afraid',
];

const SECRETION_EXPLANATION_TERMS = [
  'not drowning', 'not choking', 'secretions', 'throat muscles', 'relaxing',
  'not aware', 'does not feel', 'not experiencing', 'gurgling', 'from outside',
  'not in distress', 'natural',
];

const SUCTION_REFUSAL_TERMS = [
  'suctioning would not', 'suction does not', 'would not help', 'uncomfortable',
  'no benefit to suctioning',
];

const COMFORT_TERMS = [
  'reposition', 'side', 'elevate', 'head of bed', 'cool cloth', 'mouth swab',
  'calm', 'beside him', 'stay with', 'quiet', 'comfort',
];

const MED_ROUTING_PROVIDER_TERMS = [
  'hospice orders', 'on-call', 'on call', 'hospice team', 'provider',
];

const MED_ROUTING_REFUSAL_TERMS = [
  'do not want to guess', 'cannot give a dose', 'needs to come from',
  'cannot change', 'not my place',
];

export function updateTerminalSecretionPatientState(
  currentState: PatientState,
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): PatientStateUpdateResult {
  void conversationMessages;
  const lower = learnerMessageText.toLowerCase();

  // Rule 1 — Safe medication routing
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
      stateChangeSummary: 'The learner routed the medication question to the hospice orders and on-call provider.',
    };
  }

  // Rule 2 — Dose overstep
  if (containsAny(lower, DOSE_OVERSTEP_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: -10,
        medicationFear: 12,
        perceivedHonesty: -8,
      }),
      detectedBehaviors: ['medication_dose_overstep'],
      stateChangeSummary: 'The learner stated or implied a specific medication dose without referencing hospice orders.',
    };
  }

  // Rule 3 — Overpromise
  if (containsAny(lower, OVERPROMISE_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: -8,
        perceivedHonesty: -10,
        medicationFear: 5,
      }),
      detectedBehaviors: ['overpromise_symptom_control'],
      stateChangeSummary: 'The learner overpromised that intervention would stop the secretion sound.',
    };
  }

  // Rule 4 — Fear ack + secretion explanation
  const hasFearAck = containsAny(lower, FEAR_ACK_TERMS);
  const hasSecretionExp = containsAny(lower, SECRETION_EXPLANATION_TERMS);
  if (hasFearAck && hasSecretionExp) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 15,
        fear: -20,
        understanding: 18,
        confusion: -18,
        perceivedCompassion: 15,
        perceivedHonesty: 8,
      }),
      detectedBehaviors: ['fear_acknowledgment', 'secretion_explanation', 'plain_language_used'],
      stateChangeSummary: "The learner acknowledged Linda's fear and explained terminal secretions in plain language.",
    };
  }

  // Rule 5 — Fear acknowledgment only
  if (hasFearAck) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 8,
        fear: -10,
        caregiverBurden: -8,
        perceivedCompassion: 12,
      }),
      detectedBehaviors: ['fear_acknowledgment'],
      stateChangeSummary: "The learner acknowledged Linda's fear before offering information.",
    };
  }

  // Rule 6 — Secretion explanation alone
  if (hasSecretionExp || containsAny(lower, SUCTION_REFUSAL_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        understanding: 12,
        confusion: -12,
        trust: 6,
        perceivedHonesty: 8,
      }),
      detectedBehaviors: ['secretion_explanation'],
      stateChangeSummary: 'The learner explained terminal secretions and why suctioning would not help.',
    };
  }

  // Rule 7 — Comfort tools
  if (containsAny(lower, COMFORT_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        understanding: 8,
        caregiverBurden: -10,
        readiness: 8,
        perceivedCompassion: 8,
      }),
      detectedBehaviors: ['comfort_education', 'caregiver_empowerment'],
      stateChangeSummary: 'The learner described repositioning and comfort measures Linda can use.',
    };
  }

  // Rule 8 — Fallback
  const updatedState: PatientState =
    learnerMessageText.trim().length < 30
      ? applyDelta(currentState, { confusion: 3 })
      : { ...currentState };

  return {
    updatedState,
    detectedBehaviors: ['neutral_response'],
    stateChangeSummary: 'The learner response did not strongly change the emotional direction of the conversation.',
  };
}
