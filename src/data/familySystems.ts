import type { FamilySystemModule } from '@/types/simulator';

export const familySystems: FamilySystemModule[] = [
  {
    id: 'giving_up_fear',
    patternName: 'Giving up fear',
    coreBelief: 'Hospice means everyone is giving up.',
    hiddenFear: 'If I agree to hospice, I am betraying my father.',
    commonStatements: [
      'I am not ready to give up.',
      'Hospice means the doctors are done.',
      'We are fighters.',
      'I promised I would keep trying.',
    ],
    bestLearnerResponse:
      'I can understand why hospice might sound like giving up. A lot of families hear that word and worry everyone is walking away. Hospice does not mean care stops. It means the focus changes toward comfort, support, and making sure your family is not alone.',
    poorLearnerResponse:
      'Hospice provides nurses, aides, equipment, supplies, and medications.',
  },
  {
    id: 'air_hunger_panic',
    patternName: 'Air hunger panic',
    coreBelief: 'He is suffocating and I am watching him die and there is nothing I can do.',
    hiddenFear:
      'If I give him the wrong medication or do nothing, I will be responsible for his suffering or death.',
    commonStatements: [
      'He says he cannot breathe.',
      'I am scared he is going to suffocate.',
      'I do not know what to do.',
      'Is this what the end looks like?',
      'The oxygen is not working.',
      'Should I call 911?',
    ],
    bestLearnerResponse:
      'I can hear how frightened you are and I want you to know that what you are seeing is real. He is working hard to breathe and that is frightening to watch. Air hunger does not always look the way it feels from the outside. Let me tell you what we can do right now and when to call the hospice team.',
    poorLearnerResponse:
      'Just give him the morphine if he cannot breathe.',
  },
];
