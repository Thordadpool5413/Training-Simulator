import { safeLanguage } from '@/data/safeLanguage';
import type {
  ConversationMessage,
  FeedbackReport,
  PatientStateSnapshot,
  SafetyEvent,
} from '@/types/simulator';

const FOLLOWUP_WORDING_IDS = [
  'rn_air_hunger_acknowledgment',
  'rn_followup_comfort_reassurance',
  'rn_when_to_call',
] as const;

function hasBehavior(snapshots: PatientStateSnapshot[], behavior: string): boolean {
  return snapshots.some((s) => s.detectedBehaviors.includes(behavior));
}

function firstIndexWithBehavior(snapshots: PatientStateSnapshot[], behavior: string): number {
  return snapshots.findIndex((s) => s.detectedBehaviors.includes(behavior));
}

export function generateTerminalDyspneaFeedbackReport(
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
      "The learner acknowledged Carol's fear and explained that air hunger can still look intense even when the medication is easing the sensation. This is the core move in this follow-up visit — naming the doubt and then offering clarity about what Carol is actually seeing."
    );
  } else if (hadFearAck) {
    summaryParts.push(
      "The learner acknowledged Carol's fear, which was the right first step. The next move is explaining that air hunger can persist visually even when the comfort medication is working, so Carol understands that what she is seeing does not mean she gave the medication incorrectly."
    );
  } else if (hadComfortEd) {
    summaryParts.push(
      "The learner moved to comfort education before acknowledging Carol's fear that she may have failed Eleanor. Information about tools is harder to receive when the caregiver's doubt has not been named first."
    );
  } else {
    summaryParts.push(
      "The conversation stayed mostly neutral. No clear emotional acknowledgment or air hunger follow-up explanation was detected. Carol's opening line was an expression of doubt and fear, not a request for clinical information."
    );
  }

  if (hadComfortEd && hadCaregiverEmpow) {
    summaryParts.push(
      'Concrete comfort tools were offered and Carol was given clear actions she can take while Eleanor rests. This kind of practical guidance reduces helplessness during a frightening moment.'
    );
  }

  if (hadRnSafetyEvent && hadSafeMedRouting) {
    summaryParts.push(
      'A medication dose question was handled outside the RN scope initially, but the learner later corrected to safer routing language. In a follow-up visit, the hospice orders and on-call provider are the right source for any dose adjustment discussion.'
    );
  } else if (hadRnSafetyEvent) {
    summaryParts.push(
      'A specific medication dose was stated or changed without deferring to the hospice orders. In this follow-up scenario, dose decisions require the hospice orders and on-call provider, not the visiting RN in real time.'
    );
  } else if (hadSafeMedRouting) {
    summaryParts.push(
      'When the dose question arose, the learner correctly confirmed that comfort medications are part of the plan of care and routed the dose question to the hospice orders and on-call provider.'
    );
  }

  if (hadOverpromise) {
    summaryParts.push(
      "Some wording may have overpromised that the medication or comfort tools would eliminate Eleanor's visible breathing discomfort. This removes caregiver agency and sets up a loss of trust if the visible distress continues."
    );
  }

  const overallCoachingSummary = summaryParts.join(' ');

  // ── whatWentWell ─────────────────────────────────────────────────────────
  const whatWentWell: string[] = [];

  if (hadFearAck) {
    whatWentWell.push("Acknowledged Carol's fear before moving into any explanation or instruction.");
  }
  if (hadAirHungerExp) {
    whatWentWell.push(
      'Explained that air hunger can still look intense even when the medication is easing the sensation — without minimizing what Carol is seeing.'
    );
  }
  if (hadComfortEd && hadCaregiverEmpow) {
    whatWentWell.push(
      'Described comfort tools Carol can use and gave her concrete actions to take while waiting for the comfort plan to take effect.'
    );
  }
  if (hadSafeMedRouting && !hadRnSafetyEvent) {
    whatWentWell.push(
      'Confirmed comfort medications are part of the plan of care and routed the dose question to the hospice orders and on-call provider.'
    );
  }
  if (hadSafeMedRouting && hadRnSafetyEvent) {
    whatWentWell.push('Corrected to safer medication routing language after the initial response.');
  }
  if (hadRoleBoundary && !hadRnSafetyEvent) {
    whatWentWell.push(
      'Maintained the RN role boundary around medication dose specifics throughout the follow-up visit.'
    );
  }

  // ── whatChangedTheRoom ───────────────────────────────────────────────────
  const whatChangedTheRoom: string[] = [];

  if (hadFearAck && hadAirHungerExp) {
    whatChangedTheRoom.push(
      "The turning point was when the learner acknowledged Carol's doubt — that she feared she had failed Eleanor — and explained that the visible struggle does not mean the medication is not helping. That distinction gives Carol something to hold onto and shifts her from helpless witness to informed caregiver."
    );
  } else if (hadFearAck) {
    whatChangedTheRoom.push(
      "Acknowledging Carol's fear was the right start and began a shift in the conversation. The next turning point is explaining what she is seeing — that air hunger can look intense even when the comfort medication is working on the inside."
    );
  } else {
    whatChangedTheRoom.push(
      "No clear turning point was detected in this conversation. The most powerful shift comes from naming Carol's fear directly — that she may have failed Eleanor or that the medication is not enough — and then explaining what air hunger looks like versus what it feels like on the inside."
    );
  }

  // ── missedEmotionalCues ──────────────────────────────────────────────────
  const missedEmotionalCues: string[] = [];

  if (!hadFearAck) {
    missedEmotionalCues.push(
      "Carol's opening line — \"She still looks so uncomfortable. I gave her the medicine an hour ago like you showed me\" — is a statement of self-doubt and fear, not a clinical question about dosing. The most important first response is to name Carol's fear directly and validate that she did everything right before offering any explanation."
    );
  }
  if (comfortBeforeFear) {
    missedEmotionalCues.push(
      "Comfort education was offered before acknowledging Carol's doubt. Tools and instructions are harder to absorb when the caregiver is carrying the fear that she already made a mistake. A brief acknowledgment of what Carol must be feeling opens the door for everything that follows."
    );
  }

  // ── roleBoundaryReview ───────────────────────────────────────────────────
  let roleBoundaryReview: string;

  if (hadRnSafetyEvent && hadSafeMedRouting) {
    roleBoundaryReview =
      'A specific medication dose or order change was stated without deferring to the hospice orders. The learner later corrected to safer language by confirming that comfort medications are part of the plan and routing the dose question to the hospice orders and on-call provider. In a follow-up home visit, the safer move is to confirm the plan exists and route immediately on the first response.';
  } else if (hadRnSafetyEvent) {
    roleBoundaryReview =
      'A specific medication dose or order change was stated without deferring to the hospice orders. In this follow-up home visit, exact dose instructions must come from the hospice orders and the on-call provider, not from the RN in real time. The safer move is to confirm that comfort medications are part of the plan of care and route the dose question to the on-call provider.';
  } else if (hadSafeMedRouting || hadRoleBoundary) {
    roleBoundaryReview =
      'The learner stayed within the RN role boundary and correctly confirmed that comfort medications are part of the plan of care without stating specific doses. This is exactly the right approach during a follow-up home visit.';
  } else {
    roleBoundaryReview =
      'No medication dose boundary issue was detected in this conversation. Practice the routing language — confirming the comfort plan exists and directing exact dose questions to the hospice orders and on-call provider — so it is ready when Carol asks about changing the dose.';
  }

  // ── medicationSafetyReview ───────────────────────────────────────────────
  const medicationSafetyReview = hadRnSafetyEvent
    ? 'Stating or adjusting a specific medication dose without the hospice orders present goes beyond what the RN can confirm in real time during a home visit. The right response is to validate the concern, confirm that comfort medications are part of the plan of care, and route exact dose instructions to the hospice orders or on-call provider.'
    : 'No medication dose safety issue was detected in this conversation.';

  // ── hospiceLanguageReview (air hunger follow-up framing) ─────────────────
  let hospiceLanguageReview: string;

  if (hadAirHungerExp) {
    hospiceLanguageReview =
      "The follow-up air hunger explanation was delivered in plain language — that the body can still signal breathing difficulty even when the comfort medication is reducing the sensation on the inside. This kind of explanation helps Carol understand that what she is seeing does not mean she failed Eleanor.";
  } else if (hadComfortEd) {
    hospiceLanguageReview =
      "Comfort tools were described but the follow-up air hunger explanation was not delivered. A strong addition is explaining that Eleanor's visible discomfort does not mean the medication is failing — that air hunger can still look intense even when the comfort plan is working on the inside.";
  } else {
    hospiceLanguageReview =
      'Neither the air hunger follow-up explanation nor comfort tools were clearly delivered in this conversation. The three educational moves that most reduce caregiver doubt in this scenario are: explaining that visible distress does not mean medication failure, describing concrete comfort tools, and giving Carol a clear picture of when to call the hospice team.';
  }

  // ── suggestedWording ─────────────────────────────────────────────────────
  const suggestedWording = FOLLOWUP_WORDING_IDS
    .map((id) => safeLanguage.find((e) => e.id === id)?.text)
    .filter((text): text is string => text !== undefined);

  // ── nextPracticeFocus ────────────────────────────────────────────────────
  let nextPracticeFocus: string;

  if (hadRnSafetyEvent) {
    nextPracticeFocus =
      'Practice routing medication dose questions within the RN scope during follow-up visits. When Carol asks whether the dose needs to change, confirm that comfort medications are part of the plan of care and route the exact dose question to the hospice orders and on-call provider rather than stating or estimating a dose directly.';
  } else if (!hadFearAck) {
    nextPracticeFocus =
      "Practice acknowledging caregiver fear before offering any explanation. When Carol says she gave the medication but Eleanor still looks uncomfortable, the first response should name Carol's doubt and validate that she did everything right. That one move changes the whole follow-up visit.";
  } else if (!hadAirHungerExp) {
    nextPracticeFocus =
      "Practice explaining the follow-up air hunger concept in plain language. The key is helping Carol understand that Eleanor's body can still signal breathing difficulty even when the comfort medication is working on the inside — and that what she is seeing does not mean she administered it incorrectly.";
  } else if (!hadComfortEd) {
    nextPracticeFocus =
      'Practice describing concrete non-pharmacologic comfort tools — keeping Eleanor sitting upright, using a cool fan, staying calm and present beside her — so Carol has actions she can take while the comfort plan continues to work.';
  } else {
    nextPracticeFocus =
      'The emotional and educational foundation is strong. The next step is practicing how to close a follow-up visit clearly — confirming what Carol will watch for, when to call the hospice team, and that she does not have to figure this out alone.';
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
