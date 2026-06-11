import { safeLanguage } from '@/data/safeLanguage';
import { generateMedicationRefusalFeedbackReport } from '@/services/medicationRefusalFeedbackService';
import { generatePainManagementFeedbackReport } from '@/services/painManagementFeedbackService';
import { generateRnFeedbackReport } from '@/services/rnFeedbackService';
import { generateTerminalDyspneaFeedbackReport } from '@/services/terminalDyspneaFeedbackService';
import type {
  ConversationMessage,
  FeedbackReport,
  PatientStateSnapshot,
  SafetyEvent,
} from '@/types/simulator';

function getApprovedWordingIds(scenarioId: string): string[] {
  if (scenarioId === 'can_change_minds') {
    return [
      'cl_revocation_plain_language',
      'cl_hospice_as_choice',
      'cl_revocation_repair',
      'medication_routing_response',
    ];
  }
  if (scenarioId === 'hospice_too_soon') {
    return [
      'cl_too_soon_validation',
      'cl_hospice_timeline_education',
      'cl_what_hospice_provides',
      'medication_routing_response',
    ];
  }
  return [
    'hospice_fear_response',
    'medication_routing_response',
    'repair_language',
  ];
}

function hasBehavior(snapshots: PatientStateSnapshot[], behavior: string): boolean {
  return snapshots.some((s) => s.detectedBehaviors.includes(behavior));
}

function firstIndexWithBehavior(snapshots: PatientStateSnapshot[], behavior: string): number {
  return snapshots.findIndex((s) => s.detectedBehaviors.includes(behavior));
}

export function generateFeedbackReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): FeedbackReport {
  if (scenarioId === 'copd_air_hunger_at_home') {
    return generateRnFeedbackReport(scenarioId, conversationMessages, safetyEvents, patientStateSnapshots);
  }
  if (scenarioId === 'terminal_dyspnea_follow_up') {
    return generateTerminalDyspneaFeedbackReport(scenarioId, conversationMessages, safetyEvents, patientStateSnapshots);
  }
  if (scenarioId === 'pain_management_concern') {
    return generatePainManagementFeedbackReport(scenarioId, conversationMessages, safetyEvents, patientStateSnapshots);
  }
  if (scenarioId === 'medication_refusal') {
    return generateMedicationRefusalFeedbackReport(scenarioId, conversationMessages, safetyEvents, patientStateSnapshots);
  }

  void conversationMessages;

  // --- Detect boolean flags ---
  const hadServiceFirst = hasBehavior(patientStateSnapshots, 'service_explanation_before_emotion');
  const hadEmotionalAck = hasBehavior(patientStateSnapshots, 'emotional_acknowledgment');
  const hadHospiceReframe = hasBehavior(patientStateSnapshots, 'hospice_reframe');
  const hadRepairLanguage = hasBehavior(patientStateSnapshots, 'repair_language');
  const hadSafeMedRouting = hasBehavior(patientStateSnapshots, 'safe_medication_routing');
  const hadAbandonmentLanguage = hasBehavior(patientStateSnapshots, 'abandonment_language');
  const hadMedSafetyEvent = safetyEvents.some(
    (e) => e.violationCategory === 'medication_outside_role'
  );

  // --- Detect sequence ---
  const firstServiceFirstIdx = firstIndexWithBehavior(
    patientStateSnapshots,
    'service_explanation_before_emotion'
  );
  const firstEmotionalAckIdx = firstIndexWithBehavior(
    patientStateSnapshots,
    'emotional_acknowledgment'
  );

  // --- overallCoachingSummary ---
  const summaryParts: string[] = [];

  if (hadServiceFirst && !hadEmotionalAck) {
    summaryParts.push(
      "The learner led with factual hospice information before addressing the daughter's fear. The family's resistance stayed high because the emotional concern was not directly acknowledged."
    );
  } else if (hadServiceFirst && hadEmotionalAck) {
    summaryParts.push(
      "The learner initially provided hospice information before acknowledging the emotional concern, but later addressed the daughter's fear and improved the conversation."
    );
  } else if (hadEmotionalAck) {
    summaryParts.push(
      "The learner acknowledged the daughter's fear early, which helped move the conversation toward trust and understanding."
    );
  }

  if (hadHospiceReframe) {
    summaryParts.push(
      "Framing hospice as continued support rather than abandonment was the right move and directly addressed the family's core concern."
    );
  }

  if (hadAbandonmentLanguage) {
    summaryParts.push(
      "Some wording may have reinforced the family's fear that care was stopping rather than changing focus."
    );
  }

  if (hadMedSafetyEvent && hadSafeMedRouting) {
    summaryParts.push(
      'A medication question arose. The learner initially responded outside the Clinical Liaison role but later used safer routing language.'
    );
  } else if (hadMedSafetyEvent) {
    summaryParts.push(
      'A medication question arose and the response was outside the Clinical Liaison role. Medication guidance should always be routed to the hospice nurse or provider.'
    );
  } else if (hadSafeMedRouting) {
    summaryParts.push(
      'When the medication question arose, the learner correctly stayed within role by routing it to the hospice nurse or provider.'
    );
  }

  if (hadRepairLanguage) {
    summaryParts.push(
      'The learner used repair language to correct prior wording, which is a strong trust-building move.'
    );
  }

  if (summaryParts.length === 0) {
    summaryParts.push(
      'The conversation stayed mostly neutral. No major role boundary issues were detected and no clear turning point emerged. Keep practicing to build confidence with these conversations.'
    );
  }

  const overallCoachingSummary = summaryParts.join(' ');

  // --- whatWentWell ---
  const whatWentWell: string[] = [];
  if (hadEmotionalAck) {
    whatWentWell.push("Acknowledged the daughter's fear and emotional concern.");
  }
  if (hadHospiceReframe) {
    whatWentWell.push('Explained hospice as continued support rather than abandonment.');
  }
  if (hadSafeMedRouting && !hadMedSafetyEvent) {
    whatWentWell.push('Routed the medication question safely to the hospice nurse or provider.');
  }
  if (hadSafeMedRouting && hadMedSafetyEvent) {
    whatWentWell.push('Later corrected to safer routing language for the medication question.');
  }
  if (hadRepairLanguage) {
    whatWentWell.push('Used repair language to correct wording and rebuild trust.');
  }

  // --- whatChangedTheRoom ---
  const whatChangedTheRoom: string[] = [];
  if (hadEmotionalAck && hadHospiceReframe) {
    whatChangedTheRoom.push(
      "The turning point was when the learner acknowledged the daughter's fear and explained that hospice means the focus changes toward comfort and support, not that everyone walks away. This directly addressed the family's core concern."
    );
  } else {
    whatChangedTheRoom.push(
      "No clear turning point was detected in this conversation. The most powerful shift typically comes from directly acknowledging the fear that hospice means giving up and reframing it as continued support."
    );
  }

  // --- missedEmotionalCues (sequence-aware) ---
  const missedEmotionalCues: string[] = [];
  if (hadServiceFirst) {
    missedEmotionalCues.push(
      "The daughter's opening line was an emotional cue about fear and possible abandonment, not a question about services. She was asking whether choosing hospice meant she was giving up on her father. Responding with hospice service information before addressing that fear kept her resistance high."
    );
    if (
      hadEmotionalAck &&
      hadHospiceReframe &&
      firstEmotionalAckIdx > firstServiceFirstIdx
    ) {
      missedEmotionalCues.push(
        'The learner later improved the conversation by acknowledging the fear and reframing hospice as continued support rather than abandonment.'
      );
    } else if (hadEmotionalAck && firstEmotionalAckIdx > firstServiceFirstIdx) {
      missedEmotionalCues.push(
        'The learner later acknowledged the emotional concern, which helped shift the conversation.'
      );
    }
  }

  // --- roleBoundaryReview ---
  let roleBoundaryReview: string;
  if (hadMedSafetyEvent && hadSafeMedRouting) {
    roleBoundaryReview =
      'The learner initially provided medication guidance outside the Clinical Liaison role but later corrected to safer language by routing the question to the hospice nurse or provider. When a medication question arises, the first response should validate the concern and route immediately.';
  } else if (hadMedSafetyEvent) {
    roleBoundaryReview =
      "Medication guidance was provided outside the Clinical Liaison role. The Clinical Liaison's role is to validate the concern and connect the family with the hospice nurse or provider, not to answer clinical medication questions directly.";
  } else if (hadSafeMedRouting) {
    roleBoundaryReview =
      'The learner correctly stayed within the Clinical Liaison role by routing the medication question to the hospice nurse or provider. This is exactly the right move.';
  } else {
    roleBoundaryReview = 'No role boundary issue was detected in this scenario.';
  }

  // --- medicationSafetyReview ---
  const medicationSafetyReview = hadMedSafetyEvent
    ? 'Medication administration guidance is outside the Clinical Liaison role. The safer move is to validate the concern and connect the family with the hospice nurse or provider.'
    : 'No medication boundary issue was detected in this scenario.';

  // --- hospiceLanguageReview ---
  let hospiceLanguageReview: string;
  if (hadHospiceReframe) {
    hospiceLanguageReview =
      "The learner framed hospice as continued support rather than abandonment, which directly addressed the family's core fear. This kind of language helps families hear that choosing hospice is not giving up.";
  } else {
    hospiceLanguageReview =
      'Hospice was not clearly reframed as continued support in this conversation. A strong move is to explain that care does not stop, that the focus changes toward comfort, support, and safety, and that the family will not be alone.';
  }

  // --- suggestedWording (scenario-aware) ---
  const suggestedWording = getApprovedWordingIds(scenarioId)
    .map((id) => safeLanguage.find((e) => e.id === id)?.text)
    .filter((text): text is string => text !== undefined);

  // --- nextPracticeFocus ---
  let nextPracticeFocus: string;
  if (hadMedSafetyEvent) {
    nextPracticeFocus =
      'Practice routing medication questions safely within the Clinical Liaison role. When a medication question arises, validate the concern and connect the family with the hospice nurse or provider rather than answering directly.';
  } else if (hadServiceFirst) {
    nextPracticeFocus =
      'Practice responding to emotional concerns before moving into education. When a family member expresses fear or resistance, acknowledge what they said before explaining services or next steps.';
  } else if (!hadHospiceReframe) {
    nextPracticeFocus =
      'Practice explaining hospice as continued support rather than abandonment. Work on language that helps families hear that care does not stop and the focus changes toward comfort, support, and safety.';
  } else {
    nextPracticeFocus =
      'The emotional and educational foundation is in place. The next step is practicing how to close the conversation clearly, such as asking what questions the family still has or explaining what happens next.';
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
