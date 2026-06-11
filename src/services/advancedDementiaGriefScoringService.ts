import type {
  ConversationMessage,
  PatientStateSnapshot,
  SafetyEvent,
  SkillScore,
  SkillScoreReport,
} from '@/types/simulator';

const ADG_CATEGORIES = [
  'Emotional Attunement',
  'Grief Acknowledgment',
  'Hospice Education',
  'Role Boundary Safety',
  'Clinical Escalation Judgment',
  'Trust Building',
  'Revocation Education',
] as const;

function hasBehavior(snapshots: PatientStateSnapshot[], behavior: string): boolean {
  return snapshots.some((s) => s.detectedBehaviors.includes(behavior));
}

function scoreEmotionalAttunement(
  hadEmotionalAck: boolean,
  hadGriefAck: boolean,
  hadServiceFirst: boolean,
  hadAbandonmentLanguage: boolean
): SkillScore {
  const category = ADG_CATEGORIES[0];
  if ((hadGriefAck || hadEmotionalAck) && !hadServiceFirst && !hadAbandonmentLanguage) {
    return {
      category,
      score: 4,
      evidence: "The learner acknowledged Anne's emotional concern before providing any information.",
      coachingNote:
        "Anne's opening was grief, not a question about services. Acknowledging the grief first is the only move that opens this conversation.",
    };
  }
  if ((hadGriefAck || hadEmotionalAck) && hadServiceFirst) {
    return {
      category,
      score: 3,
      evidence: "The learner eventually acknowledged Anne's grief but provided information first.",
      coachingNote:
        "The acknowledgment helped shift the conversation. Leading with the emotional concern first has a stronger impact in grief-heavy scenarios.",
    };
  }
  if (hadAbandonmentLanguage) {
    return {
      category,
      score: 0,
      evidence: "The learner used language that reinforced Anne's fear of abandonment.",
      coachingNote:
        "Every word in this scenario needs to push against the abandonment fear, not confirm it. Repair immediately when abandonment framing appears.",
    };
  }
  return {
    category,
    score: 1,
    evidence: "The learner did not clearly acknowledge Anne's grief.",
    coachingNote:
      "The phrase 'burying her twice' is a profound grief expression. Name the grief before offering anything else.",
  };
}

function scoreGriefAcknowledgment(
  hadGriefAck: boolean,
  hadEmotionalAck: boolean,
  hadAbandonmentLanguage: boolean
): SkillScore {
  const category = ADG_CATEGORIES[1];
  if (hadGriefAck && !hadAbandonmentLanguage) {
    return {
      category,
      score: 4,
      evidence: 'The learner specifically named the ambiguous loss experience — mourning someone who is still alive.',
      coachingNote:
        "Naming the specific form of grief Anne is experiencing — ambiguous loss — is what makes her feel seen rather than processed. This is the highest-value move in this scenario.",
    };
  }
  if (hadEmotionalAck && !hadGriefAck && !hadAbandonmentLanguage) {
    return {
      category,
      score: 2,
      evidence: "The learner acknowledged Anne's emotional concern but did not name the specific grief experience.",
      coachingNote:
        "General empathy acknowledgment is good. Adding specificity — naming the experience of grieving someone who is still alive — makes the acknowledgment significantly more powerful.",
    };
  }
  if (hadAbandonmentLanguage) {
    return {
      category,
      score: 0,
      evidence: "The learner used language that confirmed Anne's fear of abandonment.",
      coachingNote:
        "Abandonment language is the most damaging pattern in this scenario. The antidote is naming the specific grief and immediately reframing hospice as presence and support.",
    };
  }
  return {
    category,
    score: 1,
    evidence: 'The grief was not acknowledged in this conversation.',
    coachingNote:
      "Practice naming ambiguous loss specifically: 'What you are describing — mourning someone who is still alive — is one of the hardest kinds of grief there is, and it is real.'",
  };
}

function scoreHospiceEducation(
  hadHospiceReframe: boolean,
  hadAbandonmentLanguage: boolean,
  hadRepairLanguage: boolean
): SkillScore {
  const category = ADG_CATEGORIES[2];
  if (hadHospiceReframe && !hadAbandonmentLanguage) {
    return {
      category,
      score: 4,
      evidence: 'The learner reframed hospice as dignity, presence, and continued support.',
      coachingNote:
        "Strong hospice framing for the dementia context. Anne's fear is abandonment — every word of the reframe pushes against that fear.",
    };
  }
  if (hadHospiceReframe && hadAbandonmentLanguage) {
    return {
      category,
      score: 2,
      evidence: 'The learner reframed hospice but also used language that may have reinforced the abandonment fear.',
      coachingNote:
        "Hospice reframing and abandonment language are contradictory. Once a reframe is established, keep the language consistent.",
    };
  }
  if (hadAbandonmentLanguage && hadRepairLanguage) {
    return {
      category,
      score: 1,
      evidence: 'The learner used abandonment-sounding language and then attempted to repair it.',
      coachingNote:
        "Repair language after abandonment framing is a strong recovery move in this scenario. Aim to avoid the abandonment language entirely.",
    };
  }
  if (hadAbandonmentLanguage) {
    return {
      category,
      score: 0,
      evidence: "Language that implied nothing can be done confirmed Anne's fear of giving up.",
      coachingNote:
        'In the dementia grief scenario, abandonment language is the most damaging pattern. Every sentence should push toward presence and support.',
    };
  }
  return {
    category,
    score: 2,
    evidence: 'Hospice was not clearly reframed as continued support in this conversation.',
    coachingNote:
      "Practice the dementia hospice reframe: 'Choosing hospice does not mean giving up on her. It means bringing in support so you can be present with her instead of carrying everything alone.'",
  };
}

function scoreRoleBoundarySafety(
  hadMedSafetyEvent: boolean,
  hadAbandonmentLanguage: boolean,
  hadRepairLanguage: boolean
): SkillScore {
  const category = ADG_CATEGORIES[3];
  if (hadMedSafetyEvent && hadAbandonmentLanguage) {
    return {
      category,
      score: 0,
      evidence: 'Role boundary violations and abandonment language were both detected.',
      coachingNote:
        'Focus on acknowledgment and hospice reframing. Clinical and medication questions belong with the hospice team.',
    };
  }
  if (hadMedSafetyEvent) {
    return {
      category,
      score: 1,
      evidence: 'A clinical question was handled outside the Clinical Liaison role.',
      coachingNote:
        'Validate the concern and route to the hospice nurse or provider.',
    };
  }
  if (hadAbandonmentLanguage && !hadRepairLanguage) {
    return {
      category,
      score: 1,
      evidence: "Abandonment language reinforced the family's fear and is outside the Clinical Liaison role framing.",
      coachingNote:
        'The Clinical Liaison role requires language that consistently positions hospice as support, not withdrawal of care.',
    };
  }
  if (hadAbandonmentLanguage && hadRepairLanguage) {
    return {
      category,
      score: 2,
      evidence: 'Abandonment language was detected and then repaired.',
      coachingNote:
        'Catching and correcting abandonment language is a strong recovery. Aim to avoid it entirely.',
    };
  }
  return {
    category,
    score: 4,
    evidence: 'The learner maintained appropriate Clinical Liaison language throughout.',
    coachingNote:
      'Clean role boundary session. No abandonment framing and no clinical boundary issues detected.',
  };
}

function scoreClinicalEscalationJudgment(
  hadMedSafetyEvent: boolean,
  hadRepairLanguage: boolean
): SkillScore {
  const category = ADG_CATEGORIES[4];
  if (hadMedSafetyEvent) {
    return {
      category,
      score: 1,
      evidence: 'A clinical question was handled directly rather than routed.',
      coachingNote:
        'Clinical questions in this scenario belong with the hospice team. Validate and route.',
    };
  }
  if (hadRepairLanguage) {
    return {
      category,
      score: 3,
      evidence: 'The learner self-corrected during the conversation, showing good escalation awareness.',
      coachingNote:
        'Good self-awareness. Continue building the instinct to route clinical concerns immediately.',
    };
  }
  return {
    category,
    score: 3,
    evidence: 'No clinical escalation situation was triggered in this conversation.',
    coachingNote:
      'Clean session. Practice the routing language so it is ready when clinical questions about dementia progression arise.',
  };
}

function scoreTrustBuilding(
  hadGriefAck: boolean,
  hadEmotionalAck: boolean,
  hadHospiceReframe: boolean,
  hadAbandonmentLanguage: boolean,
  hadRepairLanguage: boolean
): SkillScore {
  const category = ADG_CATEGORIES[5];
  if ((hadGriefAck || hadEmotionalAck) && hadHospiceReframe && !hadAbandonmentLanguage) {
    return {
      category,
      score: 4,
      evidence: "The learner acknowledged Anne's grief and reframed hospice as continued presence and dignity.",
      coachingNote:
        "Trust in this scenario comes from feeling understood in a grief experience that has no category, and then hearing that the choice she is considering is not abandonment.",
    };
  }
  if ((hadGriefAck || hadEmotionalAck) && !hadAbandonmentLanguage) {
    return {
      category,
      score: 3,
      evidence: "Anne's grief was acknowledged, which helped open the conversation.",
      coachingNote:
        'Good acknowledgment. Pairing it with the hospice reframe completes the trust arc.',
    };
  }
  if (hadRepairLanguage) {
    return {
      category,
      score: 2,
      evidence: 'The learner used repair language, showing self-awareness.',
      coachingNote:
        'Repair language is a trust-building move. Continue building toward the full grief acknowledgment and reframe arc.',
    };
  }
  if (hadAbandonmentLanguage) {
    return {
      category,
      score: 0,
      evidence: "Language that confirmed the abandonment fear broke trust.",
      coachingNote:
        "In the dementia grief scenario, abandonment language is the most trust-damaging pattern. Repair it quickly and reframe toward presence and support.",
    };
  }
  return {
    category,
    score: 1,
    evidence: 'No clear trust-building behaviors were detected.',
    coachingNote:
      'Practice the two-move trust sequence: name the grief specifically, then reframe hospice as presence and dignity.',
  };
}

function scoreRevocationEducation(
  hadRevocation: boolean,
  hadAbandonmentLanguage: boolean
): SkillScore {
  const category = ADG_CATEGORIES[6];
  if (hadRevocation && !hadAbandonmentLanguage) {
    return {
      category,
      score: 4,
      evidence: 'The learner explained that the hospice election can be revoked at any time.',
      coachingNote:
        "The revocation right often gives families permission to take the first step. 'You can always change your mind' reduces the permanence fear that is blocking readiness.",
    };
  }
  if (hadRevocation && hadAbandonmentLanguage) {
    return {
      category,
      score: 2,
      evidence: 'The learner explained the revocation right but also used abandonment-sounding language.',
      coachingNote:
        "The revocation explanation is undercut when abandonment language appears elsewhere. Keep the full message consistent.",
    };
  }
  if (hadAbandonmentLanguage) {
    return {
      category,
      score: 0,
      evidence: 'Abandonment language made the revocation point less accessible.',
      coachingNote:
        'In the dementia grief scenario, the revocation explanation is most powerful when paired with clear hospice reframing — not abandonment language.',
    };
  }
  return {
    category,
    score: 1,
    evidence: 'The revocation right was not explained in this conversation.',
    coachingNote:
      "Practice introducing revocation early: 'Choosing hospice is not a permanent decision. You can revoke the election at any time if something changes.' This is often what allows a hesitant family member to take the first step.",
  };
}

export function generateAdvancedDementiaGriefSkillScoreReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): SkillScoreReport {
  void conversationMessages;

  const hadGriefAck = hasBehavior(patientStateSnapshots, 'grief_normalization');
  const hadEmotionalAck = hasBehavior(patientStateSnapshots, 'emotional_acknowledgment');
  const hadHospiceReframe = hasBehavior(patientStateSnapshots, 'hospice_reframe');
  const hadRevocation = hasBehavior(patientStateSnapshots, 'revocation_education');
  const hadServiceFirst = hasBehavior(patientStateSnapshots, 'service_explanation_before_emotion');
  const hadAbandonmentLanguage = hasBehavior(patientStateSnapshots, 'abandonment_language');
  const hadRepairLanguage = hasBehavior(patientStateSnapshots, 'repair_language');
  const hadMedSafetyEvent = safetyEvents.some((e) => e.violationCategory === 'medication_outside_role');

  const scores: SkillScore[] = [
    scoreEmotionalAttunement(hadEmotionalAck, hadGriefAck, hadServiceFirst, hadAbandonmentLanguage),
    scoreGriefAcknowledgment(hadGriefAck, hadEmotionalAck, hadAbandonmentLanguage),
    scoreHospiceEducation(hadHospiceReframe, hadAbandonmentLanguage, hadRepairLanguage),
    scoreRoleBoundarySafety(hadMedSafetyEvent, hadAbandonmentLanguage, hadRepairLanguage),
    scoreClinicalEscalationJudgment(hadMedSafetyEvent, hadRepairLanguage),
    scoreTrustBuilding(hadGriefAck, hadEmotionalAck, hadHospiceReframe, hadAbandonmentLanguage, hadRepairLanguage),
    scoreRevocationEducation(hadRevocation, hadAbandonmentLanguage),
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
