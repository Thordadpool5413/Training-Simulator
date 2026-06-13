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

export function generateBereavementFirstCallFeedbackReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): FeedbackReport {
  void conversationMessages;
  void safetyEvents;

  const hadEmotionalAck = hasBehavior(patientStateSnapshots, 'emotional_acknowledgment');
  const hadGriefNorm = hasBehavior(patientStateSnapshots, 'grief_normalization');
  const hadBereavementEd = hasBehavior(patientStateSnapshots, 'bereavement_education');
  const hadComplicatedGriefRouting = hasBehavior(patientStateSnapshots, 'complicated_grief_routing');
  const hadMinimization = hasBehavior(patientStateSnapshots, 'minimization');
  const hadPathologizing = hasBehavior(patientStateSnapshots, 'pathologizing');

  const summaryParts: string[] = [];
  if (hadEmotionalAck && hadGriefNorm && !hadMinimization) {
    summaryParts.push(
      "The learner acknowledged Margaret's grief and normalized the morning re-grief experience. This is the most important clinical move in early bereavement — helping someone understand that what they are experiencing is not a sign that something is wrong with them."
    );
  } else if (hadEmotionalAck && !hadMinimization) {
    summaryParts.push(
      "The learner acknowledged Margaret's grief. Adding explicit normalization of the morning re-grief pattern — that waking up and forgetting is common in early grief — would give Margaret the reassurance she is asking for."
    );
  }
  if (hadMinimization) {
    summaryParts.push(
      "The learner used minimizing language. Phrases like 'time heals' or 'it will get better soon' can feel dismissive when someone is in acute grief. Margaret is asking whether she is normal, not for a timeline."
    );
  }
  if (hadPathologizing) {
    summaryParts.push(
      "The learner pathologized normal grief. Describing the morning re-grief experience as 'complicated grief' or suggesting it requires therapy can increase Margaret's distress and shame."
    );
  }
  if (hadBereavementEd) {
    summaryParts.push(
      "The learner introduced the hospice bereavement program, which gave Margaret a path forward. Many bereaved people do not know this support is still available after the death — naming it is an important act of care."
    );
  }
  if (summaryParts.length === 0) {
    summaryParts.push(
      'The conversation stayed mostly neutral. Practice the bereavement arc: acknowledge grief, normalize the experience, gently assess for complicated grief indicators, and introduce available support resources.'
    );
  }

  const whatWentWell: string[] = [];
  if (hadEmotionalAck) whatWentWell.push("Acknowledged Margaret's grief before moving into explanation or education.");
  if (hadGriefNorm) whatWentWell.push('Normalized the morning re-grief experience — the waking up and forgetting pattern.');
  if (hadComplicatedGriefRouting) whatWentWell.push('Gently assessed for complicated grief indicators without pathologizing.');
  if (hadBereavementEd) whatWentWell.push('Introduced the hospice bereavement program and available support.');
  if (!hadMinimization && !hadPathologizing) whatWentWell.push('Avoided minimizing language and did not pathologize normal grief.');

  const whatChangedTheRoom: string[] = [];
  if (hadEmotionalAck && hadGriefNorm) {
    whatChangedTheRoom.push(
      "The turning point was when the learner told Margaret that what she is experiencing is normal — that the waking up and forgetting is one of the most common early grief experiences, not a sign that something is broken. Margaret called because she is afraid she is doing grief wrong. Hearing that she is not changes everything."
    );
  } else {
    whatChangedTheRoom.push(
      "No clear turning point was detected. In bereavement first calls, the shift comes when the caller hears that what they are experiencing is normal. Margaret's question is really 'am I okay?' — and the most powerful answer is yes, what you are describing makes complete sense."
    );
  }

  const missedEmotionalCues: string[] = [];
  if (!hadEmotionalAck) {
    missedEmotionalCues.push(
      "Margaret's opening was not a clinical question — it was a plea for reassurance that she is not broken. She is asking 'is that normal?' which is really asking 'am I going to be okay?' Acknowledging what she described before answering gives that question the weight it deserves."
    );
  }

  const roleBoundaryReview = hadPathologizing
    ? "The learner used clinical diagnostic language about Margaret's grief experience. Social Workers do not diagnose grief disorders — the role is to normalize, support, and refer when indicated. Pathologizing normal grief in a bereavement call damages trust and increases shame."
    : 'No role boundary issue was detected. The learner maintained the Social Worker role throughout.';

  const medicationSafetyReview = 'No medication boundary issue was detected in this scenario.';

  const hospiceLanguageReview = hadGriefNorm
    ? "The learner normalized the morning re-grief experience clearly. This kind of normalization is one of the most therapeutic things a bereavement worker can offer in the first weeks after a loss."
    : "The morning re-grief experience Margaret described was not normalized. She is asking whether her experience is normal — that question deserves a direct answer: yes, many people experience exactly this in early grief.";

  const wordingIds = ['sw_grief_normalization', 'sw_bereavement_education'];
  const suggestedWording = wordingIds
    .map((id) => safeLanguage.find((e) => e.id === id)?.text)
    .filter((text): text is string => text !== undefined);

  let nextPracticeFocus: string;
  if (hadPathologizing) {
    nextPracticeFocus = "Practice distinguishing between normalizing grief and pathologizing it. The morning re-grief experience is normal. Save clinical language about complicated grief for cases with significant functional impairment — not for someone in early loss asking if they are okay.";
  } else if (hadMinimization) {
    nextPracticeFocus = "Practice replacing minimizing language with normalization. When Margaret says she keeps forgetting he is gone and asks how long this will feel this way, the right response is not a timeline — it is validation that what she is experiencing is real and makes sense.";
  } else if (!hadEmotionalAck) {
    nextPracticeFocus = "Practice acknowledging Margaret's experience before answering her question. She asked 'is that normal?' — acknowledge what she described first, then tell her yes.";
  } else if (!hadGriefNorm) {
    nextPracticeFocus = "Practice normalizing the morning re-grief experience directly. Margaret is asking if she is broken. She needs to hear that what she is experiencing is one of the most common early grief experiences — not a sign of anything being wrong.";
  } else {
    nextPracticeFocus = 'The normalization and support arc is in place. The next step is practicing how to introduce bereavement resources in a way that feels like an invitation, not a referral.';
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
