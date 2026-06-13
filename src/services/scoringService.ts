import { generateActiveDyingSkillScoreReport } from '@/services/activeDyingScoringService';
import { generateAdvancedDementiaGriefSkillScoreReport } from '@/services/advancedDementiaGriefScoringService';
import { generateAdvanceDirectiveConflictSkillScoreReport } from '@/services/advanceDirectiveConflictScoringService';
import { generateBereavementFirstCallSkillScoreReport } from '@/services/bereavementFirstCallScoringService';
import { generateBreakthroughPainSkillScoreReport } from '@/services/breakthroughPainScoringService';
import { generateCaregiverBurnoutSkillScoreReport } from '@/services/caregiverBurnoutScoringService';
import { generateEsrdComfortCareSkillScoreReport } from '@/services/esrdComfortCareScoringService';
import { generateMedicationRefusalSkillScoreReport } from '@/services/medicationRefusalScoringService';
import { generatePainManagementSkillScoreReport } from '@/services/painManagementScoringService';
import { generatePrognosticUncertaintySkillScoreReport } from '@/services/prognosticUncertaintyScoringService';
import { generateRnSkillScoreReport } from '@/services/rnScoringService';
import { generateTerminalSecretionSkillScoreReport } from '@/services/terminalSecretionScoringService';
import type {
  ConversationMessage,
  PatientStateSnapshot,
  SafetyEvent,
  SkillScore,
  SkillScoreReport,
} from '@/types/simulator';

const CANONICAL_CATEGORIES = [
  'Emotional Attunement',
  'Hospice Education',
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
  hadEmotionalAck: boolean,
  hadServiceFirst: boolean,
  hadRepairLanguage: boolean,
  hadAbandonmentLanguage: boolean
): SkillScore {
  const category = CANONICAL_CATEGORIES[0];
  if (hadEmotionalAck && !hadServiceFirst) {
    return {
      category,
      score: 4,
      evidence: "The learner acknowledged the daughter's fear before moving into education.",
      coachingNote:
        'Starting with emotional acknowledgment helps families feel heard before they can take in new information.',
    };
  }
  if (hadEmotionalAck && hadServiceFirst) {
    return {
      category,
      score: 3,
      evidence:
        "The learner initially provided information before addressing the daughter's emotional concern, then later acknowledged the fear.",
      coachingNote:
        'The acknowledgment helped the conversation. Leading with emotion first has a stronger impact.',
    };
  }
  if (hadRepairLanguage) {
    return {
      category,
      score: 2,
      evidence: 'The learner used repair language but did not directly address the emotional cue.',
      coachingNote:
        'Repair language shows self-awareness. The next step is responding to the emotional concern directly before moving into information.',
    };
  }
  if (!hadAbandonmentLanguage) {
    return {
      category,
      score: 1,
      evidence: 'The learner did not clearly respond to the emotional cue.',
      coachingNote:
        'Practice identifying and naming the emotional concern directly. The opening statement from the daughter was a fear, not a question about services.',
    };
  }
  return {
    category,
    score: 0,
    evidence: "The learner used language that reinforced the family's fear without attempting to repair it.",
    coachingNote:
      'When the conversation moves toward fear or abandonment framing, the fastest recovery is to name the emotional concern directly.',
  };
}

function scoreHospiceEducation(
  hadHospiceReframe: boolean,
  hadAbandonmentLanguage: boolean,
  hadRepairLanguage: boolean
): SkillScore {
  const category = CANONICAL_CATEGORIES[1];
  if (hadHospiceReframe && !hadAbandonmentLanguage) {
    return {
      category,
      score: 4,
      evidence: 'The learner explained that hospice means continued support, not abandonment of care.',
      coachingNote:
        'Strong hospice framing. Families respond well to hearing that care continues in a different form.',
    };
  }
  if (hadHospiceReframe) {
    return {
      category,
      score: 3,
      evidence:
        'The learner reframed hospice as continued support but also used language that may have reinforced the fear that care was ending.',
      coachingNote:
        'Once you reframe hospice, keep the language consistent. Avoid wording that pulls the conversation back toward the fear of abandonment.',
    };
  }
  if (!hadAbandonmentLanguage) {
    return {
      category,
      score: 2,
      evidence: 'No specific hospice framing was detected in either direction.',
      coachingNote:
        'Practice explaining what hospice actually means using language families can hear. The goal is to help them understand that care continues in a different form.',
    };
  }
  if (hadRepairLanguage) {
    return {
      category,
      score: 1,
      evidence:
        'The learner used language that may have reinforced the fear that care was stopping and then attempted to repair it.',
      coachingNote:
        'When you catch abandonment language in your own response, repair it quickly. Repair language shows self-awareness and helps rebuild trust.',
    };
  }
  return {
    category,
    score: 0,
    evidence:
      "The learner used language that reinforced the family's fear that care was stopping without offering any correction.",
    coachingNote:
      'Avoid framing that sounds like care ends or everyone walks away. Practice language that positions hospice as a change in focus toward comfort and support.',
  };
}

function scoreObjectionHandling(
  hadEmotionalAck: boolean,
  hadServiceFirst: boolean,
  hadAbandonmentLanguage: boolean
): SkillScore {
  const category = CANONICAL_CATEGORIES[2];
  if (hadEmotionalAck && !hadServiceFirst) {
    return {
      category,
      score: 4,
      evidence: "The learner acknowledged the daughter's emotional concern before providing education or information.",
      coachingNote:
        'Leading with emotional acknowledgment is exactly right. Families can hear information better once they feel heard.',
    };
  }
  if (hadEmotionalAck) {
    return {
      category,
      score: 3,
      evidence:
        "The learner eventually acknowledged the daughter's emotional concern but provided service information first.",
      coachingNote:
        'When a family member leads with fear, acknowledge it first. Education lands better after the emotion is heard.',
    };
  }
  if (!hadServiceFirst && !hadAbandonmentLanguage) {
    return {
      category,
      score: 2,
      evidence: 'No emotional acknowledgment or service-first response was detected.',
      coachingNote:
        'The next step is to practice naming the emotional concern directly. Saying what you hear builds immediate trust.',
    };
  }
  if (hadServiceFirst && !hadAbandonmentLanguage) {
    return {
      category,
      score: 1,
      evidence: "The learner gave service information before addressing the daughter's fear.",
      coachingNote:
        'When a family member expresses fear or resistance, acknowledge what they said before explaining services. The emotional concern is the real question.',
    };
  }
  return {
    category,
    score: 0,
    evidence:
      "The learner gave service information without addressing the emotional concern and also used language that reinforced the family's fear.",
    coachingNote:
      'Objection handling starts with acknowledgment. No amount of information resolves fear that has not been heard.',
  };
}

function scoreComplianceSafeLanguage(
  hadMedSafetyEvent: boolean,
  hadAbandonmentLanguage: boolean,
  hadSafeMedRouting: boolean,
  hadHospiceReframe: boolean
): SkillScore {
  const category = CANONICAL_CATEGORIES[3];
  if (hadMedSafetyEvent && hadAbandonmentLanguage) {
    return {
      category,
      score: 0,
      evidence:
        "The learner provided medication guidance outside the Clinical Liaison role and used language that may have reinforced the family's fear about care ending.",
      coachingNote:
        'Both medication guidance and abandonment framing fall outside the Clinical Liaison role. Focus on validating concerns and routing clinical questions to the right person.',
    };
  }
  if (hadMedSafetyEvent && !hadSafeMedRouting) {
    return {
      category,
      score: 1,
      evidence: 'The learner provided medication guidance outside the Clinical Liaison role.',
      coachingNote:
        'When a medication question arises, validate the concern and connect the family with the hospice nurse or provider rather than answering directly.',
    };
  }
  if (hadMedSafetyEvent) {
    return {
      category,
      score: 2,
      evidence:
        'The learner initially provided medication guidance outside the Clinical Liaison role but later corrected to safer routing language.',
      coachingNote: 'Correcting in the moment is a strong recovery move. Aim to route the question on the first response.',
    };
  }
  if (hadAbandonmentLanguage) {
    return {
      category,
      score: 1,
      evidence: "The learner used language that may have reinforced the family's fear about care ending.",
      coachingNote:
        'Avoid wording that sounds like care stops or everyone walks away. Practice language that positions hospice as a change in focus.',
    };
  }
  if (!hadHospiceReframe && !hadSafeMedRouting) {
    return {
      category,
      score: 3,
      evidence:
        'The learner stayed within appropriate language throughout the conversation but did not demonstrate hospice reframing or safe medication routing.',
      coachingNote:
        'Clean session. The next step is practicing the language patterns that actively demonstrate the Clinical Liaison role at its best.',
    };
  }
  return {
    category,
    score: 4,
    evidence:
      'The learner stayed within appropriate language throughout the conversation and demonstrated strong clinical liaison language.',
    coachingNote:
      'This is the Clinical Liaison role at its best. The language used is both safe and trust-building.',
  };
}

function scoreClinicalEscalationJudgment(
  medEventCount: number,
  hadMedSafetyEvent: boolean,
  hadSafeMedRouting: boolean,
  medicationMomentDetected: boolean
): SkillScore {
  const category = CANONICAL_CATEGORIES[4];
  if (medEventCount > 1) {
    return {
      category,
      score: 0,
      evidence: 'The learner provided medication guidance outside the Clinical Liaison role on more than one occasion.',
      coachingNote:
        'Repeated medication boundary violations are the most critical pattern to address. When a medication question arises, validate the concern and route it immediately.',
    };
  }
  if (hadMedSafetyEvent && !hadSafeMedRouting) {
    return {
      category,
      score: 1,
      evidence:
        'The learner provided medication guidance outside the Clinical Liaison role without correcting to safer routing language.',
      coachingNote:
        'When a medication question arises, validate the concern and route it to the hospice nurse or provider. Answering directly is outside the Clinical Liaison role.',
    };
  }
  if (hadMedSafetyEvent && hadSafeMedRouting) {
    return {
      category,
      score: 2,
      evidence:
        'The learner initially provided medication guidance outside the Clinical Liaison role but recognized the mistake and corrected to safer routing language.',
      coachingNote:
        'Correcting in the moment shows good self-awareness. The goal is to route on the first response.',
    };
  }
  if (!medicationMomentDetected) {
    return {
      category,
      score: 2,
      evidence:
        'No medication question arose in this conversation, so clinical escalation judgment could not be fully assessed.',
      coachingNote:
        'Practice the medication routing language before the next session so the response is ready when a medication question arises.',
    };
  }
  return {
    category,
    score: 4,
    evidence:
      'The learner correctly routed the medication question to the hospice nurse or provider without providing guidance outside the Clinical Liaison role.',
    coachingNote:
      'This is exactly right. Routing the question validates the concern and protects the family from guidance outside your role.',
  };
}

function scoreTrustBuilding(
  hadEmotionalAck: boolean,
  hadHospiceReframe: boolean,
  hadRepairLanguage: boolean,
  hadAbandonmentLanguage: boolean
): SkillScore {
  const category = CANONICAL_CATEGORIES[5];
  if (hadEmotionalAck && hadHospiceReframe) {
    return {
      category,
      score: 4,
      evidence: "The learner acknowledged the daughter's fear and reframed hospice as continued support.",
      coachingNote:
        'Combining emotional acknowledgment with correct hospice framing is the strongest trust-building combination in this conversation.',
    };
  }
  if (hadEmotionalAck) {
    return {
      category,
      score: 3,
      evidence: "The learner acknowledged the daughter's emotional concern.",
      coachingNote:
        'Good emotional acknowledgment. The next step is pairing it with a clear hospice reframe to complete the trust-building arc.',
    };
  }
  if (hadRepairLanguage) {
    return {
      category,
      score: 2,
      evidence: 'The learner used repair language to correct earlier wording.',
      coachingNote: 'Using repair language shows self-awareness and commitment to accuracy. Keep that instinct.',
    };
  }
  if (!hadAbandonmentLanguage) {
    return {
      category,
      score: 1,
      evidence: 'No specific trust-building behaviors were detected.',
      coachingNote:
        'Practice naming the emotional concern directly and following it with language that helps the family hear that care continues.',
    };
  }
  return {
    category,
    score: 0,
    evidence: "The learner used language that reinforced the family's fear without attempting to repair the impact.",
    coachingNote:
      'When the conversation moves toward fear or abandonment framing, the fastest recovery is explicit repair language followed by a hospice reframe.',
  };
}

function scoreRoleBoundarySafety(
  medEventCount: number,
  hadMedSafetyEvent: boolean,
  hadSafeMedRouting: boolean
): SkillScore {
  const category = CANONICAL_CATEGORIES[6];
  if (medEventCount > 1) {
    return {
      category,
      score: 0,
      evidence: 'The learner provided medication guidance outside the Clinical Liaison role on more than one occasion.',
      coachingNote:
        'Repeated role boundary violations are the most critical pattern to address. The Clinical Liaison role does not include medication guidance.',
    };
  }
  if (medEventCount === 1 && !hadSafeMedRouting) {
    return {
      category,
      score: 1,
      evidence: 'The learner provided medication guidance outside the Clinical Liaison role.',
      coachingNote:
        'Medication guidance is outside the Clinical Liaison role. Validate the concern and route to the hospice nurse or provider.',
    };
  }
  if (hadMedSafetyEvent && hadSafeMedRouting) {
    return {
      category,
      score: 2,
      evidence:
        'The learner initially provided medication guidance outside the Clinical Liaison role but corrected to safer routing language.',
      coachingNote:
        'Recognizing the violation and correcting it is a strong recovery. Aim to route on the first response.',
    };
  }
  if (!hadMedSafetyEvent && !hadSafeMedRouting) {
    return {
      category,
      score: 3,
      evidence:
        'No medication guidance was provided outside the Clinical Liaison role. The medication routing language was not demonstrated in this conversation.',
      coachingNote:
        'Clean boundary session. Practice the routing language so it is ready when a medication question arises.',
    };
  }
  return {
    category,
    score: 4,
    evidence:
      'The learner stayed within the Clinical Liaison role and correctly routed the medication question to the hospice nurse or provider.',
    coachingNote:
      'This is the Clinical Liaison role at its best. Staying within role protects the family and builds trust.',
  };
}

export function generateSkillScoreReport(
  scenarioId: string,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): SkillScoreReport {
  if (scenarioId === 'copd_air_hunger_at_home' || scenarioId === 'terminal_dyspnea_follow_up') {
    return generateRnSkillScoreReport(scenarioId, conversationMessages, safetyEvents, patientStateSnapshots);
  }
  if (scenarioId === 'pain_management_concern') {
    return generatePainManagementSkillScoreReport(scenarioId, conversationMessages, safetyEvents, patientStateSnapshots);
  }
  if (scenarioId === 'medication_refusal') {
    return generateMedicationRefusalSkillScoreReport(scenarioId, conversationMessages, safetyEvents, patientStateSnapshots);
  }
  if (scenarioId === 'prognostic_uncertainty') {
    return generatePrognosticUncertaintySkillScoreReport(scenarioId, conversationMessages, safetyEvents, patientStateSnapshots);
  }
  if (scenarioId === 'esrd_comfort_care') {
    return generateEsrdComfortCareSkillScoreReport(scenarioId, conversationMessages, safetyEvents, patientStateSnapshots);
  }
  if (scenarioId === 'advanced_dementia_grief') {
    return generateAdvancedDementiaGriefSkillScoreReport(scenarioId, conversationMessages, safetyEvents, patientStateSnapshots);
  }
  if (scenarioId === 'active_dying_recognition') {
    return generateActiveDyingSkillScoreReport(scenarioId, conversationMessages, safetyEvents, patientStateSnapshots);
  }
  if (scenarioId === 'terminal_secretion_distress') {
    return generateTerminalSecretionSkillScoreReport(scenarioId, conversationMessages, safetyEvents, patientStateSnapshots);
  }
  if (scenarioId === 'breakthrough_pain_at_home') {
    return generateBreakthroughPainSkillScoreReport(scenarioId, conversationMessages, safetyEvents, patientStateSnapshots);
  }
  if (scenarioId === 'advance_directive_conflict') {
    return generateAdvanceDirectiveConflictSkillScoreReport(scenarioId, conversationMessages, safetyEvents, patientStateSnapshots);
  }
  if (scenarioId === 'caregiver_burnout') {
    return generateCaregiverBurnoutSkillScoreReport(scenarioId, conversationMessages, safetyEvents, patientStateSnapshots);
  }
  if (scenarioId === 'bereavement_first_call') {
    return generateBereavementFirstCallSkillScoreReport(scenarioId, conversationMessages, safetyEvents, patientStateSnapshots);
  }

  const hadEmotionalAck = hasBehavior(patientStateSnapshots, 'emotional_acknowledgment');
  const hadHospiceReframe = hasBehavior(patientStateSnapshots, 'hospice_reframe');
  const hadRepairLanguage = hasBehavior(patientStateSnapshots, 'repair_language');
  const hadSafeMedRouting = hasBehavior(patientStateSnapshots, 'safe_medication_routing');
  const hadAbandonmentLanguage = hasBehavior(patientStateSnapshots, 'abandonment_language');
  const hadServiceFirst = hasBehavior(patientStateSnapshots, 'service_explanation_before_emotion');
  const hadMedSafetyEvent = safetyEvents.some((e) => e.violationCategory === 'medication_outside_role');
  const medEventCount = safetyEvents.filter((e) => e.violationCategory === 'medication_outside_role').length;
  const medicationMomentDetected = conversationMessages.some(
    (m) =>
      (m.sender === 'family' || m.sender === 'patient') &&
      /morphine|medication|medicine|dose|dosage|drug/i.test(m.text)
  );

  const scores: SkillScore[] = [
    scoreEmotionalAttunement(hadEmotionalAck, hadServiceFirst, hadRepairLanguage, hadAbandonmentLanguage),
    scoreHospiceEducation(hadHospiceReframe, hadAbandonmentLanguage, hadRepairLanguage),
    scoreObjectionHandling(hadEmotionalAck, hadServiceFirst, hadAbandonmentLanguage),
    scoreComplianceSafeLanguage(hadMedSafetyEvent, hadAbandonmentLanguage, hadSafeMedRouting, hadHospiceReframe),
    scoreClinicalEscalationJudgment(medEventCount, hadMedSafetyEvent, hadSafeMedRouting, medicationMomentDetected),
    scoreTrustBuilding(hadEmotionalAck, hadHospiceReframe, hadRepairLanguage, hadAbandonmentLanguage),
    scoreRoleBoundarySafety(medEventCount, hadMedSafetyEvent, hadSafeMedRouting),
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
