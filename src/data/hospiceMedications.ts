import type { HospiceMedication } from '@/types/clinicalKnowledge';

export const hospiceMedications: HospiceMedication[] = [
  {
    id: 'med_morphine',
    name: 'Morphine',
    rxcui: '7052',
    drugClass: 'Opioid analgesic',
    clinicalPurpose:
      'Management of moderate to severe pain and reduction of the sensation of breathlessness (dyspnea) in end-of-life care.',
    commonRoutes: ['Oral', 'Sublingual', 'Subcutaneous', 'Intravenous'],
    hospiceContext:
      'Morphine is the most commonly used opioid in hospice care. At appropriate doses, it reduces air hunger by modulating the brain\'s response to low oxygen levels — it does not accelerate death when used correctly.',
    rnEducationPoint:
      'Low-dose morphine for air hunger works differently than morphine for pain. Educate caregivers that a dose that addresses breathlessness is not the same as a lethal dose.',
    familyTeachingPoint:
      'Morphine helps the brain feel less frightened by the breathing difficulty. It does not take away all visible breathing effort, but it reduces the sensation of suffocation.',
    roleNote:
      'RNs may educate caregivers about what the hospice comfort plan provides. RNs must not state specific doses or recommend dose changes. Dose questions go to the on-call provider.',
    scenarioRelevance: [
      'copd_air_hunger_at_home',
      'terminal_dyspnea_follow_up',
      'active_dying_recognition',
      'terminal_secretion_distress',
      'breakthrough_pain_at_home',
    ],
  },
  {
    id: 'med_oxycodone',
    name: 'Oxycodone',
    rxcui: '7804',
    drugClass: 'Opioid analgesic',
    clinicalPurpose:
      'Management of moderate to severe pain in patients who cannot tolerate morphine or require an alternative opioid.',
    commonRoutes: ['Oral', 'Sublingual'],
    hospiceContext:
      'Oxycodone is used when morphine causes intolerable side effects. It is available in immediate-release forms suitable for breakthrough pain management at home.',
    rnEducationPoint:
      'Breakthrough pain doses should be timed per hospice orders. Caregivers often underuse breakthrough medication out of fear — education on appropriate timing is critical.',
    familyTeachingPoint:
      'Breakthrough pain medicine is prescribed specifically so you can give it when your loved one is clearly in pain. You are not giving too much — you are following the plan.',
    roleNote:
      'RNs validate caregiver-administered breakthrough dosing and route dose-change questions to the on-call provider.',
    scenarioRelevance: ['breakthrough_pain_at_home', 'pain_management_concern'],
  },
  {
    id: 'med_lorazepam',
    name: 'Lorazepam',
    rxcui: '6470',
    drugClass: 'Benzodiazepine anxiolytic',
    clinicalPurpose:
      'Reduction of anxiety, agitation, and the fear response associated with air hunger and terminal restlessness.',
    commonRoutes: ['Oral', 'Sublingual', 'Intravenous'],
    hospiceContext:
      'Lorazepam addresses the anxiety component of air hunger and is commonly used alongside morphine for dyspnea management. It is also used for terminal restlessness.',
    rnEducationPoint:
      'The combination of morphine and lorazepam for air hunger targets both the physical sensation and the fear response — both components worsen dyspnea.',
    familyTeachingPoint:
      'This medicine helps with the fear and anxiety that makes breathing feel even harder. It works alongside the pain medicine to keep your loved one more comfortable.',
    roleNote:
      'RNs explain the purpose of anxiolytics in comfort plans without stating doses. Dose adjustment is provider scope.',
    scenarioRelevance: [
      'copd_air_hunger_at_home',
      'terminal_dyspnea_follow_up',
      'active_dying_recognition',
    ],
  },
  {
    id: 'med_haloperidol',
    name: 'Haloperidol',
    rxcui: '5074',
    drugClass: 'Antipsychotic / neuroleptic',
    clinicalPurpose:
      'Management of terminal delirium, agitation, and nausea in end-of-life care.',
    commonRoutes: ['Oral', 'Subcutaneous', 'Intravenous'],
    hospiceContext:
      'Haloperidol is a first-line agent for terminal delirium and is used in actively dying patients when restlessness and confusion are causing distress for the patient and family.',
    rnEducationPoint:
      'Terminal agitation and delirium are common in the last 48 hours of life. Haloperidol does not sedate in the same way as opioids — it reduces the distressing agitation that families often interpret as suffering.',
    familyTeachingPoint:
      'This medicine helps with restlessness and confusion. It is not a sedative — it helps your loved one\'s brain settle when the dying process is causing agitation.',
    roleNote:
      'RNs explain the purpose of terminal delirium management. Dose and administration questions route to the on-call provider.',
    scenarioRelevance: ['active_dying_recognition', 'terminal_secretion_distress'],
  },
  {
    id: 'med_glycopyrrolate',
    name: 'Glycopyrrolate',
    rxcui: '4765',
    drugClass: 'Anticholinergic agent',
    clinicalPurpose:
      'Reduction of terminal secretions (the \'death rattle\') by drying secretions the patient can no longer clear.',
    commonRoutes: ['Subcutaneous', 'Intravenous', 'Oral'],
    hospiceContext:
      'Terminal secretions are one of the most distressing sounds for families to witness. Glycopyrrolate does not cross the blood-brain barrier and thus does not sedate — it targets secretions specifically.',
    rnEducationPoint:
      'Glycopyrrolate reduces the volume of secretions but may not eliminate the sound entirely. Set accurate expectations with families — partial improvement is still meaningful comfort.',
    familyTeachingPoint:
      'This medicine helps dry up the secretions causing that sound. It may not stop the sound completely, but it can reduce it. Your loved one is not drowning — the secretions are in the throat, not the lungs.',
    roleNote:
      'RNs explain the purpose of secretion management and the limits of what the medication can achieve. Dose questions go to the on-call provider.',
    scenarioRelevance: ['terminal_secretion_distress', 'active_dying_recognition'],
  },
  {
    id: 'med_scopolamine',
    name: 'Scopolamine',
    rxcui: '9404',
    drugClass: 'Anticholinergic agent',
    clinicalPurpose:
      'Management of terminal secretions and nausea in end-of-life care. Also used for motion sickness and pre-operative drying of secretions.',
    commonRoutes: ['Transdermal patch', 'Subcutaneous', 'Intravenous'],
    hospiceContext:
      'Scopolamine patches provide continuous anticholinergic coverage and are useful when oral or injectable medications are not practical. Unlike glycopyrrolate, scopolamine crosses the blood-brain barrier and may cause mild sedation.',
    rnEducationPoint:
      'The scopolamine patch is applied behind the ear and provides 72-hour coverage. Families should be instructed on placement and disposal — skin contact with the patch can transfer the medication.',
    familyTeachingPoint:
      'This patch is placed behind the ear and works for up to three days to reduce secretions. Wash your hands after handling it — the medicine can be absorbed through skin.',
    roleNote:
      'RNs educate caregivers on patch placement and safety. Prescribing and dose-change orders belong to the provider.',
    scenarioRelevance: ['terminal_secretion_distress'],
  },
  {
    id: 'med_midazolam',
    name: 'Midazolam',
    rxcui: '6960',
    drugClass: 'Benzodiazepine sedative',
    clinicalPurpose:
      'Management of refractory agitation, seizure prevention, and palliative sedation in end-of-life care.',
    commonRoutes: ['Subcutaneous', 'Intravenous', 'Intranasal', 'Buccal'],
    hospiceContext:
      'Midazolam is a short-acting benzodiazepine used when lorazepam is insufficient for terminal agitation or when rapid onset is needed. In refractory cases, continuous infusion may be used as part of palliative sedation.',
    rnEducationPoint:
      'Midazolam for terminal agitation is distinct from midazolam for procedural sedation. In hospice, the goal is comfort — not deep sedation in all cases. Titration to comfort is the clinical standard.',
    familyTeachingPoint:
      'This medicine works quickly to calm severe restlessness that is causing distress. The goal is for your loved one to be peaceful, not necessarily unconscious.',
    roleNote:
      'RNs explain the role of fast-acting comfort medication in the plan of care. Palliative sedation decisions are provider and interdisciplinary team scope.',
    scenarioRelevance: ['active_dying_recognition', 'terminal_secretion_distress'],
  },
  {
    id: 'med_dexamethasone',
    name: 'Dexamethasone',
    rxcui: '3264',
    drugClass: 'Corticosteroid',
    clinicalPurpose:
      'Reduction of inflammation, treatment of spinal cord compression pain, management of nausea, and improvement of appetite and energy in cancer patients near end of life.',
    commonRoutes: ['Oral', 'Intravenous', 'Subcutaneous'],
    hospiceContext:
      'Dexamethasone is used in hospice for pain from metastatic bone disease and spinal cord compression, nausea management, and short-term improvement in quality of life in cancer patients.',
    rnEducationPoint:
      'Steroid-induced mood elevation and insomnia are common side effects families may not anticipate. Brief preparation prevents unnecessary alarm.',
    familyTeachingPoint:
      'This medicine can help reduce pain caused by swelling around tumors and can sometimes give a brief improvement in energy. It may cause some mood changes or difficulty sleeping.',
    roleNote:
      'RNs educate on expected effects and side effects of steroids in comfort care. Dose changes and initiation are provider scope.',
    scenarioRelevance: ['pain_management_concern', 'breakthrough_pain_at_home'],
  },
  {
    id: 'med_furosemide',
    name: 'Furosemide',
    rxcui: '4603',
    drugClass: 'Loop diuretic',
    clinicalPurpose:
      'Management of fluid overload, pulmonary edema, and symptoms of fluid retention in heart failure and ESRD patients.',
    commonRoutes: ['Oral', 'Intravenous', 'Subcutaneous'],
    hospiceContext:
      'Furosemide continues to be used in hospice to manage fluid-related symptoms — not to treat the underlying disease. The goal shifts from disease management to symptom comfort.',
    rnEducationPoint:
      'In end-stage heart failure, furosemide may no longer be as effective as the disease progresses. The family needs to understand that reduced effectiveness is a sign of disease progression, not treatment failure.',
    familyTeachingPoint:
      'This medicine helps remove extra fluid from the body to reduce the feeling of heaviness and breathing difficulty. As the heart gets weaker, it may not work as well — that is a sign of the disease, not a mistake.',
    roleNote:
      'RNs explain the comfort purpose of diuretics in the hospice plan. Dose adjustments require provider order.',
    scenarioRelevance: [
      'copd_air_hunger_at_home',
      'active_dying_recognition',
      'medication_refusal',
      'caregiver_burnout',
    ],
  },
  {
    id: 'med_methadone',
    name: 'Methadone',
    rxcui: '6813',
    drugClass: 'Opioid analgesic / NMDA receptor antagonist',
    clinicalPurpose:
      'Management of refractory cancer pain, neuropathic pain, and as an opioid rotation option in patients with tolerance to other opioids.',
    commonRoutes: ['Oral', 'Sublingual'],
    hospiceContext:
      'Methadone is used in hospice for complex pain that does not respond adequately to standard opioids. Its NMDA antagonist properties make it effective for neuropathic pain. It requires careful prescribing due to complex pharmacokinetics.',
    rnEducationPoint:
      'Methadone has a long and variable half-life — dose changes must be done cautiously. Families should not adjust the timing of doses without provider guidance.',
    familyTeachingPoint:
      'This pain medicine works differently from other opioids and is specifically chosen for certain types of pain. The timing matters — it must be given exactly as prescribed.',
    roleNote:
      'RNs educate on the importance of adherence to the specific dosing schedule. Dose changes and rotation decisions are provider scope.',
    scenarioRelevance: ['breakthrough_pain_at_home', 'pain_management_concern'],
  },
];
