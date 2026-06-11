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

export function generateAdvanceDirectiveConflictFeedbackReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): FeedbackReport {
  void conversationMessages;
  void safetyEvents;

  const hadEmotionalAck = hasBehavior(patientStateSnapshots, 'emotional_acknowledgment');
  const hadSurrogateConcept = hasBehavior(patientStateSnapshots, 'surrogate_decision_explained');
  const hadAdvanceDirective = hasBehavior(patientStateSnapshots, 'advance_directive_education');
  const hadFamilyMeeting = hasBehavior(patientStateSnapshots, 'family_meeting_offered');
  const hadSidesTaken = hasBehavior(patientStateSnapshots, 'sides_taken');
  const hadDirectivePressure = hasBehavior(patientStateSnapshots, 'directive_pressure');

  const summaryParts: string[] = [];
  if (hadEmotionalAck && hadSurrogateConcept && !hadSidesTaken) {
    summaryParts.push(
      "The learner acknowledged Robert's grief and explained surrogate decision-making without taking sides. Staying neutral while engaging emotionally is the core skill in family conflict scenarios."
    );
  } else if (hadEmotionalAck && !hadSidesTaken) {
    summaryParts.push(
      "The learner acknowledged Robert's grief without taking sides, which was the right move. Adding an explanation of surrogate decision-making would give Robert a framework for what he is being asked to do."
    );
  }
  if (hadSidesTaken) {
    summaryParts.push(
      "The learner took a side in the family decision. Social Workers must stay neutral in family care conflicts — taking sides, even if well-intentioned, damages trust and can escalate the conflict."
    );
  }
  if (hadDirectivePressure) {
    summaryParts.push(
      'The learner applied pressure toward a specific decision. Social Workers do not direct care decisions — the role is to facilitate the family\'s process, not guide them toward a particular outcome.'
    );
  }
  if (hadFamilyMeeting) {
    summaryParts.push(
      'Offering a family meeting with the clinical team was the right move — it creates a structured space for the conversation without the Social Worker taking a position.'
    );
  }
  if (summaryParts.length === 0) {
    summaryParts.push(
      'The conversation stayed mostly neutral. Practice building the full arc: acknowledge grief, explain surrogate decision-making, offer a family meeting, and stay neutral throughout.'
    );
  }

  const whatWentWell: string[] = [];
  if (hadEmotionalAck) whatWentWell.push("Acknowledged Robert's grief and the weight of the situation.");
  if (hadSurrogateConcept) whatWentWell.push('Explained surrogate decision-making in plain language.');
  if (hadAdvanceDirective) whatWentWell.push('Explained what an advance directive is and what happens without one.');
  if (hadFamilyMeeting) whatWentWell.push('Offered to facilitate a family meeting with the clinical team.');
  if (!hadSidesTaken && !hadDirectivePressure) whatWentWell.push('Maintained neutrality throughout the conversation.');

  const whatChangedTheRoom: string[] = [];
  if (hadEmotionalAck && hadSurrogateConcept && hadFamilyMeeting) {
    whatChangedTheRoom.push(
      "The turning point was when the learner explained surrogate decision-making — that Robert's role is not to choose what he wants, but to speak for what Helen would have wanted based on who she was. This reframe shifts the conversation from a fight between siblings to a shared act of love."
    );
  } else {
    whatChangedTheRoom.push(
      "No clear turning point was detected. In advance directive conflict conversations, the shift often comes when the family member understands that being a surrogate means speaking for the patient's values, not their own preferences."
    );
  }

  const missedEmotionalCues: string[] = [];
  if (!hadEmotionalAck) {
    missedEmotionalCues.push(
      "Robert's opening line was a statement of fear and grief framed as an argument. He is not primarily asking a legal question — he is terrified of losing his mother and unable to accept it. Acknowledging that fear first would open the door for everything else."
    );
  }

  const roleBoundaryReview = hadSidesTaken || hadDirectivePressure
    ? 'The learner took a position in the family care decision. Social Workers are facilitators, not decision-makers. The role is to create conditions for the family to work through the decision together — not to guide them toward a particular outcome.'
    : 'No role boundary issue was detected. The learner maintained the Social Worker role throughout.';

  const medicationSafetyReview = 'No medication boundary issue was detected in this scenario.';

  const hospiceLanguageReview = hadSurrogateConcept
    ? "The learner explained surrogate decision-making clearly. Helping Robert understand that his role is to speak for Helen's values — not to choose for himself — is the most important reframe in this scenario."
    : "Surrogate decision-making was not clearly explained. Robert needs to understand that without an advance directive, his role is to speak for Helen based on who she was and what she valued — not to advocate for his own preferences.";

  const wordingIds = ['sw_surrogate_decision_explained', 'sw_advance_directive_education'];
  const suggestedWording = wordingIds
    .map((id) => safeLanguage.find((e) => e.id === id)?.text)
    .filter((text): text is string => text !== undefined);

  let nextPracticeFocus: string;
  if (hadSidesTaken) {
    nextPracticeFocus = 'Practice maintaining neutrality in family conflict. When a family member asks you to agree with them, acknowledge the pain behind the question without validating one side over the other.';
  } else if (!hadEmotionalAck) {
    nextPracticeFocus = "Practice acknowledging Robert's grief before engaging with the conflict. He is not primarily asking a legal question — he is terrified and in pain. Hearing that first makes everything else possible.";
  } else if (!hadSurrogateConcept) {
    nextPracticeFocus = 'Practice explaining surrogate decision-making in plain language. Robert needs a framework for what his role actually is — speaking for Helen based on her values, not fighting for what he wants.';
  } else {
    nextPracticeFocus = 'The emotional and conceptual foundation is in place. The next step is practicing how to offer a family meeting and close with a clear next step that keeps both Robert and Carol in the conversation.';
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
