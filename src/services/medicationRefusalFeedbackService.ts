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

export function generateMedicationRefusalFeedbackReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): FeedbackReport {
  void conversationMessages;

  const hadCaregiverAck = hasBehavior(patientStateSnapshots, 'caregiver_distress_acknowledged');
  const hadAutonomy = hasBehavior(patientStateSnapshots, 'patient_autonomy_respected');
  const hadCommunicationStrategy = hasBehavior(patientStateSnapshots, 'communication_strategy_provided');
  const hadTeamEscalation = hasBehavior(patientStateSnapshots, 'team_escalation_offered');
  const hadConsentViolation = hasBehavior(patientStateSnapshots, 'consent_violation_suggested');
  const hadAutonomyDismissed = hasBehavior(patientStateSnapshots, 'patient_autonomy_dismissed');
  const hadConsentSafetyEvent = safetyEvents.some(
    (e) => e.violationCategory === 'patient_consent_violation'
  );
  const hadRnMedSafetyEvent = safetyEvents.some(
    (e) => e.violationCategory === 'rn_medication_dose_outside_orders'
  );
  const hadAnySafetyEvent = hadConsentSafetyEvent || hadRnMedSafetyEvent;

  // --- overallCoachingSummary ---
  const summaryParts: string[] = [];

  if (hadCaregiverAck) {
    summaryParts.push(
      "The learner acknowledged Michael's distress before moving into education, which was the right starting point. Caregivers who are watching a loved one refuse comfort care carry enormous guilt, and naming that matters."
    );
  } else {
    summaryParts.push(
      "The learner moved into information before acknowledging Michael's distress. When a caregiver is in this much pain, the first move should be naming what they are carrying — not explaining policy."
    );
  }

  if (hadAutonomy) {
    summaryParts.push(
      "Explaining patient autonomy in plain language was the right clinical and ethical move. Dorothy has the right to refuse medication, and Michael needed to hear that his mother's refusal does not mean he has failed."
    );
  }

  if (hadCommunicationStrategy) {
    summaryParts.push(
      "Providing communication strategies gave Michael something concrete to try. Knowing how to offer the medication gently — without pressure — is the kind of practical guidance that helps caregivers feel less helpless."
    );
  }

  if (hadConsentViolation || hadConsentSafetyEvent) {
    summaryParts.push(
      "A suggestion of covert medication administration was detected. This is not permitted under any circumstances. Administering medication without a patient's knowledge violates patient autonomy and may constitute abuse. The right response is to acknowledge the caregiver's distress, explain the patient's right to refuse, and involve the hospice on-call team."
    );
  }

  if (hadAutonomyDismissed) {
    summaryParts.push(
      "Some wording may have implied that the caregiver should override the patient's decision. Patient autonomy in hospice is a core principle, and caregivers need to hear that honoring a refusal is not the same as giving up."
    );
  }

  if (hadTeamEscalation) {
    summaryParts.push(
      "Involving the hospice on-call team was a strong next step. Ongoing medication refusal that affects comfort is a clinical situation that warrants team review."
    );
  }

  if (summaryParts.length === 0) {
    summaryParts.push(
      "The conversation stayed neutral. The key moves in this scenario are acknowledging caregiver distress, explaining patient autonomy, providing communication strategies, and routing ongoing concerns to the on-call team."
    );
  }

  // --- whatWentWell ---
  const whatWentWell: string[] = [];
  if (hadCaregiverAck) {
    whatWentWell.push("Acknowledged Michael's distress before moving into explanation.");
  }
  if (hadAutonomy) {
    whatWentWell.push('Explained patient autonomy in plain language.');
  }
  if (hadCommunicationStrategy) {
    whatWentWell.push('Provided practical strategies for offering medication compassionately.');
  }
  if (hadTeamEscalation) {
    whatWentWell.push('Involved the hospice on-call team for clinical escalation support.');
  }

  // --- whatChangedTheRoom ---
  const whatChangedTheRoom: string[] = [];
  if (hadAutonomy && hadCommunicationStrategy) {
    whatChangedTheRoom.push(
      "The turning point was when the learner explained patient autonomy and then gave Michael something concrete to try. Michael's guilt was coming from believing he had failed by not making his mother take the medication. When he understood that honoring her refusal was not failure — and that he had a strategy to try — the conversation shifted from helplessness to partnership."
    );
  } else if (hadAutonomy) {
    whatChangedTheRoom.push(
      "The explanation of patient autonomy was the most important moment in this conversation. Michael did not know that his mother had the right to refuse and that honoring her refusal was not a failure on his part."
    );
  } else {
    whatChangedTheRoom.push(
      "No clear turning point was detected. The key moment in this scenario comes from explaining patient autonomy and giving the caregiver a practical strategy for offering medication — moving them from helplessness to a plan."
    );
  }

  // --- missedEmotionalCues ---
  const missedEmotionalCues: string[] = [];
  if (!hadCaregiverAck) {
    missedEmotionalCues.push(
      "Michael's opening statement — 'Can I just put it in her food without her knowing?' — was not primarily a question about technique. It was an expression of desperation from someone watching a person he loves suffer. Acknowledging that desperation before addressing the ethical question would have helped him feel heard."
    );
  }
  if (hadAutonomyDismissed) {
    missedEmotionalCues.push(
      "Some wording may have implied that Michael should push harder or override the patient's decision. This can deepen caregiver guilt rather than relieve it. The reframe is that honoring a patient's choice is one of the most respectful things a caregiver can do."
    );
  }

  // --- roleBoundaryReview ---
  let roleBoundaryReview: string;
  if (hadConsentSafetyEvent) {
    roleBoundaryReview =
      "A suggestion of covert medication administration was detected, which is outside the RN role and violates patient rights. Even when a caregiver suggests it, the RN must refuse and redirect — not because of protocol, but because patient autonomy is a core ethical principle in hospice care.";
  } else if (hadRnMedSafetyEvent) {
    roleBoundaryReview =
      "Specific medication dosing was provided outside the scope of the hospice orders. The RN can confirm what the comfort plan includes and give communication strategies, but specific dose modifications require review with the hospice provider.";
  } else {
    roleBoundaryReview =
      "The learner stayed within the RN role. No medication dose was stated without orders and no covert administration was suggested. This scenario tests the boundary between patient autonomy support and coercion.";
  }

  // --- medicationSafetyReview ---
  let medicationSafetyReview: string;
  if (hadConsentSafetyEvent) {
    medicationSafetyReview =
      "Covert medication administration — giving medication without the patient's knowledge or consent — is not permitted. It can constitute abuse and violates the patient's right to refuse. The right move is to acknowledge the caregiver's desperation, explain autonomy, offer strategies, and involve the team.";
  } else {
    medicationSafetyReview =
      "No medication safety violation was detected. The key safety awareness point in this scenario is that a patient's right to refuse medication is absolute — even when the caregiver or the learner believes the medication would help.";
  }

  // --- hospiceLanguageReview ---
  let hospiceLanguageReview: string;
  if (hadAutonomy && !hadAutonomyDismissed) {
    hospiceLanguageReview =
      "Patient autonomy language was used clearly. In hospice, comfort care is a choice — and the language used here helped the caregiver understand that honoring refusal is not failure.";
  } else if (hadAutonomyDismissed) {
    hospiceLanguageReview =
      "Some language may have implied that the patient should take the medication or that the caregiver should push harder. Practice the framing that patient autonomy means honoring the patient's decision — and that offering, not forcing, is the right clinical role.";
  } else {
    hospiceLanguageReview =
      "Patient autonomy language was not clearly demonstrated. Practice explaining that patients in hospice have the right to refuse any medication and that this right belongs to the patient, not the caregiver.";
  }

  // --- suggestedWording ---
  const wordingIds = ['rn_patient_autonomy', 'rn_medication_offer_strategy', 'rn_covert_refusal'];
  const suggestedWording = wordingIds
    .map((id) => safeLanguage.find((e) => e.id === id)?.text)
    .filter((text): text is string => text !== undefined);

  // --- nextPracticeFocus ---
  let nextPracticeFocus: string;
  if (hadConsentSafetyEvent || hadConsentViolation) {
    nextPracticeFocus =
      "Practice the patient autonomy and covert administration refusal language. When a caregiver suggests hiding medication, the response must be firm, compassionate, and immediate — and then redirect to what can actually be done.";
  } else if (!hadCaregiverAck) {
    nextPracticeFocus =
      "Practice acknowledging caregiver desperation before explaining policy. When a caregiver is watching someone they love suffer, they need to feel heard before they can take in information.";
  } else if (!hadAutonomy) {
    nextPracticeFocus =
      "Practice explaining patient autonomy in plain language. Caregivers often do not know that patients have the right to refuse, and they carry unnecessary guilt when their loved one says no. Naming this clearly changes the conversation.";
  } else if (!hadCommunicationStrategy) {
    nextPracticeFocus =
      "Practice offering concrete communication strategies for caregivers dealing with medication refusal. Knowing how to offer medication gently — with the right timing and framing — gives caregivers something actionable to try.";
  } else {
    nextPracticeFocus =
      "Strong session. The next step is practicing how to address the patient directly when they are present — acknowledging their fear, validating their choice, and exploring whether there is a version of comfort care they would accept.";
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
