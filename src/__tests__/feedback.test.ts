import { generateFeedbackReport } from '@/services/feedbackService';
import { safeLanguage } from '@/data/safeLanguage';
import type { ConversationMessage, PatientStateSnapshot, SafetyEvent } from '@/types/simulator';

const emptyMessages: ConversationMessage[] = [];
const emptyEvents: SafetyEvent[] = [];
const emptySnapshots: PatientStateSnapshot[] = [];

describe('generateFeedbackReport — suggestedWording', () => {
  it('hospice_means_giving_up returns 3 suggested wording entries', () => {
    const result = generateFeedbackReport(
      'hospice_means_giving_up',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    expect(result.suggestedWording).toHaveLength(3);
  });

  it('hospice_means_giving_up first entry matches hospice_fear_response text', () => {
    const result = generateFeedbackReport(
      'hospice_means_giving_up',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    const expected = safeLanguage.find((e) => e.id === 'hospice_fear_response')!.text;
    expect(result.suggestedWording[0]).toBe(expected);
  });

  it('can_change_minds returns 4 suggested wording entries', () => {
    const result = generateFeedbackReport(
      'can_change_minds',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    expect(result.suggestedWording).toHaveLength(4);
  });

  it('hospice_too_soon returns 4 suggested wording entries', () => {
    const result = generateFeedbackReport(
      'hospice_too_soon',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    expect(result.suggestedWording).toHaveLength(4);
  });

  it('terminal_dyspnea_follow_up returns 3 suggested wording entries and first matches rn_air_hunger_acknowledgment', () => {
    const result = generateFeedbackReport(
      'terminal_dyspnea_follow_up',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    expect(result.suggestedWording).toHaveLength(3);
    const expected = safeLanguage.find((e) => e.id === 'rn_air_hunger_acknowledgment')!.text;
    expect(result.suggestedWording[0]).toBe(expected);
  });

  it('pain_management_concern returns 3 suggested wording entries', () => {
    const result = generateFeedbackReport(
      'pain_management_concern',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    expect(result.suggestedWording).toHaveLength(3);
  });

  it('pain_management_concern first entry matches cl_pain_concern_validation text', () => {
    const result = generateFeedbackReport(
      'pain_management_concern',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    const expected = safeLanguage.find((e) => e.id === 'cl_pain_concern_validation')!.text;
    expect(result.suggestedWording[0]).toBe(expected);
  });

  it('medication_refusal returns 3 suggested wording entries', () => {
    const result = generateFeedbackReport(
      'medication_refusal',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    expect(result.suggestedWording).toHaveLength(3);
  });

  it('medication_refusal first entry matches rn_patient_autonomy text', () => {
    const result = generateFeedbackReport(
      'medication_refusal',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    const expected = safeLanguage.find((e) => e.id === 'rn_patient_autonomy')!.text;
    expect(result.suggestedWording[0]).toBe(expected);
  });

  it('prognostic_uncertainty returns 2 suggested wording entries', () => {
    const result = generateFeedbackReport(
      'prognostic_uncertainty',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    expect(result.suggestedWording).toHaveLength(2);
  });

  it('prognostic_uncertainty first entry matches cl_prognosis_estimate_reframe text', () => {
    const result = generateFeedbackReport(
      'prognostic_uncertainty',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    const expected = safeLanguage.find((e) => e.id === 'cl_prognosis_estimate_reframe')!.text;
    expect(result.suggestedWording[0]).toBe(expected);
  });

  it('esrd_comfort_care returns 3 suggested wording entries', () => {
    const result = generateFeedbackReport(
      'esrd_comfort_care',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    expect(result.suggestedWording).toHaveLength(3);
  });

  it('esrd_comfort_care first entry matches sw_autonomy_plain_language text', () => {
    const result = generateFeedbackReport(
      'esrd_comfort_care',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    const expected = safeLanguage.find((e) => e.id === 'sw_autonomy_plain_language')!.text;
    expect(result.suggestedWording[0]).toBe(expected);
  });

  it('advanced_dementia_grief returns 3 suggested wording entries', () => {
    const result = generateFeedbackReport(
      'advanced_dementia_grief',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    expect(result.suggestedWording).toHaveLength(3);
  });

  it('advanced_dementia_grief first entry matches cl_ambiguous_grief_acknowledgment text', () => {
    const result = generateFeedbackReport(
      'advanced_dementia_grief',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    const expected = safeLanguage.find((e) => e.id === 'cl_ambiguous_grief_acknowledgment')!.text;
    expect(result.suggestedWording[0]).toBe(expected);
  });

  it('active_dying_recognition returns 2 suggested wording entries', () => {
    const result = generateFeedbackReport(
      'active_dying_recognition',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    expect(result.suggestedWording).toHaveLength(2);
  });

  it('active_dying_recognition first entry matches rn_dying_process_explanation text', () => {
    const result = generateFeedbackReport(
      'active_dying_recognition',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    const expected = safeLanguage.find((e) => e.id === 'rn_dying_process_explanation')!.text;
    expect(result.suggestedWording[0]).toBe(expected);
  });

  it('terminal_secretion_distress returns 2 suggested wording entries', () => {
    const result = generateFeedbackReport(
      'terminal_secretion_distress',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    expect(result.suggestedWording).toHaveLength(2);
  });

  it('terminal_secretion_distress first entry matches rn_secretion_explanation text', () => {
    const result = generateFeedbackReport(
      'terminal_secretion_distress',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    const expected = safeLanguage.find((e) => e.id === 'rn_secretion_explanation')!.text;
    expect(result.suggestedWording[0]).toBe(expected);
  });

  it('breakthrough_pain_at_home returns 2 suggested wording entries', () => {
    const result = generateFeedbackReport(
      'breakthrough_pain_at_home',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    expect(result.suggestedWording).toHaveLength(2);
  });

  it('breakthrough_pain_at_home first entry matches rn_pain_assessment_response text', () => {
    const result = generateFeedbackReport(
      'breakthrough_pain_at_home',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    const expected = safeLanguage.find((e) => e.id === 'rn_pain_assessment_response')!.text;
    expect(result.suggestedWording[0]).toBe(expected);
  });

  it('advance_directive_conflict returns 2 suggested wording entries', () => {
    const result = generateFeedbackReport(
      'advance_directive_conflict',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    expect(result.suggestedWording).toHaveLength(2);
  });

  it('advance_directive_conflict first entry matches sw_surrogate_decision_explained text', () => {
    const result = generateFeedbackReport(
      'advance_directive_conflict',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    const expected = safeLanguage.find((e) => e.id === 'sw_surrogate_decision_explained')!.text;
    expect(result.suggestedWording[0]).toBe(expected);
  });

  it('caregiver_burnout returns 2 suggested wording entries', () => {
    const result = generateFeedbackReport(
      'caregiver_burnout',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    expect(result.suggestedWording).toHaveLength(2);
  });

  it('caregiver_burnout first entry matches sw_caregiver_burden_validation text', () => {
    const result = generateFeedbackReport(
      'caregiver_burnout',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    const expected = safeLanguage.find((e) => e.id === 'sw_caregiver_burden_validation')!.text;
    expect(result.suggestedWording[0]).toBe(expected);
  });

  it('bereavement_first_call returns 2 suggested wording entries', () => {
    const result = generateFeedbackReport(
      'bereavement_first_call',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    expect(result.suggestedWording).toHaveLength(2);
  });

  it('bereavement_first_call first entry matches sw_grief_normalization text', () => {
    const result = generateFeedbackReport(
      'bereavement_first_call',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    const expected = safeLanguage.find((e) => e.id === 'sw_grief_normalization')!.text;
    expect(result.suggestedWording[0]).toBe(expected);
  });

  it('terminal_dyspnea_follow_up suggestedWording does not include CL-only wording', () => {
    const result = generateFeedbackReport(
      'terminal_dyspnea_follow_up',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    const clOnlyIds = [
      'hospice_fear_response',
      'repair_language',
      'cl_too_soon_validation',
      'cl_hospice_timeline_education',
      'cl_what_hospice_provides',
      'cl_revocation_plain_language',
      'cl_hospice_as_choice',
      'cl_revocation_repair',
    ];
    const clTexts = clOnlyIds
      .map((id) => safeLanguage.find((e) => e.id === id)?.text)
      .filter((t): t is string => t !== undefined);
    result.suggestedWording.forEach((w) => {
      expect(clTexts).not.toContain(w);
    });
  });
});
