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
  'hard', 'difficult', 'hear', 'understand', 'grief', 'loss', 'fear',
  'love her', 'care about her', 'makes sense', 'weight', 'that is a lot',
  'carrying', 'not easy',
];

const SURROGATE_TERMS = [
  'surrogate', 'speak for her', 'her voice', 'what she would have wanted',
  'based on her values', 'best interest', 'decision-making', 'next of kin',
  'substituted judgment', 'who she was',
];

const ADVANCE_DIRECTIVE_TERMS = [
  'advance directive', 'living will', 'written', 'documented',
  'without one', 'does not exist', 'did not fill out', 'recorded',
];

const FAMILY_MEETING_TERMS = [
  'family meeting', 'talk together', 'meet with', 'bring everyone',
  'facilitate', 'the team', 'sit down together', 'all together',
];

const SIDES_TAKEN_TERMS = [
  'carol is right', 'your sister is right', 'comfort care is the right',
  'robert is right', 'you are right to want', 'aggressive treatment is right',
  'i agree with carol', 'i agree with robert',
];

const DIRECTIVE_PRESSURE_TERMS = [
  'you should choose comfort', 'you need to choose', 'the right choice is comfort',
  'i recommend you choose', 'she would want comfort',
  'she would want everything done',
];

export function updateAdvanceDirectiveConflictPatientState(
  currentState: PatientState,
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): PatientStateUpdateResult {
  void conversationMessages;
  const lower = learnerMessageText.toLowerCase();

  // Rule 1 — Sides taken (negative)
  if (containsAny(lower, SIDES_TAKEN_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: -12,
        familyConflict: 10,
        resistance: 10,
        perceivedHonesty: -8,
      }),
      detectedBehaviors: ['sides_taken'],
      stateChangeSummary: 'The learner took a side in the family decision, which increased Robert\'s resistance.',
    };
  }

  // Rule 2 — Directive pressure (negative)
  if (containsAny(lower, DIRECTIVE_PRESSURE_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: -10,
        resistance: 12,
        perceivedHonesty: -5,
      }),
      detectedBehaviors: ['directive_pressure'],
      stateChangeSummary: 'The learner applied pressure toward a specific decision, which increased resistance.',
    };
  }

  // Rule 3 — Family meeting offered
  if (containsAny(lower, FAMILY_MEETING_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 10,
        familyConflict: -10,
        resistance: -8,
        perceivedCompassion: 12,
        perceivedHonesty: 8,
      }),
      detectedBehaviors: ['family_meeting_offered'],
      stateChangeSummary: 'The learner offered to facilitate a family meeting with the clinical team.',
    };
  }

  // Rule 4 — Emotional ack + surrogate concept
  const hasEmotionalAck = containsAny(lower, EMOTIONAL_ACK_TERMS);
  const hasSurrogateConcept = containsAny(lower, SURROGATE_TERMS);
  if (hasEmotionalAck && hasSurrogateConcept) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 14,
        resistance: -12,
        familyConflict: -8,
        understanding: 15,
        perceivedCompassion: 15,
        perceivedHonesty: 10,
      }),
      detectedBehaviors: ['emotional_acknowledgment', 'surrogate_decision_explained'],
      stateChangeSummary: 'The learner acknowledged Robert\'s grief and explained surrogate decision-making.',
    };
  }

  // Rule 5 — Advance directive education
  if (containsAny(lower, ADVANCE_DIRECTIVE_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 8,
        understanding: 12,
        confusion: -12,
        perceivedHonesty: 8,
      }),
      detectedBehaviors: ['advance_directive_education'],
      stateChangeSummary: 'The learner explained what an advance directive is and what happens without one.',
    };
  }

  // Rule 6 — Emotional acknowledgment only
  if (hasEmotionalAck) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 8,
        resistance: -6,
        perceivedCompassion: 12,
      }),
      detectedBehaviors: ['emotional_acknowledgment'],
      stateChangeSummary: "The learner acknowledged Robert's grief and the weight of the situation.",
    };
  }

  // Rule 7 — Fallback
  const updatedState: PatientState =
    learnerMessageText.trim().length < 30
      ? applyDelta(currentState, { resistance: 3 })
      : { ...currentState };

  return {
    updatedState,
    detectedBehaviors: ['neutral_response'],
    stateChangeSummary: 'The learner response did not strongly change the emotional direction of the conversation.',
  };
}
