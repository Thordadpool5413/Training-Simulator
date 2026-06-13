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
  {
    id: 'patient_direct_prognosis',
    title: 'How Long Do I Have?',
    allowedRoleId: 'rn',
    difficulty: 'advanced',
    setting: 'Patient home, routine nursing visit',
    patient: {
      name: 'George Holloway',
      age: 68,
    },
    knownDiagnosisId: 'advanced_pancreatic_cancer',
    recentClinicalChange:
      'George has advanced pancreatic cancer diagnosed four months ago. He is alert, fully oriented, and has been asking the hospice team increasingly direct questions. Today he stopped the routine assessment and asked the nurse directly how long he has left. He has an estranged adult daughter he has not spoken to in three years.',
    whoIsPresent: ['George'],
    learnerObjective:
      "Acknowledge George's right to ask directly. Do not give a specific time estimate. Hold space for the emotion behind the question. Connect him to the hospice physician for an honest prognosis conversation. If he mentions unfinished relationship business, gently acknowledge that without redirecting away from it.",
    roleReminder:
      "You are an RN. You may acknowledge the question, provide honest general information about hospice prognosis discussions, and offer to connect George with the hospice physician for that conversation. You should not give a specific time estimate, make prognosis statements, or give medication guidance unrelated to this conversation.",
    hiddenFamilyFear:
      "George is not afraid of dying. He is afraid of running out of time to reconcile with his daughter before he goes. The prognosis question is really a question about whether he has time to fix what he broke. He needs someone to see through the medical question to the human one.",
    openingSpeakerName: 'George',
    openingLine:
      "You can stop with the blood pressure for a minute. I want to ask you something. How long do I actually have? I need someone to be straight with me.",
    successCriteria: [
      "Acknowledges that George deserves a straight answer and takes the question seriously.",
      'Does not give a specific time estimate.',
      'Explains that the hospice physician is the right person for an honest prognosis conversation and offers to arrange it.',
      'Creates space for what is behind the question — does not rush to close the topic.',
      'Does not deflect or minimize the question with false reassurance.',
    ],
    failureCriteria: [
      'Gives a specific time estimate or implies a number.',
      'Deflects the question without offering a path to a real answer.',
      'Responds only with clinical information without acknowledging the emotional weight.',
      'Gives medication guidance unrelated to the conversation.',
    ],
    patientStateDefaultId: 'patient_direct_prognosis',
  },
  {
    id: 'family_spiritual_conflict',
    title: 'God Is Going to Heal Her',
    allowedRoleId: 'social_worker',
    difficulty: 'advanced',
    setting: 'Patient home, living room',
    patient: {
      name: 'Rosalie Carter',
      age: 71,
    },
    knownDiagnosisId: 'advanced_cancer',
    recentClinicalChange:
      "Rosalie has advanced ovarian cancer and elected hospice three weeks ago after a candid goals-of-care conversation with her oncologist. She told the social work team she is at peace with comfort-focused care. Her brother Raymond arrived from out of state yesterday and is insisting the family revoke hospice, stating that God will heal Rosalie if the family does not give up faith. Rosalie is too weak to advocate for herself today.",
    whoIsPresent: ['Raymond Carter, her brother'],
    learnerObjective:
      "Acknowledge Raymond's faith without challenging it. Clarify that Rosalie made this decision while fully capable, and that it reflects her own values and expressed wishes. Explain that revocation is a right but that the decision belongs to Rosalie, not to family members. Do not take sides on the theological question. Offer to facilitate a family meeting that includes Rosalie when she is able.",
    roleReminder:
      'You are a Social Worker. You may acknowledge Raymond\'s faith and distress, explain patient self-determination, and offer to facilitate a family meeting. You should not challenge his religious beliefs, tell him his faith is misplaced, take Carol\'s side, or make clinical prognosis statements. You should not provide medication guidance.',
    hiddenFamilyFear:
      "Raymond believes that agreeing to hospice means the family has stopped praying and stopped believing God can heal Rosalie. In his view, accepting comfort care is an act of faithlessness, and he carries the terror that his sister will die because her family didn't fight hard enough spiritually. He is not malicious — he is terrified and acting from love.",
    openingSpeakerName: 'Raymond',
    openingLine:
      "I just got here yesterday and I am telling you, we are revoking this hospice. God is going to heal my sister. You people have given up on her and we have not. I need you to undo whatever papers she signed.",
    successCriteria: [
      "Acknowledges Raymond's faith and love for his sister without arguing with his beliefs.",
      "Explains that Rosalie made this decision herself, while fully capable, and that it reflects her values.",
      "Clarifies that revocation is Rosalie's right — not a family member's right to invoke on her behalf.",
      "Stays neutral on the theological question.",
      "Offers to facilitate a family meeting that includes Rosalie when she is able.",
      "Does not use dismissive or clinical language that would shut Raymond down.",
    ],
    failureCriteria: [
      "Challenges or dismisses Raymond's religious beliefs.",
      "Agrees to revoke hospice based on Raymond's demand alone.",
      "Takes Rosalie's side in a way that frames Raymond as the problem.",
      "Makes a clinical prognosis statement.",
      "Provides medication guidance outside Social Worker role.",
    ],
    patientStateDefaultId: 'family_spiritual_conflict',
  },
  {
    id: 'icu_transfer_to_hospice',
    title: 'They Said She Won\'t Make It',
    allowedRoleId: 'clinical_liaison',
    difficulty: 'intermediate',
    setting: 'Hospital ICU family waiting room',
    patient: {
      name: 'Sandra Keller',
      age: 64,
    },
    knownDiagnosisId: 'advanced_heart_failure',
    recentClinicalChange:
      "Sandra Keller had an acute cardiac event eight days ago and underwent emergency cardiac surgery. The surgical team determined that her heart is not recovering and that further intervention carries high mortality with no expectation of meaningful recovery. The attending physician spoke with her husband Richard this morning and recommended a transition to comfort-focused care. Richard requested to speak with the hospice liaison.",
    whoIsPresent: ['Richard Keller, her husband'],
    learnerObjective:
      "Acknowledge Richard's shock and grief. Explain what a hospice transition from ICU means in plain language — what stays the same, what changes, what he can expect. Do not minimize the severity of what is happening or offer false hope. Do not pressure him toward a decision. Give him time and a clear next step.",
    roleReminder:
      'You are a Clinical Liaison. You may explain the hospice transition process, what comfort-focused care in an ICU transfer looks like, and what support the hospice team provides. You should not confirm or contradict the medical prognosis, determine hospice eligibility, prescribe, or tell Richard what decision he should make.',
    hiddenFamilyFear:
      "Richard has not accepted what the surgeon told him this morning. He is still in shock. Part of him believes that if he agrees to hospice, Sandra will die faster — that stopping curative care is what kills her, not the underlying condition. He came to this meeting hoping someone would give him a reason to hold on.",
    openingSpeakerName: 'Richard',
    openingLine:
      "The doctor said she won't make it. He wants us to think about hospice. We've been married 45 years. I don't understand what that means. Are they just going to stop helping her?",
    successCriteria: [
      "Acknowledges Richard's shock and the weight of what he was just told before explaining anything.",
      "Explains what a hospice transition means — what stays the same (comfort, pain management, presence) and what changes.",
      "Does not minimize the severity or offer false hope.",
      "Does not pressure Richard toward a decision.",
      "Corrects the misconception that hospice means stopping help — reframes as a change in the kind of help.",
      "Gives Richard a clear next step and does not leave him without support.",
    ],
    failureCriteria: [
      "Jumps to explaining hospice services before acknowledging the emotional reality.",
      "Confirms or contradicts the medical prognosis.",
      "Implies that choosing hospice will cause Sandra to die sooner.",
      "Pressures Richard toward a decision.",
      "Provides medication guidance outside Clinical Liaison role.",
      "Leaves Richard without a next step.",
    ],
    patientStateDefaultId: 'icu_transfer_to_hospice',
  },

  // ── RN: 5 new scenarios ────────────────────────────────────────────────

  {
    id: 'comfort_kit_first_use',
    title: 'The Kit Is Just Sitting There',
    allowedRoleId: 'rn',
    difficulty: 'intermediate',
    setting: 'Patient home',
    patient: {
      name: 'Vincent Holden',
      age: 76,
    },
    knownDiagnosisId: 'advanced_prostate_cancer',
    recentClinicalChange:
      'Vincent has advanced prostate cancer with bone metastases and was enrolled in hospice two weeks ago. The hospice nurse provided a comfort kit with morphine and lorazepam and left written instructions. This morning Vincent is in significant pain and his wife Patricia called the hospice line. She has not opened the kit.',
    whoIsPresent: ['Vincent', 'his wife Patricia'],
    learnerObjective:
      "Acknowledge Patricia's fear about the comfort medications. Dispel the misconception that morphine causes death rather than relieves pain. Empower Patricia to use the kit as instructed. Stay within RN scope — reference the hospice orders rather than stating specific doses. Give Patricia a clear, specific next step.",
    roleReminder:
      "You are an RN. You may explain what comfort kit medications are for, reassure the caregiver about safe use, and confirm what the hospice orders provide. You should not state specific medication doses or modify orders. Reference the written instructions in the kit and the hospice orders. Route dose questions to the on-call provider.",
    hiddenFamilyFear:
      "Patricia believes that giving Vincent morphine will cause him to die faster — that the medication is there to hasten death, not relieve pain. She is afraid that opening the kit and using it means she is giving up on him and helping end his life. She would rather watch him suffer than give him something she believes will kill him.",
    openingSpeakerName: 'Patricia',
    openingLine:
      "The nurse left us this kit two weeks ago. Vincent is hurting. But I am scared to open it. What if I give too much morphine and it hurts him? I don't want to be the one who... I just can't.",
    successCriteria: [
      "Acknowledges Patricia's fear about the morphine before explaining anything.",
      "Addresses the misconception that morphine hastens death — explains it relieves suffering.",
      "Empowers Patricia to use the kit by following the written hospice orders.",
      "Does not state a specific dose — references the kit instructions and hospice orders.",
      "Routes dose questions to the on-call provider.",
      "Gives Patricia a specific, clear next step she can take right now.",
    ],
    failureCriteria: [
      "States a specific medication dose without referencing hospice orders.",
      "Dismisses or minimizes Patricia's fear about the morphine.",
      "Overpromises that the medication will eliminate all pain immediately.",
      "Leaves Patricia without a concrete next step.",
      "Fails to address the 'morphine hastens death' misconception.",
    ],
    patientStateDefaultId: 'comfort_kit_first_use',
  },

  {
    id: 'nausea_vomiting_home',
    title: 'She Can\'t Keep Anything Down',
    allowedRoleId: 'rn',
    difficulty: 'intermediate',
    setting: 'Patient home, phone call to hospice line',
    patient: {
      name: 'Maria Rivera',
      age: 70,
    },
    knownDiagnosisId: 'advanced_pancreatic_cancer',
    recentClinicalChange:
      "Maria has advanced pancreatic cancer and has been on hospice for six weeks. She has been managing with moderate nausea but this morning she has been vomiting repeatedly for two hours and cannot keep water down. Her son Carlos called the hospice line in a panic, worried she needs to go to the emergency room.",
    whoIsPresent: ['Maria', 'her son Carlos'],
    learnerObjective:
      "Acknowledge Carlos's fear. Assess the clinical picture through his description — what she is vomiting, how frequently, whether she is in pain, what she has eaten. Explain what nausea and vomiting can mean in advanced cancer. Provide non-medication comfort measures Carlos can use now. Route the medication question to the on-call provider. Give Carlos clear criteria for when the situation requires a different response.",
    roleReminder:
      "You are an RN on the hospice phone line. You may assess symptoms through the caregiver's description, educate on nausea comfort measures, and describe what the hospice plan provides. You should not recommend going to the ER, state specific antiemetic doses, or suggest IV fluids. Route medication decisions to the on-call provider.",
    hiddenFamilyFear:
      "Carlos believes the vomiting means his mother is deteriorating faster than expected and that the hospice team is not going to help her because they have 'given up on curative treatment.' He is on the edge of taking her to the ER himself because doing something feels better than doing nothing.",
    openingSpeakerName: 'Carlos',
    openingLine:
      "She has been throwing up for two hours. She can't keep anything down — not even water. Should I take her to the emergency room? I don't know what to do and I'm scared something is really wrong.",
    successCriteria: [
      "Acknowledges Carlos's fear before starting the assessment.",
      "Asks assessment questions — what, how often, whether she is in pain, what she has had to eat.",
      "Explains that nausea and vomiting are manageable symptoms, not necessarily a sign of rapid decline.",
      "Provides comfort measures Carlos can use right now — positioning, small sips, cool cloth.",
      "Does not recommend the ER without clinical justification.",
      "Routes antiemetic medication decisions to the on-call provider.",
      "Gives Carlos clear criteria for when to call back or escalate.",
    ],
    failureCriteria: [
      "Recommends going to the ER without clinical justification.",
      "States a specific antiemetic dose.",
      "Jumps to comfort measures without acknowledging Carlos's fear.",
      "Leaves Carlos without a next step or escalation criteria.",
      "Overpromises that the nausea will resolve completely.",
    ],
    patientStateDefaultId: 'nausea_vomiting_home',
  },

  {
    id: 'dehydration_education',
    title: 'She Needs to Drink Something',
    allowedRoleId: 'rn',
    difficulty: 'intermediate',
    setting: 'Patient home, routine nursing visit',
    patient: {
      name: 'Eleanor Carter',
      age: 88,
    },
    knownDiagnosisId: 'advanced_dementia',
    recentClinicalChange:
      "Eleanor has advanced dementia and has been on hospice for two months. Over the past week she has stopped drinking reliably, accepting only small sips when her daughter Joyce offers them. Eleanor does not appear to be in distress. Joyce has been trying to get fluids into her and called the hospice team asking whether Eleanor needs IV fluids or a feeding tube.",
    whoIsPresent: ['Eleanor', 'her daughter Joyce'],
    learnerObjective:
      "Acknowledge Joyce's fear that Eleanor is dying from dehydration. Explain the natural dying process — that reduced intake is a result of the dying process, not the cause of it. Explain why IV fluids in advanced dementia often cause more suffering rather than comfort. Provide mouth care and comfort measures Joyce can use. Do not order IV fluids. Route the clinical question to the hospice provider if needed.",
    roleReminder:
      "You are an RN. You may educate on the natural dying process, explain why IV hydration is often not appropriate in advanced dementia, and teach mouth care and comfort measures. You should not order IV fluids or a feeding tube. Route clinical orders to the hospice provider. Do not give prognosis estimates.",
    hiddenFamilyFear:
      "Joyce believes she is causing her mother's death by not forcing fluids into her. She thinks the dying is happening because Eleanor stopped drinking, not that Eleanor stopped drinking because she is dying. She also carries guilt about every moment her mother looks uncomfortable and interprets reduced intake as her failure to provide care.",
    openingSpeakerName: 'Joyce',
    openingLine:
      "She has not had anything to drink in two days. I have been trying to get water in her but she keeps pushing it away or it just runs out of her mouth. I know people die without water. Can we get her an IV? I feel like I am letting her starve.",
    successCriteria: [
      "Acknowledges Joyce's fear and the guilt behind the question before explaining anything.",
      "Explains that reduced intake is part of the natural dying process — the body stops because it is dying, not the other way around.",
      "Explains why IV fluids in advanced dementia can cause more discomfort — fluid overload, edema.",
      "Provides mouth care and comfort measures Joyce can use to feel like she is caring for her mother.",
      "Does not order IV fluids.",
      "Routes any clinical order question to the hospice provider.",
    ],
    failureCriteria: [
      "Orders or implies IV fluids are appropriate.",
      "Jumps to medical explanation without acknowledging Joyce's guilt.",
      "Implies Joyce has done something wrong by not forcing fluids.",
      "Uses clinical jargon without plain language.",
      "Leaves Joyce feeling helpless without a comfort role.",
    ],
    patientStateDefaultId: 'dehydration_education',
  },

  {
    id: 'terminal_agitation_home',
    title: 'He Is Not Himself',
    allowedRoleId: 'rn',
    difficulty: 'advanced',
    setting: 'Patient home, urgent call',
    patient: {
      name: 'Charles Wheeler',
      age: 71,
    },
    knownDiagnosisId: 'als_terminal',
    recentClinicalChange:
      "Charles has ALS and has been largely bedbound for three weeks. This morning he became suddenly confused, restless, and agitated — he is moving in bed despite significant motor impairment, said something about 'people in the room,' and will not be calmed by his wife Diane. This is the first time Diane has seen terminal agitation. She called the hospice line in distress.",
    whoIsPresent: ['Charles', 'his wife Diane'],
    learnerObjective:
      "Acknowledge Diane's fear. Explain terminal agitation and delirium in plain language — what it is, why it happens, what it does and does not mean about suffering. Distinguish agitation from pain. Provide immediate comfort measures. Route medication management to the on-call provider. Do not leave Diane alone in her fear.",
    roleReminder:
      "You are an RN. You may explain terminal agitation, provide comfort education, and describe what the hospice plan provides for symptom management. You should not state specific medication doses or modify orders. Route medication management to the on-call hospice provider.",
    hiddenFamilyFear:
      "Diane believes Charles is in severe pain and that the confusion and restlessness mean he is suffering in a way she cannot see or stop. She has been his sole caregiver for eighteen months and managed every symptom carefully — this is the first time she has felt completely helpless. She also fears the confusion means he is trying to tell her something she cannot hear.",
    openingSpeakerName: 'Diane',
    openingLine:
      "He is not himself at all. He was calm this morning and now he won't stop moving, he said something about people in the room who aren't here, and he looks terrified. Is he in pain? What is happening to him? I don't know what to do.",
    successCriteria: [
      "Acknowledges Diane's fear and distress before explaining anything.",
      "Explains terminal agitation and delirium in plain language — not a sign of pain alone.",
      "Distinguishes agitation from pain — they can occur together but confusion and restlessness are neurological.",
      "Provides immediate comfort measures Diane can use — calm voice, dim lights, familiar music, gentle presence.",
      "Routes medication management to the on-call provider.",
      "Does not leave Diane without a next step or a role.",
    ],
    failureCriteria: [
      "States a specific medication dose without referencing hospice orders.",
      "Overpromises that the agitation will stop quickly.",
      "Leaves Diane without comfort measures or a next step.",
      "Uses clinical jargon without explaining what it means.",
      "Dismisses the possibility that he may be in pain without acknowledging the uncertainty.",
    ],
    patientStateDefaultId: 'terminal_agitation_home',
  },

  {
    id: 'seizure_at_home',
    title: 'It Happened Again',
    allowedRoleId: 'rn',
    difficulty: 'intermediate',
    setting: 'Patient home, day after a seizure',
    patient: {
      name: 'Raymond Klein',
      age: 67,
    },
    knownDiagnosisId: 'advanced_cancer',
    recentClinicalChange:
      "Raymond has advanced brain cancer on hospice and has had two breakthrough seizures in the past month. Last night he had another seizure lasting approximately ninety seconds. His wife Barbara sat with him alone, did not know what to do, and was terrified. Raymond recovered and slept for several hours. Barbara called the hospice nurse the next morning.",
    whoIsPresent: ['Raymond', 'his wife Barbara'],
    learnerObjective:
      "Acknowledge Barbara's fear and the trauma of watching a seizure alone. Teach seizure safety in plain, actionable language — positioning, timing, what not to do. Explain what to expect during and after a seizure. Give her clear criteria for when to call the hospice line versus when to call 911. Route medication decisions to the on-call provider. Empower Barbara to manage the next episode without panic.",
    roleReminder:
      "You are an RN. You may explain seizure safety measures, provide caregiver education, and describe what the hospice plan provides. You should not state specific anticonvulsant doses, modify orders, or promise seizures will not recur. Route medication questions to the on-call hospice provider.",
    hiddenFamilyFear:
      "Barbara is terrified the next seizure will kill Raymond while she is alone with him. She also fears that her inaction during the seizure — she did not know what to do — caused harm. She blames herself for not asking more questions when he was first diagnosed. She needs both education and absolution.",
    openingSpeakerName: 'Barbara',
    openingLine:
      "He had another one last night. I sat there and I didn't know what to do. I just watched it happen. It lasted maybe two minutes and then he slept for hours. Is it going to keep happening? What do I do next time so I don't make it worse?",
    successCriteria: [
      "Acknowledges Barbara's fear and validates the trauma of witnessing a seizure alone.",
      "Reassures Barbara that her presence during the seizure was not harmful.",
      "Teaches seizure safety — side positioning, do not restrain, do not put anything in mouth, time the seizure.",
      "Explains what to expect during and after — the postictal phase of confusion and sleep is normal.",
      "Gives clear criteria for calling the hospice line versus calling 911.",
      "Routes antiseizure medication decisions to the on-call provider.",
    ],
    failureCriteria: [
      "States a specific anticonvulsant dose.",
      "Promises the seizures will not recur.",
      "Tells Barbara to call 911 for all future seizures without qualification.",
      "Skips the emotional acknowledgment and goes directly to instructions.",
      "Leaves Barbara without clear escalation criteria.",
    ],
    patientStateDefaultId: 'seizure_at_home',
  },

  // ── Clinical Liaison: 5 new scenarios ─────────────────────────────────

  {
    id: 'coverage_confusion',
    title: 'Can He Still See His Cardiologist?',
    allowedRoleId: 'clinical_liaison',
    difficulty: 'beginner',
    setting: 'Phone call to hospice coordination office',
    patient: {
      name: 'William Park',
      age: 78,
    },
    knownDiagnosisId: 'advanced_heart_failure',
    recentClinicalChange:
      'William Park enrolled in hospice one week ago after three hospitalizations for decompensated heart failure. His son Daniel called the hospice coordination office because he heard that William can no longer see his cardiologist, Dr. Patel, whom he has been seeing for twelve years. Daniel is angry and confused.',
    whoIsPresent: ['Daniel Park, his son'],
    learnerObjective:
      "Acknowledge Daniel's frustration and concern. Explain what the Medicare hospice benefit covers and does not cover in plain language. Clarify that William can still see Dr. Patel for conditions unrelated to his hospice diagnosis, but that cardiac treatment for the terminal diagnosis transitions to the hospice team. Avoid misrepresenting coverage. Route specific billing questions to the hospice care coordinator.",
    roleReminder:
      "You are a Clinical Liaison. You may explain what the Medicare hospice benefit covers in general terms — that care related to the terminal diagnosis transfers to hospice, but unrelated conditions can still be treated. You should not make specific billing determinations, promise specific coverage outcomes, give prognosis estimates, or provide medication guidance.",
    hiddenFamilyFear:
      "Daniel believes that by enrolling his father in hospice, he has cut him off from all legitimate medical care — that Dr. Patel will no longer see him at all and that his father has been abandoned by the doctors who know him. He also fears he made a mistake by agreeing to hospice enrollment.",
    openingSpeakerName: 'Daniel',
    openingLine:
      "I just heard that my dad can't see his cardiologist anymore now that he's on hospice. He has been seeing Dr. Patel for twelve years. Are you telling me we signed him up for something that cuts him off from his real doctors?",
    successCriteria: [
      "Acknowledges Daniel's frustration and concern before explaining anything.",
      "Explains that hospice covers care related to the terminal diagnosis — heart failure in this case.",
      "Clarifies that William can still see Dr. Patel for conditions unrelated to the hospice diagnosis.",
      "Does not make a specific billing determination or promise a specific coverage outcome.",
      "Routes detailed coverage questions to the hospice care coordinator.",
      "Avoids prognosis estimates and medication guidance.",
    ],
    failureCriteria: [
      "States that William can no longer see his cardiologist at all.",
      "Makes a specific Medicare billing determination beyond general explanation.",
      "Lists hospice services before addressing Daniel's anger and concern.",
      "Provides prognosis estimates or medication guidance.",
      "Leaves Daniel without a next step.",
    ],
    patientStateDefaultId: 'coverage_confusion',
  },

  {
    id: 'hospice_discharge_fear',
    title: 'What If She Gets Better?',
    allowedRoleId: 'clinical_liaison',
    difficulty: 'beginner',
    setting: 'Outpatient care coordination office',
    patient: {
      name: 'Eleanor Lawson',
      age: 84,
    },
    knownDiagnosisId: 'advanced_dementia',
    recentClinicalChange:
      "Eleanor has advanced Alzheimer's and has been on hospice for four months. Since enrolling, she has been more comfortable and her daughter Patricia has noticed she seems more settled — sleeping regularly, accepting some food. Patricia called to ask whether Eleanor's improvement means she will be discharged from hospice and lose all her support.",
    whoIsPresent: ['Patricia Lawson, her daughter'],
    learnerObjective:
      "Acknowledge Patricia's fear that improvement leads to losing support. Explain how hospice recertification works — stabilization is common and expected on hospice, not a reason for automatic discharge. Explain what the process looks like if a patient no longer meets criteria. Clarify that families are never simply abandoned — there is always a care transition plan.",
    roleReminder:
      "You are a Clinical Liaison. You may explain the hospice recertification process and what happens if a patient stabilizes. You should not make eligibility determinations, give prognosis estimates, or state that Eleanor will or will not be discharged. Route specific clinical eligibility questions to the hospice physician or care team.",
    hiddenFamilyFear:
      "Patricia is terrified that hospice requires her mother to keep declining to stay enrolled — that if she has a good week, the support will disappear and Eleanor will return to the unmanaged distress she was in before. She has come to rely on the hospice team and the idea of losing them is devastating.",
    openingSpeakerName: 'Patricia',
    openingLine:
      "She seems more comfortable lately. She's sleeping better and eating a little more. I know I should be happy, but now I'm afraid the hospice team will say she's improved and take her off. Can that happen? What do we do if she gets better?",
    successCriteria: [
      "Acknowledges that Patricia's fear makes sense — this is a question worth asking.",
      "Explains that stabilization on hospice is common and does not automatically trigger discharge.",
      "Describes the recertification process — the team assesses eligibility regularly, and a good period does not equal discharge.",
      "Explains what happens if a patient no longer meets criteria — a planned transition, not an abrupt cutoff.",
      "Does not make a specific eligibility determination for Eleanor.",
      "Routes clinical eligibility questions to the hospice physician or care team.",
    ],
    failureCriteria: [
      "States or implies that improvement means Eleanor will be discharged.",
      "Makes a specific eligibility determination.",
      "Dismisses Patricia's concern.",
      "Gives a prognosis estimate.",
      "Leaves Patricia without a next step or sense of what to do if she has questions.",
    ],
    patientStateDefaultId: 'hospice_discharge_fear',
  },

  {
    id: 'inpatient_hospice_request',
    title: 'We Cannot Keep Doing This at Home',
    allowedRoleId: 'clinical_liaison',
    difficulty: 'intermediate',
    setting: 'Hospice coordination office',
    patient: {
      name: 'Henry Chen',
      age: 74,
    },
    knownDiagnosisId: 'advanced_lung_disease',
    recentClinicalChange:
      "Henry has advanced lung cancer and has been on hospice at home for three months. His son Robert has been his primary caregiver. Over the past two weeks Henry's pain has become increasingly difficult to manage at home. Robert has not slept more than two hours at a stretch in a week. He called to ask whether there is a place — not a nursing home — where Henry could receive hospice-level care.",
    whoIsPresent: ['Robert Chen, his son'],
    learnerObjective:
      "Acknowledge Robert's exhaustion and validate that asking for more support is not failure. Explain what inpatient hospice levels of care look like — both General Inpatient (GIP) for uncontrolled symptoms and residential hospice care. Explain when each level applies. Give Robert a clear next step. Do not make Robert feel he should continue managing at home if the situation is beyond home capacity.",
    roleReminder:
      "You are a Clinical Liaison. You may explain hospice levels of care including GIP and residential hospice. You should not make a GIP eligibility determination, promise availability of a specific inpatient bed, give prognosis estimates, or provide medication guidance.",
    hiddenFamilyFear:
      "Robert feels that asking to move his father out of the home is a betrayal — that Henry will believe he is being abandoned by his son. He also carries shame about his exhaustion, feeling that a good son should be able to endure more. He needs permission to ask for help without feeling like he is giving up on his father.",
    openingSpeakerName: 'Robert',
    openingLine:
      "I haven't slept in days. His pain is out of control and I can't manage it at home anymore. Someone told me there is a place where hospice can happen — not a nursing home — is that real? Can we do that?",
    successCriteria: [
      "Acknowledges Robert's exhaustion and validates that asking for more support is not failure.",
      "Explains inpatient hospice options — GIP for symptom crises and residential hospice for caregiving overwhelm.",
      "Explains when GIP is typically indicated — uncontrolled pain, symptoms that cannot be managed at home.",
      "Does not make Robert feel he should have managed longer at home.",
      "Gives a clear next step — who to contact, what happens next.",
      "Does not promise availability of a specific bed or make an eligibility determination.",
    ],
    failureCriteria: [
      "Makes Robert feel guilty for asking or implies he should manage more at home.",
      "Promises a specific inpatient bed without confirming availability.",
      "Makes a GIP eligibility determination.",
      "Provides medication guidance.",
      "Leaves Robert without a next step.",
    ],
    patientStateDefaultId: 'inpatient_hospice_request',
  },

  {
    id: 'treatment_just_failed',
    title: 'The Treatment Stopped Working',
    allowedRoleId: 'clinical_liaison',
    difficulty: 'intermediate',
    setting: 'Hospital oncology suite, immediately after physician meeting',
    patient: {
      name: 'Anne Walsh',
      age: 69,
    },
    knownDiagnosisId: 'advanced_pancreatic_cancer',
    recentClinicalChange:
      "Anne Walsh has been receiving chemotherapy for pancreatic cancer for seven months. Her oncologist met with her daughter Karen twenty minutes ago and told her the chemotherapy is no longer working and that further treatment is not expected to help. The oncologist asked the clinical liaison to speak with Karen as the next step.",
    whoIsPresent: ['Karen Walsh, her daughter'],
    learnerObjective:
      "Acknowledge Karen's shock — she has just received devastating news and is still in the room where it happened. Do not launch into hospice services. Hold space for the immediate emotional reality. When Karen is ready, explain in plain language what a transition to comfort-focused care looks like. Do not give a prognosis. Do not pressure toward a decision. Give Karen a single clear next step.",
    roleReminder:
      "You are a Clinical Liaison. You may acknowledge Karen's shock and grief, explain what hospice support looks like, and describe what the transition process involves. You should not confirm or contradict the oncologist's prognosis, determine hospice eligibility, apply pressure toward enrollment, or provide medication guidance.",
    hiddenFamilyFear:
      "Karen has conflated 'treatment stopped working' with 'she is dying right now.' She does not know there is space between treatment failure and death. She also fears that agreeing to hospice is what causes her mother to die — that if she holds on to treatment thinking, her mother will live longer.",
    openingSpeakerName: 'Karen',
    openingLine:
      "The doctor just told us the chemo isn't working. She said to talk to hospice. I don't even know what that means. My mom is right here. Is she dying right now? What is happening to us?",
    successCriteria: [
      "Acknowledges the shock and grief before any explanation.",
      "Does not launch into hospice services immediately.",
      "Distinguishes between treatment not working and dying right now — creates space between those two things.",
      "Explains what hospice support looks like in plain language when Karen is ready to hear it.",
      "Does not confirm or contradict the oncologist's prognosis.",
      "Does not pressure Karen toward a decision.",
      "Gives Karen one clear, manageable next step.",
    ],
    failureCriteria: [
      "Launches into hospice services without acknowledging the emotional reality first.",
      "Confirms or contradicts the prognosis.",
      "Implies or states that Karen's mother is dying today.",
      "Pressures toward enrollment.",
      "Provides medication guidance.",
      "Leaves Karen without any next step.",
    ],
    patientStateDefaultId: 'treatment_just_failed',
  },

  {
    id: 'sibling_prognosis_conflict',
    title: 'My Brother Doesn\'t Want Her to Know',
    allowedRoleId: 'clinical_liaison',
    difficulty: 'advanced',
    setting: 'Outpatient care coordination office',
    patient: {
      name: 'Margaret Holloway',
      age: 81,
    },
    knownDiagnosisId: 'advanced_heart_failure',
    recentClinicalChange:
      "Margaret has advanced heart failure and has recently been enrolled in hospice. She has asked her daughter Christine directly whether she is dying. Christine wants to be honest with her mother. Her brother Tim has told Christine that telling their mother the truth will destroy her will to live and he has threatened to remove Christine from any family decisions if she tells her. Christine came to the liaison alone.",
    whoIsPresent: ['Christine Holloway, her daughter'],
    learnerObjective:
      "Acknowledge the genuinely impossible position Christine is in. Explain the patient's right to information about her own condition — it belongs to Margaret, not to the family. Explore whether anyone has asked Margaret what she wants to know. Offer to facilitate a family meeting that centers Margaret's expressed wishes. Stay neutral between Christine and Tim. Do not tell Christine what to do.",
    roleReminder:
      "You are a Clinical Liaison. You may explain patient autonomy and the right to information, and offer to facilitate a family meeting. You should not take Christine's side or Tim's side, tell Christine to share or withhold information, make a prognosis statement, or provide medication guidance.",
    hiddenFamilyFear:
      "Christine is caught between loyalty to her mother's right to know and loyalty to her family's unity. She fears that telling her mother the truth will permanently rupture her relationship with Tim. She also fears that staying silent is a kind of betrayal — that her mother will die without knowing the truth and will feel abandoned by the daughter she trusted.",
    openingSpeakerName: 'Christine',
    openingLine:
      "Mom keeps asking me if she is dying. I want to tell her the truth. But my brother Tim says we cannot — he says it will break her. He threatened to shut me out of everything if I say anything. I don't know what to do. What would you do?",
    successCriteria: [
      "Acknowledges the impossible position Christine is in — both options feel like betrayal.",
      "Explains that the right to information belongs to Margaret, not to the family.",
      "Explores whether anyone has asked Margaret what she wants to know.",
      "Stays neutral — does not tell Christine to tell her mother or to agree with Tim.",
      "Offers to facilitate a family meeting that centers Margaret's expressed wishes.",
      "Does not make a prognosis statement.",
    ],
    failureCriteria: [
      "Tells Christine she should tell her mother the truth.",
      "Tells Christine she should agree with Tim.",
      "Takes a side between Christine and Tim.",
      "Makes a prognosis statement.",
      "Moves to paperwork or process before addressing the emotional reality.",
      "Provides medication guidance.",
    ],
    patientStateDefaultId: 'sibling_prognosis_conflict',
  },

  // ── Social Worker: 5 new scenarios ────────────────────────────────────

  {
    id: 'children_in_home',
    title: 'What Do I Tell My Kids?',
    allowedRoleId: 'social_worker',
    difficulty: 'intermediate',
    setting: 'Patient home, social work visit',
    patient: {
      name: 'Marcus Reed',
      age: 41,
    },
    knownDiagnosisId: 'advanced_lung_disease',
    recentClinicalChange:
      "Marcus has advanced lung cancer and has been on hospice at home for three weeks. He is alert and engaged with his children when he has energy. His wife Angela, 38, has been managing their two children — ages 8 and 11 — alone. The children have been asking questions and the eight-year-old asked Angela directly yesterday whether daddy is going to die. Angela did not know what to say.",
    whoIsPresent: ['Angela Reed, his wife'],
    learnerObjective:
      "Acknowledge how hard it is to protect children while also being honest with them. Provide developmentally appropriate guidance — children ages 8 and 11 generally do better with honest, simple information than with vague reassurance. Validate Angela's instinct to protect her children while also supporting them. Offer practical language. Do not prescribe exactly what she should say — offer a framework and let Angela decide.",
    roleReminder:
      "You are a Social Worker. You may provide guidance on talking with children about death, validate Angela's instincts, and offer resources including referrals to pediatric grief support. You should not diagnose the children, prescribe a specific script, take over the parenting decision, or provide medication guidance.",
    hiddenFamilyFear:
      "Angela believes that telling her children the truth will traumatize them permanently — that she will destroy their childhoods by telling them their father is dying. She also carries a fear that if she explains what is happening, the children will hate her for not protecting them from the pain. She cannot see that the uncertainty and vagueness is causing anxiety in them already.",
    openingSpeakerName: 'Angela',
    openingLine:
      "My eight-year-old asked me yesterday if Daddy is going to die. I just said the doctors are helping him. I don't know if that was the right thing. How do I talk to them about this? I don't want to traumatize them.",
    successCriteria: [
      "Acknowledges how hard Angela's position is — protect or tell, both feel like they cost something.",
      "Explains that children ages 8 and 11 generally manage truth better than vague reassurance, in plain language.",
      "Validates Angela's protective instinct while gently expanding her framework.",
      "Offers concrete language examples — not a script, but a direction.",
      "Offers to connect Angela with pediatric grief support resources.",
      "Does not prescribe what Angela must say — supports her in making the decision.",
    ],
    failureCriteria: [
      "Tells Angela her response was wrong.",
      "Prescribes an exact script Angela must use.",
      "Implies children are always harmed by knowing.",
      "Rushes to resources before acknowledging the emotional weight.",
      "Provides medication guidance.",
    ],
    patientStateDefaultId: 'children_in_home',
  },

  {
    id: 'financial_caregiver_stress',
    title: 'I Had to Quit My Job',
    allowedRoleId: 'social_worker',
    difficulty: 'intermediate',
    setting: 'Patient home, routine social work visit',
    patient: {
      name: 'Thomas Nguyen',
      age: 74,
    },
    knownDiagnosisId: 'advanced_prostate_cancer',
    recentClinicalChange:
      "Thomas has advanced prostate cancer and has been on hospice for three months. His son James, 44, quit his job to become Thomas's full-time caregiver. He has been using his savings. The hospice social worker noted on a previous visit that James seemed withdrawn and mentioned 'money stuff' before quickly changing the subject. Today James mentioned it again before saying 'I don't want to talk about money when he's dying.'",
    whoIsPresent: ['James Nguyen, his son'],
    learnerObjective:
      "Acknowledge that financial concerns during caregiving are legitimate and not selfish — they are part of whole-family care. Validate the sacrifice James made without sentimentalizing it. Assess his financial situation and what resources might help — FMLA information, financial assistance programs, hospice support services. Do not suggest placing Thomas as a financial solution.",
    roleReminder:
      "You are a Social Worker. You may explore caregiver financial stress, provide resource information, and validate the difficulty of caregiving without income. You should not make financial decisions for James, suggest placing Thomas as a solution to financial pressure, or provide medication guidance.",
    hiddenFamilyFear:
      "James feels that focusing on money is selfish and disloyal when his father is dying. He believes that mentioning financial stress reveals he is not fully committed to his father's care. He also fears that if he admits how bad it is, someone will suggest placing his father — which would feel like a betrayal of his sacrifice.",
    openingSpeakerName: 'James',
    openingLine:
      "I quit my job three months ago to take care of him. I thought I could go back after... I don't know. My savings are almost gone. I don't even know why I'm telling you this. I feel like it's wrong to talk about money when he's dying.",
    successCriteria: [
      "Validates that financial concerns during caregiving are legitimate — not selfish.",
      "Acknowledges the sacrifice James made without making him feel guilty or heroic — just seen.",
      "Explores the financial situation gently — how bad is it, what resources does he know about.",
      "Provides information on relevant resources — family leave, financial assistance, hospice aid services.",
      "Does not suggest placing Thomas as a financial solution.",
      "Does not rush past the emotional reality into a resource list.",
    ],
    failureCriteria: [
      "Implies that talking about money is inappropriate.",
      "Suggests or implies placement as a financial solution.",
      "Launches into a resource list before acknowledging the emotional reality.",
      "Makes James feel guilty for his financial situation.",
      "Provides medication guidance.",
    ],
    patientStateDefaultId: 'financial_caregiver_stress',
  },

  {
    id: 'patient_home_death_wish',
    title: 'She Wants to Die at Home',
    allowedRoleId: 'social_worker',
    difficulty: 'advanced',
    setting: 'Skilled nursing facility, social work office',
    patient: {
      name: 'Louise Perkins',
      age: 74,
    },
    knownDiagnosisId: 'advanced_cancer',
    recentClinicalChange:
      "Louise has advanced ovarian cancer and is currently in a skilled nursing facility. She has told the social work team clearly and repeatedly that she wants to die at home in her own bed. Her son Alan has visited and says he cannot be there consistently — he travels for work and his sister lives in California. The social work team has been asked to facilitate a conversation with Alan about Louise's expressed wishes.",
    whoIsPresent: ['Alan Perkins, her son'],
    learnerObjective:
      "Acknowledge Alan's grief and the impossibility he feels. Explore what honoring Louise's wish could realistically look like — not as an all-or-nothing proposition, but as a question of what support structure might make it possible. Explore what Louise herself has said about her needs. Do not tell Alan he must make this happen. Do not dismiss the wish as impractical without exploring it.",
    roleReminder:
      "You are a Social Worker. You may advocate for the patient's expressed wishes, explore caregiver feasibility, and discuss support structures that might bridge the gap. You should not tell Alan he has failed, pressure him to stop working, dismiss Louise's wish, or provide medication guidance.",
    hiddenFamilyFear:
      "Alan loves his mother deeply and is devastated that he cannot give her what she wants. He fears that if he tells her he cannot be there consistently, she will die believing her children abandoned her. He also carries enormous guilt about his career choices in relation to his family. He came into this conversation hoping the social worker would tell him there is no other option so he would not have to carry the decision.",
    openingSpeakerName: 'Alan',
    openingLine:
      "She told me she wants to die at home. In her own bed. She has been saying it for months. But I travel for work, my sister is in California — we cannot be there every day. How do I tell her we can't do it without breaking her heart?",
    successCriteria: [
      "Acknowledges Alan's grief and the weight of what he is being asked to do.",
      "Does not immediately dismiss Louise's wish as impossible.",
      "Explores what honoring the wish could look like — hospice aide support, neighbor network, adjusted work schedule.",
      "Explores what Louise has said about her own needs and flexibility.",
      "Does not make Alan feel he has failed or is failing.",
      "Does not pressure him to make a specific decision in the meeting.",
    ],
    failureCriteria: [
      "Immediately declares home death impossible.",
      "Makes Alan feel guilty for his work situation.",
      "Dismisses Louise's wish without exploring options.",
      "Tells Alan what decision to make.",
      "Provides medication guidance.",
    ],
    patientStateDefaultId: 'patient_home_death_wish',
  },

  {
    id: 'anticipatory_grief_isolation',
    title: 'Everyone Tells Me to Be Strong',
    allowedRoleId: 'social_worker',
    difficulty: 'intermediate',
    setting: 'Patient home, family support visit',
    patient: {
      name: 'Warren Brooks',
      age: 71,
    },
    knownDiagnosisId: 'end_stage_heart_failure',
    recentClinicalChange:
      "Warren has advanced heart failure and is alert and present at home. His wife Helen, 68, has been managing his care with hospice support for two months. On this visit Helen pulled the social worker aside to say she has been crying frequently, that she cried in the grocery store yesterday over his brand of cereal, and that when she tries to tell friends how she is doing, they tell her to 'stay strong' or 'focus on the positive.'",
    whoIsPresent: ['Helen Brooks, his wife'],
    learnerObjective:
      "Acknowledge Helen's experience and name anticipatory grief explicitly — validate that grieving while someone is still alive is real, recognized, and not a betrayal. Challenge the 'stay strong' message gently without criticizing her friends. Explore her isolation and what she needs. Offer connection to grief support proactively. Do not rush her toward resources before she feels heard.",
    roleReminder:
      "You are a Social Worker. You may normalize anticipatory grief, validate Helen's experience, and offer connection to grief support resources. You should not diagnose a grief disorder, tell Helen how she should feel, pressure her toward a timeline for resolution, or provide medication guidance.",
    hiddenFamilyFear:
      "Helen believes that grieving while Warren is still alive is a betrayal — that it means she has given up on him, or that some part of her is 'ready for it to be over,' which she cannot forgive herself for. She also feels profoundly isolated because everyone around her is performing strength, and she cannot find anyone who will let her be sad.",
    openingSpeakerName: 'Helen',
    openingLine:
      "He is still here, and I know I should be grateful. But I cried in the grocery store yesterday because I saw his brand of cereal. And when I try to talk to my friends, they say stay strong and think positive. Is something wrong with me?",
    successCriteria: [
      "Acknowledges Helen's experience before explaining anything.",
      "Names anticipatory grief explicitly — validates it as real and recognized.",
      "Validates that the grocery store moment is normal, not a sign of something being wrong.",
      "Gently challenges the 'stay strong' message without criticizing her friends.",
      "Explores her isolation and what she needs right now.",
      "Offers grief support proactively — before she has to ask for it.",
    ],
    failureCriteria: [
      "Tells Helen to focus on the time she has left.",
      "Implies that grieving now means she has given up on Warren.",
      "Pathologizes the anticipatory grief as something to fix.",
      "Rushes to resources before Helen feels heard.",
      "Tells Helen her friends mean well — dismissing the isolation.",
      "Provides medication guidance.",
    ],
    patientStateDefaultId: 'anticipatory_grief_isolation',
  },

  {
    id: 'opioid_history_pain',
    title: 'He Had a Problem Years Ago',
    allowedRoleId: 'social_worker',
    difficulty: 'advanced',
    setting: 'Hospital room, day of hospice discharge planning',
    patient: {
      name: 'Roberto Santos',
      age: 71,
    },
    knownDiagnosisId: 'advanced_cancer',
    recentClinicalChange:
      "Roberto has advanced cancer and is being discharged to home hospice today. The hospice comfort plan includes morphine for pain management. His son Victor, 50, pulled the social worker aside before discharge and disclosed that Roberto was dependent on opioids fifteen years ago, got clean, and has been sober since. Victor is terrified that the comfort medications will cause his father to relapse before he dies, but he also knows his father is in severe pain.",
    whoIsPresent: ['Victor Santos, his son'],
    learnerObjective:
      "Acknowledge both of Victor's fears — watching his father suffer in pain AND watching him lose the sobriety he fought for. Validate that this is a legitimate concern, not a sign of bad judgment. Explain the clinical difference between physical dependence and addiction in the context of terminal illness. Explain that the hospice team is aware of and equipped to manage this. Route the clinical plan to the hospice physician and nurse.",
    roleReminder:
      "You are a Social Worker. You may acknowledge the addiction history concern, provide general education on the difference between dependence and addiction in terminal illness, and validate Victor's dilemma. You should not make medication decisions, state specific doses, dismiss the addiction history as irrelevant, or guarantee there will be no issues.",
    hiddenFamilyFear:
      "Victor is caught between two terrors: watching his father die in pain versus watching him lose the sobriety that took years to achieve and defined the second half of his life. He also carries shame about raising this concern — he fears someone will tell him his worry is selfish or disrespectful of his father's suffering. He needs someone to hold both fears as equally legitimate.",
    openingSpeakerName: 'Victor',
    openingLine:
      "My dad had a problem with pills — opioids — about fifteen years ago. He got clean and stayed clean. I am proud of him. But now they want to give him morphine. I am scared he is going to get hooked again, or I am going to watch him relapse before he dies. But I also know he is in pain. I don't know what to think.",
    successCriteria: [
      "Acknowledges both fears as legitimate — pain and relapse — without dismissing either.",
      "Validates Victor's concern rather than minimizing it as unnecessary worry.",
      "Explains the clinical difference between physical dependence and addiction in terminal illness.",
      "Explains that the hospice team takes addiction history into account in care planning.",
      "Does not dismiss the addiction history as clinically irrelevant.",
      "Routes the clinical medication plan to the hospice physician and nurse.",
    ],
    failureCriteria: [
      "Dismisses the addiction history as irrelevant because he is dying.",
      "Tells Victor not to worry about relapse.",
      "States specific doses or makes medication decisions.",
      "Makes Victor feel his concern is disrespectful of his father's pain.",
      "Guarantees there will be no issues with the medication.",
    ],
    patientStateDefaultId: 'opioid_history_pain',
  },
];
