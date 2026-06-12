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

// Merge multiple deltas so all matching rules accumulate in one turn.
function mergeDeltas(
  deltas: Partial<Record<keyof PatientState, number>>[]
): Partial<Record<keyof PatientState, number>> {
  const merged: Partial<Record<keyof PatientState, number>> = {};
  for (const delta of deltas) {
    for (const [key, value] of Object.entries(delta) as [keyof PatientState, number][]) {
      merged[key] = (merged[key] ?? 0) + value;
    }
  }
  return merged;
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

const REVOCATION_TERMS = [
  'revoke',
  'can change',
  'change your mind',
  'change course',
  'not permanent',
  'not locked',
  'your choice',
  'can stop',
  'withdraw',
  'undo',
  'take back',
];

export function updatePatientState(
  currentState: PatientState,
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): PatientStateUpdateResult {
  void conversationMessages;
  const lower = learnerMessageText.toLowerCase();

  const matchedDeltas: Partial<Record<keyof PatientState, number>>[] = [];
  const matchedBehaviors: string[] = [];
  const matchedSummaries: string[] = [];

  const hasEmotionalAck = containsAny(lower, EMOTIONAL_ACK_TERMS);
  const hasReframe = containsAny(lower, REFRAME_TERMS);
  const hasService = containsAny(lower, SERVICE_TERMS);

  // Rule 1 — Abandonment language (negative — accumulates with positives to net out)
  if (containsAny(lower, ABANDONMENT_TERMS)) {
    matchedDeltas.push({ trust: -15, fear: 15, resistance: 12, hospiceMisconception: 15, perceivedCompassion: -12, perceivedHonesty: -10 });
    matchedBehaviors.push('abandonment_language');
    matchedSummaries.push('Used wording the family heard as abandonment rather than continued care.');
  }

  // Rule 2 — Emotional acknowledgment + hospice reframe (full credit)
  if (hasEmotionalAck && hasReframe) {
    matchedDeltas.push({ trust: 12, fear: -15, resistance: -12, hospiceMisconception: -15, readiness: 10, perceivedCompassion: 12, perceivedHonesty: 8 });
    matchedBehaviors.push('emotional_acknowledgment', 'hospice_reframe', 'care_continuity_language');
    matchedSummaries.push('Acknowledged fear and reframed hospice as continued support.');
  }

  // Rule 3 — Emotional acknowledgment alone (partial credit, exclusive of Rule 2)
  if (hasEmotionalAck && !hasReframe) {
    matchedDeltas.push({ trust: 6, fear: -8, perceivedCompassion: 8 });
    matchedBehaviors.push('emotional_acknowledgment');
    matchedSummaries.push('Acknowledged emotion without following through with a hospice reframe.');
  }

  // Rule 4 — Safe medication routing
  if (containsAny(lower, MED_ROUTING_PROVIDER_TERMS) && containsAny(lower, MED_ROUTING_REFUSAL_TERMS)) {
    matchedDeltas.push({ trust: 8, perceivedHonesty: 8, medicationFear: -8, confusion: -5 });
    matchedBehaviors.push('safe_medication_routing', 'role_boundary_respected');
    matchedSummaries.push('Routed medication question to nurse or provider.');
  }

  // Rule 5 — Repair language
  if (containsAny(lower, REPAIR_TERMS)) {
    matchedDeltas.push({ trust: 10, perceivedHonesty: 10, resistance: -8, perceivedCompassion: 8 });
    matchedBehaviors.push('repair_language');
    matchedSummaries.push('Repaired prior wording — clarified that care is not stopping.');
  }

  // Rule 6 — Hospice timeline education
  if (containsAny(lower, TIMELINE_TERMS) && (hasReframe || hasService)) {
    matchedDeltas.push({ trust: 10, fear: -8, resistance: -10, hospiceMisconception: -18, understanding: 15, readiness: 8, perceivedCompassion: 8, perceivedHonesty: 10 });
    matchedBehaviors.push('timeline_addressed');
    matchedSummaries.push('Explained hospice timing — support begins before the final days.');
  }

  // Rule 7 — Revocation education
  if (containsAny(lower, REVOCATION_TERMS)) {
    matchedDeltas.push({ trust: 10, fear: -10, resistance: -12, hospiceMisconception: -20, understanding: 15, readiness: 10, perceivedHonesty: 10, perceivedCompassion: 5 });
    matchedBehaviors.push('revocation_education', 'hospice_reframe');
    matchedSummaries.push('Explained hospice can be revoked, addressing the irreversibility fear.');
  }

  // Rule 8 — Service info before any emotional acknowledgment (mild negative)
  if (hasService && !hasEmotionalAck && !hasReframe) {
    matchedDeltas.push({ understanding: 5, resistance: 8, perceivedCompassion: -5 });
    matchedBehaviors.push('service_explanation_before_emotion');
    matchedSummaries.push('Provided service information before addressing the emotional concern.');
  }

  // Nothing matched — neutral or short response
  if (matchedDeltas.length === 0) {
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

  return {
    updatedState: applyDelta(currentState, mergeDeltas(matchedDeltas)),
    detectedBehaviors: [...new Set(matchedBehaviors)],
    stateChangeSummary: matchedSummaries.join(' '),
  };
}
