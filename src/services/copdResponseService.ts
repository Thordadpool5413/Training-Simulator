import type { ConversationMessage, GeneratedResponse } from '@/types/simulator';

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

const FEAR_ACK_TERMS = [
  'scared',
  'terrifying',
  'frightening',
  'frightened',
  'watching him',
  'watching someone',
  'stay with you',
  'hard to breathe',
  'struggling to breathe',
];

const AIR_HUNGER_EXPLANATION_TERMS = [
  'air hunger',
  'not suffocating the way',
  'does not always mean',
  'ease that feeling',
  'body signals',
  'settle',
  'feel of breathing',
];

const COMFORT_TOOL_TERMS = [
  'sit upright',
  'sitting upright',
  'cool',
  'fan',
  'calm breathing',
  'comfort plan',
  'stay beside',
  'hospice comfort',
];

const SAFE_MED_FRAMING_TERMS = [
  'comfort medication',
  'does not mean abandon',
  'ease the feeling of air',
  'hospice orders',
  'on-call',
  'do not want to guess',
  'follow the hospice',
];

const EMPOWERMENT_TERMS = [
  'not alone',
  'you are not alone',
  'call the hospice',
  'call hospice',
  'next step',
  'i will help you',
  'help you call',
  'stay with you',
  'hospice team',
];

const CLOSING_REASSURANCE_TERMS = [
  'harold',
  'not leaving margaret',
  'focused on your comfort',
];

export function generateCopdResponse(
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): GeneratedResponse {
  const hasSuffocationStatement = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('going to suffocate right in front of me')
  );
  const hasOxygenQuestion = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('oxygen is already on')
  );
  const hasMorphineQuestion = conversationMessages.some((m) => m.text.includes('morphine'));
  const hasHelpMeStatement = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('I need someone to tell me')
  );
  const hasHaroldSpoken = conversationMessages.some((m) => m.sender === 'patient');

  // Rule 1 — Harold has spoken, learner gives closing reassurance
  if (hasHaroldSpoken && containsAny(learnerMessageText, CLOSING_REASSURANCE_TERMS)) {
    return {
      text: 'Okay. I can do that if someone stays with me through the first steps.',
      sender: 'family',
      speakerName: 'Margaret',
    };
  }

  // Rule 2 — Margaret expressed helplessness, learner empowers caregiver
  if (hasHelpMeStatement && !hasHaroldSpoken && containsAny(learnerMessageText, EMPOWERMENT_TERMS)) {
    return {
      text: 'Please do not leave her alone with this.',
      sender: 'patient',
      speakerName: 'Harold',
    };
  }

  // Rule 3 — Morphine question appeared, learner gives safe medication framing
  if (hasMorphineQuestion && !hasHelpMeStatement && containsAny(learnerMessageText, SAFE_MED_FRAMING_TERMS)) {
    return {
      text: 'Okay. I need someone to tell me exactly what to do because I feel like I am going to make the wrong choice.',
      sender: 'family',
      speakerName: 'Margaret',
    };
  }

  // Rule 4 — Oxygen question appeared, learner mentions comfort tools
  if (hasOxygenQuestion && !hasMorphineQuestion && containsAny(learnerMessageText, COMFORT_TOOL_TERMS)) {
    return {
      text: 'Are you talking about the morphine? I am scared that will make his breathing stop.',
      sender: 'family',
      speakerName: 'Margaret',
    };
  }

  // Rule 5 — Suffocation statement appeared, learner explains air hunger
  if (hasSuffocationStatement && !hasOxygenQuestion && containsAny(learnerMessageText, AIR_HUNGER_EXPLANATION_TERMS)) {
    return {
      text: 'But the oxygen is already on. If the oxygen is not fixing it, what else can we even do?',
      sender: 'family',
      speakerName: 'Margaret',
    };
  }

  // Rule 6 — Suffocation statement not yet appeared, learner acknowledges fear
  if (!hasSuffocationStatement && containsAny(learnerMessageText, FEAR_ACK_TERMS)) {
    return {
      text: 'I just keep thinking he is going to suffocate right in front of me.',
      sender: 'family',
      speakerName: 'Margaret',
    };
  }

  // Rule 7 — Fallback
  return {
    text: 'I am still scared. Can you help me understand what I should do next?',
    sender: 'family',
    speakerName: 'Margaret',
  };
}
