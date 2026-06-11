export type QuizCategory = 'clinical' | 'role_boundary' | 'communication';

export interface QuizQuestion {
  id: string;
  scenarioId: string;
  category: QuizCategory;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  evidenceNote?: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
}

export interface QuizResult {
  scenarioId: string;
  answers: QuizAnswer[];
  score: number;
  totalQuestions: number;
  completedAt: string;
}
