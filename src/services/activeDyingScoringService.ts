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

export function generateActiveDyingSkillScoreReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): SkillScoreReport {
  void conversationMessages;

  const hadFearAck = hasBehavior(patientStateSnapshots, 'fear_acknowledgment');
  const hadDyingProcess = hasBehavior(patientStateSnapshots, 'dying_process_explained');
  const hadPlainLanguage = hasBehavior(patientStateSnapshots, 'plain_language_used');
  const hadComfortEd = hasBehavior(patientStateSnapshots, 'comfort_education');
  const hadCaregiverEmpow = hasBehavior(patientStateSnapshots, 'caregiver_empowerment');
  const hadSafeMedRouting = hasBehavior(patientStateSnapshots, 'safe_medication_routing');
  const hadRoleBoundary = hasBehavior(patientStateSnapshots, 'role_boundary_respected');
  const hadDoseOverstep = hasBehavior(patientStateSnapshots, 'medication_dose_overstep');
  const hadOverpromise = hasBehavior(patientStateSnapshots, 'overpromise_symptom_control');
  const hadEmergencyError = hasBehavior(patientStateSnapshots, 'emergency_routing_error');
  const hadMinimizerOrUnsafe = hadDoseOverstep || hadOverpromise || hadEmergencyError;

  const rnSafetyEventCount = safetyEvents.filter(
    (e) => e.violationCategory === 'rn_medication_dose_outside_orders'
  ).length;

  const hadRecoveryAfterEvent =
    behaviorAppearsAfterFirstSafetyEvent(patientStateSnapshots, 'role_boundary_respected', safetyEvents, 'rn_medication_dose_outside_orders') ||
    behaviorAppearsAfterFirstSafetyEvent(patientStateSnapshots, 'safe_medication_routing', safetyEvents, 'rn_medication_dose_outside_orders');

  const emotionalAttunement: SkillScore = (() => {
    const cat = RN_CATEGORIES[0];
    if (hadMinimizerOrUnsafe && !hadFearAck) return { category: cat, score: 0, evidence: "Unsafe or incorrect clinical guidance was offered without acknowledging Patricia's fear.", coachingNote: "Name the fear first, then correct the framing." };
    if (hadFearAck && hadDyingProcess && !hadMinimizerOrUnsafe) return { category: cat, score: 4, evidence: "The learner acknowledged Patricia's fear and followed with a plain language explanation of active dying.", coachingNote: 'Combining fear acknowledgment with clinical explanation is the strongest approach.' };
    if (hadFearAck && !hadMinimizerOrUnsafe) return { category: cat, score: 3, evidence: "The learner acknowledged Patricia's fear.", coachingNote: 'Good start. Pair the acknowledgment with an explanation of what the dying signs mean.' };
    if (!hadFearAck && !hadMinimizerOrUnsafe && (hadComfortEd || hadCaregiverEmpow)) return { category: cat, score: 2, evidence: 'The learner provided clinical support without directly naming the fear.', coachingNote: 'Acknowledging fear opens the door for everything that follows.' };
    return { category: cat, score: 1, evidence: 'No clear emotional acknowledgment was detected.', coachingNote: "Practice naming Patricia's fear directly before explaining anything." };
  })();

  const symptomCommunication: SkillScore = (() => {
    const cat = RN_CATEGORIES[1];
    if (hadOverpromise || hadEmergencyError) return { category: cat, score: 0, evidence: 'The learner overpromised or suggested emergency escalation, which is not appropriate for active dying on hospice.', coachingNote: 'Explain what active dying looks like and why the signs are natural — do not suggest interventions that contradict the comfort plan.' };
    if (hadDyingProcess && hadPlainLanguage) return { category: cat, score: 4, evidence: 'The active dying process was explained in plain language.', coachingNote: 'Plain language explanation of dying signs helps caregivers witness without panicking.' };
    if (hadDyingProcess) return { category: cat, score: 3, evidence: 'The active dying process was explained.', coachingNote: 'Strong. Continue to use plain language so the explanation is accessible.' };
    if (hadComfortEd) return { category: cat, score: 2, evidence: 'Comfort tools were described but the dying process was not explained.', coachingNote: 'Comfort tools are more meaningful when paired with an explanation of what is happening.' };
    return { category: cat, score: 1, evidence: 'No symptom explanation was detected.', coachingNote: 'Practice explaining mottling, Cheyne-Stokes breathing, and cooling — what they mean and why they are natural.' };
  })();

  const comfortEducation: SkillScore = (() => {
    const cat = RN_CATEGORIES[2];
    if (hadOverpromise) return { category: cat, score: 0, evidence: 'The learner overstated what intervention would achieve.', coachingNote: 'Comfort education is strongest when honest about what the process involves.' };
    if (hadComfortEd && hadCaregiverEmpow) return { category: cat, score: 4, evidence: 'Comfort tools and vigil empowerment were both described.', coachingNote: 'Giving the caregiver a specific role at the bedside is the most important comfort education in this scenario.' };
    if (hadComfortEd) return { category: cat, score: 3, evidence: 'Comfort tools were described.', coachingNote: 'Good. Add a direct invitation for Patricia to hold a vigil — give her a role in the process.' };
    if (hadFearAck) return { category: cat, score: 2, evidence: "Fear was acknowledged but no comfort tools or vigil role was described.", coachingNote: 'After acknowledging the fear, describe what Patricia can do at the bedside.' };
    return { category: cat, score: 1, evidence: 'No comfort education was detected.', coachingNote: 'Practice describing the vigil role — staying beside Betty, talking to her, holding her hand, keeping the room calm.' };
  })();

  const roleBoundarySafety: SkillScore = (() => {
    const cat = RN_CATEGORIES[3];
    if (rnSafetyEventCount > 1) return { category: cat, score: 0, evidence: 'Medication dose or incorrect escalation guidance was provided more than once.', coachingNote: 'Repeated boundary violations are the most critical pattern to address.' };
    if (rnSafetyEventCount === 1 && !hadRecoveryAfterEvent) return { category: cat, score: 1, evidence: 'Medication dose language or incorrect escalation guidance was provided without correction.', coachingNote: 'Route dose questions to the hospice on-call provider. For escalation, the correct contact is the hospice team, not 911.' };
    if (rnSafetyEventCount === 1 && hadRecoveryAfterEvent) return { category: cat, score: 2, evidence: 'A boundary issue occurred but the learner later corrected to safer language.', coachingNote: 'Correcting in the moment is a strong recovery. Aim to route on the first response.' };
    if (!hadRoleBoundary) return { category: cat, score: 3, evidence: 'No boundary issue occurred. Explicit routing language was not demonstrated.', coachingNote: 'Clean session. Practice the routing language so it is ready when a medication or escalation question arises.' };
    return { category: cat, score: 4, evidence: 'The learner stayed within RN scope and demonstrated correct escalation routing.', coachingNote: 'This is exactly right. Confirming the hospice plan and routing questions protects both the family and the learner.' };
  })();

  const caregiverEmpowerment: SkillScore = (() => {
    const cat = RN_CATEGORIES[4];
    if (hadOverpromise || hadEmergencyError) return { category: cat, score: 0, evidence: 'Incorrect framing reduced the caregiver\'s ability to hold an informed presence.', coachingNote: 'Caregiver empowerment depends on honest framing. Overpromising or misrouting creates a different kind of helplessness.' };
    if (hadCaregiverEmpow && hadSafeMedRouting) return { category: cat, score: 4, evidence: "Patricia was given a vigil role and the medication question was routed safely.", coachingNote: 'Full caregiver empowerment — specific role plus correct escalation.' };
    if (hadCaregiverEmpow) return { category: cat, score: 3, evidence: 'Patricia was given a vigil role at the bedside.', coachingNote: 'Good empowerment. Add the medication routing to complete the picture.' };
    if (hadSafeMedRouting) return { category: cat, score: 2, evidence: 'The medication question was routed safely, but no vigil role was described.', coachingNote: 'Safe routing is important. Pair it with specific vigil guidance for Patricia.' };
    if (hadFearAck) return { category: cat, score: 1, evidence: "Fear was acknowledged but no concrete vigil role or next steps were described.", coachingNote: 'After acknowledging the fear, give Patricia something specific she can do at the bedside.' };
    return { category: cat, score: 1, evidence: 'No caregiver empowerment was detected.', coachingNote: 'Practice giving caregivers a vigil role — staying present, talking, holding a hand — so they move from helpless to participant.' };
  })();

  const clinicalEscalation: SkillScore = (() => {
    const cat = RN_CATEGORIES[5];
    if (rnSafetyEventCount > 1) return { category: cat, score: 0, evidence: 'Medication or escalation boundary violations occurred more than once.', coachingNote: 'Repeated escalation failures are the most critical pattern to address.' };
    if (rnSafetyEventCount === 1 && !hadRecoveryAfterEvent) return { category: cat, score: 1, evidence: 'A boundary issue arose and was not corrected.', coachingNote: 'When dose questions or escalation questions arise, route them immediately.' };
    if (rnSafetyEventCount === 1 && hadRecoveryAfterEvent) return { category: cat, score: 2, evidence: 'A boundary issue arose and was later corrected.', coachingNote: 'Correcting shows good self-awareness. The goal is to route on the first response.' };
    if (hadSafeMedRouting && hadRoleBoundary) return { category: cat, score: 4, evidence: 'The learner demonstrated correct escalation judgment — confirming the comfort plan and routing questions to the on-call provider.', coachingNote: 'This is the right escalation pattern.' };
    return { category: cat, score: 3, evidence: 'No dose or escalation question arose, so clinical escalation judgment could not be fully assessed.', coachingNote: 'Practice the routing language before the next session.' };
  })();

  const trustCount = [hadFearAck, hadDyingProcess, hadSafeMedRouting, hadCaregiverEmpow].filter(Boolean).length;
  const trustBuilding: SkillScore = (() => {
    const cat = RN_CATEGORIES[6];
    if (hadMinimizerOrUnsafe && trustCount === 0) return { category: cat, score: 0, evidence: 'Unsafe or incorrect guidance and no trust-building behaviors.', coachingNote: 'Name the fear, explain the dying process, give a vigil role — each move rebuilds trust.' };
    if (trustCount === 4) return { category: cat, score: 4, evidence: 'All four trust-building behaviors were demonstrated.', coachingNote: 'This is the full trust arc for this scenario.' };
    if (trustCount === 3) return { category: cat, score: 3, evidence: 'Three of four trust-building behaviors were demonstrated.', coachingNote: 'Strong session. Adding the missing element completes the arc.' };
    if (trustCount === 2) return { category: cat, score: 2, evidence: 'Two of four trust-building behaviors were demonstrated.', coachingNote: 'A partial trust arc is in place. Continue building the sequence.' };
    if (trustCount === 1) return { category: cat, score: 1, evidence: 'One trust-building behavior was demonstrated.', coachingNote: 'Practice the full sequence: acknowledge fear, explain dying signs, describe the vigil role, route medication questions.' };
    return { category: cat, score: 1, evidence: 'No trust-building behaviors were detected.', coachingNote: 'Practice the four trust-building moves for this scenario.' };
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
