import { roles } from '@/data/roles';
import { scenarioTemplates } from '@/data/scenarioTemplates';
import { generateFeedbackReport } from '@/services/feedbackService';
import { generateSkillScoreReport } from '@/services/scoringService';
import type {
  ConversationMessage,
  DashboardSummary,
  PatientStateSnapshot,
  SafetyEvent,
} from '@/types/simulator';

function hasBehavior(snapshots: PatientStateSnapshot[], behavior: string): boolean {
  return snapshots.some((s) => s.detectedBehaviors.includes(behavior));
}

export function generateDashboardSummary(
  activeScenarioId: string | null,
  selectedRoleId: string | null,
  conversationMessages: ConversationMessage[],
  safetyEvents: SafetyEvent[],
  patientStateSnapshots: PatientStateSnapshot[]
): DashboardSummary {
  const scenarioTitle =
    scenarioTemplates.find((s) => s.id === activeScenarioId)?.title ?? 'Current Scenario';
  const learnerRole =
    roles.find((r) => r.id === selectedRoleId)?.name ?? 'Selected Role';

  const hasLearnerMessage = conversationMessages.some((m) => m.sender === 'learner');
  const completedScenarios = activeScenarioId && hasLearnerMessage ? 1 : 0;

  // Behavior flags (safe on empty arrays)
  const hadMedEvent = safetyEvents.some((e) => e.violationCategory === 'medication_outside_role');
  const hadServiceFirst = hasBehavior(patientStateSnapshots, 'service_explanation_before_emotion');
  const hadHospiceReframe = hasBehavior(patientStateSnapshots, 'hospice_reframe');

  const isRnScenario =
    activeScenarioId === 'copd_air_hunger_at_home' ||
    activeScenarioId === 'terminal_dyspnea_follow_up' ||
    activeScenarioId === 'medication_refusal' ||
    activeScenarioId === 'active_dying_recognition' ||
    activeScenarioId === 'terminal_secretion_distress' ||
    activeScenarioId === 'breakthrough_pain_at_home';

  const isPainManagementScenario = activeScenarioId === 'pain_management_concern';
  const isPrognosticUncertainty = activeScenarioId === 'prognostic_uncertainty';
  const isEsrdComfortCare = activeScenarioId === 'esrd_comfort_care';
  const isAdvancedDementiaGrief = activeScenarioId === 'advanced_dementia_grief';
  const isAdvanceDirectiveConflict = activeScenarioId === 'advance_directive_conflict';
  const isCaregiverBurnout = activeScenarioId === 'caregiver_burnout';
  const isBereavementFirstCall = activeScenarioId === 'bereavement_first_call';

  let nextRecommendedScenario: string;
  if (activeScenarioId === 'medication_refusal') {
    const hadConsentEvent = safetyEvents.some(
      (e) => e.violationCategory === 'patient_consent_violation'
    );
    const hadRnMedEvent = safetyEvents.some(
      (e) => e.violationCategory === 'rn_medication_dose_outside_orders'
    );
    const hadCaregiverAck = hasBehavior(patientStateSnapshots, 'caregiver_distress_acknowledged');
    const hadAutonomy = hasBehavior(patientStateSnapshots, 'patient_autonomy_respected');
    const hadStrategy = hasBehavior(patientStateSnapshots, 'communication_strategy_provided');

    if (hadConsentEvent) {
      nextRecommendedScenario = 'Patient Consent and Covert Administration Refusal Practice';
    } else if (hadRnMedEvent) {
      nextRecommendedScenario = 'RN Medication Dose Boundary Practice';
    } else if (!hadCaregiverAck) {
      nextRecommendedScenario = 'Caregiver Distress Acknowledgment Practice';
    } else if (!hadAutonomy) {
      nextRecommendedScenario = 'Patient Autonomy Education Practice';
    } else if (!hadStrategy) {
      nextRecommendedScenario = 'Medication Offer Communication Strategy Practice';
    } else {
      nextRecommendedScenario = 'Advanced Patient Autonomy and Family Communication';
    }
  } else if (isPainManagementScenario) {
    const hadAngerAck = hasBehavior(patientStateSnapshots, 'emotional_acknowledgment');
    const hadNurseRouting = hasBehavior(patientStateSnapshots, 'safe_medication_routing');
    const hadAbandonmentLanguage = hasBehavior(patientStateSnapshots, 'abandonment_language');

    if (hadMedEvent) {
      nextRecommendedScenario = 'Clinical Liaison Pain Routing Practice';
    } else if (hadAbandonmentLanguage) {
      nextRecommendedScenario = 'Hospice Pain Communication Practice';
    } else if (!hadAngerAck) {
      nextRecommendedScenario = 'Family Anger Acknowledgment Practice';
    } else if (!hadNurseRouting) {
      nextRecommendedScenario = 'Clinical Liaison Nurse Routing Practice';
    } else {
      nextRecommendedScenario = 'Advanced Family Distress and Clinical Routing Conversation';
    }
  } else if (isPrognosticUncertainty) {
    const hadPrognosisPromise = hasBehavior(patientStateSnapshots, 'prognosis_promise');
    const hadPanicAck = hasBehavior(patientStateSnapshots, 'emotional_acknowledgment');
    const hadPrognosisReframe = hasBehavior(patientStateSnapshots, 'prognosis_reframe');
    const hadClinicalRouting = hasBehavior(patientStateSnapshots, 'clinical_routing');

    if (hadPrognosisPromise) {
      nextRecommendedScenario = 'Prognosis Communication Boundary Practice';
    } else if (!hadPanicAck) {
      nextRecommendedScenario = 'Family Panic Acknowledgment Practice';
    } else if (!hadPrognosisReframe) {
      nextRecommendedScenario = 'Prognosis Estimate Reframing Practice';
    } else if (!hadClinicalRouting) {
      nextRecommendedScenario = 'Clinical Signs Routing Practice';
    } else {
      nextRecommendedScenario = 'Advanced Prognosis Communication and Family Planning';
    }
  } else if (isEsrdComfortCare) {
    const hadSidesTaken = hasBehavior(patientStateSnapshots, 'sides_taken');
    const hadCapacityDetermination = hasBehavior(patientStateSnapshots, 'capacity_determination');
    const hadEmotionalAckEsrd = hasBehavior(patientStateSnapshots, 'emotional_acknowledgment');
    const hadAutonomy = hasBehavior(patientStateSnapshots, 'autonomy_respected');
    const hadValues = hasBehavior(patientStateSnapshots, 'values_elicitation');

    if (hadSidesTaken) {
      nextRecommendedScenario = 'Social Worker Neutrality Practice';
    } else if (hadCapacityDetermination) {
      nextRecommendedScenario = 'Clinical Capacity Routing Practice';
    } else if (!hadEmotionalAckEsrd) {
      nextRecommendedScenario = 'Family Grief Acknowledgment Practice';
    } else if (!hadAutonomy) {
      nextRecommendedScenario = 'Patient Autonomy Education Practice';
    } else if (!hadValues) {
      nextRecommendedScenario = 'Patient Values Elicitation Practice';
    } else {
      nextRecommendedScenario = 'Advanced Autonomy and Family Mediation Conversation';
    }
  } else if (isAdvancedDementiaGrief) {
    const hadAbandonmentAdg = hasBehavior(patientStateSnapshots, 'abandonment_language');
    const hadGriefAck = hasBehavior(patientStateSnapshots, 'grief_normalization');
    const hadHospiceReframeAdg = hasBehavior(patientStateSnapshots, 'hospice_reframe');
    const hadRevocation = hasBehavior(patientStateSnapshots, 'revocation_education');

    if (hadMedEvent) {
      nextRecommendedScenario = 'Clinical Liaison Role Boundary Practice';
    } else if (hadAbandonmentAdg) {
      nextRecommendedScenario = 'Hospice Framing Without Abandonment Language Practice';
    } else if (!hadGriefAck) {
      nextRecommendedScenario = 'Ambiguous Loss Acknowledgment Practice';
    } else if (!hadHospiceReframeAdg) {
      nextRecommendedScenario = 'Dementia Hospice Reframe Practice';
    } else if (!hadRevocation) {
      nextRecommendedScenario = 'Hospice Revocation Education Practice';
    } else {
      nextRecommendedScenario = 'Advanced Grief and Hospice Readiness Conversation';
    }
  } else if (isAdvanceDirectiveConflict) {
    const hadSidesTakenAdc = hasBehavior(patientStateSnapshots, 'sides_taken');
    const hadDirectivePressure = hasBehavior(patientStateSnapshots, 'directive_pressure');
    const hadFamilyMeeting = hasBehavior(patientStateSnapshots, 'family_meeting_offered');
    const hadSurrogateConcept = hasBehavior(patientStateSnapshots, 'surrogate_decision_explained');
    const hadAdvDirectiveEd = hasBehavior(patientStateSnapshots, 'advance_directive_education');
    const hadEmotionalAckAdc = hasBehavior(patientStateSnapshots, 'emotional_acknowledgment');

    if (hadSidesTakenAdc) {
      nextRecommendedScenario = 'Social Worker Neutrality in Family Conflict Practice';
    } else if (hadDirectivePressure) {
      nextRecommendedScenario = 'Facilitation Without Directive Pressure Practice';
    } else if (!hadEmotionalAckAdc) {
      nextRecommendedScenario = 'Grief Acknowledgment in Family Conflict Practice';
    } else if (!hadSurrogateConcept) {
      nextRecommendedScenario = 'Surrogate Decision-Making Education Practice';
    } else if (!hadAdvDirectiveEd) {
      nextRecommendedScenario = 'Advance Directive Education Practice';
    } else if (!hadFamilyMeeting) {
      nextRecommendedScenario = 'Family Meeting Facilitation Practice';
    } else {
      nextRecommendedScenario = 'Advanced Advance Directive Conflict Mediation';
    }
  } else if (isCaregiverBurnout) {
    const hadPlacementPressure = hasBehavior(patientStateSnapshots, 'placement_pressure');
    const hadMinimizationCb = hasBehavior(patientStateSnapshots, 'minimization');
    const hadGuiltValidation = hasBehavior(patientStateSnapshots, 'guilt_validation');
    const hadResourceOffered = hasBehavior(patientStateSnapshots, 'resource_offered');
    const hadCaregiverAssessment = hasBehavior(patientStateSnapshots, 'caregiver_assessment');
    const hadEmotionalAckCb = hasBehavior(patientStateSnapshots, 'emotional_acknowledgment');

    if (hadPlacementPressure) {
      nextRecommendedScenario = 'Caregiver Placement Pressure Awareness Practice';
    } else if (hadMinimizationCb) {
      nextRecommendedScenario = 'Caregiver Burden Validation Without Minimization Practice';
    } else if (!hadEmotionalAckCb) {
      nextRecommendedScenario = 'Caregiver Exhaustion Acknowledgment Practice';
    } else if (!hadGuiltValidation) {
      nextRecommendedScenario = 'Caregiver Guilt Validation Practice';
    } else if (!hadCaregiverAssessment) {
      nextRecommendedScenario = 'Caregiver Needs Assessment Practice';
    } else if (!hadResourceOffered) {
      nextRecommendedScenario = 'Caregiver Resource Navigation Practice';
    } else {
      nextRecommendedScenario = 'Advanced Caregiver Burnout and Resource Planning';
    }
  } else if (isBereavementFirstCall) {
    const hadMinimizationBfc = hasBehavior(patientStateSnapshots, 'minimization');
    const hadPathologizing = hasBehavior(patientStateSnapshots, 'pathologizing');
    const hadGriefNorm = hasBehavior(patientStateSnapshots, 'grief_normalization');
    const hadBereavementEd = hasBehavior(patientStateSnapshots, 'bereavement_education');
    const hadComplicatedGriefRouting = hasBehavior(patientStateSnapshots, 'complicated_grief_routing');
    const hadEmotionalAckBfc = hasBehavior(patientStateSnapshots, 'emotional_acknowledgment');

    if (hadPathologizing) {
      nextRecommendedScenario = 'Bereavement Normalization Without Pathologizing Practice';
    } else if (hadMinimizationBfc) {
      nextRecommendedScenario = 'Grief Validation Without Minimization Practice';
    } else if (!hadEmotionalAckBfc) {
      nextRecommendedScenario = 'Bereavement Grief Acknowledgment Practice';
    } else if (!hadGriefNorm) {
      nextRecommendedScenario = 'Morning Re-Grief Normalization Practice';
    } else if (!hadBereavementEd) {
      nextRecommendedScenario = 'Bereavement Program Education Practice';
    } else if (!hadComplicatedGriefRouting) {
      nextRecommendedScenario = 'Complicated Grief Assessment Practice';
    } else {
      nextRecommendedScenario = 'Advanced Bereavement First Call Conversation';
    }
  } else if (isRnScenario) {
    const hadRnMedEvent = safetyEvents.some(
      (e) => e.violationCategory === 'rn_medication_dose_outside_orders'
    );
    const hadDoseOverstep = hasBehavior(patientStateSnapshots, 'medication_dose_overstep');
    const hadOverpromise = hasBehavior(patientStateSnapshots, 'overpromise_symptom_control');
    const hadFearAckRn = hasBehavior(patientStateSnapshots, 'fear_acknowledgment');
    const hadAirHungerExp = hasBehavior(patientStateSnapshots, 'air_hunger_explanation');
    const hadComfortEdRn = hasBehavior(patientStateSnapshots, 'comfort_education');
    const hadCaregiverEmpow = hasBehavior(patientStateSnapshots, 'caregiver_empowerment');

    if (hadRnMedEvent || hadDoseOverstep) {
      nextRecommendedScenario = 'RN Medication Dose Boundary Practice';
    } else if (hadOverpromise) {
      nextRecommendedScenario = 'Comfort Communication Without Overpromising';
    } else if (!hadFearAckRn) {
      nextRecommendedScenario = 'Air Hunger Fear Acknowledgment Practice';
    } else if (!hadAirHungerExp) {
      nextRecommendedScenario = 'Plain Language Air Hunger Explanation Practice';
    } else if (!hadComfortEdRn) {
      nextRecommendedScenario = 'Home Comfort Plan Teaching Practice';
    } else if (!hadCaregiverEmpow) {
      nextRecommendedScenario = 'Caregiver Empowerment and Next Step Practice';
    } else {
      nextRecommendedScenario = activeScenarioId === 'terminal_dyspnea_follow_up'
        ? 'Advanced Comfort Care Conversations'
        : 'Terminal Dyspnea Follow Up Conversation';
    }
  } else {
    if (hadMedEvent) {
      nextRecommendedScenario = 'Medication Question Outside Role';
    } else if (hadServiceFirst) {
      nextRecommendedScenario = 'Hospice Objection Practice';
    } else if (!hadHospiceReframe) {
      nextRecommendedScenario = 'Hospice Support Explanation Practice';
    } else {
      nextRecommendedScenario = 'Hospital Discharge Planning Conversation';
    }
  }

  // Sequence-aware: only count resolved if a recovery snapshot is timestamped after the safety event
  let safetyFlagsResolved = 0;
  if (isRnScenario) {
    const firstRnMedEvent = safetyEvents.find(
      (e) => e.violationCategory === 'rn_medication_dose_outside_orders'
    );
    if (firstRnMedEvent) {
      const rnEventTime = Date.parse(firstRnMedEvent.createdAt);
      if (!isNaN(rnEventTime)) {
        const hasLaterRnRecovery = patientStateSnapshots.some((s) => {
          if (
            !s.detectedBehaviors.includes('role_boundary_respected') &&
            !s.detectedBehaviors.includes('safe_medication_routing')
          ) return false;
          const snapTime = Date.parse(s.createdAt);
          if (isNaN(snapTime)) return false;
          return snapTime > rnEventTime;
        });
        if (hasLaterRnRecovery) safetyFlagsResolved = 1;
      }
    }
  } else {
    const firstMedEvent = safetyEvents.find((e) => e.violationCategory === 'medication_outside_role');
    if (firstMedEvent) {
      const medEventTime = Date.parse(firstMedEvent.createdAt);
      if (!isNaN(medEventTime)) {
        const hasLaterRouting = patientStateSnapshots.some((s) => {
          if (!s.detectedBehaviors.includes('safe_medication_routing')) return false;
          const snapTime = Date.parse(s.createdAt);
          if (isNaN(snapTime)) return false;
          return snapTime > medEventTime;
        });
        if (hasLaterRouting) safetyFlagsResolved = 1;
      }
    }
  }

  // No valid session: return defaults without calling feedback or scoring services
  if (!activeScenarioId || !hasLearnerMessage) {
    return {
      scenarioTitle,
      learnerRole,
      completedScenarios,
      averageScore: 0,
      strongestSkill: 'Not available yet',
      mainGrowthArea: 'Not available yet',
      safetyFlagsResolved,
      nextRecommendedScenario,
      nextPracticeFocus: 'Complete a simulation to receive a practice focus.',
      summaryMessage:
        'You have not completed a simulation yet. Start with the Clinical Liaison scenario to generate dashboard results.',
    };
  }

  // activeScenarioId is narrowed to string after the guard above
  const scoreReport = generateSkillScoreReport(
    activeScenarioId,
    conversationMessages,
    safetyEvents,
    patientStateSnapshots
  );
  const feedbackReport = generateFeedbackReport(
    activeScenarioId,
    conversationMessages,
    safetyEvents,
    patientStateSnapshots
  );

  const strongestSkill = scoreReport.primaryStrength;
  const mainGrowthArea = scoreReport.primaryGrowthArea;

  return {
    scenarioTitle,
    learnerRole,
    completedScenarios,
    averageScore: scoreReport.overallScore,
    strongestSkill,
    mainGrowthArea,
    safetyFlagsResolved,
    nextRecommendedScenario,
    nextPracticeFocus: feedbackReport.nextPracticeFocus,
    summaryMessage: `You completed the ${scenarioTitle} scenario. Your strongest skill was ${strongestSkill}, and your main growth area is ${mainGrowthArea}.`,
  };
}
