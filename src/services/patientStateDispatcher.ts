import type { ConversationMessage, PatientState, PatientStateUpdateResult } from '@/types/simulator';
import { updateActiveDyingPatientState } from '@/services/activeDyingPatientStateService';
import { updateAdvancedDementiaGriefPatientState } from '@/services/advancedDementiaGriefPatientStateService';
import { updateAdvanceDirectiveConflictPatientState } from '@/services/advanceDirectiveConflictPatientStateService';
import { updateBereavementFirstCallPatientState } from '@/services/bereavementFirstCallPatientStateService';
import { updateBreakthroughPainPatientState } from '@/services/breakthroughPainPatientStateService';
import { updateCaregiverBurnoutPatientState } from '@/services/caregiverBurnoutPatientStateService';
import { updateCopdPatientState } from '@/services/copdPatientStateService';
import { updateEsrdComfortCarePatientState } from '@/services/esrdComfortCarePatientStateService';
import { updateMedicationRefusalPatientState } from '@/services/medicationRefusalPatientStateService';
import { updatePainManagementPatientState } from '@/services/painManagementPatientStateService';
import { updatePatientState } from '@/services/patientStateService';
import { updatePrognosticUncertaintyPatientState } from '@/services/prognosticUncertaintyPatientStateService';
import { updateTerminalSecretionPatientState } from '@/services/terminalSecretionPatientStateService';

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
  if (scenarioId === 'prognostic_uncertainty') {
    return updatePrognosticUncertaintyPatientState(currentState, learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'esrd_comfort_care') {
    return updateEsrdComfortCarePatientState(currentState, learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'advanced_dementia_grief') {
    return updateAdvancedDementiaGriefPatientState(currentState, learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'active_dying_recognition') {
    return updateActiveDyingPatientState(currentState, learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'terminal_secretion_distress') {
    return updateTerminalSecretionPatientState(currentState, learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'breakthrough_pain_at_home') {
    return updateBreakthroughPainPatientState(currentState, learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'advance_directive_conflict') {
    return updateAdvanceDirectiveConflictPatientState(currentState, learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'caregiver_burnout') {
    return updateCaregiverBurnoutPatientState(currentState, learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'bereavement_first_call') {
    return updateBereavementFirstCallPatientState(currentState, learnerMessageText, conversationMessages);
  }
  return updatePatientState(currentState, learnerMessageText, conversationMessages);
}
