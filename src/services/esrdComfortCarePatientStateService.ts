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
  'understand how difficult', 'hear how', 'that must be', 'must feel',
  'how terrifying', 'how hard', 'fear losing', 'love for your father',
  'care about him', 'watching your father', 'hard to accept', 'so difficult',
  'truly difficult', 'that grief', 'that fear', 'caring about him',
];

const AUTONOMY_TERMS = [
  'right to refuse', 'legally', 'ethically', 'his choice', 'his decision',
  'patient has the right', 'adult has the right', 'autonomous', 'refuse treatment',
  'make decisions for himself', 'right to make his own', 'medical autonomy',
  'the right to decide', 'right to refuse any', 'refuse any medical',
];

const VALUES_TERMS = [
  'what has he said', 'what does he want', 'what matters to him', 'his wishes',
  'what he values', "what your father believes", 'what he has shared', 'his goals',
  'what he told you', 'what he expressed', "your father's perspective",
  "from his perspective", 'what he wants for himself',
];

const FAMILY_MEETING_TERMS = [
  'family meeting', 'bring everyone together', 'sit down together',
  'talk as a family', 'arrange a meeting', 'meet with the team',
  'get everyone together', 'have a conversation as a family',
  'bring the family together', 'facilitate a conversation',
];

const CLINICAL_ROUTING_TERMS = [
  'physician', "his doctor", 'medical team', 'clinical team', 'care team',
  'capacity assessment', 'evaluate', 'psychiatrist', 'his care team',
  'the doctor can', 'medical evaluation', 'clinical evaluation',
];

const SIDES_TAKEN_TERMS = [
  'i agree with you', 'you are right to', 'we should stop this',
  'perhaps he is not', 'maybe he is not thinking', 'you may have a point',
  'i think you are right', 'your concern about his capacity',
];

const CAPACITY_DETERMINATION_TERMS = [
  'he has capacity', 'he is capable', 'he can make this decision',
  'he is mentally competent', 'i can confirm he has', 'he clearly has capacity',
  'he is of sound mind', 'he is competent',
];

const DIRECTIVE_PRESSURE_TERMS = [
  'you should support him', 'you need to accept', 'you have to let him',
  'the right thing to do is', 'you should step back', 'let him make this choice',
  'accept his decision', 'stop fighting this', 'you should agree',
];

const REPAIR_TERMS = [
  'let me rephrase', 'said that poorly', 'let me correct',
  'what i meant', 'i misspoke', 'to clarify', 'that came out wrong',
];

export function updateEsrdComfortCarePatientState(
  currentState: PatientState,
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): PatientStateUpdateResult {
  void conversationMessages;
  const lower = learnerMessageText.toLowerCase();

  // Rule 1 — SW takes sides against patient (worst violation)
  if (containsAny(lower, SIDES_TAKEN_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: -15,
        familyConflict: 15,
        resistance: -8,
        perceivedHonesty: -12,
        perceivedCompassion: -8,
      }),
      detectedBehaviors: ['sides_taken'],
      stateChangeSummary:
        "The learner appeared to validate James's position against his father, violating the Social Worker's neutrality.",
    };
  }

  // Rule 2 — SW makes clinical capacity determination
  if (containsAny(lower, CAPACITY_DETERMINATION_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: -10,
        confusion: 12,
        perceivedHonesty: -10,
        resistance: 5,
      }),
      detectedBehaviors: ['capacity_determination'],
      stateChangeSummary:
        "The learner made a clinical judgment about the patient's decision-making capacity, which is outside the Social Worker role.",
    };
  }

  // Rule 3 — SW pressures James to accept father's decision
  if (containsAny(lower, DIRECTIVE_PRESSURE_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: -8,
        resistance: 10,
        familyConflict: 8,
        perceivedCompassion: -10,
      }),
      detectedBehaviors: ['directive_pressure'],
      stateChangeSummary:
        "The learner directed James toward accepting the decision rather than facilitating his grief and values exploration.",
    };
  }

  const hasEmotionalAck = containsAny(lower, EMOTIONAL_ACK_TERMS);
  const hasAutonomy = containsAny(lower, AUTONOMY_TERMS);
  const hasValues = containsAny(lower, VALUES_TERMS);
  const hasFamilyMeeting = containsAny(lower, FAMILY_MEETING_TERMS);
  const hasClinicalRouting = containsAny(lower, CLINICAL_ROUTING_TERMS);

  // Rule 4 — Emotional ack + autonomy + values (complete SW response)
  if (hasEmotionalAck && hasAutonomy && hasValues) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 18,
        fear: -15,
        resistance: -18,
        familyConflict: -15,
        understanding: 18,
        griefIntensity: -10,
        perceivedCompassion: 18,
        perceivedHonesty: 12,
      }),
      detectedBehaviors: ['emotional_acknowledgment', 'autonomy_respected', 'values_elicitation'],
      stateChangeSummary:
        "The learner acknowledged James's fear, explained patient autonomy, and invited exploration of his father's values — the three core Social Worker moves.",
    };
  }

  // Rule 5 — Emotional ack + values
  if (hasEmotionalAck && hasValues) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 14,
        fear: -10,
        familyConflict: -12,
        griefIntensity: -8,
        perceivedCompassion: 14,
      }),
      detectedBehaviors: ['emotional_acknowledgment', 'values_elicitation'],
      stateChangeSummary:
        "The learner acknowledged James's fear and invited a conversation about his father's values.",
    };
  }

  // Rule 6 — Emotional ack + autonomy
  if (hasEmotionalAck && hasAutonomy) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 12,
        fear: -10,
        resistance: -12,
        understanding: 12,
        perceivedCompassion: 12,
        perceivedHonesty: 8,
      }),
      detectedBehaviors: ['emotional_acknowledgment', 'autonomy_respected'],
      stateChangeSummary:
        "The learner acknowledged James's grief and explained patient autonomy in plain language.",
    };
  }

  // Rule 7 — Emotional ack alone
  if (hasEmotionalAck) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 8,
        fear: -8,
        familyConflict: -5,
        perceivedCompassion: 10,
      }),
      detectedBehaviors: ['emotional_acknowledgment'],
      stateChangeSummary:
        "The learner acknowledged James's emotional distress before moving to information or action.",
    };
  }

  // Rule 8 — Autonomy alone
  if (hasAutonomy) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 5,
        understanding: 10,
        perceivedHonesty: 8,
      }),
      detectedBehaviors: ['autonomy_respected'],
      stateChangeSummary:
        "The learner explained patient autonomy without first addressing James's emotional distress.",
    };
  }

  // Rule 9 — Family meeting offered
  if (hasFamilyMeeting) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 6,
        familyConflict: -8,
        perceivedCompassion: 6,
      }),
      detectedBehaviors: ['family_meeting_offered'],
      stateChangeSummary:
        "The learner offered to facilitate a family meeting, demonstrating the Social Worker role.",
    };
  }

  // Rule 10 — Clinical routing
  if (hasClinicalRouting) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 4,
        confusion: -6,
        understanding: 8,
        perceivedHonesty: 6,
      }),
      detectedBehaviors: ['clinical_routing'],
      stateChangeSummary:
        "The learner routed the clinical capacity question to the appropriate clinical team.",
    };
  }

  // Rule 11 — Repair language
  if (containsAny(lower, REPAIR_TERMS)) {
    return {
      updatedState: applyDelta(currentState, {
        trust: 5,
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
