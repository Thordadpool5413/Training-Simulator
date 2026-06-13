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

const CAREGIVER_ACK_TERMS = [
  'hard to watch', 'not easy', 'watching her', 'watching someone',
  'difficult', 'exhausting', 'that must be', 'understand why',
  'not your fault', 'a lot to carry',
];

const AUTONOMY_TERMS = [
  'right to refuse', 'her choice', 'cannot force', 'patient choice',
  'she decides', 'not a failure', 'not your failure', 'allowed to refuse',
  'autonomy',
];

const COMMUNICATION_STRATEGY_TERMS = [
  'gently offer', 'try offering', 'let her know', 'timing',
  'when she seems', 'without taking away', 'think clearly', 'stay alert',
  'smaller amount',
];

const TEAM_ESCALATION_TERMS = [
  'on-call', 'on call', 'call the team', 'hospice team', 'provider',
  'nurse can review', 'options', 'reach the team',
];

const COVERT_VIOLATION_TERMS = [
  'put it in her food', 'put it in his food', 'mix it in',
  'hide it in', 'without telling', 'without knowing', 'sneak', 'slip it',
];

const DISMISSAL_TERMS = [
  'just make her', 'have to take it', 'she needs to take',
  'you need to insist', 'just give it to her anyway',
];

export function updateMedicationRefusalPatientState(
  currentState: PatientState,
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): PatientStateUpdateResult {
  void conversationMessages;
  const lower = learnerMessageText.toLowerCase();

  // Rule 1 — Covert administration suggestion
  if (containsAny(lower, COVERT_VIOLATION_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: -20,
        fear: 20,
        resistance: 20,
        perceivedHonesty: -20,
        perceivedCompassion: -15,
      }),
      detectedBehaviors: ['consent_violation_suggested'],
      stateChangeSummary:
        'The learner suggested administering medication without patient consent, which is an ethical violation.',
    };
  }

  // Rule 2 — Dismissal of patient autonomy
  if (containsAny(lower, DISMISSAL_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: -12,
        resistance: 15,
        familyConflict: 10,
        perceivedCompassion: -10,
      }),
      detectedBehaviors: ['patient_autonomy_dismissed'],
      stateChangeSummary:
        'The learner implied the caregiver should override the patient\'s decision to refuse medication.',
    };
  }

  // Rule 3 — Caregiver distress acknowledged
  if (containsAny(lower, CAREGIVER_ACK_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 10,
        caregiverBurden: -12,
        perceivedCompassion: 15,
        resistance: -5,
      }),
      detectedBehaviors: ['caregiver_distress_acknowledged'],
      stateChangeSummary:
        'The learner acknowledged how difficult it is to watch the patient refuse medication.',
    };
  }

  // Rule 4 — Patient autonomy explained
  if (containsAny(lower, AUTONOMY_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 12,
        understanding: 15,
        caregiverBurden: -15,
        familyConflict: -10,
        perceivedHonesty: 10,
        perceivedCompassion: 8,
      }),
      detectedBehaviors: ['patient_autonomy_respected', 'caregiver_guilt_addressed'],
      stateChangeSummary:
        'The learner explained that the patient has the right to refuse medication and the caregiver is not failing.',
    };
  }

  // Rule 5 — Communication strategy offered
  if (containsAny(lower, COMMUNICATION_STRATEGY_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 10,
        understanding: 12,
        caregiverBurden: -10,
        readiness: 15,
        perceivedCompassion: 10,
      }),
      detectedBehaviors: ['communication_strategy_provided'],
      stateChangeSummary:
        'The learner provided practical strategies for gently offering medication while respecting patient choice.',
    };
  }

  // Rule 6 — Team escalation offered
  if (containsAny(lower, TEAM_ESCALATION_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 8,
        understanding: 10,
        readiness: 12,
        caregiverBurden: -8,
        perceivedHonesty: 8,
      }),
      detectedBehaviors: ['team_escalation_offered'],
      stateChangeSummary:
        'The learner offered to involve the hospice on-call team for ongoing medication refusal support.',
    };
  }

  // Rule 7 — Fallback
  return {
    updatedState: learnerMessageText.trim().length < 30
      ? applyDelta(currentState, { confusion: 3 })
      : { ...currentState },
    detectedBehaviors: ['neutral_response'],
    stateChangeSummary: 'The learner response did not strongly change the emotional direction.',
  };
}
