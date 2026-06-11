import type {
  ConversationMessage,
  PatientStateSnapshot,
  SafetyEvent,
  SkillScore,
  SkillScoreReport,
} from '@/types/simulator';

const ESRD_CATEGORIES = [
  'Emotional Attunement',
  'Autonomy Advocacy',
  'Values Elicitation',
  'Conflict Mediation',
  'Role Boundary Safety',
  'Clinical Escalation Judgment',
  'Trust Building',
] as const;

function hasBehavior(snapshots: PatientStateSnapshot[], behavior: string): boolean {
  return snapshots.some((s) => s.detectedBehaviors.includes(behavior));
}

function scoreEmotionalAttunement(
  hadEmotionalAck: boolean,
  hadSidesTaken: boolean,
  hadRepairLanguage: boolean,
  hadDirectivePressure: boolean
): SkillScore {
  const category = ESRD_CATEGORIES[0];
  if (hadEmotionalAck && !hadSidesTaken && !hadDirectivePressure) {
    return {
      category,
      score: 4,
      evidence: "The learner acknowledged James's fear and grief before moving into education or mediation.",
      coachingNote:
        "James's anger is fear. Acknowledging that first is what allows the conversation to move forward.",
    };
  }
  if (hadEmotionalAck && (hadSidesTaken || hadDirectivePressure)) {
    return {
      category,
      score: 2,
      evidence: "The learner acknowledged James's emotional concern but also took a side or applied pressure.",
      coachingNote:
        'Good instinct toward acknowledgment. Keep the neutrality — acknowledging the fear and then taking sides undermines what the acknowledgment built.',
    };
  }
  if (hadRepairLanguage) {
    return {
      category,
      score: 2,
      evidence: 'The learner used repair language but did not directly acknowledge the emotional concern.',
      coachingNote:
        "Repair language shows self-awareness. Follow it with a direct acknowledgment of James's fear.",
    };
  }
  if (hadSidesTaken || hadDirectivePressure) {
    return {
      category,
      score: 0,
      evidence: "The learner took a position against the patient or pressured James toward a specific outcome.",
      coachingNote:
        'The Social Worker role requires emotional attunement without taking sides. Name the fear; do not direct.',
    };
  }
  return {
    category,
    score: 1,
    evidence: "The learner did not clearly acknowledge James's grief or fear.",
    coachingNote:
      "James's anger is grief and helplessness wrapped in urgency. Name what you hear under the anger before explaining anything.",
  };
}

function scoreAutonomyAdvocacy(
  hadAutonomy: boolean,
  hadSidesTaken: boolean,
  hadCapacityDetermination: boolean,
  hadDirectivePressure: boolean
): SkillScore {
  const category = ESRD_CATEGORIES[1];
  if (hadAutonomy && !hadSidesTaken && !hadCapacityDetermination && !hadDirectivePressure) {
    return {
      category,
      score: 4,
      evidence: "The learner explained patient autonomy in plain language while maintaining neutrality.",
      coachingNote:
        "Autonomy advocacy means explaining the right without taking sides. The learner did this correctly.",
    };
  }
  if (hadAutonomy && (hadSidesTaken || hadCapacityDetermination)) {
    return {
      category,
      score: 2,
      evidence: "The learner explained autonomy but also made a clinical judgment or took a side.",
      coachingNote:
        'Explaining autonomy and then undermining it with a clinical determination or taking sides sends a conflicting message.',
    };
  }
  if (hadSidesTaken) {
    return {
      category,
      score: 0,
      evidence: "The learner appeared to take James's side against the patient's autonomous choice.",
      coachingNote:
        "Autonomy advocacy means protecting the patient's right to self-determination. Taking a family member's side against that right is the opposite of this skill.",
    };
  }
  if (hadCapacityDetermination) {
    return {
      category,
      score: 1,
      evidence: 'The learner made a clinical determination about capacity rather than explaining autonomy.',
      coachingNote:
        'Capacity assessment is a clinical function. Explain the right to refuse treatment and route capacity questions to the clinical team.',
    };
  }
  return {
    category,
    score: 1,
    evidence: 'Patient autonomy was not clearly explained in this conversation.',
    coachingNote:
      "Practice the autonomy explanation: 'Your father has the right to refuse any medical treatment. That right belongs to him as long as he is able to make decisions for himself.'",
  };
}

function scoreValuesElicitation(
  hadValues: boolean,
  hadEmotionalAck: boolean,
  hadSidesTaken: boolean
): SkillScore {
  const category = ESRD_CATEGORIES[2];
  if (hadValues && hadEmotionalAck && !hadSidesTaken) {
    return {
      category,
      score: 4,
      evidence: "The learner invited exploration of the patient's values after acknowledging James's emotional concern.",
      coachingNote:
        "Values elicitation after emotional acknowledgment is the move that shifts James from opposition to curiosity about his father's perspective.",
    };
  }
  if (hadValues && !hadSidesTaken) {
    return {
      category,
      score: 3,
      evidence: "The learner invited exploration of the patient's values.",
      coachingNote:
        "Good values elicitation. Pairing it with emotional acknowledgment first completes the arc.",
    };
  }
  if (hadSidesTaken) {
    return {
      category,
      score: 0,
      evidence: "The learner took a side, which prevents values elicitation from being meaningful.",
      coachingNote:
        "Values elicitation requires neutrality. Once a side is taken, the family cannot trust that the values conversation is genuine.",
    };
  }
  return {
    category,
    score: 1,
    evidence: "The patient's values and stated wishes were not elicited in this conversation.",
    coachingNote:
      "Practice asking: 'What has your father told you about why he made this choice? What matters most to him?' This is the move that invites James into his father's perspective.",
  };
}

function scoreConflictMediation(
  hadEmotionalAck: boolean,
  hadFamilyMeeting: boolean,
  hadSidesTaken: boolean,
  hadDirectivePressure: boolean
): SkillScore {
  const category = ESRD_CATEGORIES[3];
  if (hadEmotionalAck && hadFamilyMeeting && !hadSidesTaken && !hadDirectivePressure) {
    return {
      category,
      score: 4,
      evidence: "The learner acknowledged James's distress and offered to facilitate a family conversation — the core conflict mediation moves.",
      coachingNote:
        "Strong mediation. Acknowledging both the family's distress and offering a structured space to process it is the Social Worker role at its best.",
    };
  }
  if (hadEmotionalAck && !hadSidesTaken && !hadDirectivePressure) {
    return {
      category,
      score: 3,
      evidence: "The learner acknowledged James's distress without taking sides.",
      coachingNote:
        'Good neutral acknowledgment. Adding a family meeting offer gives James a concrete next step and demonstrates the mediation role.',
    };
  }
  if (hadSidesTaken || hadDirectivePressure) {
    return {
      category,
      score: 0,
      evidence: "The learner took a side or applied pressure, undermining mediation.",
      coachingNote:
        'Conflict mediation requires neutrality. Taking a side or directing an outcome ends the mediation role.',
    };
  }
  if (hadFamilyMeeting) {
    return {
      category,
      score: 3,
      evidence: 'The learner offered to facilitate a family conversation.',
      coachingNote:
        'Good mediation offer. Pairing it with emotional acknowledgment first completes the arc.',
    };
  }
  return {
    category,
    score: 1,
    evidence: 'No clear conflict mediation behaviors were detected.',
    coachingNote:
      'Practice the two mediation moves: acknowledge the conflict and distress, then offer a structured space — a family meeting or conversation — where the feelings can be heard safely.',
  };
}

function scoreRoleBoundarySafety(
  hadSidesTaken: boolean,
  hadCapacityDetermination: boolean,
  hadMedSafetyEvent: boolean,
  hadDirectivePressure: boolean
): SkillScore {
  const category = ESRD_CATEGORIES[4];
  const violationCount = [hadSidesTaken, hadCapacityDetermination, hadMedSafetyEvent, hadDirectivePressure].filter(Boolean).length;
  if (violationCount > 1) {
    return {
      category,
      score: 0,
      evidence: 'Multiple role boundary violations were detected.',
      coachingNote:
        'The Social Worker role does not include taking sides, making clinical determinations, or directing outcomes. Focus on acknowledgment, autonomy explanation, and facilitation.',
    };
  }
  if (hadSidesTaken) {
    return {
      category,
      score: 1,
      evidence: "The learner appeared to take James's side against his father.",
      coachingNote:
        'Neutrality is the Social Worker role boundary. Validate the family member without validating the position against the patient.',
    };
  }
  if (hadCapacityDetermination) {
    return {
      category,
      score: 1,
      evidence: 'The learner made a clinical determination about the patient.',
      coachingNote:
        'Capacity assessment is a clinical function. Route it to the clinical team.',
    };
  }
  if (hadMedSafetyEvent) {
    return {
      category,
      score: 1,
      evidence: 'A clinical question was handled outside the Social Worker role.',
      coachingNote:
        'Route clinical questions to the appropriate team member.',
    };
  }
  if (hadDirectivePressure) {
    return {
      category,
      score: 2,
      evidence: 'The learner directed James toward a specific outcome rather than facilitating.',
      coachingNote:
        'The Social Worker facilitates — it does not direct. Families need to arrive at their own conclusions.',
    };
  }
  return {
    category,
    score: 4,
    evidence: 'The learner maintained the Social Worker role throughout the conversation.',
    coachingNote:
      'Clean role boundary session. Acknowledging, explaining, and facilitating without taking sides or making clinical determinations.',
  };
}

function scoreClinicalEscalationJudgment(
  hadClinicalRouting: boolean,
  hadCapacityDetermination: boolean,
  hadMedSafetyEvent: boolean
): SkillScore {
  const category = ESRD_CATEGORIES[5];
  if (hadCapacityDetermination || hadMedSafetyEvent) {
    return {
      category,
      score: 1,
      evidence: 'A clinical question was handled directly rather than routed.',
      coachingNote:
        'When capacity or clinical questions arise, validate the concern and route to the care team. Do not assess or advise directly.',
    };
  }
  if (hadClinicalRouting) {
    return {
      category,
      score: 4,
      evidence: 'The learner correctly routed clinical questions to the appropriate team member.',
      coachingNote:
        'Routing clinical questions is exactly right. Validate the concern and connect the family with the person who can address it.',
    };
  }
  return {
    category,
    score: 2,
    evidence: 'No clinical escalation was clearly demonstrated in this conversation.',
    coachingNote:
      "Practice the routing language for capacity questions: 'Whether your father has the ability to make this decision is something his care team needs to assess — I will make sure that happens.'",
  };
}

function scoreTrustBuilding(
  hadEmotionalAck: boolean,
  hadAutonomy: boolean,
  hadValues: boolean,
  hadSidesTaken: boolean,
  hadRepairLanguage: boolean
): SkillScore {
  const category = ESRD_CATEGORIES[6];
  if (hadEmotionalAck && hadAutonomy && hadValues && !hadSidesTaken) {
    return {
      category,
      score: 4,
      evidence: "The learner acknowledged James's fear, explained autonomy, and invited values exploration — the complete trust arc.",
      coachingNote:
        "Trust in this scenario comes from feeling heard without feeling judged, and from understanding that the Social Worker is trying to serve everyone in the room.",
    };
  }
  if (hadEmotionalAck && !hadSidesTaken) {
    return {
      category,
      score: 3,
      evidence: "James's emotional concern was acknowledged, which helped open the conversation.",
      coachingNote:
        'Good acknowledgment. Pairing it with autonomy explanation and values elicitation completes the trust arc.',
    };
  }
  if (hadRepairLanguage) {
    return {
      category,
      score: 2,
      evidence: 'The learner used repair language, showing self-awareness.',
      coachingNote:
        'Repair language is a trust signal. Continue building toward the full acknowledgment arc.',
    };
  }
  if (hadSidesTaken) {
    return {
      category,
      score: 0,
      evidence: "The learner took a side, which undermines trust with both James and the broader care system.",
      coachingNote:
        'Once neutrality is lost, trust in the Social Worker as a mediator is very difficult to recover.',
    };
  }
  return {
    category,
    score: 1,
    evidence: 'No clear trust-building behaviors were detected.',
    coachingNote:
      "Practice the three-move trust sequence: acknowledge James's fear, explain autonomy plainly, invite his father's perspective through values elicitation.",
  };
}

export function generateEsrdComfortCareSkillScoreReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): SkillScoreReport {
  void conversationMessages;

  const hadEmotionalAck = hasBehavior(patientStateSnapshots, 'emotional_acknowledgment');
  const hadAutonomy = hasBehavior(patientStateSnapshots, 'autonomy_respected');
  const hadValues = hasBehavior(patientStateSnapshots, 'values_elicitation');
  const hadFamilyMeeting = hasBehavior(patientStateSnapshots, 'family_meeting_offered');
  const hadClinicalRouting = hasBehavior(patientStateSnapshots, 'clinical_routing');
  const hadSidesTaken = hasBehavior(patientStateSnapshots, 'sides_taken');
  const hadCapacityDetermination = hasBehavior(patientStateSnapshots, 'capacity_determination');
  const hadDirectivePressure = hasBehavior(patientStateSnapshots, 'directive_pressure');
  const hadRepairLanguage = hasBehavior(patientStateSnapshots, 'repair_language');
  const hadMedSafetyEvent = safetyEvents.some((e) => e.violationCategory === 'medication_outside_role');

  const scores: SkillScore[] = [
    scoreEmotionalAttunement(hadEmotionalAck, hadSidesTaken, hadRepairLanguage, hadDirectivePressure),
    scoreAutonomyAdvocacy(hadAutonomy, hadSidesTaken, hadCapacityDetermination, hadDirectivePressure),
    scoreValuesElicitation(hadValues, hadEmotionalAck, hadSidesTaken),
    scoreConflictMediation(hadEmotionalAck, hadFamilyMeeting, hadSidesTaken, hadDirectivePressure),
    scoreRoleBoundarySafety(hadSidesTaken, hadCapacityDetermination, hadMedSafetyEvent, hadDirectivePressure),
    scoreClinicalEscalationJudgment(hadClinicalRouting, hadCapacityDetermination, hadMedSafetyEvent),
    scoreTrustBuilding(hadEmotionalAck, hadAutonomy, hadValues, hadSidesTaken, hadRepairLanguage),
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
