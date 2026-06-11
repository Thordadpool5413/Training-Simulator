import { safeLanguage } from '@/data/safeLanguage';
import type {
  ConversationMessage,
  FeedbackReport,
  PatientStateSnapshot,
  SafetyEvent,
} from '@/types/simulator';

function hasBehavior(snapshots: PatientStateSnapshot[], behavior: string): boolean {
  return snapshots.some((s) => s.detectedBehaviors.includes(behavior));
}

export function generateActiveDyingFeedbackReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): FeedbackReport {
  void conversationMessages;

  const hadFearAck = hasBehavior(patientStateSnapshots, 'fear_acknowledgment');
  const hadDyingProcess = hasBehavior(patientStateSnapshots, 'dying_process_explained');
  const hadComfortEd = hasBehavior(patientStateSnapshots, 'comfort_education');
  const hadCaregiverEmpow = hasBehavior(patientStateSnapshots, 'caregiver_empowerment');
  const hadSafeMedRouting = hasBehavior(patientStateSnapshots, 'safe_medication_routing');
  const hadDoseOverstep = hasBehavior(patientStateSnapshots, 'medication_dose_overstep');
  const hadOverpromise = hasBehavior(patientStateSnapshots, 'overpromise_symptom_control');
  const hadEmergencyError = hasBehavior(patientStateSnapshots, 'emergency_routing_error');
  const hadRnSafetyEvent = safetyEvents.some(
    (e) => e.violationCategory === 'rn_medication_dose_outside_orders'
  );

  const summaryParts: string[] = [];
  if (hadFearAck && hadDyingProcess) {
    summaryParts.push(
      "The learner acknowledged Patricia's fear and explained the active dying process, which helped her understand what she was witnessing and gave her a role to play."
    );
  } else if (hadFearAck) {
    summaryParts.push(
      "The learner acknowledged Patricia's fear, which was the right first move. Pairing that with a plain language explanation of what the dying signs mean would complete the clinical education piece."
    );
  }
  if (hadEmergencyError) {
    summaryParts.push(
      'The learner suggested calling 911 or going to the hospital, which is not appropriate for a patient in active dying on hospice. This can increase family distress and goes against the comfort-focused care plan.'
    );
  }
  if (hadDoseOverstep || hadRnSafetyEvent) {
    summaryParts.push(
      'A medication question arose and the response included specific dose language, which is outside the RN scope without referencing hospice orders and the on-call provider.'
    );
  }
  if (hadCaregiverEmpow) {
    summaryParts.push(
      "The learner empowered Patricia with a clear role at the bedside — staying present, talking to Betty, holding her hand. This is one of the most important things an RN can offer in this scenario."
    );
  }
  if (summaryParts.length === 0) {
    summaryParts.push(
      'The conversation stayed mostly neutral. No major role boundary issues were detected and no clear turning point emerged. Keep practicing to build confidence with active dying conversations.'
    );
  }

  const whatWentWell: string[] = [];
  if (hadFearAck) whatWentWell.push("Acknowledged Patricia's fear before moving into explanation.");
  if (hadDyingProcess) whatWentWell.push('Explained the active dying process in plain language.');
  if (hadComfortEd) whatWentWell.push('Described comfort measures Patricia can use at the bedside.');
  if (hadCaregiverEmpow) whatWentWell.push('Empowered Patricia to stay present and hold a vigil.');
  if (hadSafeMedRouting && !hadRnSafetyEvent) whatWentWell.push('Routed the medication question safely to the hospice orders and on-call provider.');

  const whatChangedTheRoom: string[] = [];
  if (hadFearAck && hadDyingProcess) {
    whatChangedTheRoom.push(
      "The turning point was when the learner explained what mottling and Cheyne-Stokes breathing mean — that these are natural parts of dying, not signs of suffering. This shifted Patricia from terrified witness to informed presence."
    );
  } else {
    whatChangedTheRoom.push(
      "No clear turning point was detected. In active dying conversations, the most powerful shift comes from explaining what the signs mean and giving the caregiver a specific role — staying beside their person."
    );
  }

  const missedEmotionalCues: string[] = [];
  if (!hadFearAck) {
    missedEmotionalCues.push(
      "Patricia's opening was a statement of terror — she believed her mother was actively suffering and asked whether to call 911. Acknowledging that fear directly before explaining anything is the right first move."
    );
  }

  let roleBoundaryReview: string;
  if (hadRnSafetyEvent && hadSafeMedRouting) {
    roleBoundaryReview = 'A medication question arose. The learner initially responded outside RN scope but later corrected to safer routing language. The goal is to route on the first response.';
  } else if (hadRnSafetyEvent) {
    roleBoundaryReview = 'A medication dose question arose and was not routed to the hospice orders and on-call provider. When a dose question arises, confirm the comfort plan exists and route the dose decision to the provider.';
  } else if (hadEmergencyError) {
    roleBoundaryReview = 'The learner suggested calling 911 or going to the hospital. For a hospice patient in active dying, the correct response is to notify the hospice on-call team, not to suggest emergency services.';
  } else {
    roleBoundaryReview = 'No role boundary issue was detected in this scenario.';
  }

  const medicationSafetyReview = hadRnSafetyEvent
    ? 'Specific medication dose language is outside the RN scope without referencing hospice orders. Route dose questions to the hospice on-call provider.'
    : 'No medication boundary issue was detected in this scenario.';

  const hospiceLanguageReview = hadDyingProcess
    ? "The learner explained the dying process clearly, which helped Patricia understand that the physical changes she was seeing are natural and not a sign of suffering."
    : "The signs of active dying — mottling, Cheyne-Stokes breathing, cooling extremities — were not clearly explained in plain language. Naming what these signs mean helps families move from panic to presence.";

  const wordingIds = ['rn_dying_process_explanation', 'rn_vigil_empowerment'];
  const suggestedWording = wordingIds
    .map((id) => safeLanguage.find((e) => e.id === id)?.text)
    .filter((text): text is string => text !== undefined);

  let nextPracticeFocus: string;
  if (hadRnSafetyEvent) {
    nextPracticeFocus = 'Practice routing medication dose questions safely. When a dose question arises in an active dying conversation, confirm the comfort plan and route the clinical decision to the on-call provider.';
  } else if (hadEmergencyError) {
    nextPracticeFocus = 'Practice the correct escalation path for active dying on hospice. The right call is to the hospice on-call team, not 911, unless the family chooses to leave hospice.';
  } else if (!hadFearAck) {
    nextPracticeFocus = "Practice responding to emotional fear before providing clinical explanation. Patricia's opening line is a statement of terror. Acknowledge what she is experiencing before explaining what the signs mean.";
  } else if (!hadDyingProcess) {
    nextPracticeFocus = 'Practice explaining active dying signs in plain language. Families need to understand that mottling, cooling, and Cheyne-Stokes breathing are natural — not signs of pain or suffering.';
  } else {
    nextPracticeFocus = 'The clinical explanation and empowerment arc is in place. The next step is practicing how to give Patricia a specific vigil role and closing with a clear next step for when to call the team.';
  }

  return {
    id: `${Date.now()}-feedback`,
    scenarioId,
    overallCoachingSummary: summaryParts.join(' '),
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
