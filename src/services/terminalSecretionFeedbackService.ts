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

export function generateTerminalSecretionFeedbackReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): FeedbackReport {
  void conversationMessages;

  const hadFearAck = hasBehavior(patientStateSnapshots, 'fear_acknowledgment');
  const hadSecretionExp = hasBehavior(patientStateSnapshots, 'secretion_explanation');
  const hadComfortEd = hasBehavior(patientStateSnapshots, 'comfort_education');
  const hadCaregiverEmpow = hasBehavior(patientStateSnapshots, 'caregiver_empowerment');
  const hadSafeMedRouting = hasBehavior(patientStateSnapshots, 'safe_medication_routing');
  const hadOverpromise = hasBehavior(patientStateSnapshots, 'overpromise_symptom_control');
  const hadRnSafetyEvent = safetyEvents.some(
    (e) => e.violationCategory === 'rn_medication_dose_outside_orders'
  );

  const summaryParts: string[] = [];
  if (hadFearAck && hadSecretionExp) {
    summaryParts.push(
      "The learner acknowledged Linda's fear and explained what terminal secretions are and why they are not a sign of drowning or choking. This is the most important clinical education in this scenario."
    );
  } else if (hadFearAck) {
    summaryParts.push(
      "The learner acknowledged Linda's fear, which was the right first move. Adding a clear explanation of what terminal secretions are would complete the clinical education."
    );
  }
  if (hadOverpromise) {
    summaryParts.push(
      'The learner overpromised that the sound would stop completely. The more honest and helpful framing is that the sound may ease but cannot be guaranteed to stop.'
    );
  }
  if (hadRnSafetyEvent) {
    summaryParts.push(
      'A medication question arose and the response included specific dose language outside the RN scope. Medication dose decisions belong with the hospice orders and on-call provider.'
    );
  }
  if (hadCaregiverEmpow) {
    summaryParts.push(
      'The learner gave Linda concrete actions — repositioning, mouth swabs, staying calm — which reduced her sense of helplessness.'
    );
  }
  if (summaryParts.length === 0) {
    summaryParts.push(
      'The conversation stayed mostly neutral. No major role boundary issues were detected and no clear turning point emerged.'
    );
  }

  const whatWentWell: string[] = [];
  if (hadFearAck) whatWentWell.push("Acknowledged Linda's fear before explaining anything.");
  if (hadSecretionExp) whatWentWell.push('Explained terminal secretions in plain language — not drowning, not choking.');
  if (hadComfortEd) whatWentWell.push('Described comfort measures Linda can use.');
  if (hadCaregiverEmpow) whatWentWell.push('Empowered Linda with specific actions she can take.');
  if (hadSafeMedRouting && !hadRnSafetyEvent) whatWentWell.push('Routed the medication question safely to the hospice orders and on-call provider.');

  const whatChangedTheRoom: string[] = [];
  if (hadFearAck && hadSecretionExp) {
    whatChangedTheRoom.push(
      "The turning point was when the learner explained that the gurgling sound is not drowning — that the throat muscles are simply relaxing and Earl is not in distress from the sound the way it seems from outside. This changed Linda's role from helpless witness to informed presence."
    );
  } else {
    whatChangedTheRoom.push(
      "No clear turning point was detected. In terminal secretion conversations, the shift happens when the caregiver understands that the sound does not mean suffering. That explanation is the most important piece."
    );
  }

  const missedEmotionalCues: string[] = [];
  if (!hadFearAck) {
    missedEmotionalCues.push(
      "Linda's opening was a statement of terror — she believed her husband was drowning from the inside. Acknowledging that fear directly before explaining anything is the right first move."
    );
  }

  let roleBoundaryReview: string;
  if (hadRnSafetyEvent && hadSafeMedRouting) {
    roleBoundaryReview = 'A medication question arose. The learner initially responded outside RN scope but later corrected to safer routing language.';
  } else if (hadRnSafetyEvent) {
    roleBoundaryReview = 'A medication dose question arose and was not routed to the hospice orders and on-call provider. Dose decisions belong with the provider.';
  } else {
    roleBoundaryReview = 'No role boundary issue was detected in this scenario.';
  }

  const medicationSafetyReview = hadRnSafetyEvent
    ? 'Specific medication dose language is outside the RN scope. Route dose questions to the hospice on-call provider.'
    : 'No medication boundary issue was detected in this scenario.';

  const hospiceLanguageReview = hadSecretionExp
    ? "The learner explained terminal secretions clearly, which helped Linda understand that the sound she was hearing is not a sign of Earl's suffering."
    : "Terminal secretions were not clearly explained. Families need to hear directly that the gurgling sound is not drowning or choking — this is the most frightening misconception in this scenario.";

  const wordingIds = ['rn_secretion_explanation', 'rn_repositioning_guidance'];
  const suggestedWording = wordingIds
    .map((id) => safeLanguage.find((e) => e.id === id)?.text)
    .filter((text): text is string => text !== undefined);

  let nextPracticeFocus: string;
  if (hadRnSafetyEvent) {
    nextPracticeFocus = 'Practice routing medication dose questions safely. When a medication question arises, confirm the comfort plan and route the clinical decision to the on-call provider.';
  } else if (!hadFearAck) {
    nextPracticeFocus = "Practice acknowledging Linda's fear before explaining anything. She opened with terror — that needs to be heard before she can take in clinical information.";
  } else if (!hadSecretionExp) {
    nextPracticeFocus = 'Practice explaining terminal secretions in plain language. The key is helping Linda understand that the sound is not drowning — it is the body relaxing, and Earl is not in distress from the way it sounds outside.';
  } else {
    nextPracticeFocus = 'The explanation arc is in place. The next step is practicing how to give Linda comfort actions and close with a clear next step for when to call the team.';
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
