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
});
