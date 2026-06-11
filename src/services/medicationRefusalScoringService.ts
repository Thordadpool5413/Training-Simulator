import type {
  ConversationMessage,
  PatientStateSnapshot,
  SafetyEvent,
  SkillScore,
  SkillScoreReport,
} from '@/types/simulator';

const MR_CATEGORIES = [
  'Emotional Attunement',
  'Patient Autonomy Education',
  'Communication Strategy',
  'Role Boundary Safety',
  'Caregiver Support',
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

function scoreEmotionalAttunement(
  hadCaregiverAck: boolean,
  hadAutonomyDismissed: boolean,
  hadConsentViolation: boolean
): SkillScore {
  const category = MR_CATEGORIES[0];
  if (hadConsentViolation) {
    return {
      category,
      score: 0,
      evidence: "A suggestion of covert medication administration was detected, which bypasses the caregiver's desperation rather than addressing it.",
      coachingNote:
        "When a caregiver suggests covert administration, the emotional starting point is their desperation. Name that first — then refuse and redirect.",
    };
  }
  if (hadCaregiverAck && !hadAutonomyDismissed) {
    return {
      category,
      score: 4,
      evidence: "The learner acknowledged Michael's distress before moving into education or explanation.",
      coachingNote:
        "Starting with acknowledgment of the caregiver's pain is the right first move. Caregivers watching a loved one refuse comfort care carry enormous guilt.",
    };
  }
  if (hadCaregiverAck && hadAutonomyDismissed) {
    return {
      category,
      score: 2,
      evidence: "The learner acknowledged Michael's distress but also used language that implied he should push harder.",
      coachingNote:
        "Acknowledging distress and then implying the caregiver should override the patient creates a contradictory message. The follow-through should be on the patient's right to choose.",
    };
  }
  if (hadAutonomyDismissed) {
    return {
      category,
      score: 1,
      evidence: "The learner used language that implied Michael should push harder or override Dorothy's decision.",
      coachingNote:
        "When a caregiver is desperate, the instinct to suggest pressure is understandable but counterproductive. The reframe is that honoring Dorothy's choice is one of the most respectful things Michael can do.",
    };
  }
  return {
    category,
    score: 1,
    evidence: "Michael's distress was not directly acknowledged.",
    coachingNote:
      "Michael's opening question — 'Can I just put it in her food?' — was not primarily about technique. It was an expression of helplessness. Naming that first changes the conversation.",
  };
}

function scorePatientAutonomyEducation(
  hadAutonomy: boolean,
  hadAutonomyDismissed: boolean,
  hadConsentViolation: boolean
): SkillScore {
  const category = MR_CATEGORIES[1];
  if (hadConsentViolation) {
    return {
      category,
      score: 0,
      evidence: 'A suggestion of covert administration was made, which violates patient autonomy at the most fundamental level.',
      coachingNote:
        "Covert administration overrides the patient's right to refuse. Even when a caregiver requests it, the RN must refuse clearly and compassionately — then redirect to what can be done.",
    };
  }
  if (hadAutonomy && !hadAutonomyDismissed) {
    return {
      category,
      score: 4,
      evidence: "The learner explained Dorothy's right to refuse medication in plain language.",
      coachingNote:
        "Explaining patient autonomy in hospice is a core RN skill. Michael needed to hear that Dorothy's refusal is not a failure on his part.",
    };
  }
  if (hadAutonomy && hadAutonomyDismissed) {
    return {
      category,
      score: 2,
      evidence: 'Patient autonomy was explained but the learner also used language that implied the patient should be convinced or overridden.',
      coachingNote:
        'Once you establish that Dorothy has the right to refuse, stay consistent with that framing. Implying Michael should push harder pulls the conversation in the opposite direction.',
    };
  }
  if (hadAutonomyDismissed) {
    return {
      category,
      score: 1,
      evidence: "Some language implied that Dorothy's refusal should be overcome rather than honored.",
      coachingNote:
        "In hospice, a patient's right to refuse medication is absolute. Practice framing the refusal as an expression of Dorothy's personhood — not an obstacle to overcome.",
    };
  }
  return {
    category,
    score: 1,
    evidence: 'Patient autonomy was not clearly explained.',
    coachingNote:
      "Practice explaining patient autonomy in plain language: 'Dorothy has the right to refuse. That right belongs to her, not to us.' This is what Michael needed to hear.",
  };
}

function scoreCommunicationStrategy(
  hadStrategy: boolean,
  hadAutonomy: boolean,
  hadConsentViolation: boolean
): SkillScore {
  const category = MR_CATEGORIES[2];
  if (hadConsentViolation) {
    return {
      category,
      score: 0,
      evidence: 'A suggestion of covert administration was made instead of offering communication strategies.',
      coachingNote:
        'Covert administration is never an appropriate strategy. The right move is to give Michael compassionate alternatives — timing, framing, smaller amounts — that respect Dorothy\'s autonomy.',
    };
  }
  if (hadStrategy && hadAutonomy) {
    return {
      category,
      score: 4,
      evidence: 'Patient autonomy was explained and Michael was given practical strategies for offering medication compassionately.',
      coachingNote:
        "This is the complete arc: explain why the refusal is valid, then give Michael something concrete to try. He moves from helplessness to having a plan.",
    };
  }
  if (hadStrategy) {
    return {
      category,
      score: 3,
      evidence: 'Michael was given practical strategies for offering medication without pressure.',
      coachingNote:
        'Good practical guidance. Pairing it with a clear explanation of patient autonomy helps Michael understand why the gentle approach is not just kind — it is the right clinical and ethical framework.',
    };
  }
  if (hadAutonomy) {
    return {
      category,
      score: 2,
      evidence: 'Patient autonomy was explained but no practical strategies for offering medication were provided.',
      coachingNote:
        'Explaining autonomy is essential. Adding a concrete strategy — timing, framing, smaller amounts — gives Michael something actionable and moves him from understanding to action.',
    };
  }
  return {
    category,
    score: 1,
    evidence: 'No practical strategies for offering medication compassionately were provided.',
    coachingNote:
      "Practice offering Michael concrete tools: try a smaller amount, choose a moment when Dorothy seems comfortable, frame it as her choice each time. These give him a role that honors her autonomy.",
  };
}

function scoreRoleBoundarySafety(
  hadConsentSafetyEvent: boolean,
  hadRnMedSafetyEvent: boolean,
  consentEventCount: number,
  rnEventCount: number
): SkillScore {
  const category = MR_CATEGORIES[3];
  if (consentEventCount > 0) {
    return {
      category,
      score: 0,
      evidence: 'A suggestion of covert medication administration was detected, which violates patient rights and may constitute abuse.',
      coachingNote:
        "Covert administration is not permitted under any circumstances. Even when a caregiver requests it, the RN must refuse — compassionately but firmly — and redirect to ethical alternatives.",
    };
  }
  if (rnEventCount > 1) {
    return {
      category,
      score: 0,
      evidence: 'Specific medication dosing was provided outside the scope of the hospice orders more than once.',
      coachingNote:
        'Repeated dose boundary violations require focused practice. Confirm that comfort medications are part of the plan of care and route exact dose questions to the hospice provider.',
    };
  }
  if (hadRnMedSafetyEvent) {
    return {
      category,
      score: 1,
      evidence: 'Specific medication dosing was provided without deferring to the hospice orders.',
      coachingNote:
        'The RN can confirm that comfort medications exist in the plan of care, but specific dose amounts require the hospice orders and on-call provider.',
    };
  }
  if (!hadConsentSafetyEvent && !hadRnMedSafetyEvent) {
    return {
      category,
      score: 4,
      evidence: 'No consent violation or medication dose boundary issue was detected. The learner stayed within the RN scope.',
      coachingNote:
        'Clean boundary session. The RN role in this scenario is to support patient autonomy, provide communication strategies, and involve the team — all within scope.',
    };
  }
  return {
    category,
    score: 3,
    evidence: 'Role boundaries were largely respected in this conversation.',
    coachingNote:
      'Practice making the role boundaries explicit when they come up — not just avoiding violations, but naming what you can and cannot do and why.',
  };
}

function scoreCaregiverSupport(
  hadCaregiverAck: boolean,
  hadStrategy: boolean,
  hadTeamEscalation: boolean,
  hadAutonomyDismissed: boolean,
  hadConsentViolation: boolean
): SkillScore {
  const category = MR_CATEGORIES[4];
  const supportCount = [hadCaregiverAck, hadStrategy, hadTeamEscalation].filter(Boolean).length;

  if (hadConsentViolation || hadAutonomyDismissed) {
    return {
      category,
      score: 0,
      evidence: "The learner suggested an approach that could deepen Michael's guilt rather than relieve it.",
      coachingNote:
        "Covert administration or pressure to override Dorothy's refusal shifts responsibility onto Michael in a way that will create more distress, not less. True caregiver support starts with validating that he is doing the right thing.",
    };
  }
  if (supportCount === 3) {
    return {
      category,
      score: 4,
      evidence: "Michael's distress was acknowledged, practical strategies were provided, and the hospice team was involved.",
      coachingNote:
        "Complete caregiver support arc — Michael left the conversation with his distress heard, a strategy to try, and a clinical team available for ongoing support.",
    };
  }
  if (supportCount === 2) {
    return {
      category,
      score: 3,
      evidence: 'Two of the three caregiver support elements were demonstrated.',
      coachingNote:
        'Strong caregiver support. Adding the missing element — acknowledgment, a practical strategy, or team escalation — completes the arc.',
    };
  }
  if (supportCount === 1) {
    return {
      category,
      score: 2,
      evidence: 'One caregiver support element was demonstrated.',
      coachingNote:
        'A partial support arc is in place. Practice building the full sequence: acknowledge the distress, explain autonomy, give a strategy, and involve the team if needed.',
    };
  }
  return {
    category,
    score: 1,
    evidence: 'No caregiver support behaviors were clearly detected.',
    coachingNote:
      "Michael came into this conversation desperate. The support arc — acknowledging his distress, explaining that honoring Dorothy's choice is right, and giving him something concrete to try — is what helps him leave feeling less helpless.",
  };
}

function scoreClinicalEscalationJudgment(
  hadTeamEscalation: boolean,
  hadRnMedSafetyEvent: boolean,
  hadConsentViolation: boolean
): SkillScore {
  const category = MR_CATEGORIES[5];
  if (hadConsentViolation) {
    return {
      category,
      score: 0,
      evidence: 'A covert administration suggestion was made instead of escalating to the hospice team.',
      coachingNote:
        'When a caregiver suggests covert administration, the right escalation move is to involve the hospice on-call team to review ongoing refusal and explore alternative comfort approaches.',
    };
  }
  if (hadTeamEscalation && !hadRnMedSafetyEvent) {
    return {
      category,
      score: 4,
      evidence: 'The learner offered to involve the hospice on-call team for ongoing medication refusal support.',
      coachingNote:
        'Escalating to the team is exactly right when a patient is refusing medication that is intended for comfort. The team can explore whether there are other approaches Dorothy might accept.',
    };
  }
  if (hadTeamEscalation && hadRnMedSafetyEvent) {
    return {
      category,
      score: 2,
      evidence: 'Team escalation was offered but a medication dose boundary issue occurred earlier in the conversation.',
      coachingNote:
        'Offering team escalation is the right clinical move. Combined with staying within dose scope on the first response, this completes the clinical picture.',
    };
  }
  if (hadRnMedSafetyEvent) {
    return {
      category,
      score: 1,
      evidence: 'A medication dose boundary issue occurred and team escalation was not offered.',
      coachingNote:
        'When a patient is refusing comfort medication, the right escalation is to involve the hospice on-call team — not to provide dose guidance directly. The team can review the comfort plan and explore alternatives.',
    };
  }
  return {
    category,
    score: 2,
    evidence: 'No clinical escalation move was demonstrated in this conversation.',
    coachingNote:
      "Practice offering team escalation when a patient's ongoing refusal affects comfort. This is a clinical situation the team should know about.",
  };
}

function scoreTrustBuilding(
  hadCaregiverAck: boolean,
  hadAutonomy: boolean,
  hadStrategy: boolean,
  hadTeamEscalation: boolean,
  hadConsentViolation: boolean,
  hadAutonomyDismissed: boolean
): SkillScore {
  const category = MR_CATEGORIES[6];

  if (hadConsentViolation) {
    return {
      category,
      score: 0,
      evidence: 'A covert administration suggestion was made, which damages trust in the RN and the hospice team.',
      coachingNote:
        "Trust in this scenario comes from Michael feeling that the RN is honest, on Dorothy's side, and on his side — simultaneously. Covert administration betrays all three.",
    };
  }

  const trustCount = [hadCaregiverAck, hadAutonomy, hadStrategy, hadTeamEscalation].filter(
    Boolean
  ).length;

  if (hadAutonomyDismissed && trustCount < 2) {
    return {
      category,
      score: 1,
      evidence: "Some language may have implied Michael should override Dorothy's decision, which can deepen caregiver guilt.",
      coachingNote:
        "Trust in this scenario is built by helping Michael understand that honoring Dorothy's refusal is not failure — it is care. That reframe is the most trust-building move in the conversation.",
    };
  }

  if (trustCount === 4) {
    return {
      category,
      score: 4,
      evidence: "Michael's distress was acknowledged, patient autonomy was explained, a practical strategy was offered, and the hospice team was involved.",
      coachingNote:
        'Full trust arc for this scenario. Michael left with his distress heard, a framework for Dorothy\'s right to refuse, something to try, and a team behind him.',
    };
  }
  if (trustCount === 3) {
    return {
      category,
      score: 3,
      evidence: 'Three of the four trust-building behaviors were demonstrated.',
      coachingNote: 'Strong trust-building session. Adding the missing element completes the full arc.',
    };
  }
  if (trustCount === 2) {
    return {
      category,
      score: 2,
      evidence: 'Two of the four trust-building behaviors were demonstrated.',
      coachingNote:
        "A partial trust arc is in place. The full sequence is: acknowledge Michael's distress, explain Dorothy's autonomy, give a strategy, involve the team.",
    };
  }
  return {
    category,
    score: 1,
    evidence: 'One or fewer trust-building behaviors were detected.',
    coachingNote:
      "Practice building the trust arc: start with acknowledging Michael's desperation, then explain autonomy, then give him something to try.",
  };
}

export function generateMedicationRefusalSkillScoreReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): SkillScoreReport {
  void conversationMessages;

  const hadCaregiverAck = hasBehavior(patientStateSnapshots, 'caregiver_distress_acknowledged');
  const hadAutonomy = hasBehavior(patientStateSnapshots, 'patient_autonomy_respected');
  const hadStrategy = hasBehavior(patientStateSnapshots, 'communication_strategy_provided');
  const hadTeamEscalation = hasBehavior(patientStateSnapshots, 'team_escalation_offered');
  const hadAutonomyDismissed = hasBehavior(patientStateSnapshots, 'patient_autonomy_dismissed');
  const hadConsentViolation = hasBehavior(patientStateSnapshots, 'consent_violation_suggested');

  const hadConsentSafetyEvent = safetyEvents.some(
    (e) => e.violationCategory === 'patient_consent_violation'
  );
  const hadRnMedSafetyEvent = safetyEvents.some(
    (e) => e.violationCategory === 'rn_medication_dose_outside_orders'
  );
  const consentEventCount = safetyEvents.filter(
    (e) => e.violationCategory === 'patient_consent_violation'
  ).length;
  const rnEventCount = safetyEvents.filter(
    (e) => e.violationCategory === 'rn_medication_dose_outside_orders'
  ).length;

  const hadConsentViolationAny = hadConsentViolation || hadConsentSafetyEvent;

  const hadRecoveryAfterRnEvent = behaviorAppearsAfterFirstSafetyEvent(
    patientStateSnapshots,
    'safe_medication_routing',
    safetyEvents,
    'rn_medication_dose_outside_orders'
  );
  void hadRecoveryAfterRnEvent;

  const scores: SkillScore[] = [
    scoreEmotionalAttunement(hadCaregiverAck, hadAutonomyDismissed, hadConsentViolationAny),
    scorePatientAutonomyEducation(hadAutonomy, hadAutonomyDismissed, hadConsentViolationAny),
    scoreCommunicationStrategy(hadStrategy, hadAutonomy, hadConsentViolationAny),
    scoreRoleBoundarySafety(hadConsentSafetyEvent, hadRnMedSafetyEvent, consentEventCount, rnEventCount),
    scoreCaregiverSupport(hadCaregiverAck, hadStrategy, hadTeamEscalation, hadAutonomyDismissed, hadConsentViolationAny),
    scoreClinicalEscalationJudgment(hadTeamEscalation, hadRnMedSafetyEvent, hadConsentViolationAny),
    scoreTrustBuilding(hadCaregiverAck, hadAutonomy, hadStrategy, hadTeamEscalation, hadConsentViolationAny, hadAutonomyDismissed),
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
