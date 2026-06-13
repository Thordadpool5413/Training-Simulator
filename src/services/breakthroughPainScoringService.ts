import type {
  ConversationMessage,
  PatientStateSnapshot,
  SafetyEvent,
  SkillScore,
  SkillScoreReport,
} from '@/types/simulator';

const RN_CATEGORIES = [
  'Emotional Attunement',
  'Symptom Communication',
  'Comfort Education',
  'Role Boundary Safety',
  'Caregiver Empowerment',
  'Clinical Escalation Judgment',
  'Trust Building',
] as const;

function hasBehavior(snapshots: PatientStateSnapshot[], behavior: string): boolean {
  return snapshots.some((s) => s.detectedBehaviors.includes(behavior));
}

function behaviorAppearsAfterFirstSafetyEvent(
  snapshots: PatientStateSnapshot[],
  behavior: string,
  safetyEvents: SafetyEvent[],
  violationCategory: string
): boolean {
  const firstEvent = safetyEvents.find((e) => e.violationCategory === violationCategory);
  if (!firstEvent) return false;
  const eventTime = Date.parse(firstEvent.createdAt);
  if (isNaN(eventTime)) return false;
  return snapshots.some((s) => {
    if (!s.detectedBehaviors.includes(behavior)) return false;
    const snapTime = Date.parse(s.createdAt);
    if (isNaN(snapTime)) return false;
    return snapTime > eventTime;
  });
}

export function generateBreakthroughPainSkillScoreReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): SkillScoreReport {
  void conversationMessages;

  const hadFearAck = hasBehavior(patientStateSnapshots, 'fear_acknowledgment');
  const hadPainAssessment = hasBehavior(patientStateSnapshots, 'pain_assessment_communication');
  const hadProviderRouting = hasBehavior(patientStateSnapshots, 'provider_routing');
  const hadComfortEd = hasBehavior(patientStateSnapshots, 'comfort_education');
  const hadCaregiverEmpow = hasBehavior(patientStateSnapshots, 'caregiver_empowerment');
  const hadSafeMedRouting = hasBehavior(patientStateSnapshots, 'safe_medication_routing');
  const hadRoleBoundary = hasBehavior(patientStateSnapshots, 'role_boundary_respected');
  const hadDoseOverstep = hasBehavior(patientStateSnapshots, 'medication_dose_overstep');
  const hadMinimizerOrUnsafe = hadDoseOverstep;
  const hadSupportiveBehavior = hadComfortEd || hadCaregiverEmpow || hadProviderRouting;

  const rnSafetyEventCount = safetyEvents.filter(
    (e) => e.violationCategory === 'rn_medication_dose_outside_orders'
  ).length;

  const hadRecoveryAfterEvent =
    behaviorAppearsAfterFirstSafetyEvent(patientStateSnapshots, 'provider_routing', safetyEvents, 'rn_medication_dose_outside_orders') ||
    behaviorAppearsAfterFirstSafetyEvent(patientStateSnapshots, 'safe_medication_routing', safetyEvents, 'rn_medication_dose_outside_orders') ||
    behaviorAppearsAfterFirstSafetyEvent(patientStateSnapshots, 'role_boundary_respected', safetyEvents, 'rn_medication_dose_outside_orders');

  const emotionalAttunement: SkillScore = (() => {
    const cat = RN_CATEGORIES[0];
    if (hadMinimizerOrUnsafe && !hadFearAck) return { category: cat, score: 0, evidence: "Unsafe dose language was used without acknowledging Maria's fear.", coachingNote: "Name the fear and validate the caregiver before addressing the dose question." };
    if (hadFearAck && hadPainAssessment && !hadMinimizerOrUnsafe) return { category: cat, score: 4, evidence: "The learner acknowledged Maria's fear and gathered pain assessment information.", coachingNote: 'Combining acknowledgment with assessment is the strongest approach in breakthrough pain calls.' };
    if (hadFearAck && !hadMinimizerOrUnsafe) return { category: cat, score: 3, evidence: "The learner acknowledged Maria's fear.", coachingNote: 'Good start. Pair the acknowledgment with a brief pain assessment.' };
    if (!hadFearAck && !hadMinimizerOrUnsafe && hadSupportiveBehavior) return { category: cat, score: 2, evidence: 'Clinical support was provided without naming the fear.', coachingNote: 'Acknowledging fear and validating that the caregiver followed the plan opens the conversation.' };
    return { category: cat, score: 1, evidence: 'No emotional acknowledgment detected.', coachingNote: "Practice naming Maria's fear — that the medication failed and that she may have done something wrong." };
  })();

  const symptomCommunication: SkillScore = (() => {
    const cat = RN_CATEGORIES[1];
    if (hadDoseOverstep) return { category: cat, score: 0, evidence: 'A specific dose or additional medication was stated or authorized.', coachingNote: 'Dose adjustment requires the on-call provider. Assess the pain and route.' };
    if (hadPainAssessment && hadProviderRouting) return { category: cat, score: 4, evidence: 'Pain was assessed and the dose question was routed to the on-call provider.', coachingNote: 'Assessment plus routing is the complete symptom communication arc for breakthrough pain.' };
    if (hadPainAssessment) return { category: cat, score: 3, evidence: 'Pain assessment information was gathered.', coachingNote: 'Strong. Route what you gathered to the on-call provider to complete the arc.' };
    if (hadProviderRouting) return { category: cat, score: 3, evidence: 'The dose question was routed to the on-call provider.', coachingNote: 'Correct routing. Adding a pain assessment before routing gives the provider the information they need.' };
    if (hadFearAck) return { category: cat, score: 2, evidence: 'Fear was acknowledged but pain was not assessed.', coachingNote: 'After the fear acknowledgment, gather information about the pain before routing.' };
    return { category: cat, score: 1, evidence: 'No pain assessment or routing detected.', coachingNote: 'Practice asking about the pain — location, what it looks like, what helps — before routing to the provider.' };
  })();

  const comfortEducation: SkillScore = (() => {
    const cat = RN_CATEGORIES[2];
    if (hadDoseOverstep) return { category: cat, score: 0, evidence: 'Dose guidance was given without routing. Comfort education cannot be assessed cleanly.', coachingNote: 'Route dose questions first, then offer non-medication comfort measures.' };
    if (hadComfortEd && hadCaregiverEmpow) return { category: cat, score: 4, evidence: 'Non-medication comfort measures were described and Maria was empowered with a next step.', coachingNote: 'Giving the caregiver something to do while waiting for the provider is powerful.' };
    if (hadComfortEd) return { category: cat, score: 3, evidence: 'Non-medication comfort measures were described.', coachingNote: 'Good. Add a direct invitation for Maria to take a specific action while waiting.' };
    if (hadFearAck || hadCaregiverEmpow) return { category: cat, score: 2, evidence: 'Fear was acknowledged or the caregiver was validated but no comfort tools were described.', coachingNote: 'After validating the caregiver, describe what she can do while waiting for the provider callback.' };
    return { category: cat, score: 1, evidence: 'No comfort education detected.', coachingNote: 'Practice describing repositioning, distraction, or other non-medication comfort measures for ALS pain.' };
  })();

  const roleBoundarySafety: SkillScore = (() => {
    const cat = RN_CATEGORIES[3];
    if (rnSafetyEventCount > 1) return { category: cat, score: 0, evidence: 'Dose guidance was provided more than once.', coachingNote: 'Repeated boundary violations are the most critical pattern to address.' };
    if (rnSafetyEventCount === 1 && !hadRecoveryAfterEvent) return { category: cat, score: 1, evidence: 'Dose guidance was provided without routing to the provider.', coachingNote: 'Dose adjustment belongs with the on-call hospice provider.' };
    if (rnSafetyEventCount === 1 && hadRecoveryAfterEvent) return { category: cat, score: 2, evidence: 'Dose guidance was given once but the learner later corrected to provider routing.', coachingNote: 'Correcting is a strong recovery. Route on the first response.' };
    if (!hadRoleBoundary) return { category: cat, score: 3, evidence: 'No boundary issue. Routing language not explicitly demonstrated.', coachingNote: 'Clean session. Practice the routing language.' };
    return { category: cat, score: 4, evidence: 'The learner stayed within RN scope and routed correctly.', coachingNote: 'This is the right approach.' };
  })();

  const caregiverEmpowerment: SkillScore = (() => {
    const cat = RN_CATEGORIES[4];
    if (hadDoseOverstep) return { category: cat, score: 0, evidence: 'Dose guidance removed the caregiver from the appropriate decision-making path.', coachingNote: 'Empowering the caregiver means validating their actions and routing to the right person.' };
    if (hadCaregiverEmpow && (hadProviderRouting || hadSafeMedRouting)) return { category: cat, score: 4, evidence: 'Maria was validated and empowered, and the dose question was routed.', coachingNote: 'Full empowerment — validation plus correct escalation.' };
    if (hadCaregiverEmpow) return { category: cat, score: 3, evidence: 'Maria was validated — told she followed the plan correctly.', coachingNote: 'Good empowerment. Add the provider routing to complete the picture.' };
    if (hadProviderRouting || hadSafeMedRouting) return { category: cat, score: 2, evidence: 'The dose question was routed but the caregiver was not validated.', coachingNote: 'Pair safe routing with explicit validation that Maria followed the plan correctly.' };
    if (hadFearAck) return { category: cat, score: 1, evidence: 'Fear was acknowledged but no validation or next steps were described.', coachingNote: 'After acknowledging the fear, tell Maria she did everything right and give her a clear next step.' };
    return { category: cat, score: 1, evidence: 'No caregiver empowerment detected.', coachingNote: 'Practice validating that the caregiver followed the plan correctly — this is the most important empowerment move in breakthrough pain calls.' };
  })();

  const clinicalEscalation: SkillScore = (() => {
    const cat = RN_CATEGORIES[5];
    if (rnSafetyEventCount > 1) return { category: cat, score: 0, evidence: 'Dose violations occurred more than once.', coachingNote: 'Repeated escalation failures are critical to address.' };
    if (rnSafetyEventCount === 1 && !hadRecoveryAfterEvent) return { category: cat, score: 1, evidence: 'Dose question arose and was not routed.', coachingNote: 'Route dose questions to the on-call provider immediately.' };
    if (rnSafetyEventCount === 1 && hadRecoveryAfterEvent) return { category: cat, score: 2, evidence: 'Dose question arose and was later corrected.', coachingNote: 'Correcting shows good judgment. Route on the first response.' };
    if (hadProviderRouting && (hadRoleBoundary || hadSafeMedRouting)) return { category: cat, score: 4, evidence: 'The learner demonstrated correct escalation — routing the dose question to the on-call provider.', coachingNote: 'This is the right escalation pattern for breakthrough pain.' };
    return { category: cat, score: 3, evidence: 'No dose question arose, so escalation judgment could not be fully assessed.', coachingNote: 'Practice the provider routing language before the next session.' };
  })();

  const trustCount = [hadFearAck, hadPainAssessment, hadProviderRouting, hadCaregiverEmpow].filter(Boolean).length;
  const trustBuilding: SkillScore = (() => {
    const cat = RN_CATEGORIES[6];
    if (hadMinimizerOrUnsafe && trustCount === 0) return { category: cat, score: 0, evidence: 'Dose guidance was given and no trust-building behaviors detected.', coachingNote: 'Acknowledge fear, assess pain, validate the caregiver, route — each builds trust.' };
    if (trustCount === 4) return { category: cat, score: 4, evidence: 'All four trust-building behaviors were demonstrated.', coachingNote: 'This is the full trust arc for breakthrough pain calls.' };
    if (trustCount === 3) return { category: cat, score: 3, evidence: 'Three of four trust-building behaviors demonstrated.', coachingNote: 'Strong session. Adding the missing element completes the arc.' };
    if (trustCount === 2) return { category: cat, score: 2, evidence: 'Two of four trust-building behaviors demonstrated.', coachingNote: 'Partial arc in place.' };
    if (trustCount === 1) return { category: cat, score: 1, evidence: 'One trust-building behavior demonstrated.', coachingNote: 'Build the sequence: fear, assessment, validation, provider routing.' };
    return { category: cat, score: 1, evidence: 'No trust-building behaviors detected.', coachingNote: 'Practice the four trust-building moves for this scenario.' };
  })();

  const scores: SkillScore[] = [
    emotionalAttunement, symptomCommunication, comfortEducation,
    roleBoundarySafety, caregiverEmpowerment, clinicalEscalation, trustBuilding,
  ];

  const overallScore = Math.round((scores.reduce((sum, s) => sum + s.score, 0) / scores.length) * 10) / 10;
  const maxScore = Math.max(...scores.map((s) => s.score));
  const minScore = Math.min(...scores.map((s) => s.score));
  const primaryStrength = scores.find((s) => s.score === maxScore)!.category;
  const primaryGrowthArea = scores.find((s) => s.score === minScore)!.category;

  return { id: `${Date.now()}-scores`, scenarioId, overallScore, scores, primaryStrength, primaryGrowthArea, createdAt: new Date().toISOString() };
}
