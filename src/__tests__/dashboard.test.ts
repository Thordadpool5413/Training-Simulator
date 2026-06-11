import { generateDashboardSummary } from '@/services/dashboardService';
import { patientStateDefaults } from '@/data/patientStateDefaults';
import type { ConversationMessage, PatientStateSnapshot, SafetyEvent } from '@/types/simulator';

const emptyMessages: ConversationMessage[] = [];
const emptyEvents: SafetyEvent[] = [];
const emptySnapshots: PatientStateSnapshot[] = [];

const baseState = patientStateDefaults['hospice_means_giving_up'];
const rnBaseState = patientStateDefaults['terminal_dyspnea_follow_up'];
const pmBaseState = patientStateDefaults['pain_management_concern'];
const mrBaseState = patientStateDefaults['medication_refusal'];

const learnerMessage: ConversationMessage = {
  id: 'msg-1',
  sender: 'learner',
  speakerName: 'Learner',
  text: 'I understand your concern.',
  createdAt: '2026-01-01T10:00:00.000Z',
};

const medEvent: SafetyEvent = {
  id: 'evt-1',
  scenarioId: 'hospice_means_giving_up',
  learnerMessageText: 'We can increase her morphine.',
  violationCategory: 'medication_outside_role',
  severity: 'critical_simulation_stop',
  message: 'Training Pause',
  feedbackHook: null,
  createdAt: '2026-01-01T10:01:00.000Z',
};

const recoverySnapshot: PatientStateSnapshot = {
  id: 'snap-1',
  scenarioId: 'hospice_means_giving_up',
  learnerMessageId: 'msg-2',
  stateBefore: baseState,
  stateAfter: baseState,
  detectedBehaviors: ['safe_medication_routing'],
  stateChangeSummary: 'Learner routed medication question safely.',
  createdAt: '2026-01-01T10:02:00.000Z',
};

describe('generateDashboardSummary', () => {
  it('scenarioTitle resolves from scenarioTemplates', () => {
    const result = generateDashboardSummary(
      'hospice_means_giving_up',
      'clinical_liaison',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.scenarioTitle).toBe('Hospice Means Giving Up');
  });

  it('safetyFlagsResolved is 0 when no safety events exist', () => {
    const result = generateDashboardSummary(
      'hospice_means_giving_up',
      'clinical_liaison',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.safetyFlagsResolved).toBe(0);
  });

  it('safetyFlagsResolved is 1 when recovery snapshot follows safety event', () => {
    const result = generateDashboardSummary(
      'hospice_means_giving_up',
      'clinical_liaison',
      [learnerMessage],
      [medEvent],
      [recoverySnapshot]
    );
    expect(result.safetyFlagsResolved).toBe(1);
  });

  it('terminal_dyspnea_follow_up resolves scenarioTitle to Terminal Dyspnea Follow Up Conversation', () => {
    const result = generateDashboardSummary(
      'terminal_dyspnea_follow_up',
      'rn',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.scenarioTitle).toBe('Terminal Dyspnea Follow Up Conversation');
  });

  it('pain_management_concern resolves scenarioTitle to Why Is He Still in Pain?', () => {
    const result = generateDashboardSummary(
      'pain_management_concern',
      'clinical_liaison',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.scenarioTitle).toBe('Why Is He Still in Pain?');
  });

  it('medication_refusal resolves scenarioTitle to She Won\'t Take the Medicine', () => {
    const result = generateDashboardSummary(
      'medication_refusal',
      'rn',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.scenarioTitle).toBe("She Won't Take the Medicine");
  });

  it('pain_management_concern safetyFlagsResolved is 0 when no safety events exist', () => {
    const result = generateDashboardSummary(
      'pain_management_concern',
      'clinical_liaison',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.safetyFlagsResolved).toBe(0);
  });

  it('pain_management_concern safetyFlagsResolved is 1 when routing recovery follows medication event', () => {
    const pmMedEvent: SafetyEvent = {
      id: 'evt-pm-1',
      scenarioId: 'pain_management_concern',
      learnerMessageText: 'You can increase the morphine dose.',
      violationCategory: 'medication_outside_role',
      severity: 'critical_simulation_stop',
      message: 'Training Pause',
      feedbackHook: null,
      createdAt: '2026-01-01T10:01:00.000Z',
    };
    const pmRecoverySnapshot: PatientStateSnapshot = {
      id: 'snap-pm-1',
      scenarioId: 'pain_management_concern',
      learnerMessageId: 'msg-2',
      stateBefore: pmBaseState,
      stateAfter: pmBaseState,
      detectedBehaviors: ['safe_medication_routing'],
      stateChangeSummary: 'Learner routed pain question to nurse.',
      createdAt: '2026-01-01T10:02:00.000Z',
    };
    const result = generateDashboardSummary(
      'pain_management_concern',
      'clinical_liaison',
      [learnerMessage],
      [pmMedEvent],
      [pmRecoverySnapshot]
    );
    expect(result.safetyFlagsResolved).toBe(1);
  });

  it('medication_refusal safetyFlagsResolved is 1 after RN dose event followed by routing recovery', () => {
    const mrMedEvent: SafetyEvent = {
      id: 'evt-mr-1',
      scenarioId: 'medication_refusal',
      learnerMessageText: 'Give her 0.5 mg of morphine.',
      violationCategory: 'rn_medication_dose_outside_orders',
      severity: 'clinical_safety_concern',
      message: 'Training Pause',
      feedbackHook: null,
      createdAt: '2026-01-01T10:01:00.000Z',
    };
    const mrRecoverySnapshot: PatientStateSnapshot = {
      id: 'snap-mr-1',
      scenarioId: 'medication_refusal',
      learnerMessageId: 'msg-2',
      stateBefore: mrBaseState,
      stateAfter: mrBaseState,
      detectedBehaviors: ['safe_medication_routing'],
      stateChangeSummary: 'Learner routed dose question to provider.',
      createdAt: '2026-01-01T10:02:00.000Z',
    };
    const result = generateDashboardSummary(
      'medication_refusal',
      'rn',
      [learnerMessage],
      [mrMedEvent],
      [mrRecoverySnapshot]
    );
    expect(result.safetyFlagsResolved).toBe(1);
  });

  it('terminal_dyspnea_follow_up safetyFlagsResolved is 1 after RN dose event followed by routing recovery', () => {
    const rnMedEvent: SafetyEvent = {
      id: 'evt-rn-1',
      scenarioId: 'terminal_dyspnea_follow_up',
      learnerMessageText: 'Give her 2 mg more of the morphine.',
      violationCategory: 'rn_medication_dose_outside_orders',
      severity: 'clinical_safety_concern',
      message: 'Training Pause',
      feedbackHook: null,
      createdAt: '2026-01-01T10:01:00.000Z',
    };
    const rnRecoverySnapshot: PatientStateSnapshot = {
      id: 'snap-rn-1',
      scenarioId: 'terminal_dyspnea_follow_up',
      learnerMessageId: 'msg-2',
      stateBefore: rnBaseState,
      stateAfter: rnBaseState,
      detectedBehaviors: ['safe_medication_routing'],
      stateChangeSummary: 'Learner routed medication question safely.',
      createdAt: '2026-01-01T10:02:00.000Z',
    };
    const result = generateDashboardSummary(
      'terminal_dyspnea_follow_up',
      'rn',
      [learnerMessage],
      [rnMedEvent],
      [rnRecoverySnapshot]
    );
    expect(result.safetyFlagsResolved).toBe(1);
  });
});
