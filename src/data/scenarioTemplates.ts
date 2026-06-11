import type { ScenarioTemplate } from '@/types/simulator';

export const scenarioTemplates: ScenarioTemplate[] = [
  {
    id: 'hospice_means_giving_up',
    title: 'Hospice Means Giving Up',
    allowedRoleId: 'clinical_liaison',
    difficulty: 'beginner',
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
    difficulty: 'intermediate',
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
    difficulty: 'beginner',
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
    difficulty: 'intermediate',
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
    difficulty: 'intermediate',
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
    difficulty: 'advanced',
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
    difficulty: 'advanced',
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
    difficulty: 'advanced',
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
    difficulty: 'intermediate',
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
    id: 'active_dying_recognition',
    title: 'Is She Dying Right Now?',
    allowedRoleId: 'rn',
    difficulty: 'advanced',
    setting: 'Patient home, urgent home visit',
    patient: {
      name: 'Betty Collins',
      age: 81,
    },
    knownDiagnosisId: 'end_stage_heart_failure',
    recentClinicalChange:
      "Betty has end-stage heart failure and has been declining steadily over two weeks. This morning her daughter Patricia called the hospice line. Betty is unresponsive to voice, has mottling on her lower extremities, her hands are cool and discolored, and her breathing has changed to a Cheyne-Stokes pattern — periods of shallow rapid breaths followed by pauses.",
    whoIsPresent: ['Betty', 'her daughter Patricia'],
    learnerObjective:
      "Acknowledge Patricia's fear. Explain active dying in plain language — what the signs mean and why they are normal. Empower Patricia to hold a vigil and stay present. Do not suggest calling 911 or pursuing curative intervention. Route any medication questions to the hospice orders and on-call team.",
    roleReminder:
      "You are an RN on a hospice home visit. You may explain the signs of active dying in plain language, provide comfort education, and empower the caregiver to stay present. You should not state specific medication doses, modify orders, or suggest 911. Medication questions should be routed to the hospice on-call provider.",
    hiddenFamilyFear:
      'Patricia believes she is responsible for preventing her mother\'s death and does not understand that the physical changes she is seeing are normal. She is terrified she is watching her mother suffer and that she has done something wrong by not acting sooner.',
    openingSpeakerName: 'Patricia',
    openingLine:
      "She is not responding to me. Her hands are cold and blotchy and her breathing sounds different — like it stops and then starts again. Is she dying right now? Should I call 911?",
    successCriteria: [
      "Acknowledges Patricia's fear before explaining anything.",
      'Explains active dying signs in plain language — what mottling and Cheyne-Stokes breathing mean.',
      'Clarifies that the signs are a natural process, not suffering.',
      'Does not suggest calling 911 or pursuing curative intervention.',
      'Empowers Patricia to stay present — talking to Betty, holding her hand.',
      'Routes any medication questions to the hospice orders and on-call provider.',
    ],
    failureCriteria: [
      'Suggests calling 911 or going to the hospital.',
      'States specific medication doses without referencing hospice orders.',
      'Overpromises that intervention will stop or reverse the dying process.',
      'Leaves Patricia without a role or a clear next step.',
      'Uses clinical jargon without explaining what it means.',
    ],
    patientStateDefaultId: 'active_dying_recognition',
  },
  {
    id: 'terminal_secretion_distress',
    title: 'He Sounds Like He Is Drowning',
    allowedRoleId: 'rn',
    difficulty: 'advanced',
    setting: 'Patient home',
    patient: {
      name: 'Earl Thompson',
      age: 77,
    },
    knownDiagnosisId: 'end_stage_copd',
    recentClinicalChange:
      'Earl has end-stage COPD and has been largely unresponsive since yesterday. His breathing has changed and he has developed audible terminal secretions — a gurgling sound caused by secretions in the throat that he can no longer clear. His wife Linda called the hospice line in distress.',
    whoIsPresent: ['Earl', 'his wife Linda'],
    learnerObjective:
      "Acknowledge Linda's fear. Explain terminal secretions in plain language — what they are, why suctioning does not help, and why the sound is not a sign of drowning or choking. Describe positioning and comfort measures. Do not promise the sound will stop completely. Route medication questions to the hospice on-call team.",
    roleReminder:
      "You are an RN. You may explain terminal secretions and comfort measures in plain language. You should not state specific medication doses, recommend suctioning, or promise the sound will eliminate. Route medication dose questions to the hospice orders and on-call provider.",
    hiddenFamilyFear:
      "Linda believes her husband is drowning or choking and that she is doing nothing while he suffers. She does not understand that terminal secretions are not experienced the way they sound from outside, and she fears that not acting means she has failed him.",
    openingSpeakerName: 'Linda',
    openingLine:
      "He is making this terrible gurgling sound when he breathes. It sounds like he is drowning from the inside. Is he suffering? Can we suction him or do something to make it stop?",
    successCriteria: [
      "Acknowledges Linda's fear and distress before explaining anything.",
      'Explains terminal secretions in plain language — not drowning, not choking.',
      'Explains why suctioning would not help and would be uncomfortable.',
      'Describes repositioning and comfort measures Linda can use.',
      'Avoids promising the sound will stop completely.',
      'Routes medication dose questions to the hospice orders and on-call provider.',
    ],
    failureCriteria: [
      'Recommends or agrees to suctioning.',
      'States specific medication doses without referencing hospice orders.',
      'Overpromises that the sound will stop.',
      'Leaves Linda without comfort tools or a clear next step.',
      'Uses clinical jargon without plain language explanation.',
    ],
    patientStateDefaultId: 'terminal_secretion_distress',
  },
  {
    id: 'breakthrough_pain_at_home',
    title: 'The Medicine Is Not Working',
    allowedRoleId: 'rn',
    difficulty: 'intermediate',
    setting: 'Patient home',
    patient: {
      name: 'Frank Martinez',
      age: 74,
    },
    knownDiagnosisId: 'als_terminal',
    recentClinicalChange:
      'Frank has ALS and has been receiving hospice comfort care for two months. He was prescribed a breakthrough pain medication that his wife Maria has been managing. This morning she gave the medication as prescribed but Frank still appears to be in pain two hours later. Maria called the hospice line asking whether the dose is too low.',
    whoIsPresent: ['Frank', 'his wife Maria'],
    learnerObjective:
      "Acknowledge Maria's fear that the medication is not helping and that she may have done something wrong. Assess the pain picture through Maria's description. Route the dose question to the hospice on-call provider. Empower Maria with non-medication comfort tools. Validate that she followed the plan correctly.",
    roleReminder:
      "You are an RN. You may assess symptoms through the caregiver's description, provide comfort education, and validate that the caregiver followed the plan. You should not adjust doses, state specific amounts, or tell the caregiver to give additional medication. Dose adjustment questions must go to the on-call hospice provider.",
    hiddenFamilyFear:
      "Maria believes the medication isn't working because she did something wrong. She is afraid to call the provider because she fears being judged or told she used the medication incorrectly. She carries the weight of being the sole caregiver and feels responsible for every moment of Frank's pain.",
    openingSpeakerName: 'Maria',
    openingLine:
      "I gave him his breakthrough medicine two hours ago exactly like it says to. He is still moaning and moving around like he is in pain. Is the dose too low? Can I give him more?",
    successCriteria: [
      "Acknowledges Maria's fear that the medication failed and that she may have done something wrong.",
      'Asks about the pain — location, what it looks like, whether anything helps.',
      'Validates that she followed the plan correctly.',
      'Does not state a specific dose or instruct her to give additional medication.',
      'Routes the dose question to the hospice on-call provider.',
      'Describes non-medication comfort measures Maria can use while waiting.',
      'Gives Maria a clear next step.',
    ],
    failureCriteria: [
      'States a specific dose or tells Maria to give additional medication.',
      'Leaves Maria without an assessment or a next step.',
      'Fails to validate that she followed the plan correctly.',
      'Overpromises that the on-call provider will eliminate all pain immediately.',
      'Does not route the dose question to the on-call provider.',
    ],
    patientStateDefaultId: 'breakthrough_pain_at_home',
  },
  {
    id: 'advance_directive_conflict',
    title: 'She Never Said What She Wanted',
    allowedRoleId: 'social_worker',
    difficulty: 'advanced',
    setting: 'Hospital family consultation room',
    patient: {
      name: 'Helen Morris',
      age: 86,
    },
    knownDiagnosisId: 'advanced_dementia',
    recentClinicalChange:
      "Helen has advanced dementia and can no longer make decisions for herself. Her physician has recommended a goals of care conversation. Her son Robert wants full aggressive treatment. Her daughter Carol wants comfort care only. There is no advance directive. The family conflict is escalating and the social work team has been asked to meet with Robert.",
    whoIsPresent: ['Robert Morris, her son'],
    learnerObjective:
      "Acknowledge Robert's grief and fear. Explain surrogate decision-making in plain language — what it means to speak for someone who cannot speak. Explain what an advance directive is and what happens without one. Stay neutral and do not take Carol's side or Robert's side. Offer to facilitate a family meeting with the clinical team.",
    roleReminder:
      'You are a Social Worker. You may acknowledge emotional distress, explain surrogate decision-making and advance directive concepts, and offer to facilitate a family meeting. You should not take sides in the family decision, tell Robert what Helen would have wanted, or provide medication guidance.',
    hiddenFamilyFear:
      "Robert has never accepted the severity of his mother's dementia. Agreeing to comfort care feels to him like agreeing that she is dying, and he is not ready to accept that. He projects his resistance onto Carol, framing it as a family conflict rather than a grief he cannot face.",
    openingSpeakerName: 'Robert',
    openingLine:
      "She never filled out an advance directive. That means we decide. Carol says to do comfort care only, but I want everything done. I am her son. How does anyone know what she would have wanted?",
    successCriteria: [
      "Acknowledges Robert's grief and the weight of the decision.",
      'Explains surrogate decision-making — speaking for her based on her values.',
      'Explains what an advance directive is and what it means that one does not exist.',
      'Stays neutral — does not take Carol\'s side or Robert\'s side.',
      'Offers to facilitate a family meeting with the clinical team.',
      'Avoids medication guidance outside the Social Worker role.',
    ],
    failureCriteria: [
      'Takes Carol\'s side or implies comfort care is clearly the right choice.',
      'Takes Robert\'s side or validates aggressive treatment as clearly correct.',
      'Tells Robert what Helen would have wanted.',
      'Moves to paperwork or logistics before addressing the emotional reality.',
      'Provides medication guidance outside Social Worker role.',
    ],
    patientStateDefaultId: 'advance_directive_conflict',
  },
  {
    id: 'caregiver_burnout',
    title: 'I Cannot Keep Doing This',
    allowedRoleId: 'social_worker',
    difficulty: 'intermediate',
    setting: 'Patient home, social work visit',
    patient: {
      name: 'Walter Simmons',
      age: 79,
    },
    knownDiagnosisId: 'end_stage_heart_failure',
    recentClinicalChange:
      "Walter's condition has declined steadily over the past month. His wife Dorothy, 77, has been his sole caregiver. She has not slept more than two to three hours at a time in two weeks, has lost weight, and is tearful. She is caring for Walter alone without family support nearby. The social work team has been notified by the hospice nurse.",
    whoIsPresent: ['Dorothy Simmons, his wife'],
    learnerObjective:
      "Acknowledge Dorothy's exhaustion without minimizing it or rushing to solutions. Validate that her feelings are a sign of how hard she has been working, not a sign she has failed. Assess her support network and her own health. Offer concrete respite options. Do not pressure her toward placing Walter or toward any particular decision.",
    roleReminder:
      'You are a Social Worker. You may validate caregiver distress, assess caregiver needs and support networks, and offer concrete resources such as respite care and hospice aide visits. You should not minimize the burden, pressure Dorothy toward placement, or provide medication guidance.',
    hiddenFamilyFear:
      "Dorothy believes that saying she can't cope is the same as abandoning Walter. She carries deep guilt because there are moments when she wishes this was over, and she cannot say that out loud. She fears being judged as a bad wife if she accepts help or admits she is failing.",
    openingSpeakerName: 'Dorothy',
    openingLine:
      "I am exhausted. I have not slept more than a few hours in a week. I feel like a terrible person for saying this, but I cannot keep doing this. I do not know how much longer I can go on.",
    successCriteria: [
      "Acknowledges Dorothy's exhaustion and validates that saying she cannot cope is not the same as giving up.",
      "Validates the guilt Dorothy feels without reinforcing it.",
      "Assesses her support network and her own health.",
      "Offers concrete respite resources without pressure.",
      "Does not pressure Dorothy toward placing Walter.",
      "Avoids platitudes or minimizing language.",
      "Gives Dorothy a clear next step.",
    ],
    failureCriteria: [
      'Minimizes the burden with phrases like it will get easier.',
      'Suggests or implies Walter should be placed in a facility.',
      'Rushes to solutions before acknowledging the emotional weight.',
      'Leaves Dorothy without concrete resources or a next step.',
      'Provides medication guidance outside the Social Worker role.',
    ],
    patientStateDefaultId: 'caregiver_burnout',
  },
  {
    id: 'bereavement_first_call',
    title: 'I Keep Forgetting He Is Gone',
    allowedRoleId: 'social_worker',
    difficulty: 'advanced',
    setting: 'Bereavement follow-up call',
    patient: {
      name: 'Thomas Walsh',
      age: 74,
    },
    knownDiagnosisId: 'advanced_heart_failure',
    recentClinicalChange:
      'Thomas Walsh died at home on hospice three weeks ago after a decline from advanced heart failure. His wife Margaret, 74, received a bereavement follow-up call from the hospice social work team. This is her first call with the team since the death.',
    whoIsPresent: ['Margaret Walsh, his wife'],
    learnerObjective:
      "Acknowledge Margaret's grief and normalize her experience — especially the morning re-grief pattern of waking up and forgetting he is gone. Explain that early grief often works this way. Offer a brief assessment for complicated grief indicators. Introduce the hospice bereavement program and what is available. Do not pathologize normal grief or rush her toward closure.",
    roleReminder:
      'You are a Social Worker conducting a bereavement follow-up call. You may normalize grief experiences, assess for complicated grief indicators, and offer bereavement support resources. You should not diagnose grief disorders, pressure toward closure or acceptance, or provide medication guidance.',
    hiddenFamilyFear:
      "Margaret is afraid her grief is abnormal — that forgetting he is gone each morning and then re-experiencing the loss is a sign she is broken. She has no one in her immediate network who understands grief at this scale. She fears calling the hospice team will make her seem pathetic or unable to cope.",
    openingSpeakerName: 'Margaret',
    openingLine:
      "I keep waking up and forgetting he is gone. Every morning I reach for him and then I remember. Is that normal? How long is this going to feel like this?",
    successCriteria: [
      "Acknowledges Margaret's grief before explaining anything.",
      'Validates that the morning re-grief experience is common and not a sign of abnormality.',
      'Explains that early grief often involves this kind of forgetting and re-remembering.',
      'Offers a gentle assessment for complicated grief without pathologizing.',
      'Introduces the hospice bereavement program and available resources.',
      'Avoids pressure toward closure, acceptance, or a timeline.',
    ],
    failureCriteria: [
      'Suggests a timeline for when grief should ease.',
      'Pathologizes the normal morning grief pattern.',
      'Rushes to resources before acknowledging the emotional weight.',
      'Leaves Margaret without information about available support.',
      'Provides medication guidance outside the Social Worker role.',
    ],
    patientStateDefaultId: 'bereavement_first_call',
  },
  {
    id: 'can_change_minds',
    title: 'Can We Change Our Minds?',
    allowedRoleId: 'clinical_liaison',
    difficulty: 'intermediate',
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
