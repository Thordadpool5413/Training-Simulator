import type {
  ConversationMessage,
  PatientStateSnapshot,
  SafetyEvent,
  SkillScore,
  SkillScoreReport,
} from '@/types/simulator';

const PM_CATEGORIES = [
  'Emotional Attunement',
  'Pain Concern Validation',
  'Nurse Routing',
  'Role Boundary Safety',
  'Clinical Escalation Judgment',
  'Trust Building',
  'Hospice Partnership',
] as const;

function hasBehavior(snapshots: PatientStateSnapshot[], behavior: string): boolean {
  return snapshots.some((s) => s.detectedBehaviors.includes(behavior));
}

function scoreEmotionalAttunement(
  hadAngerAck: boolean,
  hadServiceFirst: boolean,
  hadAbandonmentLanguage: boolean,
  hadRepairLanguage: boolean
): SkillScore {
  const category = PM_CATEGORIES[0];
  if (hadAngerAck && !hadServiceFirst && !hadAbandonmentLanguage) {
    return {
      category,
      score: 4,
      evidence: "The learner acknowledged Elena's anger before moving into information or action.",
      coachingNote:
        'Leading with emotional acknowledgment is the right first move when a family member is angry. It opens the door for everything that follows.',
    };
  }
  if (hadAngerAck && hadServiceFirst) {
    return {
      category,
      score: 3,
      evidence: "The learner eventually acknowledged Elena's anger but provided information first.",
      coachingNote:
        "When a family member leads with anger, acknowledge it first. Information lands better after the emotion is heard.",
    };
  }
  if (hadRepairLanguage && !hadAngerAck) {
    return {
      category,
      score: 2,
      evidence: 'The learner used repair language but did not directly acknowledge the anger.',
      coachingNote:
        "Repair language shows self-awareness. The next step is responding to Elena's anger directly before moving into information.",
    };
  }
  if (hadAbandonmentLanguage) {
    return {
      category,
      score: 0,
      evidence: "The learner used language that suggested the pain cannot be addressed, worsening Elena's fear.",
      coachingNote:
        "Avoid framing that suggests nothing more can be done. The fastest recovery is to acknowledge Elena's fear directly and name the next step.",
    };
  }
  return {
    category,
    score: 1,
    evidence: "The learner did not clearly acknowledge Elena's anger or emotional concern.",
    coachingNote:
      "Elena's opening line — 'Are you even doing anything?' — is not a question about services. It is an expression of fear and guilt. Name that before answering.",
  };
}

function scorePainConcernValidation(
  hadPainAck: boolean,
  hadAngerAck: boolean,
  hadAbandonmentLanguage: boolean
): SkillScore {
  const category = PM_CATEGORIES[1];
  if (hadPainAck && hadAngerAck && !hadAbandonmentLanguage) {
    return {
      category,
      score: 4,
      evidence: 'The learner validated the pain concern as legitimate and acknowledged the emotional weight.',
      coachingNote:
        "Naming the pain concern as real and valid — before explaining what will happen next — is what helps Elena move from accusation to collaboration.",
    };
  }
  if (hadPainAck && !hadAbandonmentLanguage) {
    return {
      category,
      score: 3,
      evidence: 'The learner validated the pain concern as a legitimate clinical issue.',
      coachingNote:
        'Good pain concern validation. Pairing it with an acknowledgment of the emotional weight completes the empathy arc.',
    };
  }
  if (hadAbandonmentLanguage) {
    return {
      category,
      score: 0,
      evidence: "The learner used language suggesting the pain is expected or cannot be addressed.",
      coachingNote:
        'In hospice, pain is always a clinical priority. Avoid framing that sounds like suffering is inevitable or unaddressable.',
    };
  }
  return {
    category,
    score: 1,
    evidence: 'The pain concern was not clearly validated as a legitimate clinical issue.',
    coachingNote:
      "Practice naming the concern directly: 'His pain is a real concern and I want to make sure the nurse is aware.' This validates Elena's experience before explaining the plan.",
  };
}

function scoreNurseRouting(
  hadNurseRouting: boolean,
  hadMedSafetyEvent: boolean,
  hadAngerAck: boolean
): SkillScore {
  const category = PM_CATEGORIES[2];
  if (hadNurseRouting && !hadMedSafetyEvent && hadAngerAck) {
    return {
      category,
      score: 4,
      evidence: "The learner acknowledged Elena's anger and routed the pain concern directly to the hospice nurse.",
      coachingNote:
        'This is the strongest move in this scenario. Acknowledging the concern and connecting Elena with the person who can act on it answers both the emotional and clinical question at once.',
    };
  }
  if (hadNurseRouting && !hadMedSafetyEvent) {
    return {
      category,
      score: 3,
      evidence: 'The learner routed the pain concern to the hospice nurse.',
      coachingNote:
        'Nurse routing is the right clinical move. Pairing it with emotional acknowledgment first completes the arc.',
    };
  }
  if (hadNurseRouting && hadMedSafetyEvent) {
    return {
      category,
      score: 2,
      evidence: 'The learner routed to the nurse but initially provided clinical guidance outside the Clinical Liaison role.',
      coachingNote:
        'Correcting to routing language is a strong recovery. The goal is to route on the first response rather than after an initial boundary issue.',
    };
  }
  if (hadMedSafetyEvent) {
    return {
      category,
      score: 1,
      evidence: 'The learner provided clinical pain guidance outside the Clinical Liaison role without routing to the nurse.',
      coachingNote:
        'When a pain concern arises, validate the concern and route directly to the hospice nurse. Pain assessment and management is clinical work.',
    };
  }
  return {
    category,
    score: 1,
    evidence: 'The pain concern was not clearly routed to the hospice nurse.',
    coachingNote:
      "Practice the routing response so it is ready when a clinical pain concern arises. The goal is to validate the concern and connect Elena with the nurse in a single clear move.",
  };
}

function scoreRoleBoundarySafety(
  medEventCount: number,
  hadMedSafetyEvent: boolean,
  hadNurseRouting: boolean
): SkillScore {
  const category = PM_CATEGORIES[3];
  if (medEventCount > 1) {
    return {
      category,
      score: 0,
      evidence: 'Clinical pain guidance was provided outside the Clinical Liaison role more than once.',
      coachingNote:
        'Repeated role boundary violations are the most critical pattern to address. Pain assessment and medication guidance belong with the hospice nurse and provider.',
    };
  }
  if (medEventCount === 1 && !hadNurseRouting) {
    return {
      category,
      score: 1,
      evidence: 'Clinical pain guidance was provided outside the Clinical Liaison role without correcting to nurse routing.',
      coachingNote:
        'Pain management guidance is outside the Clinical Liaison role. Validate the concern and route it to the hospice nurse.',
    };
  }
  if (hadMedSafetyEvent && hadNurseRouting) {
    return {
      category,
      score: 2,
      evidence: 'Clinical pain guidance was initially provided outside the role, but the learner corrected to nurse routing.',
      coachingNote:
        'Recognizing the role boundary and correcting is a strong recovery. Aim to route on the first response.',
    };
  }
  if (!hadMedSafetyEvent && !hadNurseRouting) {
    return {
      category,
      score: 3,
      evidence: 'No clinical pain guidance was provided outside the Clinical Liaison role. Routing language was not demonstrated.',
      coachingNote:
        'Clean boundary session. Practice the nurse routing language so it is ready when a clinical question comes up.',
    };
  }
  return {
    category,
    score: 4,
    evidence: 'The learner stayed within the Clinical Liaison role and correctly routed the pain concern to the hospice nurse.',
    coachingNote:
      'This is exactly right. Validating the concern and routing it protects the family and demonstrates clinical partnership.',
  };
}

function scoreClinicalEscalationJudgment(
  medEventCount: number,
  hadNurseRouting: boolean,
  hadMedSafetyEvent: boolean
): SkillScore {
  const category = PM_CATEGORIES[4];
  if (medEventCount > 1) {
    return {
      category,
      score: 0,
      evidence: 'Pain guidance was given outside the Clinical Liaison role more than once.',
      coachingNote:
        'Repeated escalation failures indicate a pattern of stepping outside the role. Practice routing the clinical question on the first response.',
    };
  }
  if (hadMedSafetyEvent && !hadNurseRouting) {
    return {
      category,
      score: 1,
      evidence: 'A clinical pain question arose and was answered directly outside the Clinical Liaison role.',
      coachingNote:
        'When a family member raises a pain concern, the escalation move is to validate and route — not to assess or advise directly.',
    };
  }
  if (hadMedSafetyEvent && hadNurseRouting) {
    return {
      category,
      score: 2,
      evidence: 'A clinical pain question was initially handled outside role, then corrected to nurse routing.',
      coachingNote:
        'Correcting in the moment shows good escalation awareness. Route on the first response to close the loop cleanly.',
    };
  }
  if (hadNurseRouting) {
    return {
      category,
      score: 4,
      evidence: 'The clinical pain concern was escalated correctly to the hospice nurse without role boundary issues.',
      coachingNote:
        'This is the right escalation pattern — validate the concern and connect the family with the person who can act on it.',
    };
  }
  return {
    category,
    score: 2,
    evidence: 'No clear escalation move was demonstrated in this conversation.',
    coachingNote:
      'Practice the escalation language so it is ready when a pain concern arises. Validate the concern and connect the family with the nurse.',
  };
}

function scoreTrustBuilding(
  hadAngerAck: boolean,
  hadNurseRouting: boolean,
  hadAbandonmentLanguage: boolean,
  hadRepairLanguage: boolean
): SkillScore {
  const category = PM_CATEGORIES[5];
  if (hadAngerAck && hadNurseRouting && !hadAbandonmentLanguage) {
    return {
      category,
      score: 4,
      evidence: "The learner acknowledged Elena's anger and connected her with the hospice nurse — the two moves that most directly build trust.",
      coachingNote:
        "Trust in this scenario comes from two things: feeling heard and seeing that something will happen. The learner delivered both.",
    };
  }
  if (hadAngerAck && !hadAbandonmentLanguage) {
    return {
      category,
      score: 3,
      evidence: "Elena's anger was acknowledged, which helped open the conversation.",
      coachingNote:
        'Good emotional acknowledgment. Pairing it with a clear next step — routing to the nurse — completes the trust arc.',
    };
  }
  if (hadRepairLanguage) {
    return {
      category,
      score: 2,
      evidence: 'The learner used repair language, which shows self-awareness.',
      coachingNote:
        'Repair language is a trust-building move. Continue building the habit of acknowledging the emotional concern before information.',
    };
  }
  if (hadAbandonmentLanguage) {
    return {
      category,
      score: 0,
      evidence: "Language that suggested the pain cannot be addressed damaged trust in the Clinical Liaison and hospice team.",
      coachingNote:
        "When the conversation moves toward 'nothing can be done,' repair it quickly by naming the concern as real and describing the next clinical step.",
    };
  }
  return {
    category,
    score: 1,
    evidence: 'No clear trust-building behaviors were detected.',
    coachingNote:
      'Practice the two-move trust sequence for this scenario: acknowledge the anger, then route to the nurse with a clear next step.',
  };
}

function scoreHospicePartnership(
  hadNurseRouting: boolean,
  hadPainAck: boolean,
  hadAbandonmentLanguage: boolean
): SkillScore {
  const category = PM_CATEGORIES[6];
  if (hadNurseRouting && hadPainAck && !hadAbandonmentLanguage) {
    return {
      category,
      score: 4,
      evidence: 'The learner positioned the hospice team as active clinical partners who will address the pain concern.',
      coachingNote:
        "The Clinical Liaison role is most powerful when it bridges the family's concern and the clinical team's action. This session demonstrated that bridge clearly.",
    };
  }
  if (hadNurseRouting && !hadAbandonmentLanguage) {
    return {
      category,
      score: 3,
      evidence: 'The learner connected Elena with the hospice nurse, demonstrating the team structure.',
      coachingNote:
        "Good partnership framing. Adding explicit validation of Elena's concern — before the routing — helps her hear the referral as action, not dismissal.",
    };
  }
  if (hadAbandonmentLanguage) {
    return {
      category,
      score: 0,
      evidence: "Language used may have made the hospice team appear passive or unable to address the pain.",
      coachingNote:
        'Hospice teams actively manage pain and symptoms. Avoid language that sounds like the team has stepped back. Frame the referral as the team mobilizing to act.',
    };
  }
  return {
    category,
    score: 1,
    evidence: 'The hospice team structure and the Clinical Liaison role were not clearly demonstrated.',
    coachingNote:
      "Practice positioning the Clinical Liaison role as the bridge between Elena's concern and the clinical nurse's action.",
  };
}

export function generatePainManagementSkillScoreReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): SkillScoreReport {
  void conversationMessages;

  const hadAngerAck = hasBehavior(patientStateSnapshots, 'emotional_acknowledgment');
  const hadPainAck = hasBehavior(patientStateSnapshots, 'pain_concern_acknowledged');
  const hadNurseRouting = hasBehavior(patientStateSnapshots, 'safe_medication_routing');
  const hadServiceFirst = hasBehavior(patientStateSnapshots, 'service_explanation_before_emotion');
  const hadAbandonmentLanguage = hasBehavior(patientStateSnapshots, 'abandonment_language');
  const hadRepairLanguage = hasBehavior(patientStateSnapshots, 'repair_language');
  const hadMedSafetyEvent = safetyEvents.some((e) => e.violationCategory === 'medication_outside_role');
  const medEventCount = safetyEvents.filter((e) => e.violationCategory === 'medication_outside_role').length;

  const scores: SkillScore[] = [
    scoreEmotionalAttunement(hadAngerAck, hadServiceFirst, hadAbandonmentLanguage, hadRepairLanguage),
    scorePainConcernValidation(hadPainAck, hadAngerAck, hadAbandonmentLanguage),
    scoreNurseRouting(hadNurseRouting, hadMedSafetyEvent, hadAngerAck),
    scoreRoleBoundarySafety(medEventCount, hadMedSafetyEvent, hadNurseRouting),
    scoreClinicalEscalationJudgment(medEventCount, hadNurseRouting, hadMedSafetyEvent),
    scoreTrustBuilding(hadAngerAck, hadNurseRouting, hadAbandonmentLanguage, hadRepairLanguage),
    scoreHospicePartnership(hadNurseRouting, hadPainAck, hadAbandonmentLanguage),
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
