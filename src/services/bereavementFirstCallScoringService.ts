import type {
  ConversationMessage,
  PatientStateSnapshot,
  SafetyEvent,
  SkillScore,
  SkillScoreReport,
} from '@/types/simulator';

const BEREAVEMENT_CATEGORIES = [
  'Emotional Attunement',
  'Grief Normalization',
  'Bereavement Education',
  'Role Boundary Safety',
  'Complicated Grief Assessment',
  'Clinical Escalation Judgment',
  'Trust Building',
] as const;

function hasBehavior(snapshots: PatientStateSnapshot[], behavior: string): boolean {
  return snapshots.some((s) => s.detectedBehaviors.includes(behavior));
}

export function generateBereavementFirstCallSkillScoreReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): SkillScoreReport {
  void conversationMessages;
  void safetyEvents;

  const hadEmotionalAck = hasBehavior(patientStateSnapshots, 'emotional_acknowledgment');
  const hadGriefNorm = hasBehavior(patientStateSnapshots, 'grief_normalization');
  const hadBereavementEd = hasBehavior(patientStateSnapshots, 'bereavement_education');
  const hadComplicatedGriefRouting = hasBehavior(patientStateSnapshots, 'complicated_grief_routing');
  const hadMinimization = hasBehavior(patientStateSnapshots, 'minimization');
  const hadPathologizing = hasBehavior(patientStateSnapshots, 'pathologizing');

  const emotionalAttunement: SkillScore = (() => {
    const cat = BEREAVEMENT_CATEGORIES[0];
    if ((hadMinimization || hadPathologizing) && !hadEmotionalAck) return { category: cat, score: 0, evidence: "Minimizing or pathologizing language was used without acknowledging Margaret's grief.", coachingNote: "Acknowledge what Margaret described before explaining or assessing anything." };
    if (hadEmotionalAck && hadGriefNorm && !(hadMinimization || hadPathologizing)) return { category: cat, score: 4, evidence: "The learner acknowledged Margaret's grief and normalized her experience.", coachingNote: 'Combining acknowledgment with normalization is the strongest opening in early bereavement calls.' };
    if (hadEmotionalAck && !(hadMinimization || hadPathologizing)) return { category: cat, score: 3, evidence: "The learner acknowledged Margaret's grief.", coachingNote: 'Good. Adding explicit normalization of the morning re-grief experience would complete the arc.' };
    if (hadEmotionalAck && hadMinimization) return { category: cat, score: 2, evidence: "The learner acknowledged the grief but also used minimizing language.", coachingNote: 'Minimization undoes acknowledgment. Stay with the grief without rushing to a timeline.' };
    return { category: cat, score: 1, evidence: 'No emotional acknowledgment detected.', coachingNote: "Practice acknowledging what Margaret described before explaining anything." };
  })();

  const griefNormalization: SkillScore = (() => {
    const cat = BEREAVEMENT_CATEGORIES[1];
    if (hadPathologizing && !hadGriefNorm) return { category: cat, score: 0, evidence: 'Normal grief was pathologized without normalization.', coachingNote: 'The morning re-grief experience is a normal early grief pattern — not a disorder.' };
    if (hadGriefNorm && !hadMinimization && !hadPathologizing) return { category: cat, score: 4, evidence: "The morning re-grief experience was normalized — many people experience exactly this in early grief.", coachingNote: 'Direct normalization is the most therapeutic move in early bereavement first calls.' };
    if (hadGriefNorm && (hadMinimization || hadPathologizing)) return { category: cat, score: 2, evidence: 'Normalization was present but also combined with minimizing or pathologizing language.', coachingNote: 'Normalization is strongest when it stands alone without a timeline or clinical label.' };
    if (hadEmotionalAck) return { category: cat, score: 2, evidence: "Margaret's grief was acknowledged but the specific morning re-grief pattern was not normalized.", coachingNote: "Margaret asked 'is that normal?' — answer that question directly." };
    return { category: cat, score: 1, evidence: 'No grief normalization detected.', coachingNote: "Practice normalizing the morning re-grief pattern: waking up and forgetting is common, not a sign of something wrong." };
  })();

  const bereavementEducation: SkillScore = (() => {
    const cat = BEREAVEMENT_CATEGORIES[2];
    if (hadBereavementEd && hadGriefNorm) return { category: cat, score: 4, evidence: 'The bereavement program was described and the grief experience was normalized.', coachingNote: 'Normalization followed by resource education is the correct arc in bereavement first calls.' };
    if (hadBereavementEd) return { category: cat, score: 3, evidence: 'The hospice bereavement program and available support were described.', coachingNote: 'Good. Pairing the resource education with normalization makes the offer feel more natural.' };
    if (hadComplicatedGriefRouting) return { category: cat, score: 2, evidence: 'Complicated grief indicators were assessed but the bereavement program was not introduced.', coachingNote: 'After assessing, introduce the bereavement program and what is available.' };
    if (hadEmotionalAck) return { category: cat, score: 2, evidence: "The grief was acknowledged but the bereavement program was not introduced.", coachingNote: 'After acknowledging the grief, introduce the bereavement support resources that are still available.' };
    return { category: cat, score: 1, evidence: 'No bereavement education detected.', coachingNote: 'Practice introducing the hospice bereavement program — many bereaved people do not know this support continues after the death.' };
  })();

  const roleBoundarySafety: SkillScore = (() => {
    const cat = BEREAVEMENT_CATEGORIES[3];
    if (hadPathologizing && hadMinimization) return { category: cat, score: 0, evidence: 'Both pathologizing and minimization were detected.', coachingNote: 'Neither pathologizing nor minimizing belongs in early bereavement calls.' };
    if (hadPathologizing) return { category: cat, score: 1, evidence: 'Normal grief was pathologized.', coachingNote: 'Social Workers do not diagnose grief disorders. Normalize first and refer if there are significant functional impairments.' };
    if (hadMinimization) return { category: cat, score: 2, evidence: 'Minimizing language was used.', coachingNote: 'Minimization invalidates grief. Replace timelines and platitudes with direct normalization.' };
    return { category: cat, score: 4, evidence: 'No pathologizing or minimization was detected.', coachingNote: 'Clean boundary session.' };
  })();

  const complicatedGriefAssessment: SkillScore = (() => {
    const cat = BEREAVEMENT_CATEGORIES[4];
    if (hadPathologizing) return { category: cat, score: 0, evidence: 'Pathologizing occurred instead of a gentle assessment.', coachingNote: 'Complicated grief assessment is gentle and functional — not diagnostic labeling.' };
    if (hadComplicatedGriefRouting && !hadPathologizing) return { category: cat, score: 4, evidence: 'Complicated grief indicators were gently assessed without pathologizing.', coachingNote: 'Asking about function, sleep, and daily life gives you the information you need without labeling.' };
    if (hadGriefNorm) return { category: cat, score: 3, evidence: 'Grief was normalized but complicated grief indicators were not formally assessed.', coachingNote: 'After normalizing, a gentle check-in about how Margaret is functioning would complete the assessment.' };
    if (hadEmotionalAck) return { category: cat, score: 2, evidence: "Margaret's grief was acknowledged but complicated grief was not assessed.", coachingNote: 'After acknowledging the grief, gently ask how she is managing daily activities, sleep, and eating.' };
    return { category: cat, score: 1, evidence: 'No complicated grief assessment detected.', coachingNote: 'Practice gently asking about function — eating, sleeping, getting out of the house — without diagnostic labeling.' };
  })();

  const clinicalEscalation: SkillScore = (() => {
    const cat = BEREAVEMENT_CATEGORIES[5];
    if (hadComplicatedGriefRouting && hadBereavementEd) return { category: cat, score: 4, evidence: 'Complicated grief was assessed and bereavement resources were offered.', coachingNote: 'Assessment plus resource offering is the correct escalation path in bereavement calls.' };
    if (hadComplicatedGriefRouting) return { category: cat, score: 3, evidence: 'Complicated grief indicators were assessed.', coachingNote: 'Good escalation awareness. Follow the assessment with resource offerings.' };
    if (hadBereavementEd) return { category: cat, score: 3, evidence: 'Bereavement resources were offered as a support path.', coachingNote: 'Good. Pairing with a gentle complicated grief assessment completes the escalation picture.' };
    if (hadEmotionalAck) return { category: cat, score: 2, evidence: "Grief was acknowledged but no escalation path was demonstrated.", coachingNote: 'After acknowledging the grief, offer resources and gently assess for complicated grief indicators.' };
    return { category: cat, score: 1, evidence: 'No escalation path detected.', coachingNote: 'Practice the bereavement escalation: normalize, assess, offer resources, follow up.' };
  })();

  const trustCount = [hadEmotionalAck, hadGriefNorm, hadBereavementEd, !hadMinimization && !hadPathologizing].filter(Boolean).length;
  const trustBuilding: SkillScore = (() => {
    const cat = BEREAVEMENT_CATEGORIES[6];
    if ((hadMinimization || hadPathologizing) && trustCount <= 1) return { category: cat, score: 0, evidence: 'Minimization or pathologizing and few trust-building behaviors.', coachingNote: 'Acknowledge, normalize, offer resources, stay away from clinical labels — each builds trust.' };
    if (trustCount === 4) return { category: cat, score: 4, evidence: 'All four trust-building behaviors demonstrated.', coachingNote: 'This is the full trust arc for bereavement first calls.' };
    if (trustCount === 3) return { category: cat, score: 3, evidence: 'Three of four trust-building behaviors demonstrated.', coachingNote: 'Strong session.' };
    if (trustCount === 2) return { category: cat, score: 2, evidence: 'Two of four trust-building behaviors demonstrated.', coachingNote: 'Partial arc in place.' };
    return { category: cat, score: 1, evidence: 'One or fewer trust-building behaviors detected.', coachingNote: 'Practice: acknowledge grief, normalize, offer resources, avoid pathologizing.' };
  })();

  const scores: SkillScore[] = [
    emotionalAttunement, griefNormalization, bereavementEducation,
    roleBoundarySafety, complicatedGriefAssessment, clinicalEscalation, trustBuilding,
  ];

  const overallScore = Math.round((scores.reduce((sum, s) => sum + s.score, 0) / scores.length) * 10) / 10;
  const maxScore = Math.max(...scores.map((s) => s.score));
  const minScore = Math.min(...scores.map((s) => s.score));
  const primaryStrength = scores.find((s) => s.score === maxScore)!.category;
  const primaryGrowthArea = scores.find((s) => s.score === minScore)!.category;

  return { id: `${Date.now()}-scores`, scenarioId, overallScore, scores, primaryStrength, primaryGrowthArea, createdAt: new Date().toISOString() };
}
