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

export function generateEsrdComfortCareFeedbackReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): FeedbackReport {
  void conversationMessages;

  const hadEmotionalAck = hasBehavior(patientStateSnapshots, 'emotional_acknowledgment');
  const hadAutonomy = hasBehavior(patientStateSnapshots, 'autonomy_respected');
  const hadValues = hasBehavior(patientStateSnapshots, 'values_elicitation');
  const hadFamilyMeeting = hasBehavior(patientStateSnapshots, 'family_meeting_offered');
  const hadClinicalRouting = hasBehavior(patientStateSnapshots, 'clinical_routing');
  const hadSidesTaken = hasBehavior(patientStateSnapshots, 'sides_taken');
  const hadCapacityDetermination = hasBehavior(patientStateSnapshots, 'capacity_determination');
  const hadDirectivePressure = hasBehavior(patientStateSnapshots, 'directive_pressure');
  const hadRepairLanguage = hasBehavior(patientStateSnapshots, 'repair_language');
  const hadMedSafetyEvent = safetyEvents.some(
    (e) => e.violationCategory === 'medication_outside_role'
  );

  // --- overallCoachingSummary ---
  const summaryParts: string[] = [];

  if (hadSidesTaken) {
    summaryParts.push(
      "The learner appeared to take James's side against his father's decision. The Social Worker role requires neutrality — facilitating the family's ability to process the situation, not validating one family member's position against another."
    );
  } else if (hadCapacityDetermination) {
    summaryParts.push(
      "The learner made a clinical statement about the patient's decision-making capacity. Capacity assessment is a medical and clinical function. The Social Worker's role is to acknowledge the concern, support the family's emotional process, and route capacity questions to the appropriate clinical team members."
    );
  } else if (hadDirectivePressure) {
    summaryParts.push(
      "The learner directed James toward accepting his father's decision rather than facilitating his grief. The Social Worker role is to hold the space, not to push a family member toward a particular emotional or practical outcome."
    );
  } else if (hadEmotionalAck && hadAutonomy && hadValues) {
    summaryParts.push(
      "The learner acknowledged James's fear, explained patient autonomy in plain language, and invited exploration of his father's values. These three moves — acknowledge, explain, elicit — are the core of the Social Worker role in this conversation."
    );
  } else if (hadEmotionalAck && hadAutonomy) {
    summaryParts.push(
      "The learner acknowledged James's distress and explained patient autonomy. Adding a values elicitation — asking what his father has said about this and what matters most to him — would complete the arc and invite James into his father's perspective rather than against it."
    );
  } else if (hadEmotionalAck) {
    summaryParts.push(
      "The learner acknowledged James's fear, which was the right first move. The next step is to explain patient autonomy in plain language and invite a conversation about what his father has said about his own values and wishes."
    );
  } else {
    summaryParts.push(
      "The conversation stayed neutral. James's opening was grief and fear wrapped in anger. The most important first move is to name what you hear — not to explain rights, not to mediate, but to let James feel heard before anything else."
    );
  }

  if (hadRepairLanguage) {
    summaryParts.push(
      "The learner used repair language to correct prior wording, which is a strong self-awareness move."
    );
  }

  if (hadMedSafetyEvent) {
    summaryParts.push(
      "A clinical question was handled outside the Social Worker role. Validate the concern and route to the appropriate clinical team member."
    );
  }

  // --- whatWentWell ---
  const whatWentWell: string[] = [];
  if (hadEmotionalAck && !hadSidesTaken) {
    whatWentWell.push("Acknowledged James's fear and grief before moving into information.");
  }
  if (hadAutonomy && !hadCapacityDetermination) {
    whatWentWell.push('Explained patient autonomy in plain language without taking sides.');
  }
  if (hadValues) {
    whatWentWell.push("Invited exploration of the patient's own values and what he has expressed.");
  }
  if (hadFamilyMeeting) {
    whatWentWell.push('Offered to facilitate a family conversation, demonstrating the Social Worker role.');
  }
  if (hadClinicalRouting) {
    whatWentWell.push('Routed the clinical capacity question to the appropriate team member.');
  }
  if (hadRepairLanguage) {
    whatWentWell.push('Used repair language to self-correct when the conversation drifted.');
  }

  // --- whatChangedTheRoom ---
  const whatChangedTheRoom: string[] = [];
  if (hadEmotionalAck && hadAutonomy && hadValues) {
    whatChangedTheRoom.push(
      "The turning point came when the learner acknowledged James's fear and then invited him into his father's perspective by asking what his father has actually said about his own wishes. This shifts the conversation from a power struggle into a shared grief conversation."
    );
  } else if (hadSidesTaken || hadCapacityDetermination) {
    whatChangedTheRoom.push(
      "The moment the learner appeared to take a position — validating James's concerns about his father's capacity or decision — the Social Worker's neutrality was lost. Once that happens, the trust built earlier is difficult to recover."
    );
  } else {
    whatChangedTheRoom.push(
      "No clear turning point was detected. The most powerful shift in this scenario comes when the family member feels heard and then is invited to think about what their loved one has actually said they want — which moves the conversation from opposition to shared understanding."
    );
  }

  // --- missedEmotionalCues ---
  const missedEmotionalCues: string[] = [];
  if (!hadEmotionalAck) {
    missedEmotionalCues.push(
      "James's opening was wrapped in anger but its core was fear — fear of losing his father, fear of helplessness, fear that the people around him have given up. The anger is secondary. Responding to the anger before naming the fear under it keeps the conversation adversarial."
    );
  }
  if (hadAutonomy && !hadEmotionalAck) {
    missedEmotionalCues.push(
      "Explaining autonomy rights before acknowledging the emotional concern tends to feel dismissive — as if the Social Worker is defending the system rather than sitting with the family. The emotional acknowledgment needs to come first."
    );
  }

  // --- roleBoundaryReview ---
  let roleBoundaryReview: string;
  if (hadSidesTaken) {
    roleBoundaryReview =
      "The learner appeared to take James's side against his father's autonomous choice. The Social Worker role requires neutrality — supporting both the family's emotional process and the patient's right to self-determination without taking sides in the conflict.";
  } else if (hadCapacityDetermination) {
    roleBoundaryReview =
      "The learner made a statement about the patient's decision-making capacity. Capacity assessment is a clinical function. The Social Worker can acknowledge capacity concerns and route them to the clinical team, but cannot confirm or deny capacity directly.";
  } else if (hadDirectivePressure) {
    roleBoundaryReview =
      "The learner directed James toward accepting his father's decision. The Social Worker role is to facilitate, not direct. Families need space to arrive at acceptance on their own terms.";
  } else if (hadClinicalRouting) {
    roleBoundaryReview =
      "The learner correctly routed the clinical capacity question to the appropriate team member. This is exactly the Social Worker role — facilitate and route, not assess.";
  } else {
    roleBoundaryReview =
      "No major role boundary issue was detected. The Social Worker role in this scenario is to acknowledge, explain autonomy, elicit values, and facilitate — not to take sides or make clinical determinations.";
  }

  // --- medicationSafetyReview ---
  const medicationSafetyReview = hadMedSafetyEvent
    ? "Clinical guidance is outside the Social Worker role. Validate the concern and route to the appropriate clinical team member."
    : "No medication boundary issue was detected in this scenario.";

  // --- hospiceLanguageReview ---
  let hospiceLanguageReview: string;
  if (hadAutonomy && hadValues) {
    hospiceLanguageReview =
      "The learner explained autonomy and invited values exploration — the two moves that help James understand that supporting his father's choice is not the same as agreeing with it or giving up.";
  } else if (hadCapacityDetermination) {
    hospiceLanguageReview =
      "Making clinical statements about capacity is outside the Social Worker role and can undermine the family's trust. Route capacity concerns to the clinical team and focus on the emotional and values dimensions.";
  } else if (hadAutonomy) {
    hospiceLanguageReview =
      "Good autonomy explanation. Pairing it with a values elicitation — asking what the father has said about his own wishes — helps James hear the autonomy framing from his father's perspective rather than as an abstract legal concept.";
  } else {
    hospiceLanguageReview =
      "Patient autonomy was not clearly explained in this conversation. A strong Social Worker move is to name the right plainly — and then immediately invite a conversation about what the patient himself has said about what he wants.";
  }

  // --- suggestedWording ---
  const wordingIds = ['sw_autonomy_plain_language', 'sw_values_elicitation', 'sw_capacity_routing'];
  const suggestedWording = wordingIds
    .map((id) => safeLanguage.find((e) => e.id === id)?.text)
    .filter((text): text is string => text !== undefined);

  // --- nextPracticeFocus ---
  let nextPracticeFocus: string;
  if (hadSidesTaken) {
    nextPracticeFocus =
      "Practice maintaining neutrality when a family member asks you to take sides. The Social Worker role is to hold the space for both the family's grief and the patient's autonomy — not to validate one against the other.";
  } else if (hadCapacityDetermination) {
    nextPracticeFocus =
      "Practice routing capacity concerns to the clinical team without making a clinical determination yourself. The language is: 'Whether your father has the ability to make this decision is something his care team needs to assess — that is not something I can determine, but I can make sure that happens.'";
  } else if (!hadEmotionalAck) {
    nextPracticeFocus =
      "Practice leading with emotional acknowledgment before explaining rights or logistics. James's anger is fear. Name the fear first.";
  } else if (!hadValues) {
    nextPracticeFocus =
      "Practice values elicitation. When a family member is in conflict with a patient's decision, the most powerful move is to ask what the patient has said about his own wishes. This invites the family into the patient's perspective rather than keeping them in opposition to it.";
  } else {
    nextPracticeFocus =
      "The foundation is strong. The next step is practicing how to hold the conversation when James continues to push back — staying neutral, not defending the system, and returning again to what his father has said he wants.";
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
