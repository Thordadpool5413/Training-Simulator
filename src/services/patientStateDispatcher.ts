import type { ConversationMessage, PatientState, PatientStateUpdateResult } from '@/types/simulator';
import { updateCopdPatientState } from '@/services/copdPatientStateService';
import { updatePatientState } from '@/services/patientStateService';

export function updateScenarioPatientState(
  scenarioId: string,
  currentState: PatientState,
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): PatientStateUpdateResult {
  if (scenarioId === 'copd_air_hunger_at_home' || scenarioId === 'terminal_dyspnea_follow_up') {
    return updateCopdPatientState(currentState, learnerMessageText, conversationMessages);
  }
  return updatePatientState(currentState, learnerMessageText, conversationMessages);
}
