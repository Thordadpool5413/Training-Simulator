import type { SafetyRule } from '@/types/simulator';

export const safetyRules: SafetyRule[] = [
  {
    id: 'medication_outside_role',
    ruleName: 'Medication outside role',
    severity: 'critical_simulation_stop',
    appliesTo: [
      'Clinical Liaison.',
      'Social Worker.',
      'Any learner with medication access level 0 or 1.',
    ],
    triggerExamples: [
      'Give the morphine.',
      'Do not give the morphine.',
      'Increase the oxygen.',
      'Hold that medication.',
      'Stop that medication.',
      'Use the comfort kit now.',
    ],
    blockedBehavior: 'Medication administration instruction outside role.',
    allowedAlternative: 'Validate concern and route to nurse or provider.',
    trainingPauseMessage:
      'That response gives medication guidance outside your selected role. Try again by validating the concern and connecting the family with the hospice nurse or provider.',
  },
  {
    id: 'rn_medication_dose_outside_orders',
    ruleName: 'RN medication dose outside orders',
    severity: 'clinical_safety_concern',
    appliesTo: [
      'RN.',
      'Any learner with medication access level 2.',
    ],
    triggerExamples: [
      'Give him 2 milligrams of morphine.',
      'Give 2 mg of morphine.',
      'Give him two milligrams of morphine.',
      'Increase the morphine to 4 milligrams.',
      'Decrease the dose to 1 mg.',
      'Hold the lorazepam.',
      'Stop the morphine.',
      'Start lorazepam.',
      'Use 0.5 of the lorazepam.',
      'The dose should be 2 to 4 milligrams.',
      'Give another dose now.',
      'Double the dose.',
      'Cut the dose in half.',
    ],
    blockedBehavior:
      'Stating or recommending a specific medication dose, dose range, or order change without deferring to existing hospice orders.',
    allowedAlternative:
      'Confirm comfort medications are part of the plan of care and route dose questions to the hospice orders or on call provider.',
    trainingPauseMessage:
      'That response states or changes a medication dose, which goes beyond what can be confirmed without the hospice orders in front of us. Try again by validating the concern, confirming that comfort medications are part of the plan of care, and routing exact dose instructions to the hospice orders or on call provider.',
  },
];
