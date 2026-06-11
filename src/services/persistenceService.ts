import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CompletedSession, LearnerProfile, StreakData } from '@/types/simulator';
import type { QuizResult } from '@/types/quiz';

const KEYS = {
  learnerProfile: 'sim_learner_profile',
  completedSessions: 'sim_completed_sessions',
  quizResult: 'sim_quiz_result',
  streakData: 'sim_streak_data',
} as const;

export async function loadLearnerProfile(): Promise<LearnerProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.learnerProfile);
    return raw ? (JSON.parse(raw) as LearnerProfile) : null;
  } catch {
    return null;
  }
}

export async function saveLearnerProfile(profile: LearnerProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.learnerProfile, JSON.stringify(profile));
  } catch {
    // silently skip — storage failure should never crash the training app
  }
}

export async function loadCompletedSessions(): Promise<CompletedSession[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.completedSessions);
    return raw ? (JSON.parse(raw) as CompletedSession[]) : [];
  } catch {
    return [];
  }
}

export async function saveCompletedSessions(sessions: CompletedSession[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.completedSessions, JSON.stringify(sessions));
  } catch {}
}

export async function loadQuizResult(): Promise<QuizResult | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.quizResult);
    return raw ? (JSON.parse(raw) as QuizResult) : null;
  } catch {
    return null;
  }
}

export async function saveQuizResult(result: QuizResult): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.quizResult, JSON.stringify(result));
  } catch {}
}

export async function loadStreakData(): Promise<StreakData | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.streakData);
    return raw ? (JSON.parse(raw) as StreakData) : null;
  } catch {
    return null;
  }
}

export async function saveStreakData(data: StreakData): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.streakData, JSON.stringify(data));
  } catch {}
}
