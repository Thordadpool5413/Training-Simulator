import type { ClinicalDiagnosis } from '@/types/clinicalKnowledge';

export const clinicalDiagnoses: ClinicalDiagnosis[] = [
  {
    id: 'cd_advanced_heart_failure',
    diagnosisId: 'advanced_heart_failure',
    icd10Code: 'I50.9',
    icd10Description: 'Heart failure, unspecified',
    lcdId: 'L34548',
    lcdTitle: 'Cardiopulmonary Conditions — Hospice Eligibility',
    lcdContractor: 'Palmetto GBA',
    eligibilityCriteria: [
      'New York Heart Association Class IV symptoms at rest despite optimal medical management.',
      'Ejection fraction of 20% or less.',
      'Persistent symptoms despite diuretics, vasodilators, and ACE inhibitors.',
      'Recurrent hospitalizations for heart failure in the past six months.',
      'Patient declines or does not qualify for procedures such as transplant, LVAD, or revascularization.',
    ],
    clinicalDeclineIndicators: [
      'Each hospitalization leaves the patient with a weaker baseline.',
      'Shorter intervals between hospitalizations.',
      'Persistent fluid overload despite medication adjustments.',
      'Increasing oxygen requirement at rest.',
      'Unintentional weight loss.',
    ],
    roleRelevance: {
      clinical_liaison:
        'Use the repeated hospitalization pattern to explain why the care focus is shifting — each recovery is weaker than the last.',
      rn: 'Fluid status, breathlessness assessment, and comfort medication education are your primary tools.',
      social_worker:
        'Caregiver burden from managing an unpredictable, episodic decline is common. Assess support networks early.',
    },
  },
  {
    id: 'cd_advanced_pancreatic_cancer',
    diagnosisId: 'advanced_pancreatic_cancer',
    icd10Code: 'C25.9',
    icd10Description: 'Malignant neoplasm of pancreas, unspecified',
    lcdId: 'L34538',
    lcdTitle: 'Terminal Status — Hospice Eligibility',
    lcdContractor: 'CGS Administrators',
    eligibilityCriteria: [
      'Karnofsky Performance Status of 50% or less (requires significant assistance, frequent medical care).',
      'Clinical evidence that the illness will progress to death within six months if the disease runs its natural course.',
      'Documented weight loss of greater than 10% in the prior six months.',
      'Inability to maintain adequate food and fluid intake.',
    ],
    clinicalDeclineIndicators: [
      'Increasing weakness and fatigue.',
      'Significant weight loss.',
      'Reduced oral intake.',
      'Pain requiring escalating management.',
      'Jaundice or biliary obstruction.',
    ],
    stagingCriteria:
      'Pancreatic cancer is typically Stage IV when distant metastases are present. Median survival for Stage IV is three to six months.',
    roleRelevance: {
      clinical_liaison:
        'Explain that hospice timing is based on the disease trajectory, not a specific deadline. A six-month prognosis is a clinical estimate, not a countdown.',
      rn: 'Pain and nausea management, nutritional support education, and family coaching on signs of decline are key clinical roles.',
      social_worker:
        'Grief about unfinished life goals, financial concerns, and family role disruption are common. Facilitate goals-of-care conversations early.',
    },
  },
  {
    id: 'cd_advanced_dementia',
    diagnosisId: 'advanced_dementia',
    icd10Code: 'G30.9',
    icd10Description: "Alzheimer's disease, unspecified",
    lcdId: 'L34567',
    lcdTitle: "Alzheimer's Disease and Related Dementias — Hospice Eligibility",
    lcdContractor: 'Palmetto GBA',
    eligibilityCriteria: [
      'FAST (Functional Assessment Staging Test) Stage 7 or beyond.',
      'Unable to walk without personal assistance.',
      'Unable to sit up without assistance.',
      'Loss of all intelligible speech — limited to single words or phrases.',
      'Incontinent of urine and feces.',
      'Dependent on others for all activities of daily living.',
      'Presence of a qualifying secondary condition such as aspiration pneumonia, urinary tract infection, sepsis, or stage 3+ pressure injury.',
    ],
    clinicalDeclineIndicators: [
      'Increasingly limited verbal communication.',
      'Loss of recognition of close family members.',
      'Difficulty swallowing and increased aspiration risk.',
      'Refusal to eat or inability to self-feed.',
      'Recurrent infections.',
    ],
    roleRelevance: {
      clinical_liaison:
        'Dementia is a terminal illness — many families do not know this. Lead with empathy and explain the disease arc before introducing hospice.',
      rn: 'Skin integrity, aspiration precautions, and caregiver education on feeding and positioning are primary clinical roles.',
      social_worker:
        'Anticipatory grief and ambiguous loss are central themes. Families often grieve the person while the body is still present.',
    },
  },
  {
    id: 'cd_advanced_prostate_cancer',
    diagnosisId: 'advanced_prostate_cancer',
    icd10Code: 'C61',
    icd10Description: 'Malignant neoplasm of prostate',
    lcdId: 'L34538',
    lcdTitle: 'Terminal Status — Hospice Eligibility',
    lcdContractor: 'CGS Administrators',
    eligibilityCriteria: [
      'Metastatic disease no longer responding to hormonal therapy.',
      'Karnofsky Performance Status of 50% or less.',
      'Documented weight loss of greater than 10% in the prior six months.',
      'Increasing pain burden requiring escalating opioid management.',
    ],
    clinicalDeclineIndicators: [
      'Worsening bone pain — back, hips, pelvis.',
      'Pathological fracture risk.',
      'Increasing fatigue and reduced mobility.',
      'Urinary retention or incontinence.',
      'Hypercalcemia of malignancy.',
    ],
    roleRelevance: {
      clinical_liaison:
        'Pain that persists does not mean hospice is failing — it means pain management is the clinical team\'s ongoing work. Route pain concerns to the hospice nurse.',
      rn: 'Pain assessment and comfort medication education are your primary clinical tools. Bone pain in prostate cancer often requires scheduled dosing rather than PRN only.',
      social_worker:
        'Male patients with prostate cancer often struggle with the loss of physical function and independence. Validate the loss of identity alongside the physical decline.',
    },
  },
  {
    id: 'cd_end_stage_heart_failure',
    diagnosisId: 'end_stage_heart_failure',
    icd10Code: 'I50.84',
    icd10Description: 'End stage heart failure',
    lcdId: 'L34548',
    lcdTitle: 'Cardiopulmonary Conditions — Hospice Eligibility',
    lcdContractor: 'Palmetto GBA',
    eligibilityCriteria: [
      'Ejection fraction of 20% or less documented on recent echocardiogram.',
      'Persistent NYHA Class IV symptoms at rest.',
      'Treatment-refractory symptoms — not responding to maximum tolerated medical therapy.',
      'Patient has declined or does not qualify for transplant, LVAD, or revascularization.',
    ],
    clinicalDeclineIndicators: [
      'Persistent severe breathlessness at rest or with minimal exertion.',
      'Recurrent decompensation requiring hospitalization.',
      'Treatment-refractory fluid overload.',
      'Reduced cardiac output with increasing fatigue.',
    ],
    roleRelevance: {
      clinical_liaison:
        'The phrase "end stage" signals that the disease has reached its most severe form. This framing can help families understand why comfort care is now the appropriate focus.',
      rn: 'Comfort medications for breathlessness and fluid-related symptoms are central. Patient autonomy about medication refusal must be respected.',
      social_worker:
        'Caregiver exhaustion from managing a relapsing-remitting decline is profound. Assess for burnout and offer respite resources proactively.',
    },
  },
  {
    id: 'cd_als_terminal',
    diagnosisId: 'als_terminal',
    icd10Code: 'G12.21',
    icd10Description: 'Amyotrophic lateral sclerosis',
    lcdId: 'L34547',
    lcdTitle: 'Neurological Conditions — Hospice Eligibility',
    lcdContractor: 'Palmetto GBA',
    eligibilityCriteria: [
      'Severe respiratory impairment — forced vital capacity less than 30% of predicted or requiring ventilatory support.',
      'Critical nutritional impairment — documented weight loss of 10% or more in the prior six months and inability to maintain adequate hydration.',
      'Patient has declined artificial ventilation and tube feeding or has begun comfort-focused care.',
    ],
    clinicalDeclineIndicators: [
      'Rapidly increasing respiratory muscle weakness.',
      'Dysphagia requiring dietary modification or tube feeding discussion.',
      'Loss of functional communication.',
      'Progressive extremity weakness limiting mobility.',
      'Increased pain from muscle cramping and spasticity.',
    ],
    roleRelevance: {
      clinical_liaison:
        'ALS is rapidly progressive once respiratory and swallowing decline begins. Families often need help understanding why hospice is appropriate while the patient is still alert and communicative.',
      rn: 'Pain assessment, respiratory comfort, and caregiver coaching on breakthrough dosing are central. Breakthrough pain that does not respond may require provider contact for dose review.',
      social_worker:
        'Grief about lost communication and identity is profound. Patients with ALS are cognitively intact and may carry deep existential distress that warrants direct acknowledgment.',
    },
  },
  {
    id: 'cd_esrd_comfort_transition',
    diagnosisId: 'esrd_comfort_transition',
    icd10Code: 'N18.6',
    icd10Description: 'End-stage renal disease',
    lcdId: 'L34559',
    lcdTitle: 'Renal Disease — Hospice Eligibility',
    lcdContractor: 'Palmetto GBA',
    eligibilityCriteria: [
      'Creatinine clearance of less than 10 cc/min (15 cc/min for diabetics).',
      'Serum creatinine greater than 8 mg/dL (6 mg/dL for diabetics).',
      'Patient is not seeking dialysis or renal transplant.',
      'Signs of uremia — confusion, restlessness, intractable nausea, or pruritus.',
    ],
    clinicalDeclineIndicators: [
      'Declining urine output progressing toward anuria.',
      'Fluid overload not responsive to diuretics.',
      'Increasing uremic symptoms — fatigue, nausea, altered mental status.',
      'Progressive weakness and loss of function.',
    ],
    clinicalNote:
      'Per LCD L34559, patients who discontinue dialysis with an ESRD diagnosis typically have a prognosis of six months or less and are appropriate for hospice election.',
    roleRelevance: {
      clinical_liaison:
        'N/A — this scenario is Social Worker primary. Support the SW by ensuring the family understands the transition before clinical paperwork begins.',
      rn: 'Symptom management for uremic symptoms, fluid comfort, and dying process education are primary clinical roles after dialysis withdrawal.',
      social_worker:
        'Families often interpret stopping dialysis as choosing death. Clarify the distinction between refusing life-sustaining treatment and making a comfort-focused choice. Stay neutral — do not take sides.',
    },
  },
  {
    id: 'cd_end_stage_copd',
    diagnosisId: 'end_stage_copd',
    icd10Code: 'J44.1',
    icd10Description: 'Chronic obstructive pulmonary disease with acute exacerbation',
    lcdId: 'L34548',
    lcdTitle: 'Cardiopulmonary Conditions — Hospice Eligibility',
    lcdContractor: 'Palmetto GBA',
    eligibilityCriteria: [
      'FEV1 less than 30% of predicted after bronchodilator — classified as GOLD Stage IV.',
      'Disabling dyspnea at rest — Medical Research Council Dyspnea Scale Grade 4 or 5.',
      'Not a candidate for lung transplant.',
      'Supplemental oxygen dependence at rest.',
      'Recurrent hospitalizations for COPD exacerbations.',
      'Right heart failure secondary to COPD.',
    ],
    clinicalDeclineIndicators: [
      'Increasing frequency and severity of air hunger episodes.',
      'Shorter intervals between exacerbations.',
      'Growing oxygen dependence even at rest.',
      'Audible breathing changes during decline — Cheyne-Stokes or terminal secretions.',
      'Increasing anxiety and panic associated with breathing difficulty.',
    ],
    roleRelevance: {
      clinical_liaison:
        'Air hunger is visible and frightening. Families need plain-language explanation that the sensation differs from suffocation and that hospice comfort medications address the fear response.',
      rn: 'Comfort medications reduce the sensation of air hunger — not by replacing oxygen, but by modulating the brain\'s response to low oxygen. Educate caregivers before a crisis occurs.',
      social_worker:
        'COPD caregivers often develop their own anxiety from repeated episodes of watching air hunger. Screen for caregiver PTSD symptoms in long-term cases.',
    },
  },
];
