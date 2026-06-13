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

function scoreEmotionalAttunement(
  hadFearAck: boolean,
  hadAirHungerExp: boolean,
  hadMinimizerOrUnsafe: boolean,
  hadSupportiveBehavior: boolean
): SkillScore {
  const category = RN_CATEGORIES[0];

  // Score 0: minimizing or unsafe behavior occurred and no fear acknowledgment
  if (hadMinimizerOrUnsafe && !hadFearAck) {
    return {
      category,
      score: 0,
      evidence: "The learner used language that may have overstated certainty or introduced unsafe framing without acknowledging the caregiver's fear.",
      coachingNote: "When unsafe or minimizing language appears, the fastest recovery is to name the caregiver's fear directly and correct the framing before continuing.",
    };
  }

  // Score 4: fear acknowledged, air hunger explained, no minimizing
  if (hadFearAck && hadAirHungerExp && !hadMinimizerOrUnsafe) {
    return {
      category,
      score: 4,
      evidence: "The learner acknowledged Margaret's fear and followed it with a plain language explanation of what Harold is experiencing.",
      coachingNote: 'Combining emotional acknowledgment with a clear clinical explanation is the strongest way to help a caregiver move from panic to informed action.',
    };
  }

  // Score 3: fear acknowledged, no minimizing
  if (hadFearAck && !hadMinimizerOrUnsafe) {
    return {
      category,
      score: 3,
      evidence: "The learner acknowledged Margaret's fear, which helped establish emotional safety in the conversation.",
      coachingNote: 'The acknowledgment was the right first move. The next step is pairing it with a plain language explanation of what air hunger is and why it looks the way it does.',
    };
  }

  // Score 2: no fear ack, no minimizing, at least one supportive clinical behavior
  if (!hadFearAck && !hadMinimizerOrUnsafe && hadSupportiveBehavior) {
    return {
      category,
      score: 2,
      evidence: 'The learner provided clinical support without directly naming the fear in the room.',
      coachingNote: "Clinical information is easier to receive after the fear is acknowledged. A brief phrase that names what Margaret is experiencing opens the door for everything that follows.",
    };
  }

  // Score 1: no meaningful emotional or supportive behavior, no minimizing
  return {
    category,
    score: 1,
    evidence: 'No clear emotional acknowledgment or supportive clinical behavior was detected.',
    coachingNote: "Practice naming the emotional concern directly. Margaret's opening statement is a statement of terror, not a request for information.",
  };
}

function scoreSymptomCommunication(
  hadAirHungerExp: boolean,
  hadPlainLanguage: boolean,
  hadComfortEd: boolean,
  hadFearAck: boolean,
  hadOverpromise: boolean
): SkillScore {
  const category = RN_CATEGORIES[1];

  // Score 0: overpromise present
  if (hadOverpromise) {
    return {
      category,
      score: 0,
      evidence: "The learner overstated certainty about what an intervention would achieve, which may have raised expectations that are difficult to meet.",
      coachingNote: 'Avoid promising that medication or intervention will eliminate the breathing difficulty. The honest and more helpful framing is that it may ease the sensation without guaranteeing full relief.',
    };
  }

  // Score 4: air hunger explanation in plain language
  if (hadAirHungerExp && hadPlainLanguage) {
    return {
      category,
      score: 4,
      evidence: 'Air hunger was explained in plain and compassionate language, helping Margaret understand what Harold is experiencing.',
      coachingNote: 'This is the clearest way to help a caregiver stay present rather than panic. Plain language explanation is one of the most important skills in this scenario.',
    };
  }

  // Score 3: air hunger explained
  if (hadAirHungerExp) {
    return {
      category,
      score: 3,
      evidence: 'Air hunger was explained, giving Margaret a way to understand what Harold is experiencing.',
      coachingNote: 'Strong symptom communication. Continue to use plain everyday language so the explanation is accessible to caregivers without clinical backgrounds.',
    };
  }

  // Score 2: comfort education present, no air hunger explanation
  if (hadComfortEd) {
    return {
      category,
      score: 2,
      evidence: 'Comfort tools were described but air hunger was not explained in plain language.',
      coachingNote: 'Comfort tools are more meaningful when paired with an explanation of what is happening. Describing the air hunger experience gives the tools context.',
    };
  }

  // Score 1: fear acknowledged, no symptom explanation
  if (hadFearAck) {
    return {
      category,
      score: 1,
      evidence: "Margaret's fear was acknowledged but the learner did not explain what air hunger is or why Harold appears the way he does.",
      coachingNote: 'After acknowledging the fear, the next move is explaining what air hunger is in plain language. This is the information Margaret needs most.',
    };
  }

  return {
    category,
    score: 1,
    evidence: 'No symptom explanation or emotional response was clearly detected.',
    coachingNote: 'Practice explaining air hunger in everyday language — what the body is doing, why oxygen may not fully relieve it, and how this is different from suffocation.',
  };
}

function scoreComfortEducation(
  hadComfortEd: boolean,
  hadCaregiverEmpow: boolean,
  hadFearAck: boolean,
  hadOverpromise: boolean
): SkillScore {
  const category = RN_CATEGORIES[2];

  // Score 0: overpromise present
  if (hadOverpromise) {
    return {
      category,
      score: 0,
      evidence: "The learner overstated what comfort measures would achieve, which may reduce the caregiver's trust if the episode continues.",
      coachingNote: 'Comfort education is strongest when it is honest about what the tools can and cannot do. Overpromising replaces fear with a different kind of vulnerability.',
    };
  }

  // Score 4: comfort education and caregiver empowerment
  if (hadComfortEd && hadCaregiverEmpow) {
    return {
      category,
      score: 4,
      evidence: 'Comfort tools were explained and Margaret was given concrete actions she can take.',
      coachingNote: 'Giving caregivers specific tools and a clear role in comfort care is one of the most powerful things an RN can do in a home visit.',
    };
  }

  // Score 3: comfort education present
  if (hadComfortEd) {
    return {
      category,
      score: 3,
      evidence: 'Comfort tools were described for this situation.',
      coachingNote: 'Good comfort education. Adding a direct invitation for Margaret to take an active role — such as adjusting position or using a fan — completes the empowerment arc.',
    };
  }

  // Score 2: fear acknowledged but no comfort education
  if (hadFearAck) {
    return {
      category,
      score: 2,
      evidence: "Margaret's fear was acknowledged but no comfort tools or concrete actions were described.",
      coachingNote: 'Emotional acknowledgment is the right starting point. The next move is describing the specific things Margaret can do right now to support Harold.',
    };
  }

  // Score 1: no comfort education detected
  return {
    category,
    score: 1,
    evidence: 'No comfort education or concrete guidance for the caregiver was detected.',
    coachingNote: 'Practice describing non-pharmacologic comfort tools — positioning upright, a cool fan, calm presence, staying beside Harold — so Margaret has actions she can take.',
  };
}

function scoreRoleBoundarySafety(
  rnSafetyEventCount: number,
  hadRoleBoundary: boolean,
  hadRecoveryAfterEvent: boolean
): SkillScore {
  const category = RN_CATEGORIES[3];

  // Score 0: more than one safety event
  if (rnSafetyEventCount > 1) {
    return {
      category,
      score: 0,
      evidence: 'Specific medication dose or order change language was used more than once without deferring to the hospice orders.',
      coachingNote: 'Repeated dose boundary violations are the most critical pattern to address. When a dose question arises, confirm the comfort plan exists and route exact instructions to the hospice orders and on-call provider.',
    };
  }

  // Score 1: one safety event, no recovery
  if (rnSafetyEventCount === 1 && !hadRecoveryAfterEvent) {
    return {
      category,
      score: 1,
      evidence: 'Specific medication dose or order change language was used without deferring to the hospice orders, and no correction to safer language was detected.',
      coachingNote: 'When a dose question arises, the right move is to confirm comfort medications are part of the plan of care and route exact dose instructions to the on-call provider.',
    };
  }

  // Score 2: one safety event, later recovery
  if (rnSafetyEventCount === 1 && hadRecoveryAfterEvent) {
    return {
      category,
      score: 2,
      evidence: 'Specific medication dose language was used once, but the learner later corrected to safer routing language.',
      coachingNote: 'Recognizing and correcting a role boundary issue in the moment is a strong recovery. The goal is to route on the first response.',
    };
  }

  // Score 3: no safety event, boundary not explicitly demonstrated
  if (!hadRoleBoundary) {
    return {
      category,
      score: 3,
      evidence: 'No medication dose boundary issue occurred. The routing language was not explicitly demonstrated in this conversation.',
      coachingNote: 'Clean boundary session. Practice the routing language — confirming the comfort plan and directing dose questions to the on-call provider — so it is ready when the question arises.',
    };
  }

  // Score 4: no safety event, boundary explicitly demonstrated
  return {
    category,
    score: 4,
    evidence: 'The learner stayed within the RN scope and explicitly confirmed that dose questions should go to the hospice orders and on-call provider.',
    coachingNote: 'This is exactly the right approach. Confirming the plan exists and routing dose questions protects both the caregiver and the learner.',
  };
}

function scoreCaregiverEmpowerment(
  hadCaregiverEmpow: boolean,
  hadSafeMedRouting: boolean,
  hadFearAck: boolean,
  hadOverpromise: boolean
): SkillScore {
  const category = RN_CATEGORIES[4];

  // Score 0: overpromise present
  if (hadOverpromise) {
    return {
      category,
      score: 0,
      evidence: "The learner overstated what an intervention would achieve, which may remove Margaret's sense of active participation in Harold's comfort.",
      coachingNote: 'Caregiver empowerment depends on honest framing. Overpromising replaces helplessness with false certainty, which creates a different kind of problem when the promise is not met.',
    };
  }

  // Score 4: caregiver empowerment and safe medication routing
  if (hadCaregiverEmpow && hadSafeMedRouting) {
    return {
      category,
      score: 4,
      evidence: 'Margaret was given concrete comfort actions and the medication dose question was routed appropriately to the hospice team.',
      coachingNote: 'Full caregiver empowerment — practical tools plus a clear path forward for the clinical question. This is what a skilled RN home visit looks like.',
    };
  }

  // Score 3: caregiver empowerment present
  if (hadCaregiverEmpow) {
    return {
      category,
      score: 3,
      evidence: 'Margaret was given concrete actions she can take to support Harold.',
      coachingNote: 'Good empowerment. Adding a clear path for the medication dose question — routing it to the on-call provider — completes the picture.',
    };
  }

  // Score 2: safe routing present, no caregiver empowerment
  if (hadSafeMedRouting) {
    return {
      category,
      score: 2,
      evidence: 'The medication dose question was routed appropriately, but no concrete comfort actions were described for Margaret.',
      coachingNote: 'Safe routing is important. Pairing it with specific comfort tools gives Margaret something to do while the clinical question is being resolved.',
    };
  }

  // Score 1: fear acknowledged, no empowerment
  if (hadFearAck) {
    return {
      category,
      score: 1,
      evidence: "Margaret's fear was acknowledged but no concrete actions or clear next steps were described.",
      coachingNote: 'After acknowledging the fear, the next move is giving Margaret something specific she can do. Concrete action reduces helplessness.',
    };
  }

  return {
    category,
    score: 1,
    evidence: 'No caregiver empowerment or supportive behavior was clearly detected.',
    coachingNote: 'Practice giving caregivers specific tools and a clear next step so they move from helpless witness to active participant.',
  };
}

function scoreClinicalEscalationJudgment(
  rnSafetyEventCount: number,
  hadSafeMedRouting: boolean,
  hadRoleBoundary: boolean,
  hadRecoveryAfterEvent: boolean
): SkillScore {
  const category = RN_CATEGORIES[5];

  // Score 0: more than one safety event
  if (rnSafetyEventCount > 1) {
    return {
      category,
      score: 0,
      evidence: 'Medication dose or order change language was used more than once without routing to the hospice orders or on-call provider.',
      coachingNote: 'Repeated escalation failures are the most critical pattern to address. When a dose question arises, route it immediately.',
    };
  }

  // Score 1: one safety event, no routing recovery
  if (rnSafetyEventCount === 1 && !hadRecoveryAfterEvent) {
    return {
      category,
      score: 1,
      evidence: 'A medication dose question arose and was not routed to the hospice orders or on-call provider.',
      coachingNote: 'When a medication dose question arises, validate the concern and route it to the hospice orders and on-call provider. Answering directly in real time without the orders present is outside the RN scope.',
    };
  }

  // Score 2: one safety event, later safe routing
  if (rnSafetyEventCount === 1 && hadRecoveryAfterEvent) {
    return {
      category,
      score: 2,
      evidence: 'A medication dose question was initially handled outside the RN scope, but the learner later corrected to safe routing language.',
      coachingNote: 'Correcting in the moment shows good self-awareness. The goal is to route on the first response.',
    };
  }

  // Score 4: no safety event, explicit safe routing demonstrated
  if (hadSafeMedRouting && hadRoleBoundary) {
    return {
      category,
      score: 4,
      evidence: 'The learner demonstrated clear escalation judgment — confirming the comfort plan and routing the dose question to the on-call provider without stating doses directly.',
      coachingNote: 'This is the right escalation pattern. Validating the concern, confirming the plan, and routing the clinical question builds both safety and trust.',
    };
  }

  // Score 3: no safety event, routing not demonstrated
  return {
    category,
    score: 3,
    evidence: 'No medication dose question arose in this conversation, so clinical escalation judgment could not be fully assessed.',
    coachingNote: 'Practice the routing language before the next session so the response is ready when a medication dose question arises.',
  };
}

function scoreTrustBuilding(
  hadFearAck: boolean,
  hadAirHungerExp: boolean,
  hadSafeMedRouting: boolean,
  hadCaregiverEmpow: boolean,
  hadMinimizerOrUnsafe: boolean
): SkillScore {
  const category = RN_CATEGORIES[6];

  const trustCount = [hadFearAck, hadAirHungerExp, hadSafeMedRouting, hadCaregiverEmpow].filter(
    Boolean
  ).length;

  // Score 0: minimizing or unsafe occurred and no trust-building behaviors
  if (hadMinimizerOrUnsafe && trustCount === 0) {
    return {
      category,
      score: 0,
      evidence: 'Minimizing or unsafe language was detected and no trust-building behaviors were identified.',
      coachingNote: 'When unsafe or minimizing language appears, the fastest recovery is to name the fear directly, correct the framing, and give Margaret a concrete action. Each of those moves rebuilds trust.',
    };
  }

  if (trustCount === 4) {
    return {
      category,
      score: 4,
      evidence: "The learner demonstrated all four trust-building behaviors: acknowledging Margaret's fear, explaining air hunger, routing the medication question safely, and empowering Margaret with concrete actions.",
      coachingNote: 'This is the full trust arc for this scenario. Each of those four moves builds on the one before it.',
    };
  }

  if (trustCount === 3) {
    return {
      category,
      score: 3,
      evidence: 'Three of the four trust-building behaviors were demonstrated.',
      coachingNote: 'Strong trust-building session. Adding the missing element — whether that is the fear acknowledgment, the air hunger explanation, the medication routing, or the caregiver empowerment — completes the arc.',
    };
  }

  if (trustCount === 2) {
    return {
      category,
      score: 2,
      evidence: 'Two of the four trust-building behaviors were demonstrated.',
      coachingNote: 'A partial trust arc is in place. The conversation had moments of connection but did not complete the full sequence that moves Margaret from panic to informed action.',
    };
  }

  if (trustCount === 1) {
    return {
      category,
      score: 1,
      evidence: 'One trust-building behavior was demonstrated.',
      coachingNote: 'One move toward trust is a starting point. Practice building the full sequence: acknowledge fear, explain what is happening, describe what Margaret can do, and confirm the clinical support available.',
    };
  }

  return {
    category,
    score: 1,
    evidence: 'No clear trust-building behaviors were detected.',
    coachingNote: 'Practice the four trust-building moves for this scenario: name the fear, explain air hunger in plain language, describe comfort tools, and route the dose question safely.',
  };
}

export function generateRnSkillScoreReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): SkillScoreReport {
  void conversationMessages;

  const hadFearAck = hasBehavior(patientStateSnapshots, 'fear_acknowledgment');
  const hadAirHungerExp = hasBehavior(patientStateSnapshots, 'air_hunger_explanation');
  const hadPlainLanguage = hasBehavior(patientStateSnapshots, 'plain_language_used');
  const hadComfortEd = hasBehavior(patientStateSnapshots, 'comfort_education');
  const hadCaregiverEmpow = hasBehavior(patientStateSnapshots, 'caregiver_empowerment');
  const hadSafeMedRouting = hasBehavior(patientStateSnapshots, 'safe_medication_routing');
  const hadRoleBoundary = hasBehavior(patientStateSnapshots, 'role_boundary_respected');
  const hadDoseOverstep = hasBehavior(patientStateSnapshots, 'medication_dose_overstep');
  const hadOverpromise = hasBehavior(patientStateSnapshots, 'overpromise_symptom_control');
  const hadMinimizerOrUnsafe = hadDoseOverstep || hadOverpromise;
  const hadSupportiveBehavior =
    hadComfortEd || hadCaregiverEmpow || hadSafeMedRouting || hadRoleBoundary;

  const rnSafetyEventCount = safetyEvents.filter(
    (e) => e.violationCategory === 'rn_medication_dose_outside_orders'
  ).length;

  const hadRoleBoundaryAfterEvent = behaviorAppearsAfterFirstSafetyEvent(
    patientStateSnapshots,
    'role_boundary_respected',
    safetyEvents,
    'rn_medication_dose_outside_orders'
  );
  const hadSafeMedRoutingAfterEvent = behaviorAppearsAfterFirstSafetyEvent(
    patientStateSnapshots,
    'safe_medication_routing',
    safetyEvents,
    'rn_medication_dose_outside_orders'
  );
  const hadRecoveryAfterEvent = hadRoleBoundaryAfterEvent || hadSafeMedRoutingAfterEvent;

  const scores: SkillScore[] = [
    scoreEmotionalAttunement(hadFearAck, hadAirHungerExp, hadMinimizerOrUnsafe, hadSupportiveBehavior),
    scoreSymptomCommunication(hadAirHungerExp, hadPlainLanguage, hadComfortEd, hadFearAck, hadOverpromise),
    scoreComfortEducation(hadComfortEd, hadCaregiverEmpow, hadFearAck, hadOverpromise),
    scoreRoleBoundarySafety(rnSafetyEventCount, hadRoleBoundary, hadRecoveryAfterEvent),
    scoreCaregiverEmpowerment(hadCaregiverEmpow, hadSafeMedRouting, hadFearAck, hadOverpromise),
    scoreClinicalEscalationJudgment(rnSafetyEventCount, hadSafeMedRouting, hadRoleBoundary, hadRecoveryAfterEvent),
    scoreTrustBuilding(hadFearAck, hadAirHungerExp, hadSafeMedRouting, hadCaregiverEmpow, hadMinimizerOrUnsafe),
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
