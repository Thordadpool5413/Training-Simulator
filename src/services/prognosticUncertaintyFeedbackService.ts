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

export function generatePrognosticUncertaintyFeedbackReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): FeedbackReport {
  void conversationMessages;

  const hadPanicAck = hasBehavior(patientStateSnapshots, 'emotional_acknowledgment');
  const hadPrognosisReframe = hasBehavior(patientStateSnapshots, 'prognosis_reframe');
  const hadClinicalRouting = hasBehavior(patientStateSnapshots, 'clinical_routing');
  const hadPrognosisPromise = hasBehavior(patientStateSnapshots, 'prognosis_promise');
  const hadServiceFirst = hasBehavior(patientStateSnapshots, 'service_explanation_before_emotion');
  const hadRepairLanguage = hasBehavior(patientStateSnapshots, 'repair_language');
  const hadMedSafetyEvent = safetyEvents.some(
    (e) => e.violationCategory === 'medication_outside_role'
  );

  // --- overallCoachingSummary ---
  const summaryParts: string[] = [];

  if (hadPanicAck && hadPrognosisReframe && hadClinicalRouting) {
    summaryParts.push(
      "The learner hit all three key moves: acknowledging David's panic, reframing the six-month estimate as a range rather than a deadline, and routing the clinical signs question to the hospice team. This is the pattern that reduces catastrophic thinking and builds trust."
    );
  } else if (hadPrognosisPromise) {
    summaryParts.push(
      "The learner provided a prognosis estimate or implied a specific timeframe, which is outside the Clinical Liaison role and escalated David's panic rather than reducing it. Prognosis questions must be routed to the hospice team."
    );
  } else if (hadServiceFirst && !hadPanicAck) {
    summaryParts.push(
      "The learner provided information about hospice services before acknowledging David's panic. David was not asking about services — he was asking whether he needed to drop everything and get to his mother's side today. The panic needed to be heard first."
    );
  } else if (hadPanicAck && !hadPrognosisReframe) {
    summaryParts.push(
      "The learner acknowledged David's panic, which was the right first move. The next step is to reframe the six-month estimate as an approximation, not a countdown — this is often the piece that reduces the catastrophic thinking."
    );
  } else if (hadPanicAck) {
    summaryParts.push(
      "The learner acknowledged David's fear, which opened the conversation. Adding a prognosis reframe and routing the clinical signs question to the hospice team would complete the arc."
    );
  } else {
    summaryParts.push(
      "The conversation stayed mostly neutral. David's opening was a panic about prognosis timing, not a question about services. The most powerful move is to name the fear directly before explaining anything."
    );
  }

  if (hadRepairLanguage) {
    summaryParts.push(
      "The learner used repair language to correct prior wording, which is a strong self-awareness move."
    );
  }

  if (hadMedSafetyEvent) {
    summaryParts.push(
      "A medication question arose and was handled outside the Clinical Liaison role. When clinical questions arise, validate the concern and route to the hospice team."
    );
  }

  // --- whatWentWell ---
  const whatWentWell: string[] = [];
  if (hadPanicAck && !hadServiceFirst) {
    whatWentWell.push("Acknowledged David's panic before moving into education or information.");
  }
  if (hadPrognosisReframe) {
    whatWentWell.push('Reframed the prognosis estimate as a range, not a countdown deadline.');
  }
  if (hadClinicalRouting && !hadPrognosisPromise) {
    whatWentWell.push('Routed the clinical signs question to the hospice team without providing a prognosis estimate.');
  }
  if (hadRepairLanguage) {
    whatWentWell.push('Used repair language to self-correct and rebuild trust.');
  }

  // --- whatChangedTheRoom ---
  const whatChangedTheRoom: string[] = [];
  if (hadPanicAck && hadPrognosisReframe) {
    whatChangedTheRoom.push(
      "The turning point was when the learner acknowledged the fear and reframed the prognosis as an estimate. David was treating the six-month timeframe as a countdown. Naming the uncertainty as real — while also explaining that it is not a fixed deadline — is what shifts the conversation from panic to planning."
    );
  } else {
    whatChangedTheRoom.push(
      "No clear turning point was detected. The most powerful shift in this scenario comes from acknowledging the panic and then explaining that prognosis estimates are approximations, not deadlines — which opens the door for David to ask the questions he actually needs answered."
    );
  }

  // --- missedEmotionalCues ---
  const missedEmotionalCues: string[] = [];
  if (hadServiceFirst) {
    missedEmotionalCues.push(
      "David's opening was not a request for hospice information. It was a catastrophizing question driven by panic: 'Is she dying today? Should I leave work? Should I call everyone?' Responding with service information before addressing that panic left him more anxious, not less."
    );
  }
  if (!hadPanicAck && !hadServiceFirst) {
    missedEmotionalCues.push(
      "The six-month countdown panic was the emotional core of this conversation. David needed to hear that his fear was understandable before he could take in any new information. Naming that fear directly is what allows the conversation to shift."
    );
  }

  // --- roleBoundaryReview ---
  let roleBoundaryReview: string;
  if (hadPrognosisPromise) {
    roleBoundaryReview =
      "The learner provided a prognosis estimate or implied a specific timeframe, which is outside the Clinical Liaison role. Prognosis questions — including 'when should I gather the family?' — must be routed to the hospice nurse or social worker, not answered directly.";
  } else if (hadMedSafetyEvent) {
    roleBoundaryReview =
      "A medication question was handled outside the Clinical Liaison role. Validate the concern and route to the hospice nurse or provider.";
  } else if (hadClinicalRouting) {
    roleBoundaryReview =
      "The learner correctly stayed within the Clinical Liaison role by routing the clinical signs question to the hospice team. This is exactly right.";
  } else {
    roleBoundaryReview =
      "No major role boundary issue was detected. The Clinical Liaison role does not include prognosis estimates or end-of-life timeline guidance. Practice the routing language so it is ready when those questions arise.";
  }

  // --- medicationSafetyReview ---
  const medicationSafetyReview = hadMedSafetyEvent
    ? "Clinical and medication guidance are outside the Clinical Liaison role. Route to the hospice nurse or provider."
    : "No medication boundary issue was detected in this scenario.";

  // --- hospiceLanguageReview ---
  let hospiceLanguageReview: string;
  if (hadPrognosisReframe && hadClinicalRouting) {
    hospiceLanguageReview =
      "The learner both reframed the prognosis estimate and routed the clinical question appropriately. This combination is what helps families move from panic to productive planning.";
  } else if (hadPrognosisPromise) {
    hospiceLanguageReview =
      "Providing prognosis specifics escalates panic and steps outside the Clinical Liaison role. The safer language is to name the uncertainty honestly: 'Six months is an estimate, not a deadline — the honest answer is that no one can tell you exactly when.'";
  } else if (hadPrognosisReframe) {
    hospiceLanguageReview =
      "Good prognosis reframing. Pairing it with routing the signs question to the hospice team completes the arc.";
  } else {
    hospiceLanguageReview =
      "The prognosis was not reframed as an estimate in this conversation. A strong move is to explain that the six-month timeframe is an approximation based on what the team knows about the illness — not a countdown clock.";
  }

  // --- suggestedWording ---
  const wordingIds = ['cl_prognosis_estimate_reframe', 'cl_prognosis_family_routing'];
  const suggestedWording = wordingIds
    .map((id) => safeLanguage.find((e) => e.id === id)?.text)
    .filter((text): text is string => text !== undefined);

  // --- nextPracticeFocus ---
  let nextPracticeFocus: string;
  if (hadPrognosisPromise) {
    nextPracticeFocus =
      "Practice routing prognosis and end-of-life signs questions to the hospice team without providing estimates. When a family member asks 'how long?' the right move is to name the uncertainty honestly and connect them with the nurse or social worker.";
  } else if (hadServiceFirst && !hadPanicAck) {
    nextPracticeFocus =
      "Practice acknowledging the panic first. When a family member is catastrophizing about timing, the emotion is the real message. Name it before explaining anything.";
  } else if (!hadPrognosisReframe) {
    nextPracticeFocus =
      "Practice the prognosis reframe language. The goal is to help David understand that six months is an estimate, not a deadline — which shifts the conversation from panic to practical planning.";
  } else if (!hadClinicalRouting) {
    nextPracticeFocus =
      "Practice routing the end-of-life signs question to the hospice team. When a family member asks what to watch for, validate the question and connect them with the person who can answer it clinically.";
  } else {
    nextPracticeFocus =
      "The foundation is in place. The next step is practicing how to close these conversations — confirming what David's next steps are and who he can call when questions come up at 2am.";
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
