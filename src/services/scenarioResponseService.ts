import type { ConversationMessage, GeneratedResponse } from '@/types/simulator';
import { generateCopdResponse } from '@/services/copdResponseService';
import { generateDaughterResponse } from '@/services/daughterResponseService';
import { generateSonResponse } from '@/services/sonResponseService';

export function generateScenarioResponse(
  scenarioId: string,
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): GeneratedResponse {
  if (scenarioId === 'copd_air_hunger_at_home') {
    return generateCopdResponse(learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'hospice_too_soon') {
    return generateSonResponse(learnerMessageText, conversationMessages);
  }
  return generateDaughterResponse(learnerMessageText, conversationMessages);
}
