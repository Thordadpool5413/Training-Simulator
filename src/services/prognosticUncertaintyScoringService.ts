import type {
  ConversationMessage,
  PatientStateSnapshot,
  SafetyEvent,
  SkillScore,
  SkillScoreReport,
} from '@/types/simulator';

const PU_CATEGORIES = [
  'Emotional Attunement',
  'Prognosis Education',
  'Objection Handling',
  'Compliance Safe Language',
  'Clinical Escalation Judgment',
  'Trust Building',
  'Role Boundary Safety',
] as const;

function hasBehavior(snapshots: PatientStateSnapshot[], behavior: string): boolean {
  return snapshots.some((s) => s.detectedBehaviors.includes(behavior));
}

function scoreEmotionalAttunement(
  hadPanicAck: boolean,
  hadServiceFirst: boolean,
  hadRepairLanguage: boolean,
  hadAbandonmentLike: boolean
): SkillScore {
  const category = PU_CATEGORIES[0];
  if (hadPanicAck && !hadServiceFirst) {
    return {
      category,
      score: 4,
      evidence: "The learner acknowledged David's panic before providing education or information.",
      coachingNote:
        'Starting with acknowledgment of the fear is the right first move when a family member is catastrophizing about prognosis timing.',
    };
  }
  if (hadPanicAck && hadServiceFirst) {
    return {
      category,
      score: 3,
      evidence: "The learner eventually acknowledged David's panic but provided information first.",
      coachingNote:
        'The acknowledgment helped shift the conversation. Leading with emotional acknowledgment first has a stronger impact.',
    };
  }
  if (hadRepairLanguage) {
    return {
      category,
      score: 2,
      evidence: 'The learner used repair language but did not directly address the panic.',
      coachingNote:
        "Repair language shows self-awareness. The next step is responding to David's panic directly before information.",
    };
  }
  if (hadAbandonmentLike) {
    return {
      category,
      score: 0,
      evidence: "The learner provided a prognosis estimate that escalated David's panic.",
      coachingNote:
        'When a family member is catastrophizing, providing a specific timeframe escalates rather than calms. Lead with the uncertainty and the emotional acknowledgment.',
    };
  }
  return {
    category,
    score: 1,
    evidence: "The learner did not clearly acknowledge David's panic.",
    coachingNote:
      "David's opening was pure panic about timing. Name the panic directly before explaining anything.",
  };
}

function scorePrognosisEducation(
  hadPrognosisReframe: boolean,
  hadPrognosisPromise: boolean,
  hadRepairLanguage: boolean
): SkillScore {
  const category = PU_CATEGORIES[1];
  if (hadPrognosisReframe && !hadPrognosisPromise) {
    return {
      category,
      score: 4,
      evidence: 'The learner explained that six months is an estimate, not a deadline.',
      coachingNote:
        'This is the key education move in this scenario. Reframing prognosis as an approximation shifts the family from countdown mode to planning mode.',
    };
  }
  if (hadPrognosisReframe && hadPrognosisPromise) {
    return {
      category,
      score: 2,
      evidence:
        'The learner reframed the prognosis as an estimate but also implied a specific timeframe.',
      coachingNote:
        'Mixing reframing with a specific estimate undercuts the reframe. Stick to uncertainty and routing.',
    };
  }
  if (hadPrognosisPromise) {
    return {
      category,
      score: 0,
      evidence: 'The learner provided a prognosis estimate or implied a specific timeframe.',
      coachingNote:
        'Prognosis estimates are outside the Clinical Liaison role and escalate rather than reduce panic. The right move is to name the uncertainty and route.',
    };
  }
  if (hadRepairLanguage) {
    return {
      category,
      score: 2,
      evidence: 'The learner used repair language but did not clearly reframe the prognosis.',
      coachingNote:
        'Repair language helps. Complete it by adding the prognosis reframe: six months is an estimate, not a countdown.',
    };
  }
  return {
    category,
    score: 1,
    evidence: 'The prognosis was not reframed as an estimate in this conversation.',
    coachingNote:
      "Practice the prognosis reframe: 'Six months is an estimate, not a deadline. No one can tell you exactly when.' This is the single most important education move in this scenario.",
  };
}

function scoreObjectionHandling(
  hadPanicAck: boolean,
  hadServiceFirst: boolean,
  hadPrognosisPromise: boolean
): SkillScore {
  const category = PU_CATEGORIES[2];
  if (hadPanicAck && !hadServiceFirst && !hadPrognosisPromise) {
    return {
      category,
      score: 4,
      evidence: "The learner acknowledged David's panic before providing information, without escalating with a prognosis estimate.",
      coachingNote:
        "Acknowledging the panic first, without adding a specific timeframe, is the right objection handling pattern for prognosis anxiety.",
    };
  }
  if (hadPanicAck && !hadPrognosisPromise) {
    return {
      category,
      score: 3,
      evidence: "The learner acknowledged David's panic, though information came first.",
      coachingNote:
        'Good acknowledgment. Leading with the emotional concern next time will have a stronger impact.',
    };
  }
  if (hadPrognosisPromise) {
    return {
      category,
      score: 0,
      evidence: 'The learner escalated the panic by providing a prognosis estimate.',
      coachingNote:
        "Prognosis estimates confirm the countdown thinking rather than interrupting it. The panic needs to be acknowledged, not validated with a specific timeframe.",
    };
  }
  if (hadServiceFirst) {
    return {
      category,
      score: 1,
      evidence: "The learner gave information before addressing David's panic.",
      coachingNote:
        'When a family member is in panic mode about timing, acknowledging the panic comes before any information.',
    };
  }
  return {
    category,
    score: 2,
    evidence: 'No strong objection handling pattern was detected.',
    coachingNote:
      'Practice naming the panic directly. Saying what you hear builds trust and opens the door for education.',
  };
}

function scoreComplianceSafeLanguage(
  hadPrognosisPromise: boolean,
  hadMedSafetyEvent: boolean,
  hadClinicalRouting: boolean,
  hadRepairLanguage: boolean
): SkillScore {
  const category = PU_CATEGORIES[3];
  if (hadPrognosisPromise && hadMedSafetyEvent) {
    return {
      category,
      score: 0,
      evidence: 'The learner provided a prognosis estimate and handled a clinical question outside the Clinical Liaison role.',
      coachingNote:
        'Both prognosis estimates and clinical guidance are outside the Clinical Liaison role. Focus on acknowledging, reframing, and routing.',
    };
  }
  if (hadPrognosisPromise) {
    return {
      category,
      score: 1,
      evidence: 'The learner provided a prognosis estimate outside the Clinical Liaison role.',
      coachingNote:
        'Prognosis estimates are outside the Clinical Liaison role. Route the question to the hospice team.',
    };
  }
  if (hadMedSafetyEvent) {
    return {
      category,
      score: 1,
      evidence: 'A clinical question was handled outside the Clinical Liaison role.',
      coachingNote:
        'Validate the concern and route to the hospice team.',
    };
  }
  if (!hadClinicalRouting && !hadPrognosisPromise) {
    return {
      category,
      score: 3,
      evidence: 'The learner stayed within appropriate language throughout the conversation.',
      coachingNote:
        'Clean boundary session. Practice the routing language so it is ready when the clinical signs question arises.',
    };
  }
  return {
    category,
    score: 4,
    evidence: 'The learner stayed within appropriate language and correctly routed the clinical question.',
    coachingNote:
      'This is the Clinical Liaison role at its best.',
  };
}

function scoreClinicalEscalationJudgment(
  hadClinicalRouting: boolean,
  hadPrognosisPromise: boolean,
  hadMedSafetyEvent: boolean
): SkillScore {
  const category = PU_CATEGORIES[4];
  if (hadPrognosisPromise && hadMedSafetyEvent) {
    return {
      category,
      score: 0,
      evidence: 'Clinical questions were handled outside the Clinical Liaison role on more than one occasion.',
      coachingNote:
        'Practice routing clinical questions immediately on the first response.',
    };
  }
  if (hadPrognosisPromise && !hadClinicalRouting) {
    return {
      category,
      score: 1,
      evidence: 'A prognosis question was answered directly outside the Clinical Liaison role.',
      coachingNote:
        'When a prognosis question arises, validate the concern and route it to the hospice team. Answering directly is outside the role.',
    };
  }
  if ((hadPrognosisPromise || hadMedSafetyEvent) && hadClinicalRouting) {
    return {
      category,
      score: 2,
      evidence: 'A clinical question was initially handled outside role, then corrected to routing.',
      coachingNote:
        'Correcting in the moment shows good escalation awareness. Route on the first response.',
    };
  }
  if (hadClinicalRouting) {
    return {
      category,
      score: 4,
      evidence: 'The clinical signs question was correctly routed to the hospice team.',
      coachingNote:
        'This is exactly right. Validating the question and connecting David with the hospice team is the best Clinical Liaison move.',
    };
  }
  return {
    category,
    score: 2,
    evidence: 'No clear clinical escalation was demonstrated in this conversation.',
    coachingNote:
      "Practice the routing response so it is ready when David asks 'what should I watch for?'",
  };
}

function scoreTrustBuilding(
  hadPanicAck: boolean,
  hadPrognosisReframe: boolean,
  hadRepairLanguage: boolean,
  hadPrognosisPromise: boolean
): SkillScore {
  const category = PU_CATEGORIES[5];
  if (hadPanicAck && hadPrognosisReframe && !hadPrognosisPromise) {
    return {
      category,
      score: 4,
      evidence: "The learner acknowledged the panic and reframed the prognosis as an estimate — the two trust-building moves in this scenario.",
      coachingNote:
        "Trust in this scenario comes from being heard and from having the countdown anxiety interrupted. The learner delivered both.",
    };
  }
  if (hadPanicAck && !hadPrognosisPromise) {
    return {
      category,
      score: 3,
      evidence: "David's panic was acknowledged, which helped open the conversation.",
      coachingNote:
        'Good acknowledgment. Pairing it with the prognosis reframe completes the trust arc.',
    };
  }
  if (hadRepairLanguage) {
    return {
      category,
      score: 2,
      evidence: 'The learner used repair language, showing self-awareness.',
      coachingNote:
        'Repair language is a trust-building move. Continue building the habit of acknowledging the emotional concern before information.',
    };
  }
  if (hadPrognosisPromise) {
    return {
      category,
      score: 0,
      evidence: "Providing a prognosis estimate escalated David's panic and damaged trust.",
      coachingNote:
        'When the conversation moves toward specific timeframes, route rather than estimate. The family needs certainty about what will happen next, not about when.',
    };
  }
  return {
    category,
    score: 1,
    evidence: 'No clear trust-building behaviors were detected.',
    coachingNote:
      'Practice the two-move trust sequence: acknowledge the panic, then reframe the prognosis as an estimate.',
  };
}

function scoreRoleBoundarySafety(
  hadPrognosisPromise: boolean,
  hadMedSafetyEvent: boolean,
  hadClinicalRouting: boolean
): SkillScore {
  const category = PU_CATEGORIES[6];
  if (hadPrognosisPromise && hadMedSafetyEvent) {
    return {
      category,
      score: 0,
      evidence: 'Multiple role boundary violations were detected.',
      coachingNote:
        'Prognosis estimates and clinical guidance are outside the Clinical Liaison role. Practice routing on the first response.',
    };
  }
  if (hadPrognosisPromise && !hadClinicalRouting) {
    return {
      category,
      score: 1,
      evidence: 'A prognosis estimate was provided outside the Clinical Liaison role.',
      coachingNote:
        'Prognosis guidance is outside the Clinical Liaison role. Validate the concern and route.',
    };
  }
  if ((hadPrognosisPromise || hadMedSafetyEvent) && hadClinicalRouting) {
    return {
      category,
      score: 2,
      evidence: 'A role boundary issue was detected but corrected to routing language.',
      coachingNote:
        'Good recovery. Aim to route on the first response.',
    };
  }
  if (!hadPrognosisPromise && !hadMedSafetyEvent && !hadClinicalRouting) {
    return {
      category,
      score: 3,
      evidence: 'No role boundary violations. Routing language was not demonstrated.',
      coachingNote:
        'Clean boundary session. Practice the routing language so it is ready when the clinical question arises.',
    };
  }
  return {
    category,
    score: 4,
    evidence: 'The learner stayed within the Clinical Liaison role and correctly routed the clinical question.',
    coachingNote:
      'This is the Clinical Liaison role at its best.',
  };
}

export function generatePrognosticUncertaintySkillScoreReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): SkillScoreReport {
  void conversationMessages;

  const hadPanicAck = hasBehavior(patientStateSnapshots, 'emotional_acknowledgment');
  const hadPrognosisReframe = hasBehavior(patientStateSnapshots, 'prognosis_reframe');
  const hadClinicalRouting = hasBehavior(patientStateSnapshots, 'clinical_routing');
  const hadPrognosisPromise = hasBehavior(patientStateSnapshots, 'prognosis_promise');
  const hadServiceFirst = hasBehavior(patientStateSnapshots, 'service_explanation_before_emotion');
  const hadRepairLanguage = hasBehavior(patientStateSnapshots, 'repair_language');
  const hadMedSafetyEvent = safetyEvents.some(
    (e) =>
      e.violationCategory === 'medication_outside_role'
  );

  const scores: SkillScore[] = [
    scoreEmotionalAttunement(hadPanicAck, hadServiceFirst, hadRepairLanguage, hadPrognosisPromise),
    scorePrognosisEducation(hadPrognosisReframe, hadPrognosisPromise, hadRepairLanguage),
    scoreObjectionHandling(hadPanicAck, hadServiceFirst, hadPrognosisPromise),
    scoreComplianceSafeLanguage(hadPrognosisPromise, hadMedSafetyEvent, hadClinicalRouting, hadRepairLanguage),
    scoreClinicalEscalationJudgment(hadClinicalRouting, hadPrognosisPromise, hadMedSafetyEvent),
    scoreTrustBuilding(hadPanicAck, hadPrognosisReframe, hadRepairLanguage, hadPrognosisPromise),
    scoreRoleBoundarySafety(hadPrognosisPromise, hadMedSafetyEvent, hadClinicalRouting),
  ];

  const overallScore =
    Math.round((scores.reduce((sum, s) => sum + s.score, 0) / scores.length) * 10) / 10;

  const maxScore = Math.max(...scores.map((s) => s.score));
  const minScore = Math.min(...scores.map((s) => s.score));
  const primaryStrength = scores.find((s) => s.score === maxScore)!.category;
  const primaryGrowthArea = scores.find((s) => s.score === minScore)!.category;

  return {
    id: `${Date.now()}-scores`,
    scenarioId,
    overallScore,
    scores,
    primaryStrength,
    primaryGrowthArea,
    createdAt: new Date().toISOString(),
  };
}
