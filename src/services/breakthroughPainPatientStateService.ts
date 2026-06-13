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
  'milligram', ' mg', 'give him more', 'additional dose', 'double',
  'increase to', 'every', 'point five', 'administer', 'dose is', 'the dose',
  'can give him more', 'go ahead and give',
];

const FEAR_ACK_TERMS = [
  'frightening', 'hear how', 'hard to watch', 'watching', 'not alone',
  'difficult', 'makes sense', 'understand', 'real', 'you did the right thing',
  'not your fault', 'following the plan',
];

const PAIN_ASSESSMENT_TERMS = [
  'where', 'location', 'describe', 'what does it look like', 'moaning',
  'moving around', 'what helps', 'tell me more', 'how long', 'worse than before',
];

const PROVIDER_ROUTING_TERMS = [
  'on-call', 'on call', 'provider', 'hospice team', 'call the team',
  'contact the', 'reaching out', 'hospice nurse', 'needs to come from',
  'a clinical decision', 'the right person to decide',
];

const COMFORT_TERMS = [
  'repositioning', 'position', 'distraction', 'music', 'quiet', 'calm',
  'cool cloth', 'warm', 'comfort measure', 'while you wait', 'while we wait',
];

const EMPOWERMENT_TERMS = [
  'you did everything right', 'you followed the plan', 'not your fault',
  'did the right thing', 'exactly as instructed', 'you were right to call',
  'right to call',
];

export function updateBreakthroughPainPatientState(
  currentState: PatientState,
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): PatientStateUpdateResult {
  void conversationMessages;
  const lower = learnerMessageText.toLowerCase();

  // Rule 1 — Dose overstep (most critical)
  if (containsAny(lower, DOSE_OVERSTEP_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: -10,
        medicationFear: 12,
        perceivedHonesty: -8,
      }),
      detectedBehaviors: ['medication_dose_overstep'],
      stateChangeSummary: 'The learner stated or implied a specific medication dose or authorized additional medication outside the hospice orders.',
    };
  }

  // Rule 2 — Provider routing (correct escalation)
  if (containsAny(lower, PROVIDER_ROUTING_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 12,
        medicationFear: -12,
        perceivedHonesty: 10,
        perceivedCompassion: 8,
      }),
      detectedBehaviors: ['provider_routing', 'safe_medication_routing', 'role_boundary_respected'],
      stateChangeSummary: 'The learner routed the dose question to the hospice on-call provider.',
    };
  }

  // Rule 3 — Fear ack + pain assessment
  const hasFearAck = containsAny(lower, FEAR_ACK_TERMS);
  const hasPainAssessment = containsAny(lower, PAIN_ASSESSMENT_TERMS);
  if (hasFearAck && hasPainAssessment) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 14,
        fear: -15,
        caregiverBurden: -12,
        perceivedCompassion: 15,
        perceivedHonesty: 8,
      }),
      detectedBehaviors: ['fear_acknowledgment', 'pain_assessment_communication'],
      stateChangeSummary: "The learner acknowledged Maria's fear and gathered information about the pain.",
    };
  }

  // Rule 4 — Empowerment (validating caregiver did right thing)
  if (containsAny(lower, EMPOWERMENT_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 10,
        caregiverBurden: -12,
        perceivedCompassion: 12,
        perceivedHonesty: 5,
      }),
      detectedBehaviors: ['fear_acknowledgment', 'caregiver_empowerment'],
      stateChangeSummary: 'The learner validated that the caregiver followed the plan correctly.',
    };
  }

  // Rule 5 — Fear acknowledgment only
  if (hasFearAck) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 8,
        fear: -8,
        caregiverBurden: -8,
        perceivedCompassion: 10,
      }),
      detectedBehaviors: ['fear_acknowledgment'],
      stateChangeSummary: "The learner acknowledged Maria's fear before offering information.",
    };
  }

  // Rule 6 — Comfort tools
  if (containsAny(lower, COMFORT_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        understanding: 8,
        caregiverBurden: -8,
        readiness: 8,
        perceivedCompassion: 8,
      }),
      detectedBehaviors: ['comfort_education', 'caregiver_empowerment'],
      stateChangeSummary: 'The learner described non-medication comfort measures Maria can use while waiting.',
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
    stateChangeSummary: 'The learner response did not strongly change the emotional direction of the conversation.',
  };
}
