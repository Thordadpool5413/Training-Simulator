import { BACKEND_URL, CLIENT_ID } from '@/constants/api';
import type { AIEvaluation, ConversationMessage } from '@/types/simulator';

export async function fetchAIEvaluation(params: {
  scenarioId: string;
  scenarioTitle: string;
  role: string;
  learnerObjective?: string;
  roleReminder?: string;
  hiddenFamilyFear?: string;
  successCriteria?: string[];
  failureCriteria?: string[];
  messages: ConversationMessage[];
  safetyEventCount: number;
  overallScore: number;
}): Promise<AIEvaluation | null> {
  try {
    const transcript = params.messages
      .filter((m) => m.sender !== 'system')
      .map((m) => `${m.speakerName}: ${m.text}`)
      .join('\n');

    const response = await fetch(`${BACKEND_URL}/anthropic/evaluate-simulation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        x_client_id: CLIENT_ID,
      },
      body: JSON.stringify({
        scenarioId: params.scenarioId,
        scenarioTitle: params.scenarioTitle,
        role: params.role,
        learnerObjective: params.learnerObjective,
        roleReminder: params.roleReminder,
        hiddenFamilyFear: params.hiddenFamilyFear,
        successCriteria: params.successCriteria,
        failureCriteria: params.failureCriteria,
        transcript,
        safetyEventCount: params.safetyEventCount,
        overallScore: params.overallScore,
      }),
    });

    if (!response.ok) return null;
    return (await response.json()) as AIEvaluation;
  } catch {
    return null;
  }
}
