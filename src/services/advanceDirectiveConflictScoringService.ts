import type {
  ConversationMessage,
  PatientStateSnapshot,
  SafetyEvent,
  SkillScore,
  SkillScoreReport,
} from '@/types/simulator';

const SW_CATEGORIES = [
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

export function generateAdvanceDirectiveConflictSkillScoreReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): SkillScoreReport {
  void conversationMessages;
  void safetyEvents;

  const hadEmotionalAck = hasBehavior(patientStateSnapshots, 'emotional_acknowledgment');
  const hadSurrogateConcept = hasBehavior(patientStateSnapshots, 'surrogate_decision_explained');
  const hadAdvanceDirective = hasBehavior(patientStateSnapshots, 'advance_directive_education');
  const hadFamilyMeeting = hasBehavior(patientStateSnapshots, 'family_meeting_offered');
  const hadSidesTaken = hasBehavior(patientStateSnapshots, 'sides_taken');
  const hadDirectivePressure = hasBehavior(patientStateSnapshots, 'directive_pressure');

  const emotionalAttunement: SkillScore = (() => {
    const cat = SW_CATEGORIES[0];
    if ((hadSidesTaken || hadDirectivePressure) && !hadEmotionalAck) return { category: cat, score: 0, evidence: "The learner took a position without acknowledging Robert's grief.", coachingNote: "Acknowledge the grief beneath the conflict before engaging with the decision." };
    if (hadEmotionalAck && !(hadSidesTaken || hadDirectivePressure)) return { category: cat, score: 4, evidence: "The learner acknowledged Robert's grief without taking sides.", coachingNote: 'Starting with emotional acknowledgment is exactly right in family conflict conversations.' };
    if (hadEmotionalAck) return { category: cat, score: 3, evidence: "The learner acknowledged Robert's grief.", coachingNote: 'Good start. Maintain neutrality throughout.' };
    return { category: cat, score: 1, evidence: 'No emotional acknowledgment detected.', coachingNote: "Practice naming Robert's grief and fear before engaging with the legal or clinical aspects." };
  })();

  const autonomyAdvocacy: SkillScore = (() => {
    const cat = SW_CATEGORIES[1];
    if (hadSurrogateConcept && hadAdvanceDirective) return { category: cat, score: 4, evidence: 'Surrogate decision-making and advance directive concepts were both explained.', coachingNote: 'Full autonomy education — giving Robert the framework for his role.' };
    if (hadSurrogateConcept) return { category: cat, score: 3, evidence: 'Surrogate decision-making was explained.', coachingNote: 'Strong. Adding an explanation of advance directives completes the educational arc.' };
    if (hadAdvanceDirective) return { category: cat, score: 3, evidence: 'Advance directive concepts were explained.', coachingNote: 'Good. Adding surrogate decision-making explains the role Robert is now in.' };
    if (hadEmotionalAck) return { category: cat, score: 2, evidence: 'Emotional acknowledgment was present but autonomy concepts were not explained.', coachingNote: 'After acknowledging grief, explain what surrogate decision-making means.' };
    return { category: cat, score: 1, evidence: 'No autonomy education detected.', coachingNote: 'Practice explaining surrogate decision-making — speaking for Helen based on her values.' };
  })();

  const valuesElicitation: SkillScore = (() => {
    const cat = SW_CATEGORIES[2];
    if (hadDirectivePressure && !hadSurrogateConcept) return { category: cat, score: 0, evidence: 'The learner directed toward a value without eliciting Helen\'s actual values.', coachingNote: 'Values elicitation means asking what Helen said, believed, and valued — not guiding Robert toward a conclusion.' };
    if (hadSurrogateConcept && hadEmotionalAck) return { category: cat, score: 4, evidence: "The learner connected surrogate decision-making to Helen's values and Robert's role in representing them.", coachingNote: "Helping Robert see his role as Helen's voice is the most important reframe in this scenario." };
    if (hadSurrogateConcept) return { category: cat, score: 3, evidence: 'Surrogate decision-making was connected to patient values.', coachingNote: 'Strong. Continuing to invite Robert to share what Helen valued deepens the elicitation.' };
    if (hadAdvanceDirective) return { category: cat, score: 2, evidence: 'Advance directive concepts were explained but values were not elicited.', coachingNote: 'After explaining the surrogate role, invite Robert to share what Helen has said about how she wanted to live.' };
    return { category: cat, score: 1, evidence: 'No values elicitation detected.', coachingNote: "Practice inviting Robert to share what Helen has said about her values — what mattered to her, how she talked about illness and quality of life." };
  })();

  const conflictMediation: SkillScore = (() => {
    const cat = SW_CATEGORIES[3];
    if (hadSidesTaken) return { category: cat, score: 0, evidence: "The learner took a side in the family conflict, which is the most critical boundary violation in this scenario.", coachingNote: 'Social Workers are neutral facilitators in family care conflicts. Taking sides escalates conflict and damages trust.' };
    if (hadDirectivePressure) return { category: cat, score: 1, evidence: 'The learner applied pressure toward a specific decision without taking a side explicitly.', coachingNote: 'Directing families toward a particular outcome is outside the Social Worker role.' };
    if (hadFamilyMeeting && !hadSidesTaken && !hadDirectivePressure) return { category: cat, score: 4, evidence: 'A family meeting was offered and neutrality was maintained throughout.', coachingNote: 'Offering a structured space for the conflict is the right mediation move.' };
    if (hadEmotionalAck && !hadSidesTaken && !hadDirectivePressure) return { category: cat, score: 3, evidence: 'Neutrality was maintained and emotional acknowledgment was present.', coachingNote: 'Good. Offering a family meeting would complete the conflict mediation arc.' };
    if (!hadSidesTaken && !hadDirectivePressure) return { category: cat, score: 2, evidence: 'Neutrality was maintained but no specific mediation move was detected.', coachingNote: 'Practice offering a family meeting as a concrete next step.' };
    return { category: cat, score: 1, evidence: 'No clear conflict mediation behavior detected.', coachingNote: 'Practice staying neutral while offering a path forward — a family meeting with the clinical team.' };
  })();

  const roleBoundarySafety: SkillScore = (() => {
    const cat = SW_CATEGORIES[4];
    if (hadSidesTaken && hadDirectivePressure) return { category: cat, score: 0, evidence: 'Both sides-taking and directive pressure were detected.', coachingNote: 'Staying neutral and not directing decisions are the core Social Worker role boundaries.' };
    if (hadSidesTaken) return { category: cat, score: 1, evidence: 'The learner took a side in the family decision.', coachingNote: 'Social Workers do not take sides in family care decisions.' };
    if (hadDirectivePressure) return { category: cat, score: 2, evidence: 'Directive pressure toward a specific outcome was detected.', coachingNote: 'Facilitation is not directing. Offer process, not conclusions.' };
    if (!hadSidesTaken && !hadDirectivePressure) return { category: cat, score: 4, evidence: 'The learner maintained neutrality throughout — no sides taken and no directive pressure.', coachingNote: 'This is the Social Worker role at its best.' };
    return { category: cat, score: 3, evidence: 'No boundary issue detected.', coachingNote: 'Clean session.' };
  })();

  const clinicalEscalation: SkillScore = (() => {
    const cat = SW_CATEGORIES[5];
    if (hadFamilyMeeting) return { category: cat, score: 4, evidence: 'A family meeting with the clinical team was offered as the appropriate escalation path.', coachingNote: 'Family meetings are the correct escalation move in advance directive conflict.' };
    if (hadSurrogateConcept) return { category: cat, score: 3, evidence: 'The surrogate concept was explained, which opens the path toward structured clinical escalation.', coachingNote: 'The next step is offering a family meeting so the clinical team can support the process.' };
    if (hadEmotionalAck) return { category: cat, score: 2, evidence: 'Emotional acknowledgment was present but clinical escalation was not demonstrated.', coachingNote: 'After acknowledging grief, offer a family meeting with the care team.' };
    return { category: cat, score: 1, evidence: 'No clinical escalation path was offered.', coachingNote: 'Practice offering a family meeting — this is the correct escalation in family conflict.' };
  })();

  const trustCount = [hadEmotionalAck, hadSurrogateConcept, hadFamilyMeeting, !hadSidesTaken && !hadDirectivePressure].filter(Boolean).length;
  const trustBuilding: SkillScore = (() => {
    const cat = SW_CATEGORIES[6];
    if (hadSidesTaken && trustCount <= 1) return { category: cat, score: 0, evidence: 'Taking sides damaged trust.', coachingNote: 'Neutrality plus acknowledgment is the trust foundation in family conflict.' };
    if (trustCount === 4) return { category: cat, score: 4, evidence: 'All four trust-building behaviors demonstrated.', coachingNote: 'This is the full trust arc.' };
    if (trustCount === 3) return { category: cat, score: 3, evidence: 'Three of four trust-building behaviors demonstrated.', coachingNote: 'Strong session.' };
    if (trustCount === 2) return { category: cat, score: 2, evidence: 'Two of four trust-building behaviors demonstrated.', coachingNote: 'Partial trust arc in place.' };
    return { category: cat, score: 1, evidence: 'One or fewer trust-building behaviors detected.', coachingNote: 'Practice: acknowledge grief, explain surrogate role, offer meeting, stay neutral.' };
  })();

  const scores: SkillScore[] = [
    emotionalAttunement, autonomyAdvocacy, valuesElicitation,
    conflictMediation, roleBoundarySafety, clinicalEscalation, trustBuilding,
  ];

  const overallScore = Math.round((scores.reduce((sum, s) => sum + s.score, 0) / scores.length) * 10) / 10;
  const maxScore = Math.max(...scores.map((s) => s.score));
  const minScore = Math.min(...scores.map((s) => s.score));
  const primaryStrength = scores.find((s) => s.score === maxScore)!.category;
  const primaryGrowthArea = scores.find((s) => s.score === minScore)!.category;

  return { id: `${Date.now()}-scores`, scenarioId, overallScore, scores, primaryStrength, primaryGrowthArea, createdAt: new Date().toISOString() };
}
