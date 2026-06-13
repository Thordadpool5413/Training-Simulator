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
    id: 'too_soon_fear',
    patternName: 'Too soon for hospice fear',
    coreBelief:
      'Hospice is only for the very end, so starting now means we are giving up too early.',
    hiddenFear:
      'If I agree to hospice now, I may be responsible for taking away time, hope, or treatment from my mother.',
    commonStatements: [
      'She is still talking to us.',
      'She is still eating a little.',
      'I thought hospice was only for the last few days.',
      'Are we giving up too soon?',
      'What if she still has more time?',
      'Does this mean no one will treat her anymore?',
    ],
    bestLearnerResponse:
      'I can hear how much you want to protect your mom and make sure this is not happening too soon. Hospice is not only for the last few days. When someone may be in the last months of life, hospice can bring support earlier so the patient and family are not carrying this alone.',
    poorLearnerResponse:
      'Hospice is what people do when treatment is over, so you should start now.',
  },
  {
    id: 'revocation_fear',
    patternName: 'Revocation and irreversibility fear',
    coreBelief:
      'Hospice is a permanent, one-way decision. Once we sign, we cannot take it back or change course, no matter what.',
    hiddenFear:
      'If I choose hospice and then change my mind, it will be too late and no one will help us go back. I will have closed a door I cannot reopen.',
    commonStatements: [
      'Can we undo this if we change our mind?',
      'Are we signing something we cannot take back?',
      'What if she gets better?',
      'I do not want to be locked into something.',
      'What if we want to try something else later?',
      'Is this permanent?',
    ],
    bestLearnerResponse:
      'I hear how much this weighs on you. Hospice is not a permanent decision and you are not signing something you cannot undo. You or your family can revoke the hospice election at any time if your goals change. This is a choice, not a trap.',
    poorLearnerResponse:
      'Hospice is the best option at this stage and once the team is in place, it really takes care of everything.',
  },
  {
    id: 'comfort_medication_doubt',
    patternName: 'Comfort medication doubt',
    coreBelief: 'The medication is not working and either I gave it wrong or it is not enough.',
    hiddenFear:
      'If I ask for more and it is not allowed, I have failed her. If I do not ask and she is suffering, I have also failed her.',
    commonStatements: [
      'She still looks so uncomfortable.',
      'I gave it like you said but nothing changed.',
      'Is this normal? Should she still look like this?',
      'Do we need to call someone? Can we give more?',
      'I do not know if I am doing this right.',
      'Is she suffering?',
    ],
    bestLearnerResponse:
      'I can see how frightening it is to watch her struggle even after giving the medication. What you are seeing does not mean the medication is failing or that you did anything wrong. Air hunger can still look intense even when the medication is helping the sensation. Let me show you what to watch for and when to call the team.',
    poorLearnerResponse: 'Just give another dose if she is still struggling.',
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
