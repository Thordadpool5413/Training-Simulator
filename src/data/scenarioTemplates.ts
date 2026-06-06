import type { ScenarioTemplate } from '@/types/simulator';

export const scenarioTemplates: ScenarioTemplate[] = [
  {
    id: 'hospice_means_giving_up',
    title: 'Hospice Means Giving Up',
    allowedRoleId: 'clinical_liaison',
    setting: 'Hospital room',
    patient: {
      name: 'Robert Mason',
      age: 79,
    },
    knownDiagnosisId: 'advanced_heart_failure',
    recentClinicalChange:
      "This is Robert's third hospitalization in two months. Each time he improves enough to leave the hospital, but he comes home weaker. The physician recommended discussing hospice support at home.",
    whoIsPresent: ['Robert', 'his daughter'],
    learnerObjective:
      'Explain hospice support, respond to concern, avoid pressure language, and route clinical questions appropriately.',
    roleReminder:
      'You may explain hospice support and answer general process questions. You should not determine hospice eligibility, give prognosis estimates, or provide medication instructions. Medication questions should be routed to the hospice nurse or provider.',
    hiddenFamilyFear:
      'The daughter believes hospice means giving up and fears agreeing to hospice means she is betraying her father.',
    openingLine:
      'My dad is dying and you want to take away his care?',
    successCriteria: [
      'Responds to fear before explaining services.',
      'Explains hospice as support, not abandonment.',
      'Avoids pressure language.',
      'Avoids eligibility overreach.',
      'Routes medication questions to nurse or provider.',
      'Closes with a clear next step.',
    ],
    failureCriteria: [
      'Lists services before addressing fear.',
      'Says hospice means treatment is over.',
      'Says the patient qualifies for hospice.',
      'Pressures the family to choose hospice.',
      'Answers medication questions outside role.',
    ],
    patientStateDefaultId: 'hospice_means_giving_up',
  },
  {
    id: 'copd_air_hunger_at_home',
    title: 'COPD Air Hunger at Home',
    allowedRoleId: 'rn',
    setting: 'Patient home',
    patient: {
      name: 'Harold Voss',
      age: 81,
    },
    knownDiagnosisId: 'end_stage_copd',
    recentClinicalChange:
      'Harold has had three severe air hunger episodes this week. He is on home oxygen but the episodes are not resolving with oxygen alone. He is increasingly anxious between episodes. His wife Margaret has been managing alone and called the hospice line this morning in a panic.',
    whoIsPresent: ['Harold', 'his wife Margaret'],
    learnerObjective:
      "Acknowledge Margaret's fear, explain air hunger in plain and compassionate language, reinforce what the comfort plan provides, stay within RN scope on medication specifics, and give Margaret a clear next step.",
    roleReminder:
      'You may assess symptoms, explain comfort-focused care, describe what the hospice plan of care provides, and educate Margaret on non-pharmacologic comfort tools. You may confirm that hospice comfort medications are part of the plan of care. You should not state specific medication doses, modify orders, or prescribe. Route medication dose questions to the hospice orders and the on-call provider.',
    hiddenFamilyFear:
      'Margaret believes Harold is suffocating and that she will be responsible if she acts or does not act. She does not understand that air hunger and suffocation are different experiences.',
    openingLine:
      'He keeps saying he cannot breathe. I am scared he is suffocating and I do not know what to do.',
    successCriteria: [
      "Acknowledges Margaret's fear before explaining anything.",
      'Explains air hunger in plain language without minimizing it.',
      'Distinguishes air hunger from suffocation compassionately.',
      'Describes comfort tools Margaret can use.',
      'Confirms the hospice comfort plan is in place.',
      'Routes medication dose questions to the hospice orders and on-call provider.',
      'Gives Margaret a clear next step.',
    ],
    failureCriteria: [
      'Jumps to intervention without acknowledging fear.',
      'States a specific medication dose without referencing hospice orders.',
      'Overpromises that intervention will stop all breathing difficulty.',
      'Uses clinical jargon the caregiver cannot understand.',
      'Leaves Margaret without a concrete next step.',
    ],
    patientStateDefaultId: 'copd_air_hunger_at_home',
  },
];
