import { getQuizForScenario, getClinicalDiagnosisForScenario } from '@/services/knowledgeQuizService';
import { clinicalDiagnoses } from '@/data/clinicalDiagnoses';
import { evidenceStatements } from '@/data/evidenceStatements';
import { knowledgeQuizBank } from '@/data/knowledgeQuizBank';
import type { QuizCategory } from '@/types/quiz';

const ALL_SCENARIO_IDS = [
  'hospice_means_giving_up',
  'copd_air_hunger_at_home',
  'hospice_too_soon',
  'terminal_dyspnea_follow_up',
  'pain_management_concern',
  'medication_refusal',
  'prognostic_uncertainty',
  'esrd_comfort_care',
  'advanced_dementia_grief',
  'active_dying_recognition',
  'terminal_secretion_distress',
  'breakthrough_pain_at_home',
  'advance_directive_conflict',
  'caregiver_burnout',
  'bereavement_first_call',
  'can_change_minds',
];

const VALID_CATEGORIES: QuizCategory[] = ['clinical', 'role_boundary', 'communication'];

describe('knowledgeQuizBank — structure', () => {
  it('every question has a unique id', () => {
    const ids = knowledgeQuizBank.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('every question has exactly 4 options', () => {
    knowledgeQuizBank.forEach((q) => {
      expect(q.options).toHaveLength(4);
    });
  });

  it('every question correctIndex is 0, 1, 2, or 3', () => {
    knowledgeQuizBank.forEach((q) => {
      expect([0, 1, 2, 3]).toContain(q.correctIndex);
    });
  });

  it('every question has a valid category', () => {
    knowledgeQuizBank.forEach((q) => {
      expect(VALID_CATEGORIES).toContain(q.category);
    });
  });

  it('every question has a non-empty explanation', () => {
    knowledgeQuizBank.forEach((q) => {
      expect(q.explanation.length).toBeGreaterThan(10);
    });
  });

  it('every question has a non-empty question string', () => {
    knowledgeQuizBank.forEach((q) => {
      expect(q.question.length).toBeGreaterThan(10);
    });
  });
});

describe('getQuizForScenario — returns 3 questions per scenario', () => {
  ALL_SCENARIO_IDS.forEach((scenarioId) => {
    it(`${scenarioId} returns exactly 3 questions`, () => {
      const questions = getQuizForScenario(scenarioId);
      expect(questions).toHaveLength(3);
    });
  });
});

describe('getQuizForScenario — one question per category per scenario', () => {
  ALL_SCENARIO_IDS.forEach((scenarioId) => {
    it(`${scenarioId} has one clinical, one role_boundary, and one communication question`, () => {
      const questions = getQuizForScenario(scenarioId);
      const categories = questions.map((q) => q.category);
      expect(categories).toContain('clinical');
      expect(categories).toContain('role_boundary');
      expect(categories).toContain('communication');
    });
  });
});

describe('getQuizForScenario — all scenarioId fields match', () => {
  ALL_SCENARIO_IDS.forEach((scenarioId) => {
    it(`${scenarioId} questions all have matching scenarioId`, () => {
      const questions = getQuizForScenario(scenarioId);
      questions.forEach((q) => {
        expect(q.scenarioId).toBe(scenarioId);
      });
    });
  });
});

describe('getClinicalDiagnosisForScenario', () => {
  it('returns a non-empty string for all known scenarios', () => {
    ALL_SCENARIO_IDS.forEach((scenarioId) => {
      const diagnosisId = getClinicalDiagnosisForScenario(scenarioId);
      expect(typeof diagnosisId).toBe('string');
      expect(diagnosisId.length).toBeGreaterThan(0);
    });
  });

  it('returns empty string for an unknown scenario', () => {
    expect(getClinicalDiagnosisForScenario('not_a_real_scenario')).toBe('');
  });
});

describe('clinicalDiagnoses — data integrity', () => {
  it('has 8 entries covering all unique diagnosis IDs in scenarios', () => {
    expect(clinicalDiagnoses.length).toBe(8);
  });

  it('every diagnosis has a valid ICD-10 code format', () => {
    const icd10Pattern = /^[A-Z][0-9A-Z]{1,6}(\.[0-9A-Z]{1,4})?$/;
    clinicalDiagnoses.forEach((d) => {
      expect(icd10Pattern.test(d.icd10Code)).toBe(true);
    });
  });

  it('every diagnosis has a non-empty lcdId starting with L', () => {
    clinicalDiagnoses.forEach((d) => {
      expect(d.lcdId).toMatch(/^L\d+$/);
    });
  });

  it('every diagnosis has at least one eligibility criterion', () => {
    clinicalDiagnoses.forEach((d) => {
      expect(d.eligibilityCriteria.length).toBeGreaterThan(0);
    });
  });

  it('every diagnosis has at least one clinical decline indicator', () => {
    clinicalDiagnoses.forEach((d) => {
      expect(d.clinicalDeclineIndicators.length).toBeGreaterThan(0);
    });
  });

  it('every diagnosis has roleRelevance for all three roles', () => {
    clinicalDiagnoses.forEach((d) => {
      expect(d.roleRelevance.clinical_liaison.length).toBeGreaterThan(0);
      expect(d.roleRelevance.rn.length).toBeGreaterThan(0);
      expect(d.roleRelevance.social_worker.length).toBeGreaterThan(0);
    });
  });
});

describe('evidenceStatements — data integrity', () => {
  it('has an evidence statement for each scenario', () => {
    ALL_SCENARIO_IDS.forEach((scenarioId) => {
      const ev = evidenceStatements.find((e) => e.scenarioId === scenarioId);
      expect(ev).toBeDefined();
    });
  });

  it('every evidence statement has a non-empty headline', () => {
    evidenceStatements.forEach((ev) => {
      expect(ev.headline.length).toBeGreaterThan(10);
    });
  });

  it('every evidence statement has a non-empty citation', () => {
    evidenceStatements.forEach((ev) => {
      expect(ev.citation.length).toBeGreaterThan(5);
    });
  });

  it('every evidence statement has a non-empty statement body', () => {
    evidenceStatements.forEach((ev) => {
      expect(ev.statement.length).toBeGreaterThan(20);
    });
  });
});
