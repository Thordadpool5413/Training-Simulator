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

export function generateTerminalSecretionSkillScoreReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): SkillScoreReport {
  void conversationMessages;

  const hadFearAck = hasBehavior(patientStateSnapshots, 'fear_acknowledgment');
  const hadSecretionExp = hasBehavior(patientStateSnapshots, 'secretion_explanation');
  const hadPlainLanguage = hasBehavior(patientStateSnapshots, 'plain_language_used');
  const hadComfortEd = hasBehavior(patientStateSnapshots, 'comfort_education');
  const hadCaregiverEmpow = hasBehavior(patientStateSnapshots, 'caregiver_empowerment');
  const hadSafeMedRouting = hasBehavior(patientStateSnapshots, 'safe_medication_routing');
  const hadRoleBoundary = hasBehavior(patientStateSnapshots, 'role_boundary_respected');
  const hadDoseOverstep = hasBehavior(patientStateSnapshots, 'medication_dose_overstep');
  const hadOverpromise = hasBehavior(patientStateSnapshots, 'overpromise_symptom_control');
  const hadMinimizerOrUnsafe = hadDoseOverstep || hadOverpromise;
  const hadSupportiveBehavior = hadComfortEd || hadCaregiverEmpow || hadSafeMedRouting || hadRoleBoundary;

  const rnSafetyEventCount = safetyEvents.filter(
    (e) => e.violationCategory === 'rn_medication_dose_outside_orders'
  ).length;

  const hadRecoveryAfterEvent =
    behaviorAppearsAfterFirstSafetyEvent(patientStateSnapshots, 'role_boundary_respected', safetyEvents, 'rn_medication_dose_outside_orders') ||
    behaviorAppearsAfterFirstSafetyEvent(patientStateSnapshots, 'safe_medication_routing', safetyEvents, 'rn_medication_dose_outside_orders');

  const emotionalAttunement: SkillScore = (() => {
    const cat = RN_CATEGORIES[0];
    if (hadMinimizerOrUnsafe && !hadFearAck) return { category: cat, score: 0, evidence: "Unsafe language was used without acknowledging Linda's fear.", coachingNote: "Name the fear first, then correct the framing." };
    if (hadFearAck && hadSecretionExp && !hadMinimizerOrUnsafe) return { category: cat, score: 4, evidence: "The learner acknowledged Linda's fear and explained terminal secretions.", coachingNote: 'Combining acknowledgment with plain language explanation is the strongest approach.' };
    if (hadFearAck && !hadMinimizerOrUnsafe) return { category: cat, score: 3, evidence: "The learner acknowledged Linda's fear.", coachingNote: 'Good start. Pair the acknowledgment with an explanation of what terminal secretions are.' };
    if (!hadFearAck && !hadMinimizerOrUnsafe && hadSupportiveBehavior) return { category: cat, score: 2, evidence: 'Clinical support was provided without naming the fear.', coachingNote: 'Acknowledging fear opens the door for information.' };
    return { category: cat, score: 1, evidence: 'No emotional acknowledgment detected.', coachingNote: "Practice naming Linda's fear directly." };
  })();

  const symptomCommunication: SkillScore = (() => {
    const cat = RN_CATEGORIES[1];
    if (hadOverpromise) return { category: cat, score: 0, evidence: 'The learner overpromised that the secretion sound would stop.', coachingNote: 'Honest framing — that the sound may ease but cannot be guaranteed to stop — is more helpful.' };
    if (hadSecretionExp && hadPlainLanguage) return { category: cat, score: 4, evidence: 'Terminal secretions were explained in plain language.', coachingNote: 'This is the clearest way to shift Linda from panic to presence.' };
    if (hadSecretionExp) return { category: cat, score: 3, evidence: 'Terminal secretions were explained.', coachingNote: 'Strong. Continue using plain language so the explanation is accessible.' };
    if (hadComfortEd) return { category: cat, score: 2, evidence: 'Comfort tools were described but secretions were not explained.', coachingNote: 'Comfort tools are more meaningful when paired with an explanation of what is happening.' };
    if (hadFearAck) return { category: cat, score: 1, evidence: "Fear was acknowledged but secretions were not explained.", coachingNote: "After acknowledging the fear, explain what the sound is and why it is not drowning." };
    return { category: cat, score: 1, evidence: 'No symptom explanation detected.', coachingNote: 'Practice explaining terminal secretions — not drowning, not choking — throat muscles relaxing.' };
  })();

  const comfortEducation: SkillScore = (() => {
    const cat = RN_CATEGORIES[2];
    if (hadOverpromise) return { category: cat, score: 0, evidence: 'The learner overstated what comfort measures would achieve.', coachingNote: 'Honest comfort education is more helpful than a promise.' };
    if (hadComfortEd && hadCaregiverEmpow) return { category: cat, score: 4, evidence: 'Comfort tools and caregiver empowerment were both described.', coachingNote: 'Giving specific actions reduces helplessness.' };
    if (hadComfortEd) return { category: cat, score: 3, evidence: 'Comfort tools were described.', coachingNote: 'Good. Add a direct invitation for Linda to take an active role.' };
    if (hadFearAck) return { category: cat, score: 2, evidence: "Fear was acknowledged but no comfort tools were described.", coachingNote: 'After acknowledging the fear, describe what Linda can do — repositioning, mouth swabs, staying calm.' };
    return { category: cat, score: 1, evidence: 'No comfort education detected.', coachingNote: 'Practice describing repositioning, elevating the head, and staying calm beside Earl.' };
  })();

  const roleBoundarySafety: SkillScore = (() => {
    const cat = RN_CATEGORIES[3];
    if (rnSafetyEventCount > 1) return { category: cat, score: 0, evidence: 'Medication dose language was used more than once.', coachingNote: 'Repeated boundary violations are critical to address.' };
    if (rnSafetyEventCount === 1 && !hadRecoveryAfterEvent) return { category: cat, score: 1, evidence: 'Medication dose language was used without correction.', coachingNote: 'Route dose questions to the hospice on-call provider.' };
    if (rnSafetyEventCount === 1 && hadRecoveryAfterEvent) return { category: cat, score: 2, evidence: 'A boundary issue occurred but was later corrected.', coachingNote: 'Correcting in the moment is a strong recovery.' };
    if (!hadRoleBoundary) return { category: cat, score: 3, evidence: 'No boundary issue occurred. Routing language not explicitly demonstrated.', coachingNote: 'Clean session. Practice the routing language for when a dose question arises.' };
    return { category: cat, score: 4, evidence: 'The learner stayed within RN scope and routed dose questions correctly.', coachingNote: 'This is the right approach.' };
  })();

  const caregiverEmpowerment: SkillScore = (() => {
    const cat = RN_CATEGORIES[4];
    if (hadOverpromise) return { category: cat, score: 0, evidence: 'Overpromising removed the caregiver\'s sense of informed participation.', coachingNote: 'Honest framing enables real empowerment.' };
    if (hadCaregiverEmpow && hadSafeMedRouting) return { category: cat, score: 4, evidence: 'Linda was given comfort actions and the medication question was routed safely.', coachingNote: 'Full caregiver empowerment — tools plus correct escalation.' };
    if (hadCaregiverEmpow) return { category: cat, score: 3, evidence: 'Linda was given specific comfort actions.', coachingNote: 'Good empowerment. Add medication routing to complete the picture.' };
    if (hadSafeMedRouting) return { category: cat, score: 2, evidence: 'Medication was routed safely but no comfort actions were described.', coachingNote: 'Safe routing is important. Pair it with specific comfort tools for Linda.' };
    if (hadFearAck) return { category: cat, score: 1, evidence: "Fear was acknowledged but no concrete actions were described.", coachingNote: 'After acknowledging the fear, give Linda something specific she can do.' };
    return { category: cat, score: 1, evidence: 'No caregiver empowerment detected.', coachingNote: 'Practice giving caregivers specific tools so they move from helpless to participant.' };
  })();

  const clinicalEscalation: SkillScore = (() => {
    const cat = RN_CATEGORIES[5];
    if (rnSafetyEventCount > 1) return { category: cat, score: 0, evidence: 'Dose boundary violations occurred more than once.', coachingNote: 'Repeated failures are the most critical pattern to address.' };
    if (rnSafetyEventCount === 1 && !hadRecoveryAfterEvent) return { category: cat, score: 1, evidence: 'A dose question arose and was not routed.', coachingNote: 'Route dose questions to the on-call provider immediately.' };
    if (rnSafetyEventCount === 1 && hadRecoveryAfterEvent) return { category: cat, score: 2, evidence: 'A dose question arose and was later corrected.', coachingNote: 'Correcting shows good self-awareness. Route on the first response.' };
    if (hadSafeMedRouting && hadRoleBoundary) return { category: cat, score: 4, evidence: 'The learner demonstrated correct escalation — confirming the comfort plan and routing.', coachingNote: 'This is the right pattern.' };
    return { category: cat, score: 3, evidence: 'No dose question arose, so escalation judgment could not be fully assessed.', coachingNote: 'Practice the routing language before the next session.' };
  })();

  const trustCount = [hadFearAck, hadSecretionExp, hadSafeMedRouting, hadCaregiverEmpow].filter(Boolean).length;
  const trustBuilding: SkillScore = (() => {
    const cat = RN_CATEGORIES[6];
    if (hadMinimizerOrUnsafe && trustCount === 0) return { category: cat, score: 0, evidence: 'Unsafe language and no trust-building behaviors.', coachingNote: 'Name the fear, explain secretions, give comfort actions — each rebuilds trust.' };
    if (trustCount === 4) return { category: cat, score: 4, evidence: 'All four trust-building behaviors were demonstrated.', coachingNote: 'This is the full trust arc.' };
    if (trustCount === 3) return { category: cat, score: 3, evidence: 'Three of four trust-building behaviors demonstrated.', coachingNote: 'Strong session. Adding the missing element completes the arc.' };
    if (trustCount === 2) return { category: cat, score: 2, evidence: 'Two of four trust-building behaviors demonstrated.', coachingNote: 'Partial arc in place.' };
    if (trustCount === 1) return { category: cat, score: 1, evidence: 'One trust-building behavior demonstrated.', coachingNote: 'Build the full sequence: fear, explanation, comfort tools, medication routing.' };
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
