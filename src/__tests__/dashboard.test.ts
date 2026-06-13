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
const puBaseState = patientStateDefaults['prognostic_uncertainty'];
const adBaseState = patientStateDefaults['active_dying_recognition'];
const tsBaseState = patientStateDefaults['terminal_secretion_distress'];
const bpBaseState = patientStateDefaults['breakthrough_pain_at_home'];

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

  it('prognostic_uncertainty resolves scenarioTitle to Six Months Was Six Months Ago', () => {
    const result = generateDashboardSummary(
      'prognostic_uncertainty',
      'clinical_liaison',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.scenarioTitle).toBe('Six Months Was Six Months Ago');
  });

  it("esrd_comfort_care resolves scenarioTitle to He's Choosing to Die", () => {
    const result = generateDashboardSummary(
      'esrd_comfort_care',
      'social_worker',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.scenarioTitle).toBe("He's Choosing to Die");
  });

  it("advanced_dementia_grief resolves scenarioTitle to She Doesn't Know Who I Am Anymore", () => {
    const result = generateDashboardSummary(
      'advanced_dementia_grief',
      'clinical_liaison',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.scenarioTitle).toBe("She Doesn't Know Who I Am Anymore");
  });

  it('prognostic_uncertainty safetyFlagsResolved is 0 when no safety events exist', () => {
    const result = generateDashboardSummary(
      'prognostic_uncertainty',
      'clinical_liaison',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.safetyFlagsResolved).toBe(0);
  });

  it('prognostic_uncertainty safetyFlagsResolved is 1 when routing recovery follows medication event', () => {
    const puMedEvent = {
      id: 'evt-pu-1',
      scenarioId: 'prognostic_uncertainty',
      learnerMessageText: 'We can increase her morphine.',
      violationCategory: 'medication_outside_role' as const,
      severity: 'critical_simulation_stop' as const,
      message: 'Training Pause',
      feedbackHook: null,
      createdAt: '2026-01-01T10:01:00.000Z',
    };
    const puRecoverySnapshot = {
      id: 'snap-pu-1',
      scenarioId: 'prognostic_uncertainty',
      learnerMessageId: 'msg-2',
      stateBefore: puBaseState,
      stateAfter: puBaseState,
      detectedBehaviors: ['safe_medication_routing'],
      stateChangeSummary: 'Learner routed medication question safely.',
      createdAt: '2026-01-01T10:02:00.000Z',
    };
    const result = generateDashboardSummary(
      'prognostic_uncertainty',
      'clinical_liaison',
      [learnerMessage],
      [puMedEvent],
      [puRecoverySnapshot]
    );
    expect(result.safetyFlagsResolved).toBe(1);
  });

  it('esrd_comfort_care safetyFlagsResolved is 0 when no safety events exist', () => {
    const result = generateDashboardSummary(
      'esrd_comfort_care',
      'social_worker',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.safetyFlagsResolved).toBe(0);
  });

  it('advanced_dementia_grief safetyFlagsResolved is 0 when no safety events exist', () => {
    const result = generateDashboardSummary(
      'advanced_dementia_grief',
      'clinical_liaison',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.safetyFlagsResolved).toBe(0);
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

  it('active_dying_recognition resolves scenarioTitle to Is She Dying Right Now?', () => {
    const result = generateDashboardSummary(
      'active_dying_recognition',
      'rn',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.scenarioTitle).toBe('Is She Dying Right Now?');
  });

  it('active_dying_recognition safetyFlagsResolved is 0 when no safety events exist', () => {
    const result = generateDashboardSummary(
      'active_dying_recognition',
      'rn',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.safetyFlagsResolved).toBe(0);
  });

  it('active_dying_recognition safetyFlagsResolved is 1 after RN dose event followed by routing recovery', () => {
    const adMedEvent: SafetyEvent = {
      id: 'evt-ad-1',
      scenarioId: 'active_dying_recognition',
      learnerMessageText: 'You can give her extra morphine.',
      violationCategory: 'rn_medication_dose_outside_orders',
      severity: 'clinical_safety_concern',
      message: 'Training Pause',
      feedbackHook: null,
      createdAt: '2026-01-01T10:01:00.000Z',
    };
    const adRecoverySnapshot: PatientStateSnapshot = {
      id: 'snap-ad-1',
      scenarioId: 'active_dying_recognition',
      learnerMessageId: 'msg-2',
      stateBefore: adBaseState,
      stateAfter: adBaseState,
      detectedBehaviors: ['safe_medication_routing'],
      stateChangeSummary: 'Learner routed dose question to provider.',
      createdAt: '2026-01-01T10:02:00.000Z',
    };
    const result = generateDashboardSummary(
      'active_dying_recognition',
      'rn',
      [learnerMessage],
      [adMedEvent],
      [adRecoverySnapshot]
    );
    expect(result.safetyFlagsResolved).toBe(1);
  });

  it('terminal_secretion_distress resolves scenarioTitle to He Sounds Like He Is Drowning', () => {
    const result = generateDashboardSummary(
      'terminal_secretion_distress',
      'rn',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.scenarioTitle).toBe('He Sounds Like He Is Drowning');
  });

  it('terminal_secretion_distress safetyFlagsResolved is 0 when no safety events exist', () => {
    const result = generateDashboardSummary(
      'terminal_secretion_distress',
      'rn',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.safetyFlagsResolved).toBe(0);
  });

  it('terminal_secretion_distress safetyFlagsResolved is 1 after RN dose event followed by routing recovery', () => {
    const tsMedEvent: SafetyEvent = {
      id: 'evt-ts-1',
      scenarioId: 'terminal_secretion_distress',
      learnerMessageText: 'Give him an extra dose of the glycopyrrolate.',
      violationCategory: 'rn_medication_dose_outside_orders',
      severity: 'clinical_safety_concern',
      message: 'Training Pause',
      feedbackHook: null,
      createdAt: '2026-01-01T10:01:00.000Z',
    };
    const tsRecoverySnapshot: PatientStateSnapshot = {
      id: 'snap-ts-1',
      scenarioId: 'terminal_secretion_distress',
      learnerMessageId: 'msg-2',
      stateBefore: tsBaseState,
      stateAfter: tsBaseState,
      detectedBehaviors: ['safe_medication_routing'],
      stateChangeSummary: 'Learner routed dose question to provider.',
      createdAt: '2026-01-01T10:02:00.000Z',
    };
    const result = generateDashboardSummary(
      'terminal_secretion_distress',
      'rn',
      [learnerMessage],
      [tsMedEvent],
      [tsRecoverySnapshot]
    );
    expect(result.safetyFlagsResolved).toBe(1);
  });

  it('breakthrough_pain_at_home resolves scenarioTitle to The Medicine Is Not Working', () => {
    const result = generateDashboardSummary(
      'breakthrough_pain_at_home',
      'rn',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.scenarioTitle).toBe('The Medicine Is Not Working');
  });

  it('breakthrough_pain_at_home safetyFlagsResolved is 0 when no safety events exist', () => {
    const result = generateDashboardSummary(
      'breakthrough_pain_at_home',
      'rn',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.safetyFlagsResolved).toBe(0);
  });

  it('breakthrough_pain_at_home safetyFlagsResolved is 1 after RN dose event followed by routing recovery', () => {
    const bpMedEvent: SafetyEvent = {
      id: 'evt-bp-1',
      scenarioId: 'breakthrough_pain_at_home',
      learnerMessageText: 'You can give him 10 mg of oxycodone now.',
      violationCategory: 'rn_medication_dose_outside_orders',
      severity: 'clinical_safety_concern',
      message: 'Training Pause',
      feedbackHook: null,
      createdAt: '2026-01-01T10:01:00.000Z',
    };
    const bpRecoverySnapshot: PatientStateSnapshot = {
      id: 'snap-bp-1',
      scenarioId: 'breakthrough_pain_at_home',
      learnerMessageId: 'msg-2',
      stateBefore: bpBaseState,
      stateAfter: bpBaseState,
      detectedBehaviors: ['safe_medication_routing'],
      stateChangeSummary: 'Learner routed dose question to provider.',
      createdAt: '2026-01-01T10:02:00.000Z',
    };
    const result = generateDashboardSummary(
      'breakthrough_pain_at_home',
      'rn',
      [learnerMessage],
      [bpMedEvent],
      [bpRecoverySnapshot]
    );
    expect(result.safetyFlagsResolved).toBe(1);
  });

  it("advance_directive_conflict resolves scenarioTitle to She Never Said What She Wanted", () => {
    const result = generateDashboardSummary(
      'advance_directive_conflict',
      'social_worker',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.scenarioTitle).toBe("She Never Said What She Wanted");
  });

  it('advance_directive_conflict safetyFlagsResolved is 0 when no safety events exist', () => {
    const result = generateDashboardSummary(
      'advance_directive_conflict',
      'social_worker',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.safetyFlagsResolved).toBe(0);
  });

  it("caregiver_burnout resolves scenarioTitle to I Cannot Keep Doing This", () => {
    const result = generateDashboardSummary(
      'caregiver_burnout',
      'social_worker',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.scenarioTitle).toBe("I Cannot Keep Doing This");
  });

  it('caregiver_burnout safetyFlagsResolved is 0 when no safety events exist', () => {
    const result = generateDashboardSummary(
      'caregiver_burnout',
      'social_worker',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.safetyFlagsResolved).toBe(0);
  });

  it("bereavement_first_call resolves scenarioTitle to I Keep Forgetting He Is Gone", () => {
    const result = generateDashboardSummary(
      'bereavement_first_call',
      'social_worker',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.scenarioTitle).toBe("I Keep Forgetting He Is Gone");
  });

  it('bereavement_first_call safetyFlagsResolved is 0 when no safety events exist', () => {
    const result = generateDashboardSummary(
      'bereavement_first_call',
      'social_worker',
      [learnerMessage],
      emptyEvents,
      emptySnapshots
    );
    expect(result.safetyFlagsResolved).toBe(0);
  });
});
