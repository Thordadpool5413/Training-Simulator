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

export function generatePainManagementFeedbackReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): FeedbackReport {
  void conversationMessages;

  const hadAngerAck = hasBehavior(patientStateSnapshots, 'emotional_acknowledgment') ||
    hasBehavior(patientStateSnapshots, 'pain_concern_acknowledged');
  const hadNurseRouting = hasBehavior(patientStateSnapshots, 'safe_medication_routing');
  const hadServiceFirst = hasBehavior(patientStateSnapshots, 'service_explanation_before_emotion');
  const hadAbandonmentLanguage = hasBehavior(patientStateSnapshots, 'abandonment_language');
  const hadMedSafetyEvent = safetyEvents.some(
    (e) => e.violationCategory === 'medication_outside_role'
  );
  const hadRepairLanguage = hasBehavior(patientStateSnapshots, 'repair_language');

  // --- overallCoachingSummary ---
  const summaryParts: string[] = [];

  if (hadAngerAck && !hadServiceFirst) {
    summaryParts.push(
      "The learner acknowledged Elena's anger before moving to information, which was the right first move. When a family member is angry, leading with acknowledgment is what opens the conversation."
    );
  } else if (hadServiceFirst && !hadAngerAck) {
    summaryParts.push(
      "The learner provided information before addressing Elena's emotional concern. Her anger was not about a lack of information — it was about fear and grief. Responding to the emotion first helps the family hear whatever comes next."
    );
  } else if (hadServiceFirst && hadAngerAck) {
    summaryParts.push(
      "The learner initially provided information before acknowledging Elena's anger, but later addressed the emotional concern. The emotional acknowledgment helped shift the conversation."
    );
  } else {
    summaryParts.push(
      "The conversation stayed neutral. The strongest move when a family member is angry is to name what you hear before explaining anything."
    );
  }

  if (hadNurseRouting) {
    summaryParts.push(
      "The learner correctly routed the pain management question to the hospice nurse. Pain assessment and management is clinical work that belongs with the RN and provider, not the Clinical Liaison."
    );
  }

  if (hadMedSafetyEvent && !hadNurseRouting) {
    summaryParts.push(
      "The learner provided medication guidance outside the Clinical Liaison role. When a family member raises a clinical pain concern, the right move is to validate the concern and route it directly to the hospice nurse."
    );
  } else if (hadMedSafetyEvent && hadNurseRouting) {
    summaryParts.push(
      "A medication question arose. The learner initially responded outside the Clinical Liaison role but later corrected to nurse routing language."
    );
  }

  if (hadRepairLanguage) {
    summaryParts.push(
      "The learner used repair language to correct earlier wording, which is a strong self-awareness move."
    );
  }

  if (summaryParts.length === 0) {
    summaryParts.push(
      "The conversation stayed mostly neutral. No major role boundary issues were detected but no clear turning point emerged. When a family member is angry about a clinical concern, the two strongest moves are validating the concern and routing it to the right person on the team."
    );
  }

  // --- whatWentWell ---
  const whatWentWell: string[] = [];
  if (hadAngerAck && !hadServiceFirst) {
    whatWentWell.push("Acknowledged Elena's anger before providing information.");
  }
  if (hadNurseRouting && !hadMedSafetyEvent) {
    whatWentWell.push('Routed the pain concern to the hospice nurse without providing clinical guidance.');
  }
  if (hadNurseRouting && hadMedSafetyEvent) {
    whatWentWell.push('Corrected to nurse routing language after an initial medication boundary issue.');
  }
  if (hadRepairLanguage) {
    whatWentWell.push('Used repair language to self-correct and rebuild trust.');
  }

  // --- whatChangedTheRoom ---
  const whatChangedTheRoom: string[] = [];
  if (hadAngerAck && hadNurseRouting) {
    whatChangedTheRoom.push(
      "The turning point was when the learner acknowledged Elena's concern as legitimate and routed her directly to the nurse. Elena was not asking for a lecture — she was asking whether anyone was going to do something. Acknowledging the concern and connecting her to the right person answered both questions at once."
    );
  } else {
    whatChangedTheRoom.push(
      "No clear turning point was detected. The most powerful shift in this scenario comes from acknowledging the anger directly — naming it, validating the concern, and then routing to the hospice nurse as the person who can actually address the pain clinically."
    );
  }

  // --- missedEmotionalCues ---
  const missedEmotionalCues: string[] = [];
  if (hadServiceFirst) {
    missedEmotionalCues.push(
      "Elena's opening line was not a request for information. It was an expression of fear that she made the wrong decision and her father is suffering because of it. Responding with information before acknowledging that fear left the emotional question unanswered."
    );
  }
  if (!hadAngerAck && !hadServiceFirst) {
    missedEmotionalCues.push(
      "Elena's anger was covering grief and guilt. The opening line — 'Are you even doing anything?' — was really asking: did I fail my father by agreeing to this? Naming what you hear in that kind of question is what shifts the conversation from anger to partnership."
    );
  }

  // --- roleBoundaryReview ---
  let roleBoundaryReview: string;
  if (hadMedSafetyEvent && hadNurseRouting) {
    roleBoundaryReview =
      "The learner initially provided clinical guidance outside the Clinical Liaison role but later corrected to nurse routing language. Pain assessment and management is the clinical nurse's role. The Clinical Liaison's role is to validate the concern, confirm it is being taken seriously, and connect the family with the right person.";
  } else if (hadMedSafetyEvent) {
    roleBoundaryReview =
      "Pain management guidance was provided outside the Clinical Liaison role. When a family member raises a clinical pain concern, validate the concern and route it to the hospice nurse or provider — do not assess pain or suggest medication changes directly.";
  } else if (hadNurseRouting) {
    roleBoundaryReview =
      "The learner stayed within the Clinical Liaison role by routing the pain concern to the hospice nurse. This is exactly right. Validating the concern and connecting the family with the person who can act on it is the highest-value move in this conversation.";
  } else {
    roleBoundaryReview =
      "No role boundary issue was detected, but the pain routing language was not clearly demonstrated. Practice routing pain concerns to the nurse so the response is ready when a clinical question comes up.";
  }

  // --- medicationSafetyReview ---
  const medicationSafetyReview = hadMedSafetyEvent
    ? "Pain assessment and medication guidance are outside the Clinical Liaison role. The right move is to validate the concern and connect the family with the hospice nurse or provider."
    : "No medication boundary issue was detected in this scenario.";

  // --- hospiceLanguageReview ---
  let hospiceLanguageReview: string;
  if (hadNurseRouting && !hadAbandonmentLanguage) {
    hospiceLanguageReview =
      "The learner framed the nurse routing as a next action step — not a dismissal. That framing matters. Families in distress need to hear that something is going to happen, and routing to the nurse communicates that the concern is real and is being acted on.";
  } else if (hadAbandonmentLanguage) {
    hospiceLanguageReview =
      "Some wording may have suggested that the pain concern was not being addressed or that the hospice team had failed. In this scenario, the key language pattern is acknowledging the concern, confirming it is legitimate, and connecting the family with the nurse as the person who can act.";
  } else {
    hospiceLanguageReview =
      "The hospice team structure was not clearly explained. When a family member asks why their loved one is still in pain, a strong response validates the concern and explains that the hospice nurse will assess and address pain directly — so the family knows there is a next step.";
  }

  // --- suggestedWording ---
  const wordingIds = ['cl_pain_concern_validation', 'cl_pain_routing_response', 'cl_pain_decision_validation'];
  const suggestedWording = wordingIds
    .map((id) => safeLanguage.find((e) => e.id === id)?.text)
    .filter((text): text is string => text !== undefined);

  // --- nextPracticeFocus ---
  let nextPracticeFocus: string;
  if (hadMedSafetyEvent) {
    nextPracticeFocus =
      "Practice routing clinical pain questions to the hospice nurse without providing guidance. When a family member raises a pain concern, the first response should validate the concern and connect them with the nurse.";
  } else if (hadServiceFirst && !hadAngerAck) {
    nextPracticeFocus =
      "Practice acknowledging emotional concerns before moving to information. When a family member is angry, the emotion is the real message. Naming it directly is what opens the conversation.";
  } else if (!hadNurseRouting) {
    nextPracticeFocus =
      "Practice the nurse routing language so it is ready when a clinical question comes up. The goal is to validate the concern and connect the family with the person who can act on it — clearly and without hesitation.";
  } else {
    nextPracticeFocus =
      "The foundation is in place. The next step is practicing how to close these conversations clearly — confirming what the next step is and when the family can expect to hear from the nurse.";
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
