import { BACKEND_URL, CLIENT_ID } from '@/constants/api';
import type { ConversationMessage, PatientState } from '@/types/simulator';

export async function fetchPatientResponse(params: {
  scenarioId: string;
  diagnosisId?: string;
  scenarioTitle: string;
  setting?: string;
  openingSpeakerName: string;
  role: string;
  learnerObjective: string;
  hiddenFamilyFear?: string;
  recentClinicalChange?: string;
  whoIsPresent?: string[];
  patientState: PatientState | null;
  conversationHistory: ConversationMessage[];
}): Promise<string | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/anthropic/simulate-response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        x_client_id: CLIENT_ID,
      },
      body: JSON.stringify({
        scenarioId: params.scenarioId,
        diagnosisId: params.diagnosisId,
        scenarioTitle: params.scenarioTitle,
        setting: params.setting,
        openingSpeakerName: params.openingSpeakerName,
        role: params.role,
        learnerObjective: params.learnerObjective,
        hiddenFamilyFear: params.hiddenFamilyFear,
        recentClinicalChange: params.recentClinicalChange,
        whoIsPresent: params.whoIsPresent,
        patientState: params.patientState,
        conversationHistory: params.conversationHistory.map((m) => ({
          sender: m.sender,
          speakerName: m.speakerName,
          text: m.text,
        })),
      }),
    });

    if (!response.ok) return null;
    const data = (await response.json()) as { text?: string };
    return typeof data.text === 'string' && data.text.trim() ? data.text.trim() : null;
  } catch {
    return null;
  }
}
