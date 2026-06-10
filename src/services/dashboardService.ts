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
    activeScenarioId === 'terminal_dyspnea_follow_up';

  let nextRecommendedScenario: string;
  if (isRnScenario) {
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
