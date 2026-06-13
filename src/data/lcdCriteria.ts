import type { LCDCriteria } from '@/types/clinicalKnowledge';

export const lcdCriteria: LCDCriteria[] = [
  {
    id: 'lcd_L34538',
    displayId: 'L34538',
    title: 'Terminal Status',
    contractor: 'CGS Administrators',
    effectiveDate: 'August 2025',
    diagnosisCategories: [
      'Cancer — any solid tumor with distant metastases',
      'Advanced solid tumor with poor performance status',
    ],
    generalCriteria: [
      'Clinical prognosis of six months or less if the illness runs its natural course.',
      'Karnofsky Performance Status (KPS) of 50% or less — requires considerable assistance and frequent medical care.',
      'Documented weight loss of greater than 10% of body weight over the prior six months.',
      'Inability to maintain sufficient fluid and calorie intake — dehydration and weight loss continuing.',
    ],
    specificCriteria: [
      'Disease documented to be metastatic or at a stage where curative therapy is no longer appropriate.',
      'Decline documented despite optimal treatment, or patient has elected not to pursue further curative treatment.',
      'Physician attestation that the patient has a terminal prognosis consistent with hospice eligibility.',
    ],
    clinicalNote:
      'L34538 applies broadly to cancer diagnoses. Key documentation requirements include performance status scoring, weight trajectory, and nutritional status. The six-month prognosis is a clinical estimate, not a guarantee.',
  },
  {
    id: 'lcd_L34548',
    displayId: 'L34548',
    title: 'Cardiopulmonary Conditions',
    contractor: 'Palmetto GBA',
    effectiveDate: 'March 2024',
    diagnosisCategories: [
      'Heart failure — NYHA Class III or IV',
      'End stage COPD — GOLD Stage IV',
      'Pulmonary fibrosis — end stage',
    ],
    generalCriteria: [
      'Clinical prognosis of six months or less if the illness runs its natural course.',
      'Severe functional limitation despite optimal medical management.',
      'Symptoms at rest or with minimal activity — unable to perform activities of daily living without significant distress.',
    ],
    specificCriteria: [
      'Heart failure: Ejection fraction of 20% or less; NYHA Class IV symptoms at rest; treatment-refractory despite diuretics, ACE inhibitors, and vasodilators; patient declines or does not qualify for transplant or LVAD.',
      'COPD: FEV1 less than 30% of predicted after bronchodilator (GOLD Stage IV); Medical Research Council Dyspnea Grade 4 or 5; supplemental oxygen dependence at rest; recurrent hospitalizations for exacerbations.',
      'Both diagnoses: Patient weight loss of 10% or more over six months is supportive documentation.',
    ],
    clinicalNote:
      'L34548 covers the most common hospice diagnoses. The combination of functional limitations, treatment refractoriness, and documented decline trajectory is the key documentation standard. Repeated hospitalizations are strong supporting evidence for both heart failure and COPD.',
  },
  {
    id: 'lcd_L34547',
    displayId: 'L34547',
    title: 'Neurological Conditions',
    contractor: 'Palmetto GBA',
    effectiveDate: 'November 2024',
    diagnosisCategories: [
      'Amyotrophic lateral sclerosis (ALS)',
      'Multiple sclerosis — advanced',
      'Parkinson\'s disease — advanced',
      'Stroke — persistent vegetative state or severe functional loss',
    ],
    generalCriteria: [
      'Clinical prognosis of six months or less if the illness runs its natural course.',
      'Severe functional decline despite treatment.',
      'Loss of capacity for self-care in multiple domains.',
    ],
    specificCriteria: [
      'ALS: Forced vital capacity less than 30% of predicted OR critical nutritional impairment (10% or more weight loss with inability to maintain adequate hydration and calorie intake); patient has declined ventilatory support or nutritional support by artificial means.',
      'Stroke: Acute stroke with no meaningful recovery after three days; or chronic stroke with Karnofsky Performance Status of 40% or less; dysphagia requiring tube feeding; aspiration pneumonia.',
      'Parkinson\'s: Severe functional decline with UPDRS Motor Score greater than 25 on optimal therapy; aspiration pneumonia or severe dysphagia; significant dementia.',
    ],
    clinicalNote:
      'ALS hospice eligibility often comes earlier in the disease when respiratory or nutritional failure is documented. Patients with ALS are typically cognitively intact and should be involved in all goals-of-care conversations.',
  },
  {
    id: 'lcd_L34559',
    displayId: 'L34559',
    title: 'Renal Disease',
    contractor: 'Palmetto GBA',
    effectiveDate: 'November 2024',
    diagnosisCategories: [
      'End stage renal disease — on dialysis and choosing to discontinue',
      'Acute renal failure — not pursuing dialysis',
      'Chronic kidney disease Stage 5 with uremic symptoms',
    ],
    generalCriteria: [
      'Clinical prognosis of six months or less if the illness runs its natural course.',
      'Patient is not pursuing dialysis or renal transplant.',
      'Documented uremic symptoms or severe functional decline.',
    ],
    specificCriteria: [
      'Creatinine clearance less than 10 cc/min (less than 15 cc/min for diabetics).',
      'Serum creatinine greater than 8.0 mg/dL (greater than 6.0 mg/dL for diabetics).',
      'Signs of uremia: confusion, intractable nausea, pruritus, restlessness.',
      'Fluid overload not responsive to diuretics.',
      'Patient with ESRD who discontinues dialysis has a typical prognosis of one to three weeks.',
    ],
    clinicalNote:
      'Stopping dialysis is a legally and ethically recognized autonomous decision for patients with decision-making capacity. The hospice team does not determine decision-making capacity — that is the treating physician\'s role. Social work plays a critical role in supporting families through this transition.',
  },
  {
    id: 'lcd_L34567',
    displayId: 'L34567',
    title: "Alzheimer's Disease and Related Dementias",
    contractor: 'Palmetto GBA',
    effectiveDate: 'February 2024',
    diagnosisCategories: [
      "Alzheimer's disease",
      'Vascular dementia',
      'Lewy body dementia',
      'Frontotemporal dementia',
    ],
    generalCriteria: [
      'FAST (Functional Assessment Staging Test) Stage 7 or higher.',
      'Unable to walk without personal assistance.',
      'Unable to sit up without assistance.',
      'Loss of all intelligible speech (communicates with single words or less).',
      'Incontinence of urine and feces.',
      'Dependent on others for all activities of daily living.',
    ],
    specificCriteria: [
      'Presence of at least one qualifying secondary condition in the past 12 months: aspiration pneumonia, pyelonephritis or upper urinary tract infection, septicemia, decubitus ulcer Stage 3 or 4, fever recurrent after antibiotic treatment, inability to maintain sufficient fluid and calorie intake.',
    ],
    clinicalNote:
      'Dementia is a terminal illness. Many families do not know this. The educational role of the hospice team — especially the clinical liaison and social worker — is to help families understand the disease trajectory before a crisis occurs. A patient at FAST Stage 7 has lost the ability to communicate meaningfully, walk, and eat safely.',
  },
  {
    id: 'lcd_L33393',
    displayId: 'L33393',
    title: 'Terminal Status (NGS)',
    contractor: 'National Government Services (NGS)',
    effectiveDate: 'November 2023',
    diagnosisCategories: [
      'Multiple diagnoses with combined terminal prognosis',
      'Cancer — solid tumor or hematological malignancy',
      'Non-cancer diagnoses meeting terminal criteria',
    ],
    generalCriteria: [
      'Clinical prognosis of six months or less if the illness runs its natural course.',
      'Karnofsky Performance Status of 50% or less.',
      'Decline not primarily driven by treatable complications.',
      'Physician attestation based on clinical judgment and disease trajectory.',
    ],
    specificCriteria: [
      'Clinical findings that support terminal prognosis: weight loss, decline in functional status, recurrent infections, treatment failure, or patient election of comfort-focused goals.',
      'Documentation of patient and family understanding and agreement with hospice goals of care.',
    ],
    clinicalNote:
      'L33393 is used in NGS jurisdictions as the broad terminal status LCD. The documentation standard is consistent with other LCDs: prognosis, performance status, and trajectory of decline.',
  },
];
