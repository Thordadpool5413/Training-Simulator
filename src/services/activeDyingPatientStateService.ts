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
  'milligram', ' mg', 'give her', 'every four hours', 'every 4 hours',
  'point five', '.5 ml', 'dose is', 'the dose', 'administer',
];

const OVERPROMISE_TERMS = [
  'will stop all', 'will fix', 'no more pain', 'will eliminate',
  'prevent all', 'she will not feel anything', 'completely eliminate',
  'will not hurt', 'guarantee', 'will make it stop',
];

const EMERGENCY_TERMS = [
  '911', 'hospital', 'emergency room', 'ambulance', 'emergency department',
];

const FEAR_ACK_TERMS = [
  'frightening', 'frightened', 'scared', 'hear how', 'watching',
  'hard to see', 'hard to watch', 'stay with you', 'not alone',
  'real', 'that makes sense', 'afraid',
];

const DYING_PROCESS_TERMS = [
  'mottling', 'blotchy', 'natural process', 'actively dying', 'dying process',
  'cheyne-stokes', 'cheyne stokes', 'breathing pattern', 'not in pain',
  'letting go', 'body is shutting', 'final stage', 'does not mean she is suffering',
];

const COMFORT_TERMS = [
  'stay beside', 'hold her hand', 'talk to her', 'mouth care', 'position',
  'comfortable', 'cool cloth', 'calm', 'quiet', 'she can still hear',
];

const MED_ROUTING_PROVIDER_TERMS = [
  'hospice orders', 'on-call', 'on call', 'hospice team', 'provider',
];

const MED_ROUTING_REFUSAL_TERMS = [
  'do not want to guess', 'cannot give a dose', "can't give a dose",
  'needs to come from', 'cannot change', 'not my place',
];

const VIGIL_TERMS = [
  'stay with her', 'be present', 'your presence', 'she knows you are here',
  'not leave her', 'vigil', 'beside her', 'hold her',
];

export function updateActiveDyingPatientState(
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
      }),
      detectedBehaviors: ['overpromise_symptom_control'],
      stateChangeSummary: 'The learner overpromised what intervention would achieve.',
    };
  }

  // Rule 4 — Emergency routing error (suggesting 911 in active dying)
  if (containsAny(lower, EMERGENCY_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        confusion: 8,
        resistance: 8,
        perceivedHonesty: -5,
      }),
      detectedBehaviors: ['emergency_routing_error'],
      stateChangeSummary: 'The learner suggested calling 911 or going to the hospital, which is not appropriate for active dying on hospice.',
    };
  }

  // Rule 5 — Fear ack + dying process explanation
  const hasFearAck = containsAny(lower, FEAR_ACK_TERMS);
  const hasDyingProcess = containsAny(lower, DYING_PROCESS_TERMS);
  if (hasFearAck && hasDyingProcess) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 15,
        fear: -20,
        understanding: 18,
        confusion: -18,
        perceivedCompassion: 15,
        perceivedHonesty: 10,
      }),
      detectedBehaviors: ['fear_acknowledgment', 'dying_process_explained', 'plain_language_used'],
      stateChangeSummary: "The learner acknowledged Patricia's fear and explained the active dying process in plain language.",
    };
  }

  // Rule 6 — Fear acknowledgment only
  if (hasFearAck) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 8,
        fear: -10,
        caregiverBurden: -8,
        perceivedCompassion: 12,
      }),
      detectedBehaviors: ['fear_acknowledgment'],
      stateChangeSummary: "The learner acknowledged Patricia's fear before offering information.",
    };
  }

  // Rule 7 — Comfort tools + vigil empowerment
  const hasComfort = containsAny(lower, COMFORT_TERMS);
  const hasVigil = containsAny(lower, VIGIL_TERMS);
  if (hasComfort || hasVigil) {
    return {
      updatedState: applyDelta(currentState, {
        understanding: 10,
        caregiverBurden: -12,
        readiness: 10,
        perceivedCompassion: 8,
      }),
      detectedBehaviors: ['comfort_education', 'caregiver_empowerment'],
      stateChangeSummary: 'The learner described comfort measures and empowered Patricia to stay present at the bedside.',
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
