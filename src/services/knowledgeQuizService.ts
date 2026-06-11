import { knowledgeQuizBank } from '@/data/knowledgeQuizBank';
import type { QuizQuestion } from '@/types/quiz';

export function getQuizForScenario(scenarioId: string): QuizQuestion[] {
  return knowledgeQuizBank.filter((q) => q.scenarioId === scenarioId);
}

export function getClinicalDiagnosisForScenario(scenarioId: string): string {
  const map: Record<string, string> = {
    hospice_means_giving_up: 'advanced_heart_failure',
    copd_air_hunger_at_home: 'end_stage_copd',
    hospice_too_soon: 'advanced_pancreatic_cancer',
    terminal_dyspnea_follow_up: 'end_stage_copd',
    pain_management_concern: 'advanced_prostate_cancer',
    medication_refusal: 'end_stage_heart_failure',
    prognostic_uncertainty: 'advanced_pancreatic_cancer',
    esrd_comfort_care: 'esrd_comfort_transition',
    advanced_dementia_grief: 'advanced_dementia',
    active_dying_recognition: 'end_stage_heart_failure',
    terminal_secretion_distress: 'end_stage_copd',
    breakthrough_pain_at_home: 'als_terminal',
    advance_directive_conflict: 'advanced_dementia',
    caregiver_burnout: 'end_stage_heart_failure',
    bereavement_first_call: 'advanced_heart_failure',
    can_change_minds: 'advanced_dementia',
  };
  return map[scenarioId] ?? '';
}
