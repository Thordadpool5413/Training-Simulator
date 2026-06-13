import type { QuizQuestion } from '@/types/quiz';

export const knowledgeQuizBank: QuizQuestion[] = [
  // hospice_means_giving_up — CL / advanced_heart_failure
  {
    id: 'q_hmgu_clinical',
    scenarioId: 'hospice_means_giving_up',
    category: 'clinical',
    question:
      'A patient with advanced heart failure has been hospitalized three times in two months, recovering partially each time but leaving weaker. This pattern is best described as:',
    options: [
      'A relapsing-remitting course indicating the treatment is not working',
      'A typical hospice decline pattern where each recovery returns the patient to a weaker baseline',
      'A sign the patient should be transferred to a skilled nursing facility',
      'Evidence that the patient has not been following their medication regimen',
    ],
    correctIndex: 1,
    explanation:
      'Repeated hospitalizations with partial but incomplete recovery — each leaving the patient weaker — is the hallmark decline pattern in advanced heart failure and is one of the primary clinical indicators supporting hospice eligibility under LCD L34548.',
    evidenceNote:
      'CMS LCD L34548 identifies recurrent hospitalizations for heart failure as a key eligibility indicator.',
  },
  {
    id: 'q_hmgu_role',
    scenarioId: 'hospice_means_giving_up',
    category: 'role_boundary',
    question: 'A family member asks: "Can my father still get his heart medications on hospice?" As a Clinical Liaison, you should:',
    options: [
      'Tell her hospice will continue all his current heart medications',
      'Tell her hospice will stop all medications because the goal is comfort only',
      'Explain that the hospice nurse and medical team determine which medications are included in the comfort plan — and offer to connect her with the nurse',
      'Tell her to ask the cardiologist, because hospice does not manage cardiac medications',
    ],
    correctIndex: 2,
    explanation:
      'Medication decisions in hospice — including which medications are appropriate for the comfort plan — are clinical decisions made by the hospice nurse and medical director. The Clinical Liaison validates the concern, explains the team structure, and routes medication questions to the clinical team.',
  },
  {
    id: 'q_hmgu_communication',
    scenarioId: 'hospice_means_giving_up',
    category: 'communication',
    question:
      'A daughter says: "My dad is dying and you want to take away his care?" The most effective first response is:',
    options: [
      'Immediately explain what hospice services include so she understands it is not abandonment',
      'Acknowledge her fear and the weight of what she is carrying before saying anything else',
      'Tell her that her father\'s doctor recommended hospice, so it must be the right time',
      'Ask her what specific services she is afraid of losing',
    ],
    correctIndex: 1,
    explanation:
      'Leading with emotional acknowledgment before explanation is the evidence-supported approach in end-of-life communication. When fear activates the threat response, information is less accessible. Acknowledgment first lowers the emotional temperature and makes education possible.',
  },

  // copd_air_hunger_at_home — RN / end_stage_copd
  {
    id: 'q_copd_clinical',
    scenarioId: 'copd_air_hunger_at_home',
    category: 'clinical',
    question:
      'Margaret is terrified her husband is suffocating. What is the most clinically accurate distinction between air hunger and suffocation for RN education purposes?',
    options: [
      'Air hunger and suffocation are the same experience — the patient is running out of oxygen',
      'Air hunger is the sensation of difficulty breathing, which can occur even when oxygen levels are adequate; suffocation implies mechanical obstruction',
      'Air hunger only happens at oxygen saturation levels below 80%, so supplemental oxygen will always resolve it',
      'Suffocation is only possible if the airway is blocked, which does not happen in COPD',
    ],
    correctIndex: 1,
    explanation:
      'Air hunger is a subjective sensation driven by the brain\'s response to changes in oxygen and carbon dioxide, not a sign of mechanical suffocation. In COPD, comfort medications reduce the brain\'s anxiety response to low oxygen, reducing the sensation even when visible breathing effort continues.',
  },
  {
    id: 'q_copd_role',
    scenarioId: 'copd_air_hunger_at_home',
    category: 'role_boundary',
    question:
      'Margaret asks: "How much morphine should I give him when this happens?" As the hospice RN, you should:',
    options: [
      'Tell her the exact dose listed in the hospice orders so she can give it correctly',
      'Tell her morphine is not safe to give at home and should only be administered by a nurse',
      'Confirm that the hospice comfort plan includes medication for air hunger, describe what to watch for, and route specific dose questions to the hospice orders and the on-call provider',
      'Tell her to call 911 when the episode starts because air hunger requires emergency intervention',
    ],
    correctIndex: 2,
    explanation:
      'RNs confirm the hospice plan of care includes medications, educate caregivers on when and how to use comfort medications in general terms, and route specific dose questions to the hospice orders and on-call provider. Stating specific doses at a phone level crosses into prescribing scope.',
  },
  {
    id: 'q_copd_communication',
    scenarioId: 'copd_air_hunger_at_home',
    category: 'communication',
    question:
      'Margaret says: "He keeps saying he cannot breathe. I am scared he is suffocating and I do not know what to do." Which response best demonstrates effective RN communication?',
    options: [
      '"The most important thing is to keep him calm. Here is what you can do right now."',
      '"I understand you are scared. What you are seeing is air hunger — not the same as suffocation. Let me explain what is happening and what the comfort plan can do."',
      '"His oxygen saturation is probably low. You should increase the oxygen flow until he feels better."',
      '"I know this is hard. The hospice nurse will call you back in a few hours with more information."',
    ],
    correctIndex: 1,
    explanation:
      'Effective RN communication in a caregiver crisis acknowledges the fear, provides a plain-language clinical explanation, and connects the information to the available comfort plan. Jumping to action without acknowledgment (option A), giving clinical advice without explanation (option C), or deferring to a callback (option D) all miss the immediate educational and supportive need.',
  },

  // hospice_too_soon — CL / advanced_pancreatic_cancer
  {
    id: 'q_hts_clinical',
    scenarioId: 'hospice_too_soon',
    category: 'clinical',
    question:
      'A patient with advanced pancreatic cancer is still talking with family and eating a little. Her son believes hospice is only for the last few days. Which statement is clinically accurate?',
    options: [
      'He is correct — hospice is most appropriate when a patient has less than 72 hours to live',
      'Hospice is appropriate when a patient has a terminal illness with a prognosis of six months or less, regardless of how functional they appear',
      'The patient should wait until she stops eating before hospice eligibility is considered',
      'Because she is still alert and eating, she does not meet hospice criteria and should remain in oncology care',
    ],
    correctIndex: 1,
    explanation:
      'Medicare hospice eligibility requires a physician\'s certification of a prognosis of six months or less — not that death is imminent. Patients can be alert, communicating, and still hospice-eligible. Research consistently shows earlier enrollment improves outcomes.',
  },
  {
    id: 'q_hts_role',
    scenarioId: 'hospice_too_soon',
    category: 'role_boundary',
    question:
      'Marcus asks: "How long does my mother have?" As a Clinical Liaison, you should:',
    options: [
      'Tell him her oncologist said approximately six months when he discussed hospice',
      'Explain that prognosis estimates are the physician\'s domain, offer to arrange a physician conversation, and explain what a prognosis estimate means in plain language',
      'Tell him hospice would not have been recommended if she had more than a few weeks',
      'Tell him there is no way to know and change the subject',
    ],
    correctIndex: 1,
    explanation:
      'Clinical prognosis statements are physician scope. The Clinical Liaison can explain what a prognosis estimate means — it is a clinical estimate, not a deadline — and route specific questions to the physician. Avoiding the question entirely (option D) abandons the family.',
  },
  {
    id: 'q_hts_communication',
    scenarioId: 'hospice_too_soon',
    category: 'communication',
    question:
      'Marcus says: "I thought hospice was only for the last few days." Which response best addresses this misconception while staying in role?',
    options: [
      '"Actually, most people wait too long for hospice. We are really for people who are much earlier in the process."',
      '"I understand why you would think that — many people do. Hospice actually supports patients and families for months when there is a terminal illness, not just the final days."',
      '"Your mother\'s oncologist thought it was the right time, so I trust his judgment."',
      '"Hospice is appropriate whenever the patient and family decide they are ready."',
    ],
    correctIndex: 1,
    explanation:
      'Validating the misconception before correcting it ("I understand why you would think that") is more effective than immediately challenging it. Option A sounds like a marketing pitch. Option C defers entirely to authority without explaining. Option D is vague and does not actually address the timing misconception.',
  },

  // terminal_dyspnea_follow_up — RN / end_stage_copd
  {
    id: 'q_tdf_clinical',
    scenarioId: 'terminal_dyspnea_follow_up',
    category: 'clinical',
    question:
      'Eleanor received her first comfort medication dose for air hunger one hour ago but still appears uncomfortable. Carol believes the medication failed. What is the most accurate clinical explanation?',
    options: [
      'The dose was too low and should be doubled immediately',
      'Opioid medications for air hunger reduce the subjective sensation of breathlessness — visible respiratory effort may persist even when the medication is effective',
      'The medication is working but it takes 4-6 hours to reach full effect',
      'Comfort medications do not work for visible breathing effort — they only work for pain',
    ],
    correctIndex: 1,
    explanation:
      'Comfort medications for dyspnea reduce the brain\'s anxiety response and the subjective sensation of breathlessness. Visible respiratory effort — the labored breathing that caregivers observe — can persist even when the patient\'s subjective distress has been meaningfully reduced. This is a critical caregiver education point.',
  },
  {
    id: 'q_tdf_role',
    scenarioId: 'terminal_dyspnea_follow_up',
    category: 'role_boundary',
    question:
      'Carol asks: "Does she need more medicine? Should I give her another dose?" As the hospice RN, you should:',
    options: [
      'Tell Carol to give a second dose if she thinks it is needed',
      'Confirm the dose from memory and tell Carol it is safe to repeat',
      'Acknowledge Carol\'s concern, explain that dose changes require a provider order, and contact the on-call provider to evaluate',
      'Tell Carol not to give any more medication until the RN can do an in-person assessment tomorrow',
    ],
    correctIndex: 2,
    explanation:
      'Dose changes for hospice comfort medications require a provider order — RNs cannot modify doses verbally. The correct action is to acknowledge the concern, explain the process, and escalate to the on-call provider who can evaluate and order if clinically appropriate. Deferring to tomorrow (option D) is inappropriate for active distress.',
  },
  {
    id: 'q_tdf_communication',
    scenarioId: 'terminal_dyspnea_follow_up',
    category: 'communication',
    question:
      'Carol says: "She still looks so uncomfortable. I gave her the medicine an hour ago like you showed me. Are we giving the right amount, or does she need more?" Which response best supports Carol?',
    options: [
      '"The dose looks right to me. Just keep watching her and call us if it gets worse."',
      '"You did everything exactly right. What you are seeing — the visible breathing effort — can continue even when the medication is doing its job. Let me explain what to watch for and who to call."',
      '"She probably needs a stronger dose. I will put in an order right now."',
      '"Did you give it the way I showed you? Sometimes the medication does not work if it is not given correctly."',
    ],
    correctIndex: 1,
    explanation:
      'Validating that Carol followed the plan correctly is both clinically accurate and emotionally supportive. Explaining the disconnect between visible effort and subjective comfort addresses the core misunderstanding. Giving a vague reassurance (option A), ordering a dose change without provider evaluation (option C), or questioning her technique (option D) all fail Carol in different ways.',
  },

  // pain_management_concern — CL / advanced_prostate_cancer
  {
    id: 'q_pmc_clinical',
    scenarioId: 'pain_management_concern',
    category: 'clinical',
    question:
      'Elena\'s father with advanced prostate cancer has bone metastases and is still in pain three days after starting hospice. What does this most likely indicate?',
    options: [
      'The hospice is not providing adequate care and intervention is needed',
      'Pain management in bone metastasis often requires ongoing assessment and titration — it is rarely controlled immediately after hospice enrollment',
      'His cancer has progressed beyond what hospice can manage and he should return to oncology care',
      'The opioid selected is not effective for bone pain and should be switched to a non-opioid',
    ],
    correctIndex: 1,
    explanation:
      'Bone pain from metastatic prostate cancer is complex and often requires careful titration over days to weeks. Pain persisting in the first days of hospice enrollment is a clinical finding that should be assessed and managed — it does not indicate failure. The hospice nurse\'s scheduled reassessment is the appropriate response.',
  },
  {
    id: 'q_pmc_role',
    scenarioId: 'pain_management_concern',
    category: 'role_boundary',
    question:
      'Elena asks: "Can you tell me what medications he is on and whether the doses are high enough?" As a Clinical Liaison, you should:',
    options: [
      'Look up the medication list and explain whether the doses seem appropriate based on your experience',
      'Tell her you do not have access to clinical records and cannot help with medical questions',
      'Explain that medication assessment is the hospice nurse\'s clinical role, validate her concern as legitimate and serious, and confirm the nurse will assess and address the pain',
      'Tell her to call the hospice medical director directly to get her questions answered',
    ],
    correctIndex: 2,
    explanation:
      'The Clinical Liaison validates the concern, explains the team structure, and routes clinical questions to the appropriate clinician. Looking up medications and commenting on doses (option A) is clinical liaison scope overreach. Refusing to help without routing (option B) abandons the family. Skipping the nurse and routing to the medical director (option D) breaks the care team structure.',
  },
  {
    id: 'q_pmc_communication',
    scenarioId: 'pain_management_concern',
    category: 'communication',
    question:
      'Elena says: "You said hospice would manage his pain. He is still hurting every time I come in. Are you even doing anything?" Which response best de-escalates while keeping the concern active?',
    options: [
      '"I understand you are frustrated. Our team is doing everything we can within our protocols."',
      '"Elena, I hear your anger — and your concern is completely valid. Your father\'s comfort matters. Let me make sure the nurse calls you today before the scheduled visit to talk specifically about the pain picture."',
      '"I know this is hard. Pain management takes time. You should give us a few more days."',
      '"If you are not satisfied with our services, you have the right to choose a different hospice provider."',
    ],
    correctIndex: 1,
    explanation:
      'Option B names the emotion, validates the concern, and creates a specific concrete next step — not a vague promise. Defensive language (option A), minimizing with "takes time" (option C), and offering a transfer (option D) all damage the relationship without addressing the core concern.',
  },

  // medication_refusal — RN / end_stage_heart_failure
  {
    id: 'q_mr_clinical',
    scenarioId: 'medication_refusal',
    category: 'clinical',
    question:
      'Dorothy refuses every dose of her comfort medication because she does not want to be "out of it." What is the most important clinical fact to communicate to her son Michael?',
    options: [
      'At the right dose, comfort medications do not eliminate mental clarity — the goal is comfort, not sedation',
      'Dorothy\'s refusal means the pain is not as severe as it appears, so no intervention is needed',
      'It is Michael\'s responsibility to ensure Dorothy takes the medication as prescribed',
      'Dorothy\'s medication should be switched to a non-opioid to address her concerns',
    ],
    correctIndex: 0,
    explanation:
      'Many patients refuse comfort medications out of fear of losing mental clarity. Educating caregivers that appropriate comfort doses aim for symptom relief — not sedation — can help them have a more effective conversation with the patient. This is within RN education scope.',
  },
  {
    id: 'q_mr_role',
    scenarioId: 'medication_refusal',
    category: 'role_boundary',
    question:
      'Michael asks: "Can I just put the medicine in her food so she gets it without knowing?" As the hospice RN, you must:',
    options: [
      'Explain that this is technically allowed if the patient is suffering and cannot make decisions',
      'Clearly explain that administering medication without the patient\'s knowledge or consent is never acceptable, even with good intentions, and explain why',
      'Tell him to ask the hospice medical director before doing it, since it is a medical decision',
      'Suggest a liquid formulation that mixes more easily into food',
    ],
    correctIndex: 1,
    explanation:
      'Covert medication administration — giving medication without the patient\'s knowledge or consent — violates patient autonomy and is ethically prohibited regardless of the caregiver\'s intent. This is an absolute role boundary for all hospice team members. The RN must state this clearly, kindly, and without ambiguity.',
  },
  {
    id: 'q_mr_communication',
    scenarioId: 'medication_refusal',
    category: 'communication',
    question:
      'Michael says: "She is clearly in pain and I cannot make her take it." Which response best supports Michael while respecting Dorothy\'s rights?',
    options: [
      '"You are right — if she is in that much pain, you need to find a way to get her to take it."',
      '"I hear how hard this is for you. She has the right to refuse, and that does not mean you have failed her. Let me give you some ways to offer it that might help her feel safer."',
      '"There is nothing you can do. Patients have the right to refuse, so you just have to watch her be in pain."',
      '"If she keeps refusing, we may need to discharge her from hospice since comfort care requires patient cooperation."',
    ],
    correctIndex: 1,
    explanation:
      'The response validates Michael\'s distress, affirms patient autonomy without abandoning him, and offers practical communication strategies. Option A pressures him toward coercion. Option C is accurate but abandons Michael. Option D is clinically false — medication refusal is not grounds for hospice discharge.',
  },

  // prognostic_uncertainty — CL / advanced_pancreatic_cancer
  {
    id: 'q_pu_clinical',
    scenarioId: 'prognostic_uncertainty',
    category: 'clinical',
    question:
      'Rose\'s physician said "approximately six months" six months ago and she is still alive. David believes this means death is now imminent. What is clinically accurate about prognosis estimates?',
    options: [
      'The six-month prognosis was wrong — the physician should reassess and give a new estimate immediately',
      'A prognosis estimate is a population-based statistical median — some patients live shorter, some longer. It is not a countdown clock.',
      'If she has lived past six months, she has beaten the prognosis and may not need hospice anymore',
      'Hospice should be discontinued because the original prognosis has expired',
    ],
    correctIndex: 1,
    explanation:
      'Prognosis estimates in terminal illness are clinical estimates based on disease trajectory and population statistics. They describe what is typical for patients with a similar presentation — they do not predict an individual\'s death date. Some patients live shorter, some longer than the estimate.',
  },
  {
    id: 'q_pu_role',
    scenarioId: 'prognostic_uncertainty',
    category: 'role_boundary',
    question:
      'David asks: "So how long does she really have now — can\'t someone give me a number?" As a Clinical Liaison, you should:',
    options: [
      'Give him a new estimate based on what you know about pancreatic cancer progression',
      'Tell him there is no way to know anything and you cannot say more',
      'Explain that a specific prognosis is the physician\'s domain, normalize the uncertainty, and offer to arrange a physician conversation where David can ask this directly',
      'Tell him to call the hospice medical director because the Clinical Liaison cannot discuss prognosis',
    ],
    correctIndex: 2,
    explanation:
      'The Clinical Liaison can normalize prognosis uncertainty, explain what estimates mean, and route specific prognosis questions to the physician. This is not the same as making a prognosis statement. Refusing to engage (option B) abandons David. Routing without normalizing (option D) is incomplete.',
  },
  {
    id: 'q_pu_communication',
    scenarioId: 'prognostic_uncertainty',
    category: 'communication',
    question:
      'David says: "Should I have everyone come now? Is she going to die any day?" Which response best addresses the question while staying in role?',
    options: [
      '"I cannot tell you that. Only her doctor knows."',
      '"I understand you are trying to figure out what to do. The six-month estimate was not a countdown — some people live past it, some do not reach it. What I can tell you is that your presence matters to her now. Would it help to talk about what is most important to her right now?"',
      '"If I were you, I would call everyone. It is better to be there early than to miss it."',
      '"She is still doing well enough that you have some time. There is no need to rush."',
    ],
    correctIndex: 1,
    explanation:
      'Option B normalizes the uncertainty, corrects the countdown misunderstanding, and redirects David toward presence and meaning — which is what he can actually control. Option A abandons him. Option C gives a prognosis-adjacent recommendation outside role. Option D gives false reassurance and another informal prognosis.',
  },

  // esrd_comfort_care — SW / esrd_comfort_transition
  {
    id: 'q_esrd_clinical',
    scenarioId: 'esrd_comfort_care',
    category: 'clinical',
    question:
      'Robert has ESRD and has decided to stop dialysis. His physician has confirmed he has decision-making capacity. What is the typical clinical prognosis after dialysis withdrawal for a patient with ESRD?',
    options: [
      'Most patients live six months or longer after stopping dialysis',
      'Most patients experience a gradual decline over one to three weeks after dialysis withdrawal',
      'Stopping dialysis causes immediate cardiac arrest within hours',
      'The timeline varies so much that no estimate is possible',
    ],
    correctIndex: 1,
    explanation:
      'Per CMS LCD L34559, patients with ESRD who discontinue dialysis typically have a prognosis of six months or less, with most experiencing a gradual decline of one to three weeks as uremic waste accumulates. The progression is generally one of increasing sleepiness and decreased awareness rather than acute distress.',
  },
  {
    id: 'q_esrd_role',
    scenarioId: 'esrd_comfort_care',
    category: 'role_boundary',
    question:
      'James says: "He is not in his right mind if he thinks stopping dialysis is okay." As a Social Worker, you should:',
    options: [
      'Agree that the decision raises questions about capacity and request a psychiatric evaluation',
      'Tell James his father has the right to make his own choices and he needs to accept it',
      'Acknowledge James\'s fear, explain what decision-making capacity means, and clarify that the physician has already assessed and documented capacity — without overriding that determination yourself',
      'Tell James the social worker cannot comment on medical decisions and he needs to speak with the doctor',
    ],
    correctIndex: 2,
    explanation:
      'Decision-making capacity is determined by the physician — not by the social worker. The social worker can explain what capacity means, defer to the physician\'s determination, and acknowledge James\'s grief without taking sides. Agreeing with James (option A) undermines the clinical determination. Dismissing him (option B) fails the therapeutic relationship.',
  },
  {
    id: 'q_esrd_communication',
    scenarioId: 'esrd_comfort_care',
    category: 'communication',
    question:
      'James says: "How can you sit there and let him do this? He is choosing to die." Which response best holds space for James while clarifying the ethical distinction?',
    options: [
      '"I understand your perspective, but stopping dialysis is not the same as choosing death — it is choosing to stop a burdensome treatment."',
      '"I can hear how frightening this is. What your father is doing is not the same as choosing to die — he is choosing to stop a treatment that has become too much. That is a right recognized in medicine and in law. Can we talk about what he told you about his reasons?"',
      '"Your father has the legal right to make this decision. I know it is hard, but we have to respect his wishes."',
      '"I am going to ask the doctor to reassess his capacity because what you are describing does not sound like a competent decision."',
    ],
    correctIndex: 1,
    explanation:
      'Option B acknowledges James\'s terror, provides the ethical distinction, grounds it in legitimacy, and invites him into a conversation about his father\'s values. Option A gives the distinction without acknowledgment. Option C is accurate but dismissive. Option D undermines the physician\'s capacity determination, which is not the social worker\'s role.',
  },

  // advanced_dementia_grief — CL / advanced_dementia
  {
    id: 'q_adg_clinical',
    scenarioId: 'advanced_dementia_grief',
    category: 'clinical',
    question:
      'Ruth has advanced Alzheimer\'s and no longer recognizes her daughter Anne. Anne says she "still seems like herself some days." What is the most accurate clinical framing?',
    options: [
      'Good days indicate the disease may have stabilized and hospice may not be appropriate yet',
      'Advanced dementia often has variable days — periods of relative clarity exist alongside severe impairment. This does not reverse the overall terminal trajectory.',
      'Anne should encourage more visits on the good days to stimulate Ruth\'s memory',
      'Good days are a sign Ruth is not at the end stage and the physician\'s assessment may be premature',
    ],
    correctIndex: 1,
    explanation:
      'Variable days — periods of apparent clarity or engagement — are common in advanced dementia and do not represent disease improvement. They exist alongside the underlying terminal trajectory. This is one of the most important pieces of clinical education for families resisting hospice due to good days.',
  },
  {
    id: 'q_adg_role',
    scenarioId: 'advanced_dementia_grief',
    category: 'role_boundary',
    question:
      'Anne asks: "How long does my mother have?" As a Clinical Liaison, you should:',
    options: [
      'Tell her that advanced dementia patients typically live two to five years after diagnosis, so she has time',
      'Tell her that advanced dementia patients typically die within six months of FAST Stage 7',
      'Explain that specific prognosis is the physician\'s domain, that the disease is terminal, and offer to arrange a physician conversation',
      'Tell her hospice would not have accepted Ruth if the prognosis were more than six months',
    ],
    correctIndex: 2,
    explanation:
      'Clinical prognosis statements — including FAST stage prognostic estimates — are physician scope. The Clinical Liaison can confirm dementia is a terminal illness, explain what that means in plain language, and route specific prognosis questions to the physician.',
  },
  {
    id: 'q_adg_communication',
    scenarioId: 'advanced_dementia_grief',
    category: 'communication',
    question:
      'Anne says: "The person I knew is already gone. How can I put her in hospice? It feels like I am burying her twice." Which response best holds Anne\'s grief?',
    options: [
      '"I understand. Hospice will help her be more comfortable, which is what matters now."',
      '"That is a beautiful way to describe it — and I think a lot of caregivers feel exactly that. You have already been grieving her for years. That is real loss, and it is allowed to hurt. Hospice is not about giving up — it is about making sure she is supported for whatever time remains."',
      '"Let me explain what hospice does so you can see why it is the right decision."',
      '"Her physician recommended this because it is the right time. You should trust that recommendation."',
    ],
    correctIndex: 1,
    explanation:
      'Option B meets Anne in her grief, names the anticipatory grief arc of dementia caregiving, and reframes hospice as support rather than abandonment — without rushing past the emotion to services. Options A and C pivot to hospice education before honoring the grief. Option D defers to authority without acknowledgment.',
  },

  // active_dying_recognition — RN / end_stage_heart_failure
  {
    id: 'q_adr_clinical',
    scenarioId: 'active_dying_recognition',
    category: 'clinical',
    question:
      'Patricia describes her mother: unresponsive to voice, mottling on the lower extremities, cool and discolored hands, and a breathing pattern that stops and starts. Which of these is NOT a sign of active dying?',
    options: [
      'Peripheral mottling on the legs and feet',
      'Cheyne-Stokes respirations — periodic breathing with apneic pauses',
      'Oral secretions the patient can no longer clear',
      'Moderate fever with elevated white blood cell count',
    ],
    correctIndex: 3,
    explanation:
      'Fever and elevated white blood cell count suggest infection or acute illness — these are potentially reversible clinical findings that require assessment. Peripheral mottling, Cheyne-Stokes respirations, and inability to clear oral secretions are classic signs of the active dying process reflecting circulatory withdrawal and reduced neurological function.',
  },
  {
    id: 'q_adr_role',
    scenarioId: 'active_dying_recognition',
    category: 'role_boundary',
    question:
      'Patricia asks: "Should I call 911?" As the hospice RN present in the home, you should:',
    options: [
      'Tell her yes, because active dying requires emergency intervention',
      'Tell her only to call 911 if she wants to revoke the hospice election',
      'Explain that these signs are the natural dying process, that the hospice comfort plan is in place, and that the goal is peaceful presence — not emergency intervention. Confirm you are staying with her.',
      'Tell her you cannot make that decision for her — it is her choice to call 911 or not',
    ],
    correctIndex: 2,
    explanation:
      'When the hospice plan is in place and the patient is actively dying, the appropriate RN role is to normalize the process, confirm the comfort plan is active, and support the caregiver in staying present. Recommending 911 (option A) would disrupt the hospice plan. Option D abandons Patricia without guidance at a critical moment.',
  },
  {
    id: 'q_adr_communication',
    scenarioId: 'active_dying_recognition',
    category: 'communication',
    question:
      'Patricia says: "Is she suffering? I feel so helpless." Which response best empowers Patricia at this moment?',
    options: [
      '"Based on what I am seeing, she appears comfortable."',
      '"Her body is doing what it needs to do. She is not suffering the way you fear. The most important thing you can do right now is be here — talk to her, hold her hand. She can still hear you."',
      '"I will call the on-call provider to see if we should adjust her comfort medications."',
      '"It is very hard to know. These signs can mean different things for different people."',
    ],
    correctIndex: 1,
    explanation:
      'Option B addresses the fear of suffering, normalizes the dying process, and gives Patricia a meaningful active role — being present with her mother. Clinical assessment is secondary (option A) without guidance. Immediately routing to the on-call provider (option C) without first supporting Patricia misses the priority. Expressing uncertainty (option D) increases fear.',
  },

  // terminal_secretion_distress — RN / end_stage_copd
  {
    id: 'q_tsd_clinical',
    scenarioId: 'terminal_secretion_distress',
    category: 'clinical',
    question:
      'Linda wants to suction Earl to stop the gurgling sound from terminal secretions. What is the clinical rationale for NOT recommending suctioning?',
    options: [
      'Suctioning is not covered under the hospice benefit',
      'Suctioning can only reach the mouth and throat, not the lungs — and the stimulation is uncomfortable for a dying patient while providing only brief and temporary benefit',
      'Suctioning equipment is not available for home hospice',
      'Suctioning is only contraindicated if the patient has COPD — it would be fine for other diagnoses',
    ],
    correctIndex: 1,
    explanation:
      'Terminal secretions accumulate in the oropharynx and cannot be effectively removed by suctioning the lungs. Oropharyngeal suctioning provides only brief, temporary relief of the sound while introducing stimulation that is uncomfortable and distressing for a dying patient who cannot protect their own airway. It is not recommended in the actively dying patient.',
  },
  {
    id: 'q_tsd_role',
    scenarioId: 'terminal_secretion_distress',
    category: 'role_boundary',
    question:
      'Linda asks about medication to dry up the secretions. As the hospice RN, you should:',
    options: [
      'Tell her the standard medication is a scopolamine patch and she should apply one behind his ear',
      'Confirm that the hospice plan of care may include medications for secretion management, explain what they do, and route prescription and dose questions to the on-call provider',
      'Tell her medication for secretions is not part of the hospice benefit',
      'Tell her the medication will stop the sound within an hour',
    ],
    correctIndex: 1,
    explanation:
      'Confirming that the comfort plan addresses secretion management is within RN education scope. Prescribing a specific medication (option A), misinforming about coverage (option C), or making guarantees about outcomes (option D) are all outside RN scope or clinically misleading.',
  },
  {
    id: 'q_tsd_communication',
    scenarioId: 'terminal_secretion_distress',
    category: 'communication',
    question:
      'Linda says: "He sounds like he is drowning from the inside. Is he suffering?" Which response best addresses her fear?',
    options: [
      '"That sound is very hard to hear. Let me check his vital signs and we will know more shortly."',
      '"I know that sound is frightening. He is not drowning — the sound comes from secretions in the throat that he can no longer clear. The research tells us that patients who are this close to death are typically not experiencing the sound the way it sounds to us from outside."',
      '"All we can do now is wait. These sounds are normal for the dying process."',
      '"He may be experiencing some distress. I will call the on-call provider immediately to request sedation."',
    ],
    correctIndex: 1,
    explanation:
      'Option B addresses the immediate fear, provides a plain-language explanation of the mechanism, and offers the important clinical education that terminal secretions are a caregiver comfort issue more than a patient comfort issue. Options A and D respond to the sound as a clinical emergency. Option C normalizes without explanation or emotional support.',
  },

  // breakthrough_pain_at_home — RN / als_terminal
  {
    id: 'q_bpah_clinical',
    scenarioId: 'breakthrough_pain_at_home',
    category: 'clinical',
    question:
      'Frank has ALS and his breakthrough pain medication was given as prescribed two hours ago. He still appears to be in pain. What should the RN do first?',
    options: [
      'Tell Maria to give another dose because two hours is long enough to wait',
      'Assess the pain — location, character, what it looks like, and whether anything provides relief — before any action is taken',
      'Contact the on-call provider immediately to request a dose increase',
      'Tell Maria that ALS pain is untreatable and she should expect this level of discomfort',
    ],
    correctIndex: 1,
    explanation:
      'Assessment before action is the fundamental clinical principle. Understanding the pain character — is it bone pain, muscle cramping, positional, neuropathic? — informs the on-call provider conversation and may reveal non-medication comfort measures that can help immediately. ALS pain is absolutely treatable.',
  },
  {
    id: 'q_bpah_role',
    scenarioId: 'breakthrough_pain_at_home',
    category: 'role_boundary',
    question:
      'Maria asks: "The dose seems too low — can you tell me if I can give more?" As the hospice RN, you should:',
    options: [
      'Tell her she can give a second dose if she thinks it is needed, as long as she documents it',
      'Tell her the dose is correct and the pain is expected at this stage of ALS',
      'Validate her concern, confirm she followed the plan correctly, and contact the on-call provider to evaluate whether a dose adjustment is clinically appropriate',
      'Tell her dose questions are beyond your scope and she should wait for the next scheduled nursing visit',
    ],
    correctIndex: 2,
    explanation:
      'Dose adjustment decisions require provider evaluation and order. The RN validates, assesses, confirms the plan was followed correctly, and escalates to the on-call provider who has prescriptive authority. Authorizing an additional dose (option A) or dismissing the concern (option B or D) both fail Maria.',
  },
  {
    id: 'q_bpah_communication',
    scenarioId: 'breakthrough_pain_at_home',
    category: 'communication',
    question:
      'Maria says: "I gave him his breakthrough medicine two hours ago exactly like it says to. He is still moaning and moving around like he is in pain." Which response best supports Maria?',
    options: [
      '"You may have given it too late. Next time try to give it earlier in the episode."',
      '"You did everything right. That matters. Let me ask you a few questions about what his pain looks like — where it seems to be, what helps if anything — and then I will contact our on-call provider to review whether the plan needs to be adjusted."',
      '"Sometimes breakthrough medication just does not work well enough. This may be as good as it gets with ALS."',
      '"Two hours is right — it should be working. Are you sure he is actually in pain and not just restless?"',
    ],
    correctIndex: 1,
    explanation:
      'Validating that Maria followed the plan correctly is both clinically accurate and the most important thing the RN can say. It removes her guilt and builds trust. Moving into assessment and provider contact demonstrates action without false reassurance. Options A and D introduce doubt about her actions. Option C abandons the clinical goal.',
  },

  // advance_directive_conflict — SW / advanced_dementia
  {
    id: 'q_adc_clinical',
    scenarioId: 'advance_directive_conflict',
    category: 'clinical',
    question:
      'Helen has advanced dementia and no advance directive. Her children disagree about her care. What legal standard applies to surrogate decision-making when no advance directive exists?',
    options: [
      'The oldest child has legal authority to make all decisions',
      'The treating physician has final authority when the family cannot agree',
      'Surrogates are expected to apply substituted judgment — making the decision the patient would have made based on her known values and preferences',
      'Without an advance directive, the default is always aggressive treatment until a court orders otherwise',
    ],
    correctIndex: 2,
    explanation:
      'Substituted judgment is the legal and ethical standard for surrogate decision-making when a patient lacks capacity and has no advance directive. Surrogates are asked to speak for the patient based on known values — "what would she have wanted?" — not to make the decision they personally prefer.',
  },
  {
    id: 'q_adc_role',
    scenarioId: 'advance_directive_conflict',
    category: 'role_boundary',
    question:
      'Robert says: "I know my mother — she would want everything done." As a Social Worker, you should:',
    options: [
      'Validate Robert\'s knowledge of his mother and confirm that his preference should be the deciding factor',
      'Tell Robert that Carol\'s preference for comfort care is more aligned with typical dementia care',
      'Stay neutral — acknowledge his knowledge of her and invite exploration of her known values without taking sides or telling him what she would have wanted',
      'Tell Robert the social worker cannot be involved in medical decisions and he needs to speak with the attending',
    ],
    correctIndex: 2,
    explanation:
      'The social worker\'s role in family conflict is to stay neutral, facilitate values exploration, and support the family without taking sides. Validating Robert\'s position as the decision-maker (option A) takes sides. Implying comfort care is correct (option B) also takes sides. Refusing to engage (option D) abandons a critical supportive moment.',
  },
  {
    id: 'q_adc_communication',
    scenarioId: 'advance_directive_conflict',
    category: 'communication',
    question:
      'Robert says: "Carol says to do comfort care only, but I want everything done. How does anyone know what she would have wanted?" Which response best opens a productive conversation?',
    options: [
      '"You are right — without an advance directive, no one can know for certain. That is why we default to full treatment."',
      '"The standard for making decisions for someone who cannot speak is to ask: what would she have wanted, based on what you know about her values and how she lived? Can you tell me about her — what did she say about illness or hospitals when she was well?"',
      '"Carol has been more involved in her care, so her knowledge of your mother\'s wishes may be more current."',
      '"We can arrange a family meeting where a mediator helps you and Carol reach an agreement."',
    ],
    correctIndex: 1,
    explanation:
      'Option B introduces the substituted judgment standard in plain language and immediately shifts the conversation from positions to values. This is the social worker\'s primary facilitation tool. Option A gives legal misinformation about defaults. Option C takes sides. Option D jumps to a solution before exploring values.',
  },

  // caregiver_burnout — SW / end_stage_heart_failure
  {
    id: 'q_cb_clinical',
    scenarioId: 'caregiver_burnout',
    category: 'clinical',
    question:
      'Dorothy has not slept more than two to three hours at a time in two weeks, has lost weight, and is tearful. Which of these is the most important reason to screen her for caregiver burden now?',
    options: [
      'Caregiver burnout can lead Dorothy to neglect Walter\'s medications',
      'Caregiver burden during the illness is a predictor of complicated grief, depression, and physical health problems in the bereavement period — early intervention reduces these outcomes',
      'Social workers are required to document caregiver status for hospice billing',
      'Dorothy may need to be assessed for dementia given the cognitive impact of sleep deprivation',
    ],
    correctIndex: 1,
    explanation:
      'Research consistently shows that caregiver burden during a loved one\'s terminal illness is a significant predictor of complicated grief and poor health outcomes in the bereavement period. Identifying and addressing caregiver burden is a preventive intervention — it improves outcomes for Dorothy after Walter dies.',
  },
  {
    id: 'q_cb_role',
    scenarioId: 'caregiver_burnout',
    category: 'role_boundary',
    question:
      'Dorothy says she has been thinking about placing Walter in a care facility because she cannot manage alone. As a Social Worker, you should:',
    options: [
      'Tell her that hospice patients must remain at home to keep the hospice benefit',
      'Encourage her to explore placement because her health comes first',
      'Acknowledge the weight of the decision, provide accurate information about the options, and support her in clarifying what she wants — without pressuring her in either direction',
      'Contact the hospice medical director to assess whether Walter\'s care needs have exceeded what can be provided at home',
    ],
    correctIndex: 2,
    explanation:
      'The Social Worker supports Dorothy\'s decision-making without taking sides or applying pressure. Providing accurate information about inpatient hospice or facility care options is appropriate. Pressuring her toward placement (option B) or away from it (by default in option A) are both outside role. The medical director contact (option D) may be appropriate eventually but is not the first step.',
  },
  {
    id: 'q_cb_communication',
    scenarioId: 'caregiver_burnout',
    category: 'communication',
    question:
      'Dorothy says: "I feel like a terrible person for saying this, but I cannot keep doing this." Which response best honors her honesty?',
    options: [
      '"You are not a terrible person. You are doing an amazing job."',
      '"Saying you cannot keep going is not the same as giving up on Walter. It means you have been giving everything you have for a long time. That is not terrible — that is honest. Can we talk about what is hardest right now?"',
      '"We hear this a lot from caregivers. It is completely normal to feel this way."',
      '"You are right that it is too much. We should talk about other options for Walter\'s care."',
    ],
    correctIndex: 1,
    explanation:
      'Option B validates the statement directly, reframes the meaning of saying "I cannot keep doing this," and opens a specific conversation. Option A dismisses the feeling with a compliment. Option C normalizes without acknowledging the specific content of what Dorothy said — the guilt. Option D jumps immediately to placement, which Dorothy has not requested.',
  },

  // bereavement_first_call — SW / advanced_heart_failure
  {
    id: 'q_bfc_clinical',
    scenarioId: 'bereavement_first_call',
    category: 'clinical',
    question:
      'Margaret wakes up each morning and briefly forgets Thomas has died. When she remembers, she re-experiences the loss. Which of these best describes this phenomenon?',
    options: [
      'A symptom of pathological grief that requires psychiatric evaluation',
      'A normal early grief experience where the reality of the death has not yet been fully integrated into waking consciousness',
      'Evidence that Margaret did not have adequate closure before Thomas died',
      'A dissociative response suggesting Margaret may benefit from antidepressant medication',
    ],
    correctIndex: 1,
    explanation:
      'The morning re-grief pattern — waking and momentarily forgetting, then re-experiencing the loss — is a well-documented normal early grief experience. It occurs because the psychological integration of the death takes time, and waking consciousness has not yet fully incorporated the new reality. It typically diminishes as grief progresses.',
  },
  {
    id: 'q_bfc_role',
    scenarioId: 'bereavement_first_call',
    category: 'role_boundary',
    question:
      'Margaret asks: "How long is this going to feel like this?" As a hospice Social Worker on a bereavement call, you should:',
    options: [
      'Tell her grief usually improves significantly after about six months',
      'Tell her you cannot say because everyone grieves differently, and change the subject',
      'Normalize the uncertainty, explain that early grief often feels most acute, and offer information about the bereavement support program available to her',
      'Refer her to a psychiatrist because the question suggests she may be struggling more than normal',
    ],
    correctIndex: 2,
    explanation:
      'Grief does not follow a fixed timeline, and giving a specific endpoint (option A) creates false expectations. Refusing to engage (option B) abandons Margaret. Immediately referring to psychiatry (option D) pathologizes normal grief. Normalizing the uncertainty while offering support and resources is the appropriate bereavement social work response.',
  },
  {
    id: 'q_bfc_communication',
    scenarioId: 'bereavement_first_call',
    category: 'communication',
    question:
      'Margaret says: "I keep waking up and forgetting he is gone. Is that normal?" Which response best supports her?',
    options: [
      '"That is actually very common. Do not worry about it."',
      '"Yes — many people experience exactly that in early grief. Waking up and forgetting, then remembering again, is one of the most common and painful parts of early loss. It does not mean anything is wrong with you. Can I ask — how are you sleeping overall, and who is around you right now?"',
      '"That sounds like it might be complicated grief. I would like to refer you to a grief counselor."',
      '"That is your mind protecting you. It will stop when you are ready to accept the loss."',
    ],
    correctIndex: 1,
    explanation:
      'Option B validates the experience, names it as common without minimizing how painful it is, reassures her it is not abnormal, and opens a gentle assessment. Option A normalizes dismissively without acknowledgment. Option C immediately pathologizes normal grief. Option D uses a simplistic "protection" framing that implies she is avoiding acceptance.',
  },

  // can_change_minds — CL / advanced_dementia
  {
    id: 'q_ccm_clinical',
    scenarioId: 'can_change_minds',
    category: 'clinical',
    question:
      'Frank is afraid that choosing hospice is a permanent, irreversible decision. What is clinically accurate about hospice election and revocation?',
    options: [
      'Hospice is irreversible once elected — patients cannot return to curative treatment',
      'Patients can revoke hospice election at any time and return to standard Medicare benefits, including curative treatment',
      'Patients can revoke hospice only within the first 30 days of election',
      'Revoking hospice requires physician approval and a 72-hour waiting period',
    ],
    correctIndex: 1,
    explanation:
      'Per CMS policy, Medicare hospice election can be revoked at any time by the patient or their authorized representative. Upon revocation, the patient immediately returns to standard Medicare benefits. There is no waiting period and no physician approval required for the revocation itself.',
  },
  {
    id: 'q_ccm_role',
    scenarioId: 'can_change_minds',
    category: 'role_boundary',
    question:
      'Frank asks: "If we start hospice and she improves, can she still go to the hospital?" As a Clinical Liaison, you should:',
    options: [
      'Tell him hospice patients cannot go to the hospital for any reason while on the benefit',
      'Tell him that emergency hospitalizations are covered but scheduled hospitalizations are not',
      'Explain that if Ruth revokes hospice, she can return to standard Medicare benefits including hospital care, and that a Clinical Liaison can walk him through what this looks like specifically',
      'Tell him to ask the hospice nurse because this is a clinical question',
    ],
    correctIndex: 2,
    explanation:
      'The Clinical Liaison can explain the hospice benefit, including revocation rights and what reversion to standard Medicare means. This is core Clinical Liaison knowledge. The question about hospital access relates to the hospice benefit structure — not a clinical medical decision. Option A is incorrect. Option B is a partial answer that omits the revocation pathway.',
  },
  {
    id: 'q_ccm_communication',
    scenarioId: 'can_change_minds',
    category: 'communication',
    question:
      'Frank says: "Are we signing something we cannot take back?" Which response best addresses his fear?',
    options: [
      '"Hospice is a commitment, so it is important to feel ready before signing."',
      '"You are not signing something you cannot take back. Hospice can be revoked at any time — it is a choice, not a trap. If circumstances change, or you want to change direction, that option is always available to you."',
      '"I cannot legally give you advice about what to sign. You should have an attorney review it."',
      '"This is a very common fear. Most people who start hospice do not regret it."',
    ],
    correctIndex: 1,
    explanation:
      'Option B directly answers Frank\'s core question, uses plain language, and reframes hospice as a reversible choice. Option A implies commitment and increases the fear of permanence. Option C is both unhelpful and legally misleading. Option D normalizes without actually answering what he asked.',
  },
];
