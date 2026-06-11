import type { DiagnosisModule } from '@/types/simulator';

export const diagnoses: DiagnosisModule[] = [
  {
    id: 'advanced_heart_failure',
    name: 'Advanced heart failure',
    everydayLanguage:
      'His heart is getting weaker and he is needing the hospital more often.',
    declinePattern:
      'Repeated hospitalizations with partial recovery and a weaker baseline after each discharge.',
    commonSymptoms: [
      'Shortness of breath.',
      'Swelling.',
      'Fatigue.',
      'Weakness.',
      'Poor appetite.',
      'Anxiety with breathing.',
    ],
    familyMisconceptions: [
      'They fixed it before, so they should be able to fix it again.',
      'Hospice means heart medicines stop.',
      'Hospice means no one is trying anymore.',
      'A heart diagnosis does not belong in hospice.',
    ],
    trainingObjectives: [
      'Explain the repeated decline pattern.',
      'Clarify that each recovery is leaving the patient weaker.',
      'Respond to fear of abandonment.',
      'Explain hospice as support.',
      'Avoid saying there is nothing else to do.',
    ],
  },
  {
    id: 'advanced_pancreatic_cancer',
    name: 'Advanced pancreatic cancer',
    everydayLanguage:
      'Her cancer has progressed to the point where treatment is no longer expected to control it, and the care focus is shifting toward comfort, support, and quality of life.',
    declinePattern:
      'Increasing weakness, reduced intake, worsening fatigue, more time resting, and fewer meaningful recovery periods after treatment or hospitalization.',
    commonSymptoms: [
      'Weakness.',
      'Poor appetite.',
      'Fatigue.',
      'Pain.',
      'Weight loss.',
      'Nausea.',
      'Increased need for help with daily activities.',
    ],
    familyMisconceptions: [
      'Hospice is only for the last few days.',
      'Starting hospice means we are giving up too early.',
      'She cannot keep seeing anyone who knows her care.',
      'Hospice means no one treats symptoms anymore.',
    ],
    trainingObjectives: [
      'Explain hospice timing in plain language.',
      'Clarify that hospice is not only for the final days.',
      'Acknowledge fear about starting too soon.',
      'Explain comfort-focused support without sounding transactional.',
      'Avoid making prognosis promises.',
      'Stay within Clinical Liaison role boundaries.',
    ],
  },
  {
    id: 'advanced_dementia',
    name: 'Advanced dementia',
    everydayLanguage:
      'Her memory and awareness have declined to the point where she no longer recognizes most of her family and needs help with every part of daily life.',
    declinePattern:
      'Gradual loss of recognition, communication, and the ability to eat and swallow safely, with periods that may appear more or less difficult, making the overall decline hard to track.',
    commonSymptoms: [
      'Loss of recognition of family members.',
      'Very limited communication.',
      'Difficulty eating and swallowing.',
      'Increased time in bed.',
      'Fragile skin and infection risk.',
      'Unpredictable periods of agitation or withdrawal.',
    ],
    familyMisconceptions: [
      'Hospice is a permanent decision with no way back.',
      'She might still get better if she has good days.',
      'Choosing hospice means the hospital will not take her anymore.',
      'We are taking away her chance if we stop fighting.',
    ],
    trainingObjectives: [
      'Explain that dementia can qualify for hospice care.',
      'Clarify that hospice election can be revoked at any time.',
      'Acknowledge the grief of losing someone slowly over years.',
      'Explain hospice as added support, not abandonment of care.',
      'Avoid overpromising or making prognosis statements.',
    ],
  },
  {
    id: 'advanced_prostate_cancer',
    name: 'Advanced prostate cancer',
    everydayLanguage:
      'His prostate cancer has spread and is no longer responding to treatment. The focus has shifted to keeping him as comfortable as possible.',
    declinePattern:
      'Increasing pain from bone metastases, fatigue, reduced mobility, and weight loss over several months, with periods that may appear stable before further decline.',
    commonSymptoms: [
      'Bone pain, especially in the back and hips.',
      'Fatigue.',
      'Urinary difficulty.',
      'Weight loss.',
      'Reduced mobility.',
      'Poor appetite.',
    ],
    familyMisconceptions: [
      'If he is still in pain, hospice is not working.',
      'The hospice team should eliminate all pain immediately.',
      'Choosing hospice means no one is managing his symptoms anymore.',
      'Pain means the family made the wrong choice.',
    ],
    trainingObjectives: [
      'Acknowledge the family\'s fear that hospice has failed when pain is still present.',
      'Clarify that pain management is the RN and provider\'s domain.',
      'Route the family to the hospice nurse for clinical pain assessment.',
      'Avoid suggesting or adjusting medications.',
      'Validate that the concern is legitimate and will be acted on.',
    ],
  },
  {
    id: 'end_stage_heart_failure',
    name: 'End stage heart failure',
    everydayLanguage:
      'Her heart is no longer able to pump well enough to keep up with her body\'s needs, even with medication. The focus of care has shifted toward comfort and quality of life.',
    declinePattern:
      'Increasing breathlessness, fatigue, and fluid retention that is no longer responding well to treatment, with shorter periods of improvement after each episode.',
    commonSymptoms: [
      'Severe breathlessness.',
      'Fluid retention in legs and abdomen.',
      'Fatigue.',
      'Reduced alertness.',
      'Poor appetite.',
      'Pain or pressure in the chest.',
    ],
    familyMisconceptions: [
      'Refusing medication means the patient wants to die.',
      'It is the caregiver\'s job to make the patient take medicine.',
      'If the patient refuses comfort medication, the family has failed.',
      'There must be a medication she will agree to take.',
    ],
    trainingObjectives: [
      'Explain patient autonomy in plain language.',
      'Validate the caregiver\'s distress when the patient refuses comfort care.',
      'Provide communication strategies for gently offering medication.',
      'Clarify that a patient who refuses is not the caregiver\'s failure.',
      'Route ongoing refusal concerns to the hospice on-call team.',
    ],
  },
  {
    id: 'als_terminal',
    name: 'ALS (Amyotrophic Lateral Sclerosis)',
    everydayLanguage:
      'He is living with a disease that progressively weakens the muscles that control movement, speech, swallowing, and eventually breathing — and there is currently no treatment that stops or reverses it.',
    declinePattern:
      'Gradual loss of function in specific muscle groups, with the rate and sequence of progression varying from person to person. Most people eventually lose the ability to swallow safely and to breathe without assistance.',
    commonSymptoms: [
      'Progressive muscle weakness.',
      'Difficulty speaking or being understood.',
      'Difficulty swallowing.',
      'Shortness of breath or breathing difficulty.',
      'Fatigue.',
      'Emotional lability.',
      'Deep grief about the loss of function and identity.',
    ],
    familyMisconceptions: [
      'He is still mentally sharp, so he must be managing.',
      'If he keeps his spirits up, the disease will slow down.',
      'Hospice is for people who have already stopped fighting.',
      'Ventilator support means the disease is being treated.',
    ],
    trainingObjectives: [
      'Acknowledge the spiritual and existential weight of ALS.',
      'Explain that hospice in ALS focuses on comfort and quality of life, not acceleration of death.',
      'Validate the family\'s helplessness without minimizing what can still be done.',
      'Avoid implying that spiritual distress has a simple resolution.',
      'Route clinical questions about breathing support and swallowing to the appropriate team members.',
    ],
  },
  {
    id: 'esrd_comfort_transition',
    name: 'End Stage Renal Disease — Comfort Transition',
    everydayLanguage:
      'His kidneys have stopped functioning and he has been receiving dialysis to do what his kidneys cannot. He has decided he no longer wants dialysis, which means his care focus will shift entirely to comfort and quality of life.',
    declinePattern:
      'Without dialysis, the body accumulates waste products and fluid. Most patients with ESRD who stop dialysis experience a gradual decline over one to three weeks, with increasing sleepiness and decreased awareness as the primary pattern. Per CMS LCD L34559, stopping dialysis with ESRD typically carries a prognosis of six months or less.',
    commonSymptoms: [
      'Fatigue and weakness.',
      'Decreased alertness.',
      'Reduced appetite and thirst.',
      'Fluid retention.',
      'Nausea.',
      'Increasing sleepiness and restfulness as the body slows down.',
    ],
    familyMisconceptions: [
      'Stopping dialysis is the same as choosing to die.',
      'He must not be thinking clearly to make this choice.',
      'If he really wanted to live, he would continue dialysis.',
      'Comfort care means giving up on him.',
    ],
    trainingObjectives: [
      'Explain the difference between refusing life-sustaining treatment and choosing death.',
      'Clarify that stopping dialysis is a legally and ethically recognized autonomous choice.',
      'Acknowledge the family\'s grief and fear without taking sides.',
      'Avoid implying the patient lacks decision-making capacity.',
      'Route clinical questions about the expected course to the hospice medical team.',
    ],
  },
  {
    id: 'end_stage_copd',
    name: 'End stage COPD',
    everydayLanguage:
      'His lungs are no longer able to move enough air even with oxygen, and the episodes of struggling to breathe are getting more frequent and harder to recover from.',
    declinePattern:
      'Increasing episodes of air hunger that are harder to calm. Growing oxygen dependence. Decreasing endurance between episodes. Heightened anxiety during breathing difficulty that itself worsens the breathing.',
    commonSymptoms: [
      'Severe shortness of breath during episodes.',
      'Visible breathing effort.',
      'Anxiety and panic during air hunger.',
      'Oxygen dependence.',
      'Fatigue.',
      'Reduced ability to speak during an episode.',
      'Caregiver panic and helplessness.',
    ],
    familyMisconceptions: [
      'He is suffocating and no one is doing anything.',
      'More oxygen will fix the breathing.',
      'Morphine will make him stop breathing faster.',
      'There must be something else the hospital can do.',
    ],
    trainingObjectives: [
      'Explain air hunger in plain language without minimizing the distress.',
      'Distinguish between the sensation of air hunger and actual suffocation.',
      'Explain why the fear response worsens breathing and how calm presence helps.',
      'Describe what the comfort plan addresses.',
      'Route medication specifics to hospice orders and the on-call team.',
      'Empower the caregiver with non-pharmacologic comfort tools.',
    ],
  },
];
