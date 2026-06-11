import type { SafeLanguageEntry } from '@/types/simulator';

export const safeLanguage: SafeLanguageEntry[] = [
  {
    id: 'hospice_fear_response',
    context: 'Hospice fear response',
    text: 'I can understand why hospice might sound like giving up. A lot of families hear that word and worry everyone is walking away. Hospice does not mean care stops. It means the focus changes toward comfort, support, and making sure your family is not alone.',
  },
  {
    id: 'medication_routing_response',
    context: 'Medication routing response',
    text: 'That is an important medication question. I do not want to guess about something that important. The hospice nurse or provider should walk through that with you directly.',
  },
  {
    id: 'repair_language',
    context: 'Repair language',
    text: 'I am sorry. I said that poorly. What I meant is that the care is not stopping. The focus is changing toward comfort, support, and helping your family know what to do next.',
  },
  {
    id: 'cl_too_soon_validation',
    context: 'Clinical Liaison, hospice timing fear validation',
    text: 'I can hear how much you want to protect your mom and make sure this is not happening too soon. That makes sense. Hospice is not about taking hope away. It is about bringing support in sooner so she and your family are not carrying this alone.',
  },
  {
    id: 'cl_hospice_timeline_education',
    context: 'Clinical Liaison, hospice timing education',
    text: 'Hospice is not only for the final few days. It is designed for people who may be in the last months of life, so support can begin while there is still time to help with comfort, planning, and family support.',
  },
  {
    id: 'cl_what_hospice_provides',
    context: 'Clinical Liaison, hospice support before final days',
    text: 'The hospice team can support your mom with nursing visits, symptom support, social work, spiritual care if she wants it, equipment, supplies, and guidance for your family. The goal is to help her feel as well supported as possible.',
  },
  {
    id: 'cl_revocation_plain_language',
    context: 'Clinical Liaison, hospice revocation plain language',
    text: "Choosing hospice is not a permanent decision. If something changes, if Ruth's condition changes, or your goals change, or you want to take a different direction, you or your family can revoke the hospice election at any time. The door is not closed behind you.",
  },
  {
    id: 'cl_hospice_as_choice',
    context: 'Clinical Liaison, hospice as a choice framing',
    text: 'Think of hospice as a choice you are making right now, for right now. You are not signing away future options. You are bringing in more support today, and you keep the right to change course if your situation changes.',
  },
  {
    id: 'cl_revocation_repair',
    context: 'Clinical Liaison, revocation repair language',
    text: 'I want to make sure I said that clearly. Hospice is not a one-way door. You and your family decide to start hospice, and you and your family can also decide to stop at any time. Your goals stay in your hands.',
  },
  {
    id: 'rn_air_hunger_acknowledgment',
    context: 'RN — air hunger fear acknowledgment',
    text: 'I can hear how frightened you are and I want you to know that what you are seeing is real. He is working hard to breathe and that is frightening to watch. Let me stay with you through this.',
  },
  {
    id: 'rn_air_hunger_explanation',
    context: 'RN — air hunger plain language explanation',
    text: 'Air hunger is when the body signals that breathing is hard, even when some air is moving in and out. It does not always mean he is suffocating the way it looks from the outside. What helps most is staying calm beside him, keeping the room cool, and having the comfort medications the hospice team prescribed ready if you need them.',
  },
  {
    id: 'rn_medication_routing',
    context: 'RN — comfort medication routing',
    text: 'The hospice team has a comfort plan in place for exactly this. I do not want to guess at amounts because that needs to come from the hospice orders and the on-call team. Let me make sure you know exactly when and how to reach them.',
  },
  {
    id: 'cl_pain_concern_validation',
    context: 'Clinical Liaison — validating pain concern and routing to nurse',
    text: 'What you are seeing is real and your concern matters. Pain assessment and management is something the hospice nurse handles directly. I want to make sure the nurse knows what you have seen so they can address it today.',
  },
  {
    id: 'cl_pain_routing_response',
    context: 'Clinical Liaison — routing pain question to hospice nurse',
    text: 'I do not want to give you a guess when this deserves a real clinical answer. The hospice nurse is the right person to assess what is happening and whether the pain plan needs to change. Can I help you reach the nurse directly?',
  },
  {
    id: 'cl_pain_decision_validation',
    context: 'Clinical Liaison — validating family decision to choose hospice despite ongoing pain',
    text: 'Agreeing to hospice was not the wrong decision. It means your father has a team focused on his comfort. Seeing pain does not mean the team has failed. It means we need to look more closely at what he needs, and the nurse can do that.',
  },
  {
    id: 'rn_patient_autonomy',
    context: 'RN — explaining patient autonomy when patient refuses medication',
    text: 'Your mother has the right to refuse medication. That is part of hospice — comfort care is always her choice, not something we can impose. Your role is to offer, not to make her take it. That is not a failure on your part.',
  },
  {
    id: 'rn_medication_offer_strategy',
    context: 'RN — communication strategy for offering comfort medication compassionately',
    text: 'Try offering it at a moment when she seems the most uncomfortable, and let her know what it does and does not do. You could say: this might ease the pain without taking away your thinking. And then let her decide.',
  },
  {
    id: 'rn_covert_refusal',
    context: 'RN — refusing to suggest covert medication administration',
    text: 'I cannot suggest that, even when watching someone you love suffer is unbearable. Giving medication without her knowledge is not something we are able to do. But there are things we can try together, and I want to help you find them.',
  },
  {
    id: 'rn_followup_comfort_reassurance',
    context: 'RN, follow-up visit when caregiver fears medication is not working',
    text: 'I can hear how frightening it is to watch her still struggling even after giving the medication. What you are seeing does not mean the medication is failing or that you did anything wrong. Air hunger can still look intense even when the medication is easing the sensation on the inside. Let me show you what to watch for and when that means it is time to call.',
  },
  {
    id: 'rn_when_to_call',
    context: 'RN, explaining when and how to call the hospice on-call team',
    text: 'You should call the hospice on-call team if the medication does not seem to be helping after the time your care plan says to wait, if the breathing is getting more distressed, or if you are not sure what to do next. You do not have to figure this out alone. That is exactly what the on-call team is there for.',
  },
  {
    id: 'cl_prognosis_estimate_reframe',
    context: 'Clinical Liaison — reframing prognosis as estimate, not a countdown deadline',
    text: 'Six months is the best estimate the hospice team can offer based on what they know about this illness. It is not a countdown clock. Some people do not reach six months. Some live well beyond it. The honest answer is that no one can tell you exactly when.',
  },
  {
    id: 'cl_prognosis_family_routing',
    context: 'Clinical Liaison — routing family gathering and end-of-life signs questions to hospice team',
    text: 'The question of what signs to watch for and when to call the family is one I want to make sure the hospice nurse or social worker answers with you directly. They can walk you through what to look for and how to think about timing. I do not want to give you a guess on something that important.',
  },
  {
    id: 'sw_autonomy_plain_language',
    context: 'Social Worker — explaining patient right to refuse treatment in plain language',
    text: 'Your father has the legal and ethical right to refuse any medical treatment, including dialysis. That right belongs to any adult who is able to make decisions for themselves. It is not something we can override, and it is not our role to change his mind or take sides in this.',
  },
  {
    id: 'sw_values_elicitation',
    context: 'Social Worker — inviting discussion of patient values and goals',
    text: "I want to understand this from your father's perspective. What has he told you about why he made this choice? What matters most to him about how he lives and what his days look like?",
  },
  {
    id: 'sw_capacity_routing',
    context: 'Social Worker — routing decision-making capacity questions to clinical team',
    text: "Questions about whether your father has the ability to make this decision — what his care team calls decision-making capacity — are medical and clinical assessments. Those need to come from his physician and clinical team, not from me. What I can do is help your family talk through what this decision means and what your father has said about what he wants.",
  },
  {
    id: 'cl_ambiguous_grief_acknowledgment',
    context: 'Clinical Liaison — acknowledging anticipatory grief and ambiguous loss in advanced dementia',
    text: "What you are describing — that she is still here but the person you knew is not — is something families in your situation often carry. It is a kind of grief that does not fit the usual categories. You are mourning someone who is still alive, and that is one of the hardest things there is.",
  },
  {
    id: 'cl_dementia_hospice_reframe',
    context: 'Clinical Liaison — framing hospice for advanced dementia as dignity and presence, not abandonment',
    text: "Choosing hospice for your mother does not mean giving up on her. It means bringing in a team focused on her comfort, her dignity, and reducing any distress she might feel — while giving you more support so you can actually be present with her instead of managing everything alone.",
  },
  {
    id: 'rn_dying_process_explanation',
    context: 'RN — explaining active dying signs to a caregiver in plain language',
    text: "What you are describing — the mottling, the cooler hands, the change in her breathing pattern — are signs that her body is shifting into the final stage of dying. This is a natural process. It does not mean she is in pain. It means her body is letting go of the work of staying alive, and it is doing so in the way bodies are designed to.",
  },
  {
    id: 'rn_vigil_empowerment',
    context: 'RN — empowering caregiver to hold a presence vigil at the bedside',
    text: "Your job right now is not to fix this or stop it. Your job is to be beside her. Talk to her. Touch her hand. She may still be able to hear you even if she cannot respond. Staying with her, keeping the room calm, and letting her know she is not alone — that is exactly the right thing to do.",
  },
  {
    id: 'rn_secretion_explanation',
    context: 'RN — explaining terminal secretions in plain language without causing more fear',
    text: "The sound you are hearing is not choking and it is not drowning. It is the sound of secretions in the throat that he can no longer clear on his own because the muscles that do that are relaxing. Most people in this stage are not aware of the sound the way we hear it from outside. Suctioning would not help and would be uncomfortable for him.",
  },
  {
    id: 'rn_repositioning_guidance',
    context: 'RN — guiding repositioning and non-pharmacologic comfort for terminal secretions',
    text: "The most helpful things are repositioning him gently onto his side so gravity helps, keeping the head of the bed raised a little, and keeping the room calm. A cool, slightly damp cloth near his mouth can help. You do not need to fix the sound. You need to stay beside him and keep him comfortable.",
  },
  {
    id: 'rn_pain_assessment_response',
    context: 'RN — acknowledging breakthrough pain concern and beginning assessment',
    text: "You did the right thing giving the medication as the plan describes, and I hear how frightening it is to watch him still seem uncomfortable. I want to ask you a few questions so I can understand exactly what I am hearing — where the pain seems to be, what it looks like, whether anything is helping even a little. That is going to help me tell the right person the right things.",
  },
  {
    id: 'rn_provider_routing',
    context: 'RN — routing breakthrough pain dose question to on-call hospice provider',
    text: "A question about whether the current dose is enough or whether it needs to change is a clinical decision that needs to come from the hospice provider, not from me alone. I am going to contact the on-call team right now and give them a full picture of what you are describing. They are the right person to decide if the plan needs to be adjusted.",
  },
  {
    id: 'sw_surrogate_decision_explained',
    context: 'Social Worker — explaining surrogate decision-making in plain language without taking sides',
    text: "When someone has not left written instructions, the people who loved them most become her voice. That means trying to understand what she would have chosen — based on what she said, how she lived, what she valued — not just what you would choose for her, and not just what feels safest. That is a hard thing to hold, and it is exactly what I want to help your family work through together.",
  },
  {
    id: 'sw_advance_directive_education',
    context: 'Social Worker — explaining advance directives and what happens without one',
    text: "An advance directive is a written document where someone records their own wishes for medical care. Without one, the medical team turns to the family — the legal next of kin — to make decisions based on what the person would have wanted. That is the role you are in right now. It does not mean you decide what you want. It means you decide what she would have wanted.",
  },
  {
    id: 'sw_caregiver_burden_validation',
    context: 'Social Worker — validating caregiver exhaustion without minimization or platitudes',
    text: "What you are describing is not a character flaw. Caring for someone around the clock, alone, without sleep, without a break — the fact that you are exhausted is not a sign that you love him less. It is a sign that you have been doing something that no single person can sustain forever. Saying you cannot keep going is not giving up on him. It is being honest about what you need.",
  },
  {
    id: 'sw_respite_resource_offer',
    context: 'Social Worker — offering respite care and concrete caregiver support resources',
    text: "There are options I want to talk through with you. Hospice has a respite benefit — that is time where Walter can receive care in a facility for a short period so you can rest and recover. There may also be a hospice aide or volunteer who can come in to give you a few hours. I want to understand what would actually help you, and then figure out what we can put in place.",
  },
  {
    id: 'sw_grief_normalization',
    context: 'Social Worker — normalizing the morning re-grief experience in early bereavement',
    text: "What you are describing — waking up and having a few seconds before you remember, and then the grief hitting all over again — is one of the most common experiences in early grief. It is not a sign that something is wrong with you. It is the mind trying to protect you from something too large to hold all at once. Many people describe exactly this, and it does tend to ease over time.",
  },
  {
    id: 'sw_bereavement_education',
    context: 'Social Worker — explaining the hospice bereavement program and available support',
    text: "You do not have to navigate this alone. Our hospice bereavement program offers ongoing support after a loss — that can include calls from our team, support groups with other people who understand this kind of grief, or a referral to a grief counselor if you want someone to talk with more consistently. I want to tell you what is available and then find out what feels right for where you are.",
  },
];
