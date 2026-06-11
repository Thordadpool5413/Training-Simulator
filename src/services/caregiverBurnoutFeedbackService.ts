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

export function generateCaregiverBurnoutFeedbackReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): FeedbackReport {
  void conversationMessages;
  void safetyEvents;

  const hadEmotionalAck = hasBehavior(patientStateSnapshots, 'emotional_acknowledgment');
  const hadGuiltValidation = hasBehavior(patientStateSnapshots, 'guilt_validation');
  const hadResourceOffered = hasBehavior(patientStateSnapshots, 'resource_offered');
  const hadCaregiverAssessment = hasBehavior(patientStateSnapshots, 'caregiver_assessment');
  const hadMinimization = hasBehavior(patientStateSnapshots, 'minimization');
  const hadPlacementPressure = hasBehavior(patientStateSnapshots, 'placement_pressure');

  const summaryParts: string[] = [];
  if (hadEmotionalAck && hadGuiltValidation && !hadMinimization) {
    summaryParts.push(
      "The learner acknowledged Dorothy's exhaustion and validated her guilt without minimizing either. This is the foundation for everything else in caregiver burnout conversations."
    );
  } else if (hadEmotionalAck && !hadMinimization) {
    summaryParts.push(
      "The learner acknowledged Dorothy's exhaustion. Adding explicit validation of the guilt she expressed — that saying she cannot keep going is not the same as giving up on Walter — would complete the emotional foundation."
    );
  }
  if (hadMinimization) {
    summaryParts.push(
      "The learner used minimizing language. Phrases like 'hang in there' or 'it will get easier' invalidate the caregiver's experience and can deepen isolation. Dorothy needs to feel heard, not managed."
    );
  }
  if (hadPlacementPressure) {
    summaryParts.push(
      'The learner suggested or implied placing Walter in a facility. Placement is never the Social Worker\'s recommendation to make in this conversation — it may be an option to describe, but only after the caregiver asks or it becomes clear it is needed.'
    );
  }
  if (hadResourceOffered) {
    summaryParts.push(
      "Offering concrete respite resources gave Dorothy an actionable next step without making the decision for her. This is the correct balance between support and autonomy."
    );
  }
  if (summaryParts.length === 0) {
    summaryParts.push(
      'The conversation stayed mostly neutral. Practice the caregiver burnout arc: acknowledge exhaustion, validate guilt, assess the support network, offer concrete resources, and close with a next step Dorothy can take.'
    );
  }

  const whatWentWell: string[] = [];
  if (hadEmotionalAck) whatWentWell.push("Acknowledged Dorothy's exhaustion and validated that saying she cannot keep going is not a character failure.");
  if (hadGuiltValidation) whatWentWell.push("Validated Dorothy's guilt without reinforcing it.");
  if (hadCaregiverAssessment) whatWentWell.push("Assessed Dorothy's support network and her own health.");
  if (hadResourceOffered) whatWentWell.push('Offered concrete respite and caregiver support resources.');
  if (!hadMinimization && !hadPlacementPressure) whatWentWell.push('Avoided minimizing language and placement pressure throughout.');

  const whatChangedTheRoom: string[] = [];
  if (hadEmotionalAck && hadGuiltValidation) {
    whatChangedTheRoom.push(
      "The turning point was when the learner named Dorothy's guilt directly — that saying she cannot keep going does not mean she loves Walter less, and is not the same as abandoning him. This is the unspoken fear underneath her exhaustion. Naming it removes the weight of it."
    );
  } else {
    whatChangedTheRoom.push(
      "No clear turning point was detected. In caregiver burnout conversations, the shift often comes when the caregiver hears — for the first time — that their exhaustion is not a character failure, and that asking for help is not the same as giving up."
    );
  }

  const missedEmotionalCues: string[] = [];
  if (!hadEmotionalAck) {
    missedEmotionalCues.push(
      "Dorothy's opening line contained multiple layers: physical exhaustion, guilt, and a fear that she is a 'terrible person.' All three need to be acknowledged before moving into assessment or resources."
    );
  }

  const roleBoundaryReview = hadPlacementPressure
    ? 'The learner suggested placing Walter in a facility. In a caregiver burnout conversation, the Social Worker does not recommend placement. If placement becomes relevant, it is introduced as one possible option among several — only when the caregiver opens that door.'
    : 'No role boundary issue was detected. The learner maintained the Social Worker role throughout.';

  const medicationSafetyReview = 'No medication boundary issue was detected in this scenario.';

  const hospiceLanguageReview = hadGuiltValidation
    ? "The learner validated Dorothy's guilt without reinforcing it. This is one of the most delicate moves in caregiver support — acknowledging the feeling while gently separating the feeling from the reality."
    : "Dorothy's guilt — that saying she cannot keep going means she is a terrible person — was not directly addressed. Naming this guilt explicitly is the most important move in caregiver burnout conversations.";

  const wordingIds = ['sw_caregiver_burden_validation', 'sw_respite_resource_offer'];
  const suggestedWording = wordingIds
    .map((id) => safeLanguage.find((e) => e.id === id)?.text)
    .filter((text): text is string => text !== undefined);

  let nextPracticeFocus: string;
  if (hadPlacementPressure) {
    nextPracticeFocus = 'Practice offering support options without directing toward placement. When a caregiver is exhausted, the next step is concrete help — not removal of the person they are caring for.';
  } else if (hadMinimization) {
    nextPracticeFocus = 'Practice replacing minimizing language with direct acknowledgment. When a caregiver says they cannot keep going, the right response is not encouragement — it is validation and then resources.';
  } else if (!hadEmotionalAck) {
    nextPracticeFocus = "Practice acknowledging Dorothy's exhaustion and guilt before moving into any assessment or resources. She needs to feel heard before she can hear anything else.";
  } else if (!hadResourceOffered) {
    nextPracticeFocus = 'Practice offering concrete respite and caregiver support resources. After acknowledging the burnout, the next step is giving Dorothy something actionable — a respite option, an aide visit, a next step she can take.';
  } else {
    nextPracticeFocus = 'The emotional and practical foundation is in place. The next step is practicing how to close with a specific plan Dorothy has agreed to, and a follow-up contact.';
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
