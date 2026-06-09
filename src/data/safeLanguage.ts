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
];
