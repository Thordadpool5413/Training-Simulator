import type { ConversationMessage, GeneratedResponse } from '@/types/simulator';

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

export function generateDaughterResponse(
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): GeneratedResponse {
  // History flags — check what has already happened in the conversation
  const hasFearReframe = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('does not mean everyone stops caring')
  );
  const hasPracticalQuestion = conversationMessages.some(
    (m) => m.sender === 'family' && m.text.includes('What would actually happen')
  );
  const hasRobertDisclosure = conversationMessages.some(
    (m) => m.sender === 'patient' && m.text.includes('keep coming back here')
  );
  const hasMedicationQuestion = conversationMessages.some((m) =>
    m.text.includes('morphine')
  );
  const learnerCount = conversationMessages.filter((m) => m.sender === 'learner').length;

  // Keyword detection on the current learner message
  const mentionsServiceList = containsAny(learnerMessageText, [
    'nurse', 'aide', 'equipment', 'supplies', 'medication',
    'benefit', 'service',
  ]);

  const mentionsEmotionalAck = containsAny(learnerMessageText, [
    'giving up', 'afraid', 'fear', 'worried', 'walk away',
    'understand', 'not alone', 'abandon', 'protect', 'worry',
  ]);

  const hasReframeAck = containsAny(learnerMessageText, [
    'understand', 'sound like giving up', 'protect', 'afraid', 'worry', 'fear',
  ]);
  const hasReframeExplain = containsAny(learnerMessageText, [
    'does not stop', 'does not mean', 'focus changes', 'comfort',
    'not alone', 'support', "won't stop", 'continues',
  ]);
  const mentionsReframe = hasReframeAck && hasReframeExplain;

  const mentionsHospiceAtHome = containsAny(learnerMessageText, [
    'home', 'at home', 'support', 'team', 'visit', 'continue',
  ]);

  const mentionsNurseOrProvider = containsAny(learnerMessageText, [
    'nurse', 'provider', 'doctor', 'physician', 'hospice team',
  ]);
  const mentionsRoutingLanguage = containsAny(learnerMessageText, [
    'explain', 'review', 'walk through', 'answer', 'call',
    'connect', 'bring in', 'talk through', 'go over',
  ]);
  const mentionsDirectMedInstruction = containsAny(learnerMessageText, [
    'give', 'administer', 'increase', 'decrease', 'hold', 'stop', 'start', 'take',
  ]);
  const isSafeMedRouting =
    mentionsNurseOrProvider && mentionsRoutingLanguage && !mentionsDirectMedInstruction;

  // Rule 3 — practical support question
  // Fires when fear reframe has happened, practical question not yet asked,
  // and learner explains hospice at home
  if (hasFearReframe && !hasPracticalQuestion && mentionsHospiceAtHome) {
    return {
      text: 'What would actually happen if we went home with hospice?',
      sender: 'family',
      speakerName: 'Daughter',
    };
  }

  // Rule 4 — Robert's quiet disclosure
  // Fires when practical question has been asked, Robert has not yet spoken,
  // and at least two learner turns have occurred
  if (hasPracticalQuestion && !hasRobertDisclosure && learnerCount >= 2) {
    return {
      text: 'I just do not want to keep coming back here like this.',
      sender: 'patient',
      speakerName: 'Robert',
    };
  }

  // Rule 5 — medication question
  // Only fires after hospice support has meaningfully been discussed.
  // learnerCount alone is not sufficient — one of the reframe milestones must be true.
  if (
    (hasFearReframe || hasPracticalQuestion || hasRobertDisclosure) &&
    !hasMedicationQuestion
  ) {
    return {
      text: 'If he gets short of breath at home, am I supposed to give morphine?',
      sender: 'family',
      speakerName: 'Daughter',
    };
  }

  // Rule 5A — safe medication routing response
  // Fires when the medication question has already appeared and the learner
  // safely routes it to the nurse or provider.
  if (hasMedicationQuestion && isSafeMedRouting) {
    return {
      text: 'Okay. I would want someone to explain that before we are home and scared.',
      sender: 'family',
      speakerName: 'Daughter',
    };
  }

  // Rule 2 — fear acknowledgment and hospice reframe
  // Fires when learner acknowledges the fear and explains the reframe
  if (mentionsReframe) {
    return {
      text: 'So you are saying hospice does not mean everyone stops caring for him?',
      sender: 'family',
      speakerName: 'Daughter',
    };
  }

  // Rule 1 — service list before emotional acknowledgment
  // Fires when learner leads with services without addressing the fear
  if (mentionsServiceList && !mentionsEmotionalAck) {
    return {
      text: 'That sounds like services, but it still sounds like you are saying we stop trying.',
      sender: 'family',
      speakerName: 'Daughter',
    };
  }

  // Rule 6 — fallback
  return {
    text: 'I am trying to understand, but I still need to know what this really means for him.',
    sender: 'family',
    speakerName: 'Daughter',
  };
}
