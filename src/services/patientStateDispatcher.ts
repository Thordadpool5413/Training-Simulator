import type { ConversationMessage, PatientState, PatientStateUpdateResult } from '@/types/simulator';
import { updateCopdPatientState } from '@/services/copdPatientStateService';
import { updateMedicationRefusalPatientState } from '@/services/medicationRefusalPatientStateService';
import { updatePainManagementPatientState } from '@/services/painManagementPatientStateService';
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
  if (scenarioId === 'pain_management_concern') {
    return updatePainManagementPatientState(currentState, learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'medication_refusal') {
    return updateMedicationRefusalPatientState(currentState, learnerMessageText, conversationMessages);
  }
  return updatePatientState(currentState, learnerMessageText, conversationMessages);
}
