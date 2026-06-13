export interface LearningStage {
  stageNumber: 1 | 2 | 3;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  tint: string;
  border: string;
  scenarioIds: string[];
  // How many scenarios from the PREVIOUS stage must be completed to unlock this one
  requiredFromPrevious: number;
}

export interface RoleLearningPath {
  roleId: string;
  roleName: string;
  stages: LearningStage[];
}

const COLORS = {
  s1: { color: '#16A34A', tint: '#F0FDF4', border: '#86EFAC' },
  s2: { color: '#2563EB', tint: '#EFF6FF', border: '#BFDBFE' },
  s3: { color: '#7C3AED', tint: '#F5F3FF', border: '#DDD6FE' },
} as const;

export const LEARNING_PATHS: RoleLearningPath[] = [
  {
    roleId: 'clinical_liaison',
    roleName: 'Clinical Liaison',
    stages: [
      {
        stageNumber: 1,
        title: 'Hospice Orientation',
        subtitle: 'Foundation',
        description:
          'Master the core conversations every clinical liaison faces — explaining hospice, addressing fear, and handling coverage questions.',
        ...COLORS.s1,
        requiredFromPrevious: 0,
        scenarioIds: [
          'hospice_means_giving_up',
          'hospice_too_soon',
          'coverage_confusion',
          'hospice_discharge_fear',
        ],
      },
      {
        stageNumber: 2,
        title: 'Transitions & Resistance',
        subtitle: 'Core Practice',
        description:
          'Navigate pain management concerns, ICU-to-hospice transitions, treatment failure, and family resistance to change.',
        ...COLORS.s2,
        requiredFromPrevious: 3,
        scenarioIds: [
          'pain_management_concern',
          'can_change_minds',
          'icu_transfer_to_hospice',
          'inpatient_hospice_request',
          'treatment_just_failed',
        ],
      },
      {
        stageNumber: 3,
        title: 'Complexity & Conflict',
        subtitle: 'Advanced',
        description:
          'Handle prognostic uncertainty beyond the expected timeline and navigate conflict between family members over prognosis.',
        ...COLORS.s3,
        requiredFromPrevious: 4,
        scenarioIds: [
          'prognostic_uncertainty',
          'sibling_prognosis_conflict',
        ],
      },
    ],
  },
  {
    roleId: 'rn',
    roleName: 'RN',
    stages: [
      {
        stageNumber: 1,
        title: 'Symptom Management',
        subtitle: 'Foundation',
        description:
          'Build confidence explaining and managing dyspnea, breakthrough pain, and comfort kit use in the home setting.',
        ...COLORS.s1,
        requiredFromPrevious: 0,
        scenarioIds: [
          'copd_air_hunger_at_home',
          'terminal_dyspnea_follow_up',
          'breakthrough_pain_at_home',
          'comfort_kit_first_use',
        ],
      },
      {
        stageNumber: 2,
        title: 'Active Home Management',
        subtitle: 'Core Practice',
        description:
          'Address dehydration misconceptions, new-onset seizures, and nausea — three of the most common crisis calls in home hospice.',
        ...COLORS.s2,
        requiredFromPrevious: 3,
        scenarioIds: [
          'nausea_vomiting_home',
          'dehydration_education',
          'seizure_at_home',
        ],
      },
      {
        stageNumber: 3,
        title: 'End-of-Life Conversations',
        subtitle: 'Advanced',
        description:
          'Navigate medication refusal, direct prognosis questions, terminal secretions, ESRD active dying, and terminal agitation at bedside.',
        ...COLORS.s3,
        requiredFromPrevious: 2,
        scenarioIds: [
          'medication_refusal',
          'esrd_comfort_care',
          'terminal_secretion_distress',
          'patient_direct_prognosis',
          'terminal_agitation_home',
        ],
      },
    ],
  },
  {
    roleId: 'social_worker',
    roleName: 'Social Worker',
    stages: [
      {
        stageNumber: 1,
        title: 'Caregiver & Family Support',
        subtitle: 'Foundation',
        description:
          'Address caregiver burnout, financial stress, anticipatory grief, and how to help parents talk to children about terminal illness.',
        ...COLORS.s1,
        requiredFromPrevious: 0,
        scenarioIds: [
          'caregiver_burnout',
          'children_in_home',
          'financial_caregiver_stress',
          'anticipatory_grief_isolation',
        ],
      },
      {
        stageNumber: 2,
        title: 'Family Dynamics & Conflict',
        subtitle: 'Core Practice',
        description:
          'Navigate advance directive disputes, spiritual resistance to hospice, and support a patient whose dying wish is to be home.',
        ...COLORS.s2,
        requiredFromPrevious: 3,
        scenarioIds: [
          'advance_directive_conflict',
          'family_spiritual_conflict',
          'patient_home_death_wish',
        ],
      },
      {
        stageNumber: 3,
        title: 'Grief & Complex Cases',
        subtitle: 'Advanced',
        description:
          'Conduct bereavement follow-up calls and navigate pain management conversations with patients who have an opioid history.',
        ...COLORS.s3,
        requiredFromPrevious: 2,
        scenarioIds: [
          'bereavement_first_call',
          'opioid_history_pain',
        ],
      },
    ],
  },
];
