import type { ScenarioTopic } from '@/types/simulator';

export const TOPIC_LABELS: Record<ScenarioTopic, string> = {
  goals_of_care:       'Goals of Care',
  symptom_management:  'Symptoms',
  medication:          'Medication',
  grief:               'Grief',
  family_conflict:     'Family Conflict',
  caregiver_support:   'Caregiver',
};

export const SCENARIO_TOPICS: Record<string, ScenarioTopic> = {
  // Goals of Care
  hospice_means_giving_up:    'goals_of_care',
  hospice_too_soon:           'goals_of_care',
  prognostic_uncertainty:     'goals_of_care',
  esrd_comfort_care:          'goals_of_care',
  can_change_minds:           'goals_of_care',
  patient_direct_prognosis:   'goals_of_care',
  icu_transfer_to_hospice:    'goals_of_care',
  coverage_confusion:         'goals_of_care',
  hospice_discharge_fear:     'goals_of_care',
  treatment_just_failed:      'goals_of_care',

  // Symptom Management
  copd_air_hunger_at_home:      'symptom_management',
  terminal_dyspnea_follow_up:   'symptom_management',
  active_dying_recognition:     'symptom_management',
  terminal_secretion_distress:  'symptom_management',
  nausea_vomiting_home:         'symptom_management',
  terminal_agitation_home:      'symptom_management',
  seizure_at_home:              'symptom_management',

  // Medication
  pain_management_concern:  'medication',
  medication_refusal:       'medication',
  breakthrough_pain_at_home:'medication',
  comfort_kit_first_use:    'medication',
  opioid_history_pain:      'medication',

  // Grief
  advanced_dementia_grief:      'grief',
  bereavement_first_call:       'grief',
  patient_home_death_wish:      'grief',
  anticipatory_grief_isolation: 'grief',

  // Family Conflict
  advance_directive_conflict:  'family_conflict',
  family_spiritual_conflict:   'family_conflict',
  sibling_prognosis_conflict:  'family_conflict',

  // Caregiver Support
  caregiver_burnout:         'caregiver_support',
  dehydration_education:     'caregiver_support',
  inpatient_hospice_request: 'caregiver_support',
  children_in_home:          'caregiver_support',
  financial_caregiver_stress:'caregiver_support',
};
