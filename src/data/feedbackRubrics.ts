import type { FeedbackRubric } from '@/types/simulator';

export const feedbackRubrics: FeedbackRubric[] = [
  {
    id: 'clinical_liaison_rubric',
    roleId: 'clinical_liaison',
    categories: [
      'Emotional attunement.',
      'Hospice education.',
      'Objection handling.',
      'Compliance safe language.',
      'Clinical escalation judgment.',
      'Role boundary safety.',
      'Trust building.',
    ],
  },
  {
    id: 'rn_rubric',
    roleId: 'rn',
    categories: [
      'Emotional Attunement.',
      'Symptom Communication.',
      'Comfort Education.',
      'Role Boundary Safety.',
      'Caregiver Empowerment.',
      'Clinical Escalation Judgment.',
      'Trust Building.',
    ],
  },
];
