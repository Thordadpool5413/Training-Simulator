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

export function generateBreakthroughPainFeedbackReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): FeedbackReport {
  void conversationMessages;

  const hadFearAck = hasBehavior(patientStateSnapshots, 'fear_acknowledgment');
  const hadPainAssessment = hasBehavior(patientStateSnapshots, 'pain_assessment_communication');
  const hadProviderRouting = hasBehavior(patientStateSnapshots, 'provider_routing');
  const hadComfortEd = hasBehavior(patientStateSnapshots, 'comfort_education');
  const hadCaregiverEmpow = hasBehavior(patientStateSnapshots, 'caregiver_empowerment');
  const hadDoseOverstep = hasBehavior(patientStateSnapshots, 'medication_dose_overstep');
  const hadRnSafetyEvent = safetyEvents.some(
    (e) => e.violationCategory === 'rn_medication_dose_outside_orders'
  );

  const summaryParts: string[] = [];
  if (hadFearAck && hadPainAssessment && hadProviderRouting) {
    summaryParts.push(
      "The learner acknowledged Maria's fear, gathered information about the pain, validated that she followed the plan correctly, and routed the dose question to the on-call provider. This is the complete arc for breakthrough pain management."
    );
  } else if (hadProviderRouting) {
    summaryParts.push(
      'The learner correctly routed the dose question to the hospice on-call provider.'
    );
  }
  if (hadDoseOverstep || hadRnSafetyEvent) {
    summaryParts.push(
      'The learner stated or implied a specific dose or authorized additional medication. Dose adjustment requires the hospice on-call provider — stating doses or authorizing additional medication in the field is outside the RN scope.'
    );
  }
  if (hadCaregiverEmpow) {
    summaryParts.push(
      "The learner validated that Maria followed the plan correctly. This is one of the most important things an RN can do — caregivers in this situation carry guilt that they caused the failure. Removing that guilt is therapeutic."
    );
  }
  if (summaryParts.length === 0) {
    summaryParts.push(
      'The conversation stayed mostly neutral. Practice building the full breakthrough pain arc: acknowledge fear, assess the pain, validate the caregiver, route the dose question, and offer non-medication comfort measures.'
    );
  }

  const whatWentWell: string[] = [];
  if (hadFearAck) whatWentWell.push("Acknowledged Maria's fear that the medication failed and that she may have done something wrong.");
  if (hadPainAssessment) whatWentWell.push('Gathered information about the pain before routing.');
  if (hadProviderRouting) whatWentWell.push('Routed the dose question to the hospice on-call provider.');
  if (hadCaregiverEmpow) whatWentWell.push('Validated that Maria followed the plan correctly.');
  if (hadComfortEd) whatWentWell.push('Described non-medication comfort measures while waiting for the provider.');

  const whatChangedTheRoom: string[] = [];
  if (hadFearAck && hadCaregiverEmpow) {
    whatChangedTheRoom.push(
      "The turning point was when the learner told Maria she did everything right — that she followed the plan and was right to call. Caregivers who have been managing alone carry enormous guilt. Removing that guilt immediately changes the emotional temperature."
    );
  } else {
    whatChangedTheRoom.push(
      "No clear turning point was detected. In breakthrough pain calls, the most powerful shift comes from telling the caregiver they did nothing wrong and then giving them a clear next step."
    );
  }

  const missedEmotionalCues: string[] = [];
  if (!hadFearAck) {
    missedEmotionalCues.push(
      "Maria's opening line contained two fears: that the medication failed and that she may have done something wrong. Both need to be acknowledged before moving into assessment or routing."
    );
  }

  let roleBoundaryReview: string;
  if (hadRnSafetyEvent && hadProviderRouting) {
    roleBoundaryReview = 'A medication dose question arose. The learner initially responded outside RN scope but later corrected by routing to the on-call provider.';
  } else if (hadRnSafetyEvent) {
    roleBoundaryReview = 'A medication dose question arose and was answered directly rather than routed to the on-call provider. Dose adjustment decisions belong with the hospice provider, not the field RN.';
  } else {
    roleBoundaryReview = 'No role boundary issue was detected in this scenario.';
  }

  const medicationSafetyReview = hadRnSafetyEvent
    ? 'Stating a specific dose or authorizing additional medication in the field is outside the RN scope. Route dose questions to the on-call hospice provider.'
    : 'No medication boundary issue was detected in this scenario.';

  const hospiceLanguageReview = hadProviderRouting
    ? "The learner correctly identified the dose question as a clinical decision requiring the on-call provider. This protects both the family and the learner."
    : "The dose question was not clearly routed to the on-call hospice provider. In breakthrough pain calls, dose adjustment is always a provider decision — the RN's role is to assess, validate, and route.";

  const wordingIds = ['rn_pain_assessment_response', 'rn_provider_routing'];
  const suggestedWording = wordingIds
    .map((id) => safeLanguage.find((e) => e.id === id)?.text)
    .filter((text): text is string => text !== undefined);

  let nextPracticeFocus: string;
  if (hadRnSafetyEvent) {
    nextPracticeFocus = 'Practice routing breakthrough pain dose questions immediately. When a caregiver asks if they can give more, validate the concern and route the clinical decision to the on-call provider.';
  } else if (!hadFearAck) {
    nextPracticeFocus = "Practice acknowledging Maria's fear before assessing. She opened with two fears — that the medication failed and that she caused the problem. Both need to be heard first.";
  } else if (!hadProviderRouting) {
    nextPracticeFocus = 'Practice routing the dose question to the on-call provider. The assessment is important, but the dose decision belongs with the provider. Route with confidence and give Maria a clear next step.';
  } else {
    nextPracticeFocus = 'The assessment and routing arc is in place. The next step is practicing how to offer non-medication comfort measures while Maria waits for the provider callback.';
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
