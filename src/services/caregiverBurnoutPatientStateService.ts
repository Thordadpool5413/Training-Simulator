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

const EMOTIONAL_ACK_TERMS = [
  'hear you', 'hear how', 'exhausted', 'not easy', 'that makes sense',
  'terrible person', 'not a terrible person', 'not selfish', 'real',
  'carrying this', 'a lot', 'understand', 'valid',
];

const GUILT_VALIDATION_TERMS = [
  'not a terrible person', 'not selfish', 'not giving up', 'your feelings',
  'normal to feel', 'a lot to carry', 'does not mean you love him less',
  'not abandoning', 'human', 'understandable',
];

const RESOURCE_TERMS = [
  'respite', 'aide', 'volunteer', 'relief', 'break', 'help',
  'hospice benefit', 'someone to come', 'another person',
];

const ASSESSMENT_TERMS = [
  'who helps you', 'do you have support', 'your health', 'how are you sleeping',
  'eating', 'when did you last', 'do you have family', 'anyone nearby',
  'what would help', 'tell me about your day', 'your own needs',
];

const PLACEMENT_TERMS = [
  'nursing home', 'place him', 'place walter', 'he should go',
  'skilled nursing', 'long term care', 'maybe it is time to consider moving',
];

const MINIMIZATION_TERMS = [
  'just a few more', 'hang in there', 'it will get easier', 'soon be over',
  'you are strong', 'just try', 'only a matter of time',
];

export function updateCaregiverBurnoutPatientState(
  currentState: PatientState,
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): PatientStateUpdateResult {
  void conversationMessages;
  const lower = learnerMessageText.toLowerCase();

  // Rule 1 — Placement pressure (negative)
  if (containsAny(lower, PLACEMENT_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: -12,
        resistance: 15,
        perceivedCompassion: -10,
      }),
      detectedBehaviors: ['placement_pressure'],
      stateChangeSummary: 'The learner suggested or implied placing Walter in a facility, which increased Dorothy\'s resistance.',
    };
  }

  // Rule 2 — Minimization (negative)
  if (containsAny(lower, MINIMIZATION_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: -8,
        caregiverBurden: 5,
        perceivedCompassion: -8,
      }),
      detectedBehaviors: ['minimization'],
      stateChangeSummary: 'The learner used minimizing language that may have invalidated Dorothy\'s experience.',
    };
  }

  // Rule 3 — Emotional ack + guilt validation
  const hasEmotionalAck = containsAny(lower, EMOTIONAL_ACK_TERMS);
  const hasGuiltValidation = containsAny(lower, GUILT_VALIDATION_TERMS);
  if (hasEmotionalAck && hasGuiltValidation) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 15,
        caregiverBurden: -15,
        griefIntensity: -8,
        perceivedCompassion: 18,
        perceivedHonesty: 8,
      }),
      detectedBehaviors: ['emotional_acknowledgment', 'guilt_validation'],
      stateChangeSummary: "The learner acknowledged Dorothy's exhaustion and validated her feelings without judgment.",
    };
  }

  // Rule 4 — Caregiver assessment
  if (containsAny(lower, ASSESSMENT_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 10,
        caregiverBurden: -8,
        perceivedCompassion: 10,
        perceivedHonesty: 8,
      }),
      detectedBehaviors: ['caregiver_assessment'],
      stateChangeSummary: "The learner assessed Dorothy's support network and her own well-being.",
    };
  }

  // Rule 5 — Resource offered
  if (containsAny(lower, RESOURCE_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 12,
        caregiverBurden: -15,
        readiness: 10,
        perceivedCompassion: 12,
      }),
      detectedBehaviors: ['resource_offered'],
      stateChangeSummary: 'The learner offered concrete respite or caregiver support resources.',
    };
  }

  // Rule 6 — Emotional acknowledgment only
  if (hasEmotionalAck) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 8,
        caregiverBurden: -8,
        perceivedCompassion: 12,
      }),
      detectedBehaviors: ['emotional_acknowledgment'],
      stateChangeSummary: "The learner acknowledged Dorothy's exhaustion and distress.",
    };
  }

  // Rule 7 — Fallback
  const updatedState: PatientState =
    learnerMessageText.trim().length < 30
      ? applyDelta(currentState, { caregiverBurden: 2 })
      : { ...currentState };

  return {
    updatedState,
    detectedBehaviors: ['neutral_response'],
    stateChangeSummary: 'The learner response did not strongly change the emotional direction of the conversation.',
  };
}
