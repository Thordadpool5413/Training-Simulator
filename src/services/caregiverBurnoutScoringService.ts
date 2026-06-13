import type {
  ConversationMessage,
  PatientStateSnapshot,
  SafetyEvent,
  SkillScore,
  SkillScoreReport,
} from '@/types/simulator';

const BURNOUT_CATEGORIES = [
  'Emotional Attunement',
  'Burden Validation',
  'Resource Navigation',
  'Role Boundary Safety',
  'Caregiver Assessment',
  'Clinical Escalation Judgment',
  'Trust Building',
] as const;

function hasBehavior(snapshots: PatientStateSnapshot[], behavior: string): boolean {
  return snapshots.some((s) => s.detectedBehaviors.includes(behavior));
}

export function generateCaregiverBurnoutSkillScoreReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): SkillScoreReport {
  void conversationMessages;
  void safetyEvents;

  const hadEmotionalAck = hasBehavior(patientStateSnapshots, 'emotional_acknowledgment');
  const hadGuiltValidation = hasBehavior(patientStateSnapshots, 'guilt_validation');
  const hadResourceOffered = hasBehavior(patientStateSnapshots, 'resource_offered');
  const hadCaregiverAssessment = hasBehavior(patientStateSnapshots, 'caregiver_assessment');
  const hadMinimization = hasBehavior(patientStateSnapshots, 'minimization');
  const hadPlacementPressure = hasBehavior(patientStateSnapshots, 'placement_pressure');

  const emotionalAttunement: SkillScore = (() => {
    const cat = BURNOUT_CATEGORIES[0];
    if ((hadMinimization || hadPlacementPressure) && !hadEmotionalAck) return { category: cat, score: 0, evidence: "Minimizing or pressure language was used without acknowledging Dorothy's exhaustion.", coachingNote: "Name the exhaustion and validate it before moving to any solution." };
    if (hadEmotionalAck && hadGuiltValidation && !(hadMinimization || hadPlacementPressure)) return { category: cat, score: 4, evidence: "The learner acknowledged Dorothy's exhaustion and validated her guilt without judgment.", coachingNote: 'Combining acknowledgment with guilt validation is the strongest opening in caregiver burnout.' };
    if (hadEmotionalAck && !(hadMinimization || hadPlacementPressure)) return { category: cat, score: 3, evidence: "The learner acknowledged Dorothy's exhaustion.", coachingNote: 'Good. Adding explicit guilt validation would complete the emotional foundation.' };
    if (hadEmotionalAck && hadMinimization) return { category: cat, score: 2, evidence: "The learner acknowledged the exhaustion but also used minimizing language.", coachingNote: 'Minimizing language undoes acknowledgment. Replace it with direct validation.' };
    return { category: cat, score: 1, evidence: 'No emotional acknowledgment detected.', coachingNote: "Practice naming Dorothy's exhaustion and guilt directly." };
  })();

  const burdenValidation: SkillScore = (() => {
    const cat = BURNOUT_CATEGORIES[1];
    if (hadMinimization && !hadGuiltValidation) return { category: cat, score: 0, evidence: 'Minimizing language was used without validating the burden.', coachingNote: "Minimization is the opposite of validation. Dorothy's exhaustion is real — name it and stay with it." };
    if (hadGuiltValidation && !hadMinimization) return { category: cat, score: 4, evidence: "Dorothy's guilt was explicitly validated without minimizing either the guilt or the exhaustion.", coachingNote: 'Direct guilt validation is one of the most therapeutic things a Social Worker can offer a burned-out caregiver.' };
    if (hadGuiltValidation && hadMinimization) return { category: cat, score: 2, evidence: 'Guilt validation was present but minimizing language also appeared.', coachingNote: 'The validation was valuable but the minimizing language undercut it.' };
    if (hadEmotionalAck && !hadGuiltValidation) return { category: cat, score: 2, evidence: 'Emotional acknowledgment was present but guilt was not explicitly validated.', coachingNote: "Dorothy said she feels like a terrible person. That guilt needs to be named and addressed directly." };
    return { category: cat, score: 1, evidence: 'No burden validation detected.', coachingNote: "Practice naming Dorothy's guilt explicitly and separating it from the reality of her situation." };
  })();

  const resourceNavigation: SkillScore = (() => {
    const cat = BURNOUT_CATEGORIES[2];
    if (hadPlacementPressure && !hadResourceOffered) return { category: cat, score: 0, evidence: 'Placement pressure was applied without offering caregiver support resources.', coachingNote: 'Resource navigation starts with support options, not placement.' };
    if (hadResourceOffered && hadCaregiverAssessment) return { category: cat, score: 4, evidence: 'Caregiver support resources were offered and the support network was assessed.', coachingNote: 'Understanding what Dorothy needs before offering resources is the strongest approach.' };
    if (hadResourceOffered) return { category: cat, score: 3, evidence: 'Caregiver support resources were offered.', coachingNote: 'Good. Assessing the support network before offering resources makes the offer more targeted.' };
    if (hadCaregiverAssessment) return { category: cat, score: 2, evidence: "Dorothy's support network was assessed but no resources were offered.", coachingNote: 'The assessment is the right first step. Follow it with concrete resource options.' };
    if (hadEmotionalAck) return { category: cat, score: 2, evidence: "Dorothy's distress was acknowledged but no resources were described.", coachingNote: 'After acknowledging the exhaustion, describe the concrete support options available.' };
    return { category: cat, score: 1, evidence: 'No resource navigation detected.', coachingNote: 'Practice offering respite care, aide visits, and volunteer support as concrete options.' };
  })();

  const roleBoundarySafety: SkillScore = (() => {
    const cat = BURNOUT_CATEGORIES[3];
    if (hadPlacementPressure && hadMinimization) return { category: cat, score: 0, evidence: 'Both placement pressure and minimization were detected.', coachingNote: 'Placement pressure and minimization are the two most common boundary violations in caregiver burnout.' };
    if (hadPlacementPressure) return { category: cat, score: 1, evidence: 'Placement pressure was applied.', coachingNote: 'Placement is never a recommendation to make in this conversation. Describe options, not outcomes.' };
    if (hadMinimization) return { category: cat, score: 2, evidence: 'Minimizing language was used.', coachingNote: 'Minimizing language invalidates the caregiver. Replace it with validation.' };
    return { category: cat, score: 4, evidence: 'No placement pressure or minimizing language was detected.', coachingNote: 'Clean boundary session.' };
  })();

  const caregiverAssessment: SkillScore = (() => {
    const cat = BURNOUT_CATEGORIES[4];
    if (hadCaregiverAssessment && hadEmotionalAck) return { category: cat, score: 4, evidence: "Dorothy's well-being and support network were assessed after acknowledging her distress.", coachingNote: 'Assessing after acknowledgment means Dorothy is ready to answer honestly.' };
    if (hadCaregiverAssessment) return { category: cat, score: 3, evidence: "Dorothy's support network and needs were assessed.", coachingNote: 'Good assessment. Pairing it with emotional acknowledgment first makes the assessment more effective.' };
    if (hadResourceOffered) return { category: cat, score: 2, evidence: 'Resources were offered but caregiver needs were not formally assessed.', coachingNote: 'Understanding what Dorothy needs before offering resources makes the support more targeted.' };
    if (hadEmotionalAck) return { category: cat, score: 2, evidence: "Dorothy's distress was acknowledged but her needs were not assessed.", coachingNote: 'After acknowledging the distress, ask about her support network, sleep, and health.' };
    return { category: cat, score: 1, evidence: 'No caregiver assessment detected.', coachingNote: 'Practice asking about support network, sleep, eating, and what would actually help Dorothy.' };
  })();

  const clinicalEscalation: SkillScore = (() => {
    const cat = BURNOUT_CATEGORIES[5];
    if (hadCaregiverAssessment && hadResourceOffered) return { category: cat, score: 4, evidence: 'Caregiver needs were assessed and concrete support resources were offered.', coachingNote: 'Assessment plus resource offering is the correct escalation path in caregiver burnout.' };
    if (hadCaregiverAssessment) return { category: cat, score: 3, evidence: "Dorothy's needs were assessed.", coachingNote: 'Good. Follow the assessment with concrete resource options.' };
    if (hadResourceOffered) return { category: cat, score: 3, evidence: 'Concrete resources were offered.', coachingNote: 'Good escalation. Pairing resources with a needs assessment makes the offer more precise.' };
    if (hadEmotionalAck) return { category: cat, score: 2, evidence: "Dorothy's distress was acknowledged but no escalation path was demonstrated.", coachingNote: 'After acknowledging the burnout, assess needs and offer concrete support resources.' };
    return { category: cat, score: 1, evidence: 'No clinical escalation path detected.', coachingNote: 'Practice the caregiver support escalation: assess needs, offer resources, follow up.' };
  })();

  const trustCount = [hadEmotionalAck, hadGuiltValidation, hadResourceOffered, !hadMinimization && !hadPlacementPressure].filter(Boolean).length;
  const trustBuilding: SkillScore = (() => {
    const cat = BURNOUT_CATEGORIES[6];
    if ((hadMinimization || hadPlacementPressure) && trustCount <= 1) return { category: cat, score: 0, evidence: 'Minimization or placement pressure and few trust-building behaviors.', coachingNote: 'Acknowledge, validate, offer resources, stay neutral — each builds trust.' };
    if (trustCount === 4) return { category: cat, score: 4, evidence: 'All four trust-building behaviors demonstrated.', coachingNote: 'This is the full trust arc for caregiver burnout.' };
    if (trustCount === 3) return { category: cat, score: 3, evidence: 'Three of four trust-building behaviors demonstrated.', coachingNote: 'Strong session.' };
    if (trustCount === 2) return { category: cat, score: 2, evidence: 'Two of four trust-building behaviors demonstrated.', coachingNote: 'Partial arc in place.' };
    return { category: cat, score: 1, evidence: 'One or fewer trust-building behaviors detected.', coachingNote: 'Practice: acknowledge exhaustion, validate guilt, offer resources, avoid minimizing.' };
  })();

  const scores: SkillScore[] = [
    emotionalAttunement, burdenValidation, resourceNavigation,
    roleBoundarySafety, caregiverAssessment, clinicalEscalation, trustBuilding,
  ];

  const overallScore = Math.round((scores.reduce((sum, s) => sum + s.score, 0) / scores.length) * 10) / 10;
  const maxScore = Math.max(...scores.map((s) => s.score));
  const minScore = Math.min(...scores.map((s) => s.score));
  const primaryStrength = scores.find((s) => s.score === maxScore)!.category;
  const primaryGrowthArea = scores.find((s) => s.score === minScore)!.category;

  return { id: `${Date.now()}-scores`, scenarioId, overallScore, scores, primaryStrength, primaryGrowthArea, createdAt: new Date().toISOString() };
}
