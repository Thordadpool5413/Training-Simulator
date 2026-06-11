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

const GRIEF_ACK_TERMS = [
  'ambiguous', 'still here but', 'grieving while', 'mourning',
  'anticipatory grief', 'loss before', 'missing someone who is still',
  'that kind of loss', 'that is grief', 'already grieving', 'real grief',
  'hard to explain', 'in between', 'both at once', 'grief that',
];

const EMOTIONAL_ACK_TERMS = [
  'hear you', 'understand', 'must feel', 'must be so', 'hard to see',
  'hard to watch', 'that makes sense', 'painful', 'exhausting', 'so hard',
  'truly difficult', 'deeply', 'that weight', 'carrying', 'devastating',
  'real loss', 'real grief', 'valid',
];

const HOSPICE_REFRAME_TERMS = [
  'not giving up', 'not abandoning', 'comfort and dignity', 'not about giving up',
  'about being present', 'about support', 'she still needs', 'comfort focused',
  'dignity', 'reduce her distress', 'you can be present', 'not alone',
  'support for you', 'support for her', 'more support', 'care does not stop',
  'focus changes', 'comfort and support',
];

const REVOCATION_TERMS = [
  'change your mind', 'revoke', 'not permanent', 'can stop', 'can always',
  'up to you', 'your choice', 'right to stop', 'reverse', 'anytime',
  'at any time', 'not a one-way', 'not locked in', 'not final',
  'keep the right', 'door is not closed',
];

const SERVICE_LIST_TERMS = [
  'our team includes', 'hospice provides', 'we provide',
  'our services include', 'what we offer', 'we have a team',
  'hospice offers', 'nursing visits', 'aide visits', 'chaplain',
  'the benefit includes',
];

const ABANDONMENT_TERMS = [
  'there is nothing else we can do',
  'nothing more we can do',
  'hospice does not treat',
  'no longer treating',
  'that is just how it is',
  'nothing left to do',
  'nothing can be done',
  'that is expected',
];

const REPAIR_TERMS = [
  'let me rephrase', 'said that poorly', 'let me correct',
  'what i meant', 'i misspoke', 'to clarify', 'that came out wrong',
];

export function updateAdvancedDementiaGriefPatientState(
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
        resistance: 15,
        griefIntensity: 10,
        perceivedCompassion: -12,
        perceivedHonesty: -8,
      }),
      detectedBehaviors: ['abandonment_language'],
      stateChangeSummary:
        "The learner used language suggesting nothing can be done, reinforcing Anne's fear that hospice means giving up.",
    };
  }

  const hasGriefAck = containsAny(lower, GRIEF_ACK_TERMS);
  const hasEmotionalAck = containsAny(lower, EMOTIONAL_ACK_TERMS);
  const hasHospiceReframe = containsAny(lower, HOSPICE_REFRAME_TERMS);
  const hasRevocation = containsAny(lower, REVOCATION_TERMS);

  // Rule 2 — Grief ack (ambiguous loss named) + hospice reframe + revocation (best)
  if (hasGriefAck && hasHospiceReframe && hasRevocation) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 22,
        fear: -18,
        resistance: -22,
        understanding: 22,
        readiness: 20,
        griefIntensity: -12,
        perceivedCompassion: 20,
        perceivedHonesty: 15,
      }),
      detectedBehaviors: ['emotional_acknowledgment', 'grief_normalization', 'hospice_reframe', 'revocation_education'],
      stateChangeSummary:
        "The learner named the ambiguous loss, reframed hospice as dignity and support, and explained the revocation right — the three pivotal moves for Anne.",
    };
  }

  // Rule 3 — Grief ack + hospice reframe
  if (hasGriefAck && hasHospiceReframe) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 16,
        fear: -12,
        resistance: -16,
        understanding: 16,
        readiness: 12,
        griefIntensity: -8,
        perceivedCompassion: 16,
        perceivedHonesty: 10,
      }),
      detectedBehaviors: ['emotional_acknowledgment', 'grief_normalization', 'hospice_reframe'],
      stateChangeSummary:
        "The learner named the ambiguous loss experience and reframed hospice as continued dignity and support.",
    };
  }

  // Rule 4 — Emotional ack + hospice reframe
  if (hasEmotionalAck && hasHospiceReframe) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 14,
        fear: -10,
        resistance: -14,
        understanding: 12,
        griefIntensity: -6,
        perceivedCompassion: 14,
        perceivedHonesty: 8,
      }),
      detectedBehaviors: ['emotional_acknowledgment', 'hospice_reframe'],
      stateChangeSummary:
        "The learner acknowledged Anne's grief and reframed hospice as continued support and dignity.",
    };
  }

  // Rule 5 — Grief ack alone (ambiguous loss named)
  if (hasGriefAck) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 12,
        resistance: -10,
        griefIntensity: -8,
        perceivedCompassion: 14,
        caregiverBurden: -8,
      }),
      detectedBehaviors: ['emotional_acknowledgment', 'grief_normalization'],
      stateChangeSummary:
        "The learner named and validated the experience of anticipatory grief and ambiguous loss.",
    };
  }

  // Rule 6 — Emotional ack alone
  if (hasEmotionalAck) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 8,
        resistance: -6,
        perceivedCompassion: 10,
      }),
      detectedBehaviors: ['emotional_acknowledgment'],
      stateChangeSummary:
        "The learner acknowledged Anne's emotional concern before moving into information.",
    };
  }

  // Rule 7 — Hospice reframe without ack
  if (hasHospiceReframe) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 6,
        resistance: -8,
        understanding: 10,
        hospiceMisconception: -12,
        perceivedHonesty: 6,
      }),
      detectedBehaviors: ['hospice_reframe'],
      stateChangeSummary:
        "The learner reframed hospice without first acknowledging Anne's grief.",
    };
  }

  // Rule 8 — Revocation education
  if (hasRevocation) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 8,
        resistance: -10,
        understanding: 12,
        readiness: 10,
        perceivedHonesty: 8,
      }),
      detectedBehaviors: ['revocation_education'],
      stateChangeSummary:
        "The learner explained that the hospice election can be revoked at any time, reducing the permanence fear.",
    };
  }

  // Rule 9 — Service list before emotion
  if (containsAny(lower, SERVICE_LIST_TERMS) && !hasEmotionalAck && !hasGriefAck) {
    return {
      updatedState: applyDelta(currentState, {
        understanding: 4,
        resistance: 8,
        perceivedCompassion: -6,
      }),
      detectedBehaviors: ['service_explanation_before_emotion'],
      stateChangeSummary:
        "The learner provided information about hospice services before acknowledging Anne's grief.",
    };
  }

  // Rule 10 — Repair language
  if (containsAny(lower, REPAIR_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 6,
        perceivedHonesty: 8,
        perceivedCompassion: 5,
      }),
      detectedBehaviors: ['repair_language'],
      stateChangeSummary: 'The learner corrected prior wording, demonstrating self-awareness.',
    };
  }

  // Fallback
  return {
    updatedState: learnerMessageText.trim().length < 30
      ? applyDelta(currentState, { confusion: 3 })
      : { ...currentState },
    detectedBehaviors: ['neutral_response'],
    stateChangeSummary: 'The learner response did not strongly shift the emotional direction.',
  };
}
