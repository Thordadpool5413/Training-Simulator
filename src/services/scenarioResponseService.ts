import type { ConversationMessage, GeneratedResponse } from '@/types/simulator';
import { generateActiveDyingResponse } from '@/services/activeDyingResponseService';
import { generateAdvancedDementiaGriefResponse } from '@/services/advancedDementiaGriefResponseService';
import { generateBereavementFirstCallResponse } from '@/services/bereavementFirstCallResponseService';
import { generateBreakthroughPainResponse } from '@/services/breakthroughPainResponseService';
import { generateAdvanceDirectiveConflictResponse } from '@/services/advanceDirectiveConflictResponseService';
import { generateCaregiverBurnoutResponse } from '@/services/caregiverBurnoutResponseService';
import { generateCopdResponse } from '@/services/copdResponseService';
import { generateDaughterResponse } from '@/services/daughterResponseService';
import { generateEsrdComfortCareResponse } from '@/services/esrdComfortCareResponseService';
import { generateHusbandResponse } from '@/services/husbandResponseService';
import { generateMedicationRefusalResponse } from '@/services/medicationRefusalResponseService';
import { generatePainManagementResponse } from '@/services/painManagementResponseService';
import { generatePrognosticUncertaintyResponse } from '@/services/prognosticUncertaintyResponseService';
import { generateSonResponse } from '@/services/sonResponseService';
import { generateTerminalDyspneaResponse } from '@/services/terminalDyspneaResponseService';
import { generateTerminalSecretionResponse } from '@/services/terminalSecretionResponseService';

export function generateScenarioResponse(
  scenarioId: string,
  learnerMessageText: string,
  conversationMessages: ConversationMessage[]
): GeneratedResponse {
  if (scenarioId === 'copd_air_hunger_at_home') {
    return generateCopdResponse(learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'terminal_dyspnea_follow_up') {
    return generateTerminalDyspneaResponse(learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'hospice_too_soon') {
    return generateSonResponse(learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'can_change_minds') {
    return generateHusbandResponse(learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'pain_management_concern') {
    return generatePainManagementResponse(learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'medication_refusal') {
    return generateMedicationRefusalResponse(learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'prognostic_uncertainty') {
    return generatePrognosticUncertaintyResponse(learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'esrd_comfort_care') {
    return generateEsrdComfortCareResponse(learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'advanced_dementia_grief') {
    return generateAdvancedDementiaGriefResponse(learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'active_dying_recognition') {
    return generateActiveDyingResponse(learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'terminal_secretion_distress') {
    return generateTerminalSecretionResponse(learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'breakthrough_pain_at_home') {
    return generateBreakthroughPainResponse(learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'advance_directive_conflict') {
    return generateAdvanceDirectiveConflictResponse(learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'caregiver_burnout') {
    return generateCaregiverBurnoutResponse(learnerMessageText, conversationMessages);
  }
  if (scenarioId === 'bereavement_first_call') {
    return generateBereavementFirstCallResponse(learnerMessageText, conversationMessages);
  }
  return generateDaughterResponse(learnerMessageText, conversationMessages);
}
