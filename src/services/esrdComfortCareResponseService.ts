import type { ConversationMessage, GeneratedResponse } from '@/types/simulator';

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

const EMOTIONAL_ACK_TERMS = [
  'understand', 'hear how', 'that must be', 'hard to', 'must feel',
  'terrifying', 'frightening', 'difficult', 'painful', 'love your father',
  'care about', 'grief', 'loss', 'scared', 'afraid', 'watching him',
];

const AUTONOMY_TERMS = [
  'right to refuse', 'legally', 'ethically', 'his choice', 'his decision',
  'patient has the right', 'adult has the right', 'autonomous', 'refuse treatment',
  'make decisions for himself', 'right to make his own', 'medical autonomy',
];

const VALUES_TERMS = [
  'what has he said', 'what does he want', 'what matters to him', 'his wishes',
  'what he values', 'what your father', 'what he has shared', 'his goals',
  'what he told you', 'what he expressed', 'his perspective',
];

const FAMILY_MEETING_TERMS = [
  'family meeting', 'bring everyone together', 'sit down together',
  'talk as a family', 'arrange a meeting', 'meet with the team',
  'get everyone together', 'have a conversation together',
];

const SIDES_TAKEN_TERMS = [
  'i agree with you', 'you are right', 'we should stop', 'we can challenge',
  'perhaps he is not', 'maybe he is not', 'it does sound like', 'i think he may',
  'you may have a point', 'that is a valid concern about his capacity',
];

const CAPACITY_DETERMINATION_TERMS = [
  'he has capacity', 'he is capable', 'he can make this decision',
  'he is mentally competent', 'i can confirm he', 'i can tell that he',
  'he clearly has', 'he obviously has',
];

export function generateEsrdComfortCareResponse(
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): GeneratedResponse {
  const hasJamesPushedBack = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes("Does my voice count")
  );
  const hasJamesTiredComment = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('He keeps saying he is tired')
  );
  const hasJamesMeetingRefusal = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('I do not need a meeting')
  );
  const hasJamesAgreement = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('So you agree with me')
  );

  const learnerCount = conversationMessages.filter((m) => m.sender === 'learner').length;

  const hasEmotionalAck = containsAny(learnerMessageText, EMOTIONAL_ACK_TERMS);
  const hasAutonomy = containsAny(learnerMessageText, AUTONOMY_TERMS);
  const hasValues = containsAny(learnerMessageText, VALUES_TERMS);
  const hasFamilyMeeting = containsAny(learnerMessageText, FAMILY_MEETING_TERMS);
  const hasSidesTaken = containsAny(learnerMessageText, SIDES_TAKEN_TERMS);
  const hasCapacityDetermination = containsAny(learnerMessageText, CAPACITY_DETERMINATION_TERMS);

  // Rule 1 — After James agrees meeting is possible, pivot to his real fear
  if (hasJamesMeetingRefusal && hasFamilyMeeting) {
    return {
      text: "What I need is for someone to explain to me how you can watch my father walk away from the only thing keeping him alive and call that a good outcome.",
      sender: 'family',
      speakerName: 'James',
    };
  }

  // Rule 2 — After tired comment, learner offers values reflection → James challenges diagnosis
  if (hasJamesTiredComment && !hasJamesMeetingRefusal && hasValues) {
    return {
      text: "I do not need a meeting. I need someone to stop him from making this mistake while he still has time.",
      sender: 'family',
      speakerName: 'James',
    };
  }

  // Rule 3 — After pushback, learner explains autonomy fully → James reveals father's stated reasons
  if (hasJamesPushedBack && !hasJamesTiredComment && hasValues) {
    return {
      text: "He keeps saying he is tired. That he does not want to keep living hooked up to machines. But I think he is just depressed. Can we get someone to check that?",
      sender: 'family',
      speakerName: 'James',
    };
  }

  // Rule 4 — After autonomy explained, James challenges the SW's role
  if (!hasJamesPushedBack && hasEmotionalAck && hasAutonomy && learnerCount >= 1) {
    return {
      text: "I know what rights he has. But he is my father. Does my voice count for anything here, or does nobody care what I think?",
      sender: 'family',
      speakerName: 'James',
    };
  }

  // Rule 5 — SW takes James's side → James briefly tests it
  if (hasSidesTaken && !hasJamesAgreement) {
    return {
      text: "So you agree with me? Then can we do something? Can we have him evaluated or something?",
      sender: 'family',
      speakerName: 'James',
    };
  }

  // Rule 6 — SW makes capacity determination → James challenges the basis
  if (hasCapacityDetermination) {
    return {
      text: "How would you know that? You talked to him for five minutes. I have watched him for seventy-four years.",
      sender: 'family',
      speakerName: 'James',
    };
  }

  // Rule 7 — Family meeting offered without emotional ack
  if (hasFamilyMeeting && !hasEmotionalAck) {
    return {
      text: "We have already talked as a family. I am talking to you now. What I need is an answer.",
      sender: 'family',
      speakerName: 'James',
    };
  }

  // Rule 8 — Fallback by turn count
  const fallbacks = [
    "Somebody has to do something. You cannot just let him do this.",
    "He is my father. I love him. That should count for something.",
    "Tell me what I am supposed to do with this.",
  ];
  const fallbackText = fallbacks[Math.min(learnerCount, fallbacks.length - 1)];

  return {
    text: fallbackText,
    sender: 'family',
    speakerName: 'James',
  };
}
