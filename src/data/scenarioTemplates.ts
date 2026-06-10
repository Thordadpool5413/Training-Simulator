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
    openingSpeakerName: 'Daughter',
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
    openingSpeakerName: 'Margaret',
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
  {
    id: 'hospice_too_soon',
    title: 'Hospice Is Only for the Last Few Days',
    allowedRoleId: 'clinical_liaison',
    setting: 'Hospital room',
    patient: {
      name: 'Gloria Santos',
      age: 72,
    },
    knownDiagnosisId: 'advanced_pancreatic_cancer',
    recentClinicalChange:
      "Gloria's oncologist has recommended a comfort-focused plan because curative treatment is no longer expected to help. She is weaker, eating less, and spending most of the day resting, but she is still alert enough to talk with her family at times.",
    whoIsPresent: ['Marcus Santos, her son'],
    learnerObjective:
      "Acknowledge Marcus's fear that hospice is being introduced too soon, explain hospice timing in plain language, clarify that hospice can support patients before the final days, avoid prognosis promises, and give the family a clear next step.",
    roleReminder:
      'You are a Clinical Liaison. You may explain hospice timing, general eligibility concepts, and what the hospice team provides. You should not determine eligibility, make prognosis promises, prescribe, or make medication decisions.',
    hiddenFamilyFear:
      'Marcus believes agreeing to hospice now may mean he is giving up on his mother too early.',
    openingSpeakerName: 'Marcus',
    openingLine:
      'The doctor says Mom might qualify for hospice, but she is still talking to us and eating a little. I thought hospice was only for the last few days.',
    successCriteria: [
      "Acknowledges Marcus's fear about starting hospice too soon.",
      'Explains that hospice is not only for the final few days.',
      'Clarifies hospice support in plain language.',
      'Avoids prognosis promises.',
      'Avoids medication guidance outside the Clinical Liaison role.',
      'Gives Marcus a clear next step.',
    ],
    failureCriteria: [
      'Says hospice is only for when treatment is over.',
      'Uses pressure language.',
      'Sounds transactional or sales-focused.',
      'Makes a prognosis promise.',
      'Gives medication guidance outside the Clinical Liaison role.',
    ],
    patientStateDefaultId: 'hospice_too_soon',
  },
  {
    id: 'terminal_dyspnea_follow_up',
    title: 'Terminal Dyspnea Follow Up Conversation',
    allowedRoleId: 'rn',
    setting: 'Patient home, follow-up visit',
    patient: {
      name: 'Eleanor Marsh',
      age: 84,
    },
    knownDiagnosisId: 'end_stage_copd',
    recentClinicalChange:
      'Eleanor Marsh has end-stage COPD and received her first comfort medication dose one hour ago following an air hunger episode. Carol administered the medication as instructed during the previous hospice visit. Eleanor still appears uncomfortable and Carol called the hospice line. The visiting RN is now present for a follow-up coaching visit.',
    whoIsPresent: ['Eleanor', 'her daughter Carol'],
    learnerObjective:
      "Acknowledge Carol's fear that Eleanor is still suffering despite medication, explain that air hunger can persist visually even when comfort medication is working, reinforce what the hospice comfort plan provides, stay within RN scope on medication dose specifics, and give Carol clear guidance on what to watch for and when to call the hospice on-call team.",
    roleReminder:
      'You may assess symptoms, explain comfort-focused care, describe what the hospice plan of care provides, and educate Carol on non-pharmacologic comfort tools and when to call the team. You may confirm that hospice comfort medications are part of the plan of care. You should not state specific medication doses, modify orders, or prescribe. Route medication dose questions to the hospice orders and the on-call provider.',
    hiddenFamilyFear:
      'Carol believes that if Eleanor is still visibly uncomfortable after receiving the medication, either she administered it incorrectly or the dose is not enough. She fears she will have to ask for a dose change and be told she cannot, or that she will fail Eleanor by not acting.',
    openingSpeakerName: 'Carol',
    openingLine:
      'She still looks so uncomfortable. I gave her the medicine an hour ago like you showed me. She is still struggling to breathe. Are we giving the right amount, or does she need more?',
    successCriteria: [
      "Acknowledges Carol's fear before explaining anything.",
      'Explains that air hunger can still look intense even when the medication is easing the sensation.',
      'Describes comfort tools Carol can use right now.',
      'Confirms the hospice comfort plan is in place without stating specific doses.',
      'Routes medication dose questions to the hospice orders and on-call provider.',
      'Gives Carol a clear next step including when and how to call the hospice team.',
    ],
    failureCriteria: [
      'States or recommends a specific medication dose.',
      "Jumps to intervention steps without acknowledging Carol's fear.",
      'Overpromises that medication will eliminate all visible breathing discomfort.',
      'Leaves Carol without a clear next step or call contact.',
      'Uses clinical jargon Carol cannot understand.',
    ],
    patientStateDefaultId: 'terminal_dyspnea_follow_up',
  },
  {
    id: 'can_change_minds',
    title: 'Can We Change Our Minds?',
    allowedRoleId: 'clinical_liaison',
    setting: 'Hospital room',
    patient: {
      name: 'Ruth Calloway',
      age: 78,
    },
    knownDiagnosisId: 'advanced_dementia',
    recentClinicalChange:
      'Ruth has declined significantly over the past three months. She no longer recognizes most family members and has stopped eating reliably. Her physician has recommended a goals of care conversation and indicated she may meet hospice criteria.',
    whoIsPresent: ['Ruth', 'her husband Frank'],
    learnerObjective:
      "Acknowledge Frank's fear that choosing hospice is permanent and irreversible. Explain hospice election and revocation in plain language. Clarify that hospice is a choice, not a trap. Avoid making prognosis promises. Stay within Clinical Liaison role boundaries. Give Frank a clear next step.",
    roleReminder:
      'You are a Clinical Liaison. You may explain the hospice process, including that hospice can be elected and revoked. You should not determine eligibility, make prognosis statements, prescribe, or provide medication guidance.',
    hiddenFamilyFear:
      'Frank believes choosing hospice is a permanent, one-way decision. He fears that once they sign, Ruth cannot return to the hospital or resume treatment if goals change or if he changes his mind.',
    openingSpeakerName: 'Frank',
    openingLine:
      'The doctor says she might qualify for hospice, but I need to know, if we start this and I change my mind, or she gets better, can we undo it? Are we signing something we cannot take back?',
    successCriteria: [
      "Acknowledge Frank's fear of making an irreversible decision.",
      'Explain in plain language that hospice can be revoked.',
      'Clarify that hospice is a choice, not a permanent commitment.',
      'Avoid prognosis promises.',
      'Avoid medication guidance outside the Clinical Liaison role.',
      'Avoid sounding transactional or pressuring.',
      'Give Frank a clear next step.',
    ],
    failureCriteria: [
      'Imply or state that choosing hospice is permanent.',
      'Sound like a sales pitch rather than a supportive conversation.',
      'Make a prognosis promise.',
      'Provide medication guidance outside the Clinical Liaison role.',
      'Fail to address the core question about reversibility.',
    ],
    patientStateDefaultId: 'can_change_minds',
  },
];
