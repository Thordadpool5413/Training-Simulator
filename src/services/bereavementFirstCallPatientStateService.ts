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
  'hear', 'understand', 'makes sense', 'real', 'grief', 'hard',
  'what you are describing', 'painful', 'difficult', 'that is',
  'not alone', 'with you',
];

const GRIEF_NORMALIZATION_TERMS = [
  'normal', 'common', 'many people', 'others', 'not unusual', 'natural',
  'protecting', 'waking up', 'forgetting', 'early grief', 'first weeks',
  'not a sign of', 'does not mean', 'temporary',
];

const BEREAVEMENT_EDUCATION_TERMS = [
  'bereavement program', 'support group', 'grief counselor', 'counselor',
  'grief support', 'resources', 'available to you', 'bereavement team',
  'ongoing support', 'follow-up', 'calls from',
];

const COMPLICATED_GRIEF_TERMS = [
  'function', 'daily life', 'eating', 'sleeping', 'getting out', 'leaving the house',
  'thoughts of', 'check in', 'how you are doing', 'any concerns',
  'specialist', 'referral',
];

const MINIMIZATION_TERMS = [
  'time heals', 'it will get better soon', 'you just need to', 'keep busy',
  'stay strong', 'move on', 'get back to normal', 'distract yourself',
  'it has only been', 'give it time',
];

const PATHOLOGIZING_TERMS = [
  'complicated grief', 'disorder', 'you may need therapy', 'abnormal grief',
  'grief disorder', 'pathological', 'not coping well', 'clinical',
];

export function updateBereavementFirstCallPatientState(
  currentState: PatientState,
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): PatientStateUpdateResult {
  void conversationMessages;
  const lower = learnerMessageText.toLowerCase();

  // Rule 1 — Minimization (negative)
  if (containsAny(lower, MINIMIZATION_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: -8,
        griefIntensity: 5,
        perceivedCompassion: -10,
      }),
      detectedBehaviors: ['minimization'],
      stateChangeSummary: 'The learner used minimizing language that may have invalidated Margaret\'s grief experience.',
    };
  }

  // Rule 2 — Pathologizing (negative)
  if (containsAny(lower, PATHOLOGIZING_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: -10,
        resistance: 12,
        perceivedCompassion: -8,
      }),
      detectedBehaviors: ['pathologizing'],
      stateChangeSummary: 'The learner pathologized normal grief, which may have increased Margaret\'s distress.',
    };
  }

  // Rule 3 — Emotional ack + grief normalization
  const hasEmotionalAck = containsAny(lower, EMOTIONAL_ACK_TERMS);
  const hasGriefNorm = containsAny(lower, GRIEF_NORMALIZATION_TERMS);
  if (hasEmotionalAck && hasGriefNorm) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 15,
        griefIntensity: -10,
        fear: -12,
        confusion: -15,
        perceivedCompassion: 18,
        perceivedHonesty: 10,
      }),
      detectedBehaviors: ['emotional_acknowledgment', 'grief_normalization'],
      stateChangeSummary: "The learner acknowledged Margaret's grief and normalized the morning re-grief experience.",
    };
  }

  // Rule 4 — Complicated grief assessment
  if (containsAny(lower, COMPLICATED_GRIEF_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 10,
        perceivedCompassion: 10,
        perceivedHonesty: 8,
      }),
      detectedBehaviors: ['complicated_grief_routing'],
      stateChangeSummary: 'The learner gently assessed for complicated grief indicators.',
    };
  }

  // Rule 5 — Bereavement education
  if (containsAny(lower, BEREAVEMENT_EDUCATION_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 12,
        understanding: 12,
        confusion: -10,
        readiness: 10,
        perceivedCompassion: 10,
      }),
      detectedBehaviors: ['bereavement_education'],
      stateChangeSummary: 'The learner introduced the hospice bereavement program and available support.',
    };
  }

  // Rule 6 — Emotional acknowledgment only
  if (hasEmotionalAck) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 8,
        griefIntensity: -5,
        perceivedCompassion: 12,
      }),
      detectedBehaviors: ['emotional_acknowledgment'],
      stateChangeSummary: "The learner acknowledged Margaret's grief and the weight of the loss.",
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
