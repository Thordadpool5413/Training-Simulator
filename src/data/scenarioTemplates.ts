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
    id: 'pain_management_concern',
    title: 'Why Is He Still in Pain?',
    allowedRoleId: 'clinical_liaison',
    setting: 'Hospital room',
    patient: {
      name: 'Arthur Williams',
      age: 77,
    },
    knownDiagnosisId: 'advanced_prostate_cancer',
    recentClinicalChange:
      'Arthur has advanced prostate cancer with bone metastases. His daughter Elena agreed to hospice three days ago after a difficult conversation. Since then, she has visited twice and found her father visibly uncomfortable on both visits. The hospice nurse has already scheduled a pain reassessment, but Elena called to speak with the Clinical Liaison before that visit.',
    whoIsPresent: ['Elena, his daughter'],
    learnerObjective:
      "Acknowledge Elena's anger and fear that hospice has failed her father. Validate her concern as legitimate. Explain that pain assessment and management is the hospice nurse's clinical role. Route her to the nurse without dismissing her concern. Avoid medication guidance. Help Elena feel heard and clear about the next step.",
    roleReminder:
      'You are a Clinical Liaison. You may validate emotional concerns, explain the hospice team structure, and confirm that the nurse will assess and address pain. You should not assess pain, suggest medication changes, or give clinical guidance. Pain management belongs with the hospice nurse and provider.',
    hiddenFamilyFear:
      'Elena agreed to hospice believing it would relieve her father\'s suffering. Seeing him still in pain makes her feel she made a terrible mistake and failed him. She is angry because anger is easier than grief.',
    openingSpeakerName: 'Elena',
    openingLine:
      'You said hospice would manage his pain. He is still hurting every time I come in. Are you even doing anything?',
    successCriteria: [
      "Acknowledges Elena's anger without becoming defensive.",
      'Validates that her concern is legitimate and serious.',
      'Explains that pain assessment and management is the clinical nurse\'s role.',
      'Routes Elena to the hospice nurse with a clear next step.',
      'Avoids medication guidance or clinical pain assessment.',
      'Helps Elena feel heard, not dismissed.',
    ],
    failureCriteria: [
      'Gives medication guidance outside the Clinical Liaison role.',
      'Sounds defensive about hospice performance.',
      'Lists services before acknowledging the emotional concern.',
      'Dismisses or minimizes the pain concern.',
      'Leaves Elena without a clear next step.',
    ],
    patientStateDefaultId: 'pain_management_concern',
  },
  {
    id: 'medication_refusal',
    title: 'She Won\'t Take the Medicine',
    allowedRoleId: 'rn',
    setting: 'Patient home',
    patient: {
      name: 'Dorothy Chen',
      age: 80,
    },
    knownDiagnosisId: 'end_stage_heart_failure',
    recentClinicalChange:
      'Dorothy has end-stage heart failure and was prescribed a comfort medication for pain and breathlessness three days ago. She has refused every dose since it was prescribed, telling her son Michael she does not want to be "out of it." Michael has been managing her care alone and is in distress. He called the hospice line this morning.',
    whoIsPresent: ['Dorothy', 'her son Michael'],
    learnerObjective:
      "Acknowledge Michael's distress. Explain patient autonomy in plain language — Dorothy has the right to refuse medication. Provide communication strategies Michael can use when offering the medication. Address Dorothy's fear of losing her mental clarity. Route ongoing refusal concerns to the hospice on-call team. Do not suggest or imply that the medication can be given covertly.",
    roleReminder:
      'You are an RN. You may assess symptoms, educate caregivers on comfort medication and patient autonomy, and provide communication strategies. You may confirm what the hospice plan of care includes. You should not change orders, state specific doses, or in any circumstance suggest administering medication without the patient\'s knowledge or consent.',
    hiddenFamilyFear:
      'Michael believes that if his mother continues to refuse medication, she will suffer needlessly and he will be responsible. He is carrying guilt about every moment of her discomfort.',
    openingSpeakerName: 'Michael',
    openingLine:
      'She keeps refusing the morphine. She says she does not want to be drugged. She is clearly in pain and I cannot make her take it. Can I just put it in her food without her knowing?',
    successCriteria: [
      "Acknowledges Michael's distress and the difficulty of watching his mother refuse medication.",
      'Explains patient autonomy in plain language — patients have the right to refuse.',
      'Provides practical communication strategies for offering the medication compassionately.',
      "Addresses Dorothy's fear of mental cloudiness without dismissing it.",
      'Does not suggest or condone covert medication administration.',
      'Routes ongoing refusal concerns to the hospice on-call team.',
      'Gives Michael a clear next step.',
    ],
    failureCriteria: [
      'Suggests or condones putting medication in food or drink without consent.',
      'Fails to validate Michael\'s distress.',
      'Fails to explain patient autonomy.',
      'Leaves Michael without a clear plan.',
      'States specific doses or changes orders.',
    ],
    patientStateDefaultId: 'medication_refusal',
  },
  {
    id: 'prognostic_uncertainty',
    title: 'Six Months Was Six Months Ago',
    allowedRoleId: 'clinical_liaison',
    setting: 'Outpatient care coordination office',
    patient: {
      name: 'Rose Fitzgerald',
      age: 74,
    },
    knownDiagnosisId: 'advanced_pancreatic_cancer',
    recentClinicalChange:
      "Rose's oncologist said approximately six months when hospice was discussed six months ago. She has stabilized somewhat and is still at home, alert, and having some good days. Her son David has been tracking the six-month mark obsessively and called this morning in a panic.",
    whoIsPresent: ['David, her son'],
    learnerObjective:
      "Acknowledge David's fear and the catastrophic thinking that the prognosis countdown has expired. Explain what a prognosis estimate means — it is not a precise clock, it is a clinical estimate based on patterns. Avoid both false precision (giving a new number) and false hope (implying the prognosis no longer applies). Stay within Clinical Liaison role and route prognosis questions to the physician. Help David focus on what is present rather than what is expected.",
    roleReminder:
      'You are a Clinical Liaison. You may explain what a prognosis means in plain language. You should not state a prognosis, give a new time estimate, or suggest the prognosis has changed. Prognosis questions should go to the hospice physician or oncologist. Do not provide medication guidance.',
    hiddenFamilyFear:
      "David has been mentally treating the six-month mark as a countdown clock and now believes his mother should have died six months ago. He is catastrophizing — expecting her to die today or tomorrow — and is terrified that every phone call is the last. He does not understand that a prognosis is a statistical estimate, not a promise or a deadline.",
    openingSpeakerName: 'David',
    openingLine:
      'The doctor said six months. It has been six months. That means she is going to die any day now, right? Should I be there? Should I have everyone come?',
    successCriteria: [
      "Acknowledges David's fear before explaining anything.",
      'Explains that a prognosis is an estimate, not a countdown clock.',
      'Avoids giving a new time estimate or suggesting the prognosis has passed.',
      'Maintains honest uncertainty without giving false hope.',
      'Routes the specific prognosis question to the physician.',
      'Redirects David toward presence and quality time rather than countdown anxiety.',
    ],
    failureCriteria: [
      'States a specific time estimate.',
      'Implies or says her prognosis has changed or extended.',
      'Fails to acknowledge the emotional weight of the question.',
      'Dismisses the prognosis entirely.',
      'Provides medication guidance outside the Clinical Liaison role.',
    ],
    patientStateDefaultId: 'prognostic_uncertainty',
  },
  {
    id: 'esrd_comfort_care',
    title: "He's Choosing to Die",
    allowedRoleId: 'social_worker',
    setting: 'Hospital family consultation room',
    patient: {
      name: 'Robert Hayes',
      age: 74,
    },
    knownDiagnosisId: 'esrd_comfort_transition',
    recentClinicalChange:
      "Robert has ESRD and has been on dialysis three times a week for four years. Last week he told his care team he wants to stop. His physician has confirmed he has decision-making capacity. His son James flew in immediately and is demanding to speak with someone from the hospice social work team.",
    whoIsPresent: ['James Hayes, his son'],
    learnerObjective:
      "Acknowledge James's grief and fear. Explain the difference between refusing life-sustaining treatment and choosing death. Explain what decision-making capacity means — without making a clinical determination. Offer to facilitate a family meeting with the clinical team. Stay neutral and do not take sides in the decision. Route clinical questions about prognosis and medical details to the physician.",
    roleReminder:
      'You are a Social Worker. You may acknowledge emotional distress, explain patient autonomy and the right to refuse life-sustaining treatment, and offer to facilitate a family meeting. You should not make clinical capacity determinations, take sides in the family conflict, provide medication guidance, or tell anyone what Robert should decide.',
    hiddenFamilyFear:
      "James believes his father either lacks capacity or is depressed. He cannot accept that his father, fully competent, is choosing to end dialysis. His anger is covering terror that he is about to lose his father and guilt that he was not present enough to prevent this decision.",
    openingSpeakerName: 'James',
    openingLine:
      'He wants to stop dialysis. His doctor says he has the right. But that is just choosing to die. How can you sit there and let him do this? He is not in his right mind.',
    successCriteria: [
      "Acknowledges James's grief and the weight of what he is hearing.",
      'Explains the difference between refusing life-sustaining treatment and suicide.',
      "Explains what decision-making capacity means without overriding the physician's determination.",
      'Stays neutral — does not side with the patient or with James.',
      'Offers to facilitate a family meeting with Robert and the clinical team.',
      'Avoids medication guidance outside Social Worker role.',
    ],
    failureCriteria: [
      'Tells James his father is making the right choice.',
      'Agrees with James that the decision suggests the father lacks capacity.',
      'Takes a position on what Robert should decide.',
      'Moves to paperwork or logistics before addressing the emotional reality.',
      'Provides medication guidance outside Social Worker role.',
    ],
    patientStateDefaultId: 'esrd_comfort_care',
  },
  {
    id: 'advanced_dementia_grief',
    title: "She Doesn't Know Who I Am Anymore",
    allowedRoleId: 'clinical_liaison',
    setting: 'Outpatient care coordination office',
    patient: {
      name: 'Ruth Wheeler',
      age: 87,
    },
    knownDiagnosisId: 'advanced_dementia',
    recentClinicalChange:
      "Ruth has advanced Alzheimer's. She no longer recognizes her daughter Anne on most visits, has stopped eating reliably, and requires full assistance with all daily activities. Her physician has recommended a goals of care conversation and noted she may meet hospice eligibility criteria. Anne called the Clinical Liaison after the appointment.",
    whoIsPresent: ['Anne, her daughter'],
    learnerObjective:
      "Acknowledge Anne's grief — she has been losing her mother slowly for years and the pain of not being recognized is profound. Normalize anticipatory grief. Explain that dementia is a terminal illness and that hospice eligibility is not a punishment or a defeat. Explain the hospice revocation option. Avoid pressuring toward a decision. Stay within Clinical Liaison role boundaries.",
    roleReminder:
      'You are a Clinical Liaison. You may explain what hospice supports, how dementia qualifies, and that hospice can be elected and revoked. You should not determine eligibility, make prognosis statements, provide medication guidance, or pressure Anne toward or away from a decision.',
    hiddenFamilyFear:
      "Anne has been grieving her mother's dementia for years. She carries guilt about the relief she sometimes feels when she imagines the end. She fears that agreeing to hospice means she is choosing her own relief over her mother's life. She has also never been told that dementia is a terminal illness.",
    openingSpeakerName: 'Anne',
    openingLine:
      'She looked right at me today and had no idea who I was. She is still breathing but the person I knew is already gone. How can I put her in hospice? It feels like I am burying her twice.',
    successCriteria: [
      "Acknowledges Anne's anticipatory grief before explaining anything.",
      'Validates the grief of losing someone before they die.',
      'Explains that dementia is a terminal illness in plain language.',
      'Explains hospice as support rather than abandonment.',
      'Mentions revocation as an option without leading with it.',
      'Avoids pressuring Anne toward a hospice decision.',
      'Avoids medication guidance outside the Clinical Liaison role.',
    ],
    failureCriteria: [
      'Lists hospice services before addressing grief.',
      'Tells Anne she should choose hospice.',
      'Fails to acknowledge the long grief arc of dementia caregiving.',
      'Makes a prognosis statement.',
      'Provides medication guidance outside the Clinical Liaison role.',
    ],
    patientStateDefaultId: 'advanced_dementia_grief',
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
