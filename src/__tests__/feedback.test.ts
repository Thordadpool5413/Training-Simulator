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
