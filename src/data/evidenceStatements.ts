import type { EvidenceStatement } from '@/types/clinicalKnowledge';

export const evidenceStatements: EvidenceStatement[] = [
  {
    id: 'ev_hospice_fear_response',
    scenarioId: 'hospice_means_giving_up',
    skillCategory: 'Emotional Attunement',
    headline: 'Acknowledging fear before explaining services improves family receptivity.',
    statement:
      'Families who feel emotionally acknowledged before receiving information are significantly more likely to engage with hospice education and less likely to disengage from the conversation.',
    clinicalContext:
      'In end-of-life communication research, the sequence of acknowledgment-then-education consistently outperforms leading with clinical information. This is because fear activates the threat-response system, which limits information processing.',
    citation:
      'Epstein RM, Street RL. Patient-Centered Communication in Cancer Care. National Cancer Institute, NIH. 2007.',
  },
  {
    id: 'ev_copd_air_hunger',
    scenarioId: 'copd_air_hunger_at_home',
    skillCategory: 'Symptom Communication',
    headline: 'Low-dose opioids reduce the sensation of dyspnea without accelerating death.',
    statement:
      'Systematic reviews consistently demonstrate that low-dose opioids reduce the subjective sensation of breathlessness in patients with advanced COPD and other terminal conditions without clinically meaningful effects on respiratory rate or time to death.',
    clinicalContext:
      'The fear that morphine will "stop breathing" is the most common barrier to comfort medication use in COPD families. Proactively addressing this misconception is a core RN education responsibility.',
    citation:
      'Currow DC, et al. Once-daily opioids for chronic dyspnea: a dose increment and pharmacovigilance study. Journal of Pain and Symptom Management. 2011;42(3):388-399.',
    pmid: '21458217',
  },
  {
    id: 'ev_hospice_timing',
    scenarioId: 'hospice_too_soon',
    skillCategory: 'Hospice Education',
    headline: 'Earlier hospice enrollment is associated with better patient and family outcomes.',
    statement:
      'Studies consistently show that patients enrolled in hospice earlier experience better symptom management, and their family caregivers report lower rates of complicated grief and PTSD at six-month follow-up.',
    clinicalContext:
      'The median hospice length of stay in the United States remains under three weeks — far shorter than the evidence-supported benefit window. Addressing the "too soon" misconception is one of the most impactful clinical liaison skills.',
    citation:
      'Casarett D, et al. Do palliative consultations improve patient outcomes? Journal of the American Geriatrics Society. 2008;56(4):593-599.',
    pmid: '18266664',
  },
  {
    id: 'ev_terminal_dyspnea',
    scenarioId: 'terminal_dyspnea_follow_up',
    skillCategory: 'Comfort Education',
    headline:
      'Visible breathing effort can persist after comfort medication reduces the subjective sensation of air hunger.',
    statement:
      'Opioid and benzodiazepine medications reduce the sensation of breathlessness without necessarily eliminating visible respiratory effort. Families who observe continued respiratory effort after a comfort dose often believe the medication failed — accurate pre-education prevents this misinterpretation.',
    clinicalContext:
      'The disconnect between what comfort medication does subjectively versus what it looks like externally is one of the most important caregiver education points in end-stage COPD and other dyspneic conditions.',
    citation:
      'Abernethy AP, et al. Randomised, double blind, placebo controlled crossover trial of sustained release morphine for the management of refractory dyspnoea. BMJ. 2003;327(7414):523-526.',
    pmid: '12958109',
  },
  {
    id: 'ev_pain_management',
    scenarioId: 'pain_management_concern',
    skillCategory: 'Trust Building',
    headline: 'Validating pain concerns and routing to the clinical team maintains family trust.',
    statement:
      'Family members who feel their pain concerns are taken seriously and acted upon — rather than minimized or deferred without explanation — report significantly higher trust in the hospice team at two-week follow-up.',
    clinicalContext:
      'The Clinical Liaison role in pain concerns is to validate, not assess. The routing action — connecting the family to the nurse with a clear timeline — is itself a trust-building intervention.',
    citation:
      'Teno JM, et al. Family perspectives on end-of-life care at the last place of care. JAMA. 2004;291(1):88-93.',
    pmid: '14709580',
  },
  {
    id: 'ev_patient_autonomy',
    scenarioId: 'medication_refusal',
    skillCategory: 'Patient Autonomy Education',
    headline: 'Competent patients have an absolute right to refuse medications, including comfort medications.',
    statement:
      'The right of a competent adult to refuse medical treatment — including life-sustaining medication — is a fundamental principle of biomedical ethics and is upheld in all U.S. state laws. This applies to comfort medications as well as curative treatments.',
    clinicalContext:
      'Medication refusal by a hospice patient creates caregiver distress that frequently exceeds the patient\'s own distress level. RNs play a critical role in reframing refusal as autonomy rather than failure.',
    citation:
      'Beauchamp TL, Childress JF. Principles of Biomedical Ethics. 8th ed. Oxford University Press. 2019.',
  },
  {
    id: 'ev_prognosis_education',
    scenarioId: 'prognostic_uncertainty',
    skillCategory: 'Prognosis Education',
    headline: 'A six-month prognosis is a population-based estimate, not an individual countdown.',
    statement:
      'Prognosis estimates in terminal illness are based on disease trajectory and population data — they describe the median time a group of patients with similar presentations survives, not the time a specific patient will live.',
    clinicalContext:
      'Families who misinterpret the six-month prognosis as a countdown clock experience severe anticipatory anxiety. Correcting this misunderstanding is one of the most impactful psychosocial interventions available to the hospice team.',
    citation:
      'Christakis NA, Lamont EB. Extent and determinants of error in doctors\' prognoses in terminally ill patients. BMJ. 2000;320(7233):469-473.',
    pmid: '10678857',
  },
  {
    id: 'ev_treatment_refusal_autonomy',
    scenarioId: 'esrd_comfort_care',
    skillCategory: 'Autonomy Advocacy',
    headline: 'Withdrawing dialysis in a patient with decision-making capacity is ethically and legally distinct from assisted death.',
    statement:
      'Withdrawal of life-sustaining treatment by a patient with full decision-making capacity is recognized in law, ethics, and medical practice as a patient right — not a form of assisted death. The ethical distinction rests on autonomy: the patient is declining a treatment, not requesting acceleration of death.',
    clinicalContext:
      'Families often conflate stopping dialysis with choosing to die. The social worker\'s role is to clarify this distinction without taking sides in the family\'s decision — and without undermining the physician\'s capacity determination.',
    citation:
      'Truog RD, et al. Recommendations for end-of-life care in the intensive care unit: the Ethics Committee of the Society of Critical Care Medicine. Critical Care Medicine. 2001;29(12):2332-2348.',
    pmid: '11801837',
  },
  {
    id: 'ev_dementia_terminal',
    scenarioId: 'advanced_dementia_grief',
    skillCategory: 'Grief Acknowledgment',
    headline: 'Dementia is a terminal illness — and most caregivers do not know this.',
    statement:
      'Population studies demonstrate that advanced dementia has mortality rates comparable to metastatic cancer. Despite this, the majority of family caregivers do not recognize dementia as a terminal illness until very late in the disease course.',
    clinicalContext:
      'This knowledge gap has direct clinical consequences: families who do not understand dementia is terminal are more likely to pursue aggressive interventions at the end of life, leading to worse outcomes for the patient and more complicated grief for the family.',
    citation:
      'Mitchell SL, et al. The clinical course of advanced dementia. New England Journal of Medicine. 2009;361(16):1529-1538.',
    pmid: '19828530',
  },
  {
    id: 'ev_active_dying',
    scenarioId: 'active_dying_recognition',
    skillCategory: 'Comfort Education',
    headline: 'Mottling and Cheyne-Stokes breathing are normal signs of the dying process — not signs of suffering.',
    statement:
      'Peripheral mottling, cool extremities, and irregular breathing patterns including Cheyne-Stokes respirations are expected physiological changes in the final hours to days of life. These signs reflect withdrawal of circulation from the periphery as the heart weakens — they do not indicate pain or distress.',
    clinicalContext:
      'Families who observe these signs without education frequently call 911 or interpret the changes as medical emergencies. RN education before the active dying phase significantly reduces emergency interventions and supports a peaceful death at home.',
    citation:
      'Hui D, et al. Clinical signs of impending death in cancer patients. Oncologist. 2014;19(6):681-687.',
    pmid: '24799578',
  },
  {
    id: 'ev_terminal_secretions',
    scenarioId: 'terminal_secretion_distress',
    skillCategory: 'Symptom Communication',
    headline: 'Terminal secretions are not experienced by the dying person the way they sound from outside.',
    statement:
      'Terminal secretions — also called the "death rattle" — arise from the accumulation of secretions in the oropharynx that the dying patient can no longer clear. Clinical evidence suggests that patients are typically unconscious or obtunded at the time these sounds occur and are not experiencing the distress the sound implies.',
    clinicalContext:
      'The sound of terminal secretions is highly distressing to family caregivers but is primarily a caregiver comfort issue rather than a patient comfort issue. RN education about the mechanism and experience of terminal secretions is one of the most important end-of-life teaching moments.',
    citation:
      'Wee BL, Coleman PG, Hillier R, Holgate SH. The sound of death rattle I: are relatives distressed by hearing this sound? Palliative Medicine. 2006;20(3):171-175.',
    pmid: '16613764',
  },
  {
    id: 'ev_breakthrough_pain',
    scenarioId: 'breakthrough_pain_at_home',
    skillCategory: 'Caregiver Empowerment',
    headline: 'Caregivers consistently underuse prescribed breakthrough pain medication.',
    statement:
      'Research demonstrates that home caregivers underuse prescribed breakthrough opioids, primarily due to fear of causing addiction, fear of causing death, and fear of medicating incorrectly. This underuse results in inadequate pain control and increased caregiver guilt.',
    clinicalContext:
      'RN education that validates caregiver-administered breakthrough dosing — "you followed the plan correctly" — has been shown to increase appropriate medication use and reduce caregiver guilt in the follow-up period.',
    citation:
      'Schumacher KL, et al. Putting cancer pain management regimens into practice at home. Journal of Pain and Symptom Management. 2002;23(5):369-382.',
    pmid: '12007755',
  },
  {
    id: 'ev_advance_directive',
    scenarioId: 'advance_directive_conflict',
    skillCategory: 'Values Elicitation',
    headline: 'Surrogate decision-makers are expected to apply substituted judgment, not personal preference.',
    statement:
      'Surrogate decision-making standards — used when a patient lacks decision-making capacity and has no advance directive — require that surrogates attempt to make the decision the patient would have made based on their known values, not the decision the surrogate would make for themselves.',
    clinicalContext:
      'Family members in conflict often argue from their own preferences rather than the patient\'s known values. The social worker\'s role is to gently redirect the conversation toward "what did she value in life" rather than "what do you want for her."',
    citation:
      'Shalowitz DI, Garrett-Mayer E, Wendler D. The accuracy of surrogate decision makers. Archives of Internal Medicine. 2006;166(5):493-497.',
    pmid: '16534034',
  },
  {
    id: 'ev_caregiver_burnout',
    scenarioId: 'caregiver_burnout',
    skillCategory: 'Caregiver Assessment',
    headline: 'Caregiver burden in hospice is a predictor of complicated grief and poor health outcomes.',
    statement:
      'Hospice caregivers who report high burden during the patient\'s final illness are significantly more likely to develop complicated grief, depression, and physical health problems in the bereavement period. Early identification and intervention reduces these outcomes.',
    clinicalContext:
      'The social worker\'s caregiver assessment is not only a service coordination tool — it is a grief prevention intervention. Caregivers who receive respite support during the illness report fewer complicated grief symptoms at six-month follow-up.',
    citation:
      'Grunfeld E, et al. Family caregiver burden: results of a longitudinal study of breast cancer patients and their principal caregivers. CMAJ. 2004;170(12):1795-1801.',
    pmid: '15184333',
  },
  {
    id: 'ev_bereavement',
    scenarioId: 'bereavement_first_call',
    skillCategory: 'Grief Normalization',
    headline: 'Morning re-grief — waking and momentarily forgetting the death — is a common and normal early grief experience.',
    statement:
      'The phenomenon of waking and briefly forgetting that a loved one has died, followed by re-experiencing the loss upon remembering, is well-documented in grief literature. This pattern does not indicate pathological grief and typically diminishes over time as the reality of the death integrates.',
    clinicalContext:
      'Bereaved spouses and partners frequently interpret this experience as a sign they are not coping normally. Normalizing this experience on the first bereavement call prevents unnecessary distress and builds trust in the bereavement support relationship.',
    citation:
      'Parkes CM. Bereavement: Studies of Grief in Adult Life. 4th ed. Penguin Books. 2010.',
  },
  {
    id: 'ev_hospice_revocation',
    scenarioId: 'can_change_minds',
    skillCategory: 'Hospice Education',
    headline: 'Hospice election can be revoked at any time — it is not a one-way door.',
    statement:
      'The Medicare Hospice Benefit allows patients to revoke hospice election at any time and return to curative treatment or seek a different level of care. This right is unconditional — patients do not have to justify the decision to revoke.',
    clinicalContext:
      'Fear of irreversibility is one of the most common barriers to hospice election for families who are not yet certain about the decision. Proactive education about revocation reduces this barrier and supports informed consent.',
    citation:
      'Centers for Medicare & Medicaid Services. Medicare Benefit Policy Manual, Chapter 9: Coverage of Hospice Services Under Hospital Insurance. Revised 2024.',
  },
];
