import { safeLanguage } from '@/data/safeLanguage';
import type {
  ConversationMessage,
  FeedbackReport,
  PatientStateSnapshot,
  SafetyEvent,
} from '@/types/simulator';

const RN_WORDING_IDS = [
  'rn_air_hunger_acknowledgment',
  'rn_air_hunger_explanation',
  'rn_medication_routing',
] as const;

function hasBehavior(snapshots: PatientStateSnapshot[], behavior: string): boolean {
  return snapshots.some((s) => s.detectedBehaviors.includes(behavior));
}

function firstIndexWithBehavior(snapshots: PatientStateSnapshot[], behavior: string): number {
  return snapshots.findIndex((s) => s.detectedBehaviors.includes(behavior));
}

export function generateRnFeedbackReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): FeedbackReport {
  void conversationMessages;

  const hadFearAck = hasBehavior(patientStateSnapshots, 'fear_acknowledgment');
  const hadAirHungerExp = hasBehavior(patientStateSnapshots, 'air_hunger_explanation');
  const hadComfortEd = hasBehavior(patientStateSnapshots, 'comfort_education');
  const hadCaregiverEmpow = hasBehavior(patientStateSnapshots, 'caregiver_empowerment');
  const hadSafeMedRouting = hasBehavior(patientStateSnapshots, 'safe_medication_routing');
  const hadRoleBoundary = hasBehavior(patientStateSnapshots, 'role_boundary_respected');
  const hadDoseOverstep = hasBehavior(patientStateSnapshots, 'medication_dose_overstep');
  const hadOverpromise = hasBehavior(patientStateSnapshots, 'overpromise_symptom_control');
  const hadRnSafetyEvent = safetyEvents.some(
    (e) => e.violationCategory === 'rn_medication_dose_outside_orders'
  );

  const firstFearAckIdx = firstIndexWithBehavior(patientStateSnapshots, 'fear_acknowledgment');
  const firstComfortEdIdx = firstIndexWithBehavior(patientStateSnapshots, 'comfort_education');
  const comfortBeforeFear =
    firstComfortEdIdx !== -1 &&
    (firstFearAckIdx === -1 || firstComfortEdIdx < firstFearAckIdx);

  void hadDoseOverstep;

  // ── overallCoachingSummary ───────────────────────────────────────────────
  const summaryParts: string[] = [];

  if (hadFearAck && hadAirHungerExp) {
    summaryParts.push(
      "The learner acknowledged Margaret's fear and explained air hunger in plain language. This is the core arc of this conversation — naming the terror and then offering clarity about what is actually happening."
    );
  } else if (hadFearAck) {
    summaryParts.push(
      "The learner acknowledged Margaret's fear, which was the right first step. The next move is explaining what air hunger is in plain language so that Margaret understands what Harold is experiencing and why oxygen alone may not be enough."
    );
  } else if (hadComfortEd) {
    summaryParts.push(
      "The learner moved to comfort education before acknowledging Margaret's fear. Information is harder to receive when fear has not been named first."
    );
  } else {
    summaryParts.push(
      "The conversation stayed mostly neutral. No clear emotional acknowledgment or air hunger explanation was detected. Margaret's opening line was a statement of terror, not a request for clinical information."
    );
  }

  if (hadComfortEd && hadCaregiverEmpow) {
    summaryParts.push(
      'Concrete comfort tools were offered and Margaret was given clear actions she can take. This kind of practical guidance reduces helplessness.'
    );
  }

  if (hadRnSafetyEvent && hadSafeMedRouting) {
    summaryParts.push(
      'A medication dose question was handled outside the RN scope initially, but the learner later corrected to safer routing language. The hospice orders and on-call provider are the right source for exact dose instructions.'
    );
  } else if (hadRnSafetyEvent) {
    summaryParts.push(
      'A specific medication dose was stated or changed without deferring to the hospice orders. Exact dose instructions require the hospice orders and on-call provider, not the RN in real time.'
    );
  } else if (hadSafeMedRouting) {
    summaryParts.push(
      'When the medication question arose, the learner correctly confirmed that comfort medications are part of the plan of care and routed the dose question to the hospice orders and on-call provider.'
    );
  }

  if (hadOverpromise) {
    summaryParts.push(
      "Some wording may have overpromised that medication or intervention would eliminate Harold's breathing difficulty. Overpromising removes caregiver agency and sets up a loss of trust if the intervention does not fully resolve the episode."
    );
  }

  const overallCoachingSummary = summaryParts.join(' ');

  // ── whatWentWell ─────────────────────────────────────────────────────────
  const whatWentWell: string[] = [];

  if (hadFearAck) {
    whatWentWell.push("Acknowledged Margaret's fear before moving into clinical education.");
  }
  if (hadAirHungerExp) {
    whatWentWell.push('Explained air hunger in plain language without minimizing what Harold is experiencing.');
  }
  if (hadComfortEd && hadCaregiverEmpow) {
    whatWentWell.push('Described comfort tools Margaret can use and gave her concrete actions she can take.');
  }
  if (hadSafeMedRouting && !hadRnSafetyEvent) {
    whatWentWell.push('Confirmed comfort medications are part of the plan of care and routed the dose question to the hospice orders and on-call provider.');
  }
  if (hadSafeMedRouting && hadRnSafetyEvent) {
    whatWentWell.push('Corrected to safer medication routing language after the initial response.');
  }
  if (hadRoleBoundary && !hadRnSafetyEvent) {
    whatWentWell.push('Maintained the RN role boundary around medication dose specifics throughout the conversation.');
  }

  // ── whatChangedTheRoom ───────────────────────────────────────────────────
  const whatChangedTheRoom: string[] = [];

  if (hadFearAck && hadAirHungerExp) {
    whatChangedTheRoom.push(
      "The turning point was when the learner acknowledged Margaret's terror and explained what air hunger is — real and frightening, but different from suffocation. That distinction gives Margaret something to hold onto and changes her experience from helpless witness to informed caregiver."
    );
  } else if (hadFearAck) {
    whatChangedTheRoom.push(
      "Acknowledging Margaret's fear was the right move and started a shift in the conversation. The next turning point is explaining what air hunger is in plain language so that the distinction between air hunger and suffocation becomes clear."
    );
  } else {
    whatChangedTheRoom.push(
      "No clear turning point was detected in this conversation. The most powerful shift comes from naming Margaret's fear directly and then explaining what air hunger is and why oxygen alone may not resolve the sensation."
    );
  }

  // ── missedEmotionalCues ──────────────────────────────────────────────────
  const missedEmotionalCues: string[] = [];

  if (!hadFearAck) {
    missedEmotionalCues.push(
      'Margaret\'s opening line — "He keeps saying he cannot breathe. I am scared he is suffocating and I do not know what to do" — is a statement of terror, not a question about clinical steps. The most important first response is to name that fear directly before offering any explanation or instruction.'
    );
  }
  if (comfortBeforeFear) {
    missedEmotionalCues.push(
      "Comfort education was offered before acknowledging the fear in the room. Information about tools and plans is harder to receive when fear has not been heard first. A brief acknowledgment of the terror Margaret is experiencing opens the door for everything that follows."
    );
  }

  // ── roleBoundaryReview ───────────────────────────────────────────────────
  let roleBoundaryReview: string;

  if (hadRnSafetyEvent && hadSafeMedRouting) {
    roleBoundaryReview =
      'A specific medication dose or order change was stated without deferring to the hospice orders. The learner later corrected to safer language by confirming that comfort medications are part of the plan and routing the dose question to the hospice orders and on-call provider. On the first response, the safer move is to confirm the plan exists and route immediately.';
  } else if (hadRnSafetyEvent) {
    roleBoundaryReview =
      'A specific medication dose or order change was stated without deferring to the hospice orders. In a home visit, exact dose instructions must come from the hospice orders and the on-call provider, not from the RN in real time without the orders present. The safer move is to confirm that comfort medications are part of the plan of care and route the dose question to the on-call provider.';
  } else if (hadSafeMedRouting || hadRoleBoundary) {
    roleBoundaryReview =
      'The learner stayed within the RN role boundary and correctly confirmed that comfort medications are part of the plan of care without stating specific doses. This is exactly the right approach.';
  } else {
    roleBoundaryReview =
      'No medication dose boundary issue was detected in this conversation. Practice the routing language — confirming the comfort plan exists and directing exact dose questions to the hospice orders and on-call provider — so it is ready when the question arises.';
  }

  // ── medicationSafetyReview ───────────────────────────────────────────────
  const medicationSafetyReview = hadRnSafetyEvent
    ? 'Stating or changing a specific medication dose without the hospice orders present goes beyond what the RN can confirm in real time. The right response is to validate the concern, confirm that comfort medications are part of the plan of care, and route exact dose instructions to the hospice orders or on-call provider.'
    : 'No medication dose safety issue was detected in this conversation.';

  // ── hospiceLanguageReview (repurposed: air hunger and comfort language) ──
  let hospiceLanguageReview: string;

  if (hadAirHungerExp) {
    hospiceLanguageReview =
      "Air hunger was explained in plain language, which helps Margaret understand that Harold's distress is real without being caused by suffocation. This kind of language helps caregivers stay present and take action rather than panic.";
  } else if (hadComfortEd) {
    hospiceLanguageReview =
      "Comfort tools were described but air hunger was not explained in plain language. A strong addition is explaining what air hunger is — that the body can signal distress about breathing even when some air is moving in and out — and that this is different from the suffocation Margaret fears.";
  } else {
    hospiceLanguageReview =
      'Neither air hunger nor comfort tools were clearly explained in this conversation. Explaining what air hunger is, why oxygen may not fully relieve it, and what concrete tools Margaret can use are the three educational moves that most reduce caregiver panic in this scenario.';
  }

  // ── suggestedWording ─────────────────────────────────────────────────────
  const suggestedWording = RN_WORDING_IDS
    .map((id) => safeLanguage.find((e) => e.id === id)?.text)
    .filter((text): text is string => text !== undefined);

  // ── nextPracticeFocus ────────────────────────────────────────────────────
  let nextPracticeFocus: string;

  if (hadRnSafetyEvent) {
    nextPracticeFocus =
      'Practice routing medication dose questions within the RN scope. When a caregiver asks about a specific dose, confirm that comfort medications are part of the plan of care and route the exact dose question to the hospice orders and on-call provider rather than stating or estimating a dose directly.';
  } else if (!hadFearAck) {
    nextPracticeFocus =
      "Practice acknowledging caregiver fear before offering clinical education. When Margaret says she is scared Harold is suffocating, the first response should name that fear directly. That one move changes the whole room.";
  } else if (!hadAirHungerExp) {
    nextPracticeFocus =
      "Practice explaining air hunger in plain language. The key is helping caregivers understand that Harold's body is signaling distress about breathing even when some air is moving in and out, and that this experience is different from suffocation. That distinction reduces panic.";
  } else if (!hadComfortEd) {
    nextPracticeFocus =
      'Practice describing concrete non-pharmacologic comfort tools — positioning upright, a cool fan, calm presence, staying beside Harold — so Margaret has actions she can take while waiting for the comfort plan to take effect.';
  } else {
    nextPracticeFocus =
      'The emotional and educational foundation is strong. The next step is practicing how to close a home visit clearly — confirming what Margaret will do next, when to call the hospice team, and that she does not have to face this alone.';
  }

  return {
    id: `${Date.now()}-feedback`,
    scenarioId,
    overallCoachingSummary,
    whatWentWell,
    whatChangedTheRoom,
    missedEmotionalCues,
    roleBoundaryReview,
    medicationSafetyReview,
    hospiceLanguageReview,
    suggestedWording,
    nextPracticeFocus,
    createdAt: new Date().toISOString(),
  };
}
