import { generateSkillScoreReport } from '@/services/scoringService';
import type { ConversationMessage, PatientStateSnapshot, SafetyEvent } from '@/types/simulator';

const emptyMessages: ConversationMessage[] = [];
const emptyEvents: SafetyEvent[] = [];
const emptySnapshots: PatientStateSnapshot[] = [];

const CL_CATEGORIES = [
  'Emotional Attunement',
  'Hospice Education',
  'Objection Handling',
  'Compliance Safe Language',
  'Clinical Escalation Judgment',
  'Trust Building',
  'Role Boundary Safety',
];

const RN_CATEGORIES = [
  'Emotional Attunement',
  'Symptom Communication',
  'Comfort Education',
  'Role Boundary Safety',
  'Caregiver Empowerment',
  'Clinical Escalation Judgment',
  'Trust Building',
];

describe('generateSkillScoreReport', () => {
  it('clinical liaison scenario returns 7 skill scores', () => {
    const result = generateSkillScoreReport(
      'hospice_means_giving_up',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    expect(result.scores).toHaveLength(7);
  });

  it('clinical liaison scores use canonical CL category names in order', () => {
    const result = generateSkillScoreReport(
      'hospice_means_giving_up',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    expect(result.scores.map((s) => s.category)).toEqual(CL_CATEGORIES);
  });

  it('RN scenario returns 7 skill scores with RN category names', () => {
    const result = generateSkillScoreReport(
      'copd_air_hunger_at_home',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    expect(result.scores).toHaveLength(7);
    expect(result.scores.map((s) => s.category)).toEqual(RN_CATEGORIES);
  });

  it('terminal_dyspnea_follow_up returns 7 RN score rows', () => {
    const result = generateSkillScoreReport(
      'terminal_dyspnea_follow_up',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    expect(result.scores).toHaveLength(7);
    expect(result.scores.map((s) => s.category)).toEqual(RN_CATEGORIES);
  });

  it('all scores from both role paths are within the 0–4 range', () => {
    const clResult = generateSkillScoreReport(
      'hospice_means_giving_up',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    const rnResult = generateSkillScoreReport(
      'copd_air_hunger_at_home',
      emptyMessages,
      emptyEvents,
      emptySnapshots
    );
    [...clResult.scores, ...rnResult.scores].forEach((s) => {
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(4);
    });
  });
});
