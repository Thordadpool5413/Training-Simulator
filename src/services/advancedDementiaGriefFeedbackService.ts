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

export function generateAdvancedDementiaGriefFeedbackReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): FeedbackReport {
  void conversationMessages;

  const hadGriefAck = hasBehavior(patientStateSnapshots, 'grief_normalization');
  const hadEmotionalAck = hasBehavior(patientStateSnapshots, 'emotional_acknowledgment');
  const hadHospiceReframe = hasBehavior(patientStateSnapshots, 'hospice_reframe');
  const hadRevocation = hasBehavior(patientStateSnapshots, 'revocation_education');
  const hadServiceFirst = hasBehavior(patientStateSnapshots, 'service_explanation_before_emotion');
  const hadAbandonmentLanguage = hasBehavior(patientStateSnapshots, 'abandonment_language');
  const hadRepairLanguage = hasBehavior(patientStateSnapshots, 'repair_language');
  const hadMedSafetyEvent = safetyEvents.some(
    (e) => e.violationCategory === 'medication_outside_role'
  );

  // --- overallCoachingSummary ---
  const summaryParts: string[] = [];

  if (hadGriefAck && hadHospiceReframe && hadRevocation) {
    summaryParts.push(
      "The learner named the ambiguous loss experience, reframed hospice as dignity and presence rather than abandonment, and explained that the election can be revoked. These three moves directly address Anne's fear of burying her mother twice."
    );
  } else if (hadAbandonmentLanguage) {
    summaryParts.push(
      "The learner used language that reinforced Anne's fear that hospice means giving up. In the dementia grief scenario, the core concern is abandonment and loss of identity. Every piece of language needs to push against that fear, not confirm it."
    );
  } else if (hadServiceFirst && !hadEmotionalAck) {
    summaryParts.push(
      "The learner provided information about hospice services before acknowledging Anne's grief. Anne was not asking what hospice provides — she was asking whether choosing hospice meant she was abandoning her mother. That question needed to be heard before any information was offered."
    );
  } else if (hadGriefAck && !hadHospiceReframe) {
    summaryParts.push(
      "The learner named the ambiguous loss experience, which was the right first move. The next step is to pair it with a hospice reframe that makes clear that choosing hospice is not abandonment — it is bringing in support so Anne can be present without carrying everything alone."
    );
  } else if (hadEmotionalAck && !hadGriefAck) {
    summaryParts.push(
      "The learner acknowledged Anne's emotional concern. Adding a specific naming of the ambiguous loss — the grief of mourning someone who is still alive — would make this acknowledgment more powerful and specific to what Anne is actually experiencing."
    );
  } else {
    summaryParts.push(
      "The conversation stayed mostly neutral. Anne's opening was about a specific kind of grief — the loss of her mother's recognition while her mother is still alive. That specific grief needs to be named before any hospice information is offered."
    );
  }

  if (hadRepairLanguage) {
    summaryParts.push(
      "The learner used repair language to correct prior wording. In the grief context, catching and correcting abandonment framing quickly is a meaningful trust-building move."
    );
  }

  if (hadMedSafetyEvent) {
    summaryParts.push(
      "A clinical question was handled outside the Clinical Liaison role. Validate the concern and route to the hospice team."
    );
  }

  // --- whatWentWell ---
  const whatWentWell: string[] = [];
  if (hadGriefAck) {
    whatWentWell.push("Named the ambiguous loss experience — mourning someone who is still alive.");
  } else if (hadEmotionalAck && !hadServiceFirst) {
    whatWentWell.push("Acknowledged Anne's emotional concern before moving into information.");
  }
  if (hadHospiceReframe && !hadAbandonmentLanguage) {
    whatWentWell.push('Reframed hospice as dignity and continued support, not abandonment.');
  }
  if (hadRevocation) {
    whatWentWell.push('Explained the revocation right — that choosing hospice is not a permanent or irreversible decision.');
  }
  if (hadRepairLanguage) {
    whatWentWell.push('Used repair language to self-correct and rebuild trust.');
  }

  // --- whatChangedTheRoom ---
  const whatChangedTheRoom: string[] = [];
  if (hadGriefAck && hadHospiceReframe) {
    whatChangedTheRoom.push(
      "The turning point was when the learner named what Anne is actually experiencing — grieving someone who is still alive — and then reframed hospice as a way to be more present with her mother, not less. Anne's opening fear was that hospice meant burying her mother twice. Naming that fear and offering a different frame is what shifted the conversation."
    );
  } else if (hadAbandonmentLanguage) {
    whatChangedTheRoom.push(
      "The language that implied nothing more can be done confirmed Anne's worst fear. In this scenario, the moment a learner uses language that sounds like giving up, the conversation loses the ground it needs to build hospice readiness."
    );
  } else {
    whatChangedTheRoom.push(
      "No clear turning point was detected. The most powerful shift in this scenario comes from naming the ambiguous loss directly — 'what you are describing is a kind of grief that happens while someone is still alive' — and then showing that hospice is about presence and dignity, not abandonment."
    );
  }

  // --- missedEmotionalCues ---
  const missedEmotionalCues: string[] = [];
  if (hadServiceFirst) {
    missedEmotionalCues.push(
      "Anne's opening — 'it feels like I am burying her twice' — was not a request for hospice information. It was an expression of a grief that does not have a name in most people's experience. Offering services before naming that grief left the most important thing unaddressed."
    );
  }
  if (!hadEmotionalAck && !hadServiceFirst) {
    missedEmotionalCues.push(
      "The phrase 'burying her twice' is a profound expression of anticipatory grief and ambiguous loss. Families in this situation often feel completely alone in their experience because the usual grief frameworks do not apply. Naming that specificity directly is what makes them feel seen."
    );
  }

  // --- roleBoundaryReview ---
  let roleBoundaryReview: string;
  if (hadMedSafetyEvent) {
    roleBoundaryReview =
      "A clinical question was handled outside the Clinical Liaison role. In this scenario, clinical questions about dementia progression or symptom management should be routed to the hospice nurse or provider.";
  } else if (hadAbandonmentLanguage) {
    roleBoundaryReview =
      "Language that suggested nothing can be done reinforced the abandonment fear. The Clinical Liaison role requires language that consistently positions hospice as added support and presence, not a withdrawal of care.";
  } else {
    roleBoundaryReview =
      "No role boundary issue was detected. The Clinical Liaison role in this scenario is to acknowledge the grief, reframe hospice as dignity and support, and explain the revocation right. No clinical or medication guidance is expected.";
  }

  // --- medicationSafetyReview ---
  const medicationSafetyReview = hadMedSafetyEvent
    ? "Clinical guidance is outside the Clinical Liaison role. Validate the concern and route to the hospice nurse or provider."
    : "No medication boundary issue was detected in this scenario.";

  // --- hospiceLanguageReview ---
  let hospiceLanguageReview: string;
  if (hadHospiceReframe && !hadAbandonmentLanguage) {
    hospiceLanguageReview =
      "The learner reframed hospice as dignity and presence rather than abandonment. This is the most important language move in this conversation — Anne's entire hesitation is built on the fear that choosing hospice means she is giving up on her mother.";
  } else if (hadAbandonmentLanguage) {
    hospiceLanguageReview =
      "Language that sounds like giving up or care ending is particularly damaging in the dementia grief scenario. Every sentence should push toward 'this is about being more present with her' rather than away from it.";
  } else {
    hospiceLanguageReview =
      "Hospice was not clearly reframed as continued support in this conversation. A strong move is to explain that choosing hospice does not mean giving up — it means bringing in a team so Anne can be present with her mother instead of carrying everything alone.";
  }

  // --- suggestedWording ---
  const wordingIds = ['cl_ambiguous_grief_acknowledgment', 'cl_dementia_hospice_reframe', 'cl_revocation_plain_language'];
  const suggestedWording = wordingIds
    .map((id) => safeLanguage.find((e) => e.id === id)?.text)
    .filter((text): text is string => text !== undefined);

  // --- nextPracticeFocus ---
  let nextPracticeFocus: string;
  if (hadAbandonmentLanguage) {
    nextPracticeFocus =
      "Practice identifying and avoiding abandonment framing. When any language sounds like 'nothing can be done' or 'care is stopping,' replace it immediately with language that positions hospice as support, presence, and dignity.";
  } else if (hadServiceFirst && !hadEmotionalAck) {
    nextPracticeFocus =
      "Practice responding to the grief before the information. Anne's opening is one of the most emotionally loaded in the entire curriculum. The grief needs to be named before anything else is offered.";
  } else if (!hadGriefAck) {
    nextPracticeFocus =
      "Practice naming ambiguous loss specifically. The phrase 'mourning someone who is still alive' lands very differently from a general empathy statement. That specificity is what makes Anne feel seen rather than processed.";
  } else if (!hadRevocation) {
    nextPracticeFocus =
      "Practice introducing the revocation right early in these conversations. Knowing that hospice can be stopped at any time is often what allows a family member to take the first step.";
  } else {
    nextPracticeFocus =
      "Strong session. The next step is practicing how to close these conversations — confirming what the next step looks like practically and making sure Anne knows who to call when the grief feels unbearable.";
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
