import type { ConversationMessage, GeneratedResponse } from '@/types/simulator';

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

const CAREGIVER_ACK_TERMS = [
  'hard to watch', 'difficult', 'understand why', 'hear how',
  'that must be', 'not easy', 'watching someone', 'watching her',
  'frustrated', 'distress', 'exhausting', 'a lot to carry', 'not your fault',
];

const AUTONOMY_TERMS = [
  'right to refuse', 'her choice', 'patient choice', 'autonomy',
  'cannot force', 'cannot make her', 'her decision', 'she decides',
  'not your failure', 'not a failure',
];

const COMMUNICATION_STRATEGY_TERMS = [
  'gently offer', 'try offering', 'let her know', 'explain what it does',
  'without taking away', 'thinking clearly', 'clear mind', 'stay alert',
  'less pain', 'smaller amount', 'timing', 'when she seems most',
];

const DOROTHY_DIRECT_TERMS = [
  'dorothy', 'what are you worried about', 'what concerns you',
  'your own words', 'your experience', 'how you feel',
  'what would help you', 'that makes sense', 'i hear you',
];

const TEAM_ESCALATION_TERMS = [
  'on-call', 'on call', 'call the team', 'hospice team', 'provider',
  'nurse can', 'reach the team', 'someone from the team', 'options',
];

const COVERT_TERMS = [
  'put it in her food', 'put it in his food', 'mix it', 'hide it',
  'without telling', 'without knowing', 'sneak it', 'slip it',
];

export function generateMedicationRefusalResponse(
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): GeneratedResponse {
  const hasMichaelRefusalExplain = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('not herself anymore')
  );
  const hasMichaelConvinceQuestion = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('nothing I can do to convince her')
  );
  const hasDorothySpoken = conversationMessages.some((m) => m.sender === 'patient');
  const hasDorothyFearRevealed = conversationMessages.some(
    (m) => m.sender === 'patient' && m.text.includes('If I could still think clearly')
  );
  const hasMichaelClosing = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('I felt like I was doing something wrong')
  );

  const learnerCount = conversationMessages.filter((m) => m.sender === 'learner').length;

  const hasAutonomy = containsAny(learnerMessageText, AUTONOMY_TERMS);
  const hasCaregiverAck = containsAny(learnerMessageText, CAREGIVER_ACK_TERMS);
  const hasCommunicationStrategy = containsAny(learnerMessageText, COMMUNICATION_STRATEGY_TERMS);
  const hasDorothyDirect = containsAny(learnerMessageText, DOROTHY_DIRECT_TERMS);
  const hasTeamEscalation = containsAny(learnerMessageText, TEAM_ESCALATION_TERMS);
  const hasCovert = containsAny(learnerMessageText, COVERT_TERMS);

  // Rule 1 — Close the arc after Dorothy's fear is addressed
  if (hasDorothyFearRevealed && !hasMichaelClosing && (hasCommunicationStrategy || hasTeamEscalation)) {
    return {
      text: 'Thank you. I felt like I was doing something wrong by letting her refuse. I did not know that was allowed.',
      sender: 'family',
      speakerName: 'Michael',
    };
  }

  // Rule 2 — Dorothy reveals real fear when addressed directly
  if (hasDorothySpoken && !hasDorothyFearRevealed && hasDorothyDirect) {
    return {
      text: 'If I could still think clearly but not hurt as much, would that be possible with a smaller amount?',
      sender: 'patient',
      speakerName: 'Dorothy',
    };
  }

  // Rule 3 — Dorothy speaks up after Michael's convince question is answered
  if (hasMichaelConvinceQuestion && !hasDorothySpoken && (hasAutonomy || hasCommunicationStrategy)) {
    return {
      text: 'I do not want to be out of it. I want to know where I am when my son is in the room.',
      sender: 'patient',
      speakerName: 'Dorothy',
    };
  }

  // Rule 4 — Michael asks if there is anything he can do after the reason appears
  if (hasMichaelRefusalExplain && !hasMichaelConvinceQuestion && hasAutonomy) {
    return {
      text: 'So there is nothing I can do to convince her? I have to just watch her hurt?',
      sender: 'family',
      speakerName: 'Michael',
    };
  }

  // Rule 5 — After caregiver ack, Michael explains why Dorothy refuses
  if (!hasMichaelRefusalExplain && hasCaregiverAck) {
    return {
      text: 'She says the morphine makes her feel like she is not herself anymore. Like she cannot track what day it is or who is in the room.',
      sender: 'family',
      speakerName: 'Michael',
    };
  }

  // Rule 6 — Covert suggestion from learner (this fires before safety service, as a secondary response)
  if (hasCovert) {
    return {
      text: 'I just do not know what to do anymore. I feel like I am failing her.',
      sender: 'family',
      speakerName: 'Michael',
    };
  }

  // Rule 7 — Varied fallbacks
  const fallbacks = [
    'I just do not know how to help her when she keeps saying no.',
    'Is there something else we can try? Something she might actually accept?',
    'I keep thinking I am making it worse by not making her take it.',
  ];
  const fallbackText = fallbacks[Math.min(learnerCount, fallbacks.length - 1)];

  return {
    text: fallbackText,
    sender: 'family',
    speakerName: 'Michael',
  };
}
