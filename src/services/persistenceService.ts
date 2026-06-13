import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppSettings, CompletedSession, LearnerProfile, StreakData } from '@/types/simulator';
import type { QuizResult } from '@/types/quiz';

const KEYS = {
  learnerProfile: 'sim_learner_profile',
  completedSessions: 'sim_completed_sessions',
  quizResult: 'sim_quiz_result',
  streakData: 'sim_streak_data',
  appSettings: 'sim_app_settings',
} as const;

function scopedKey(scope: string, key: keyof typeof KEYS): string {
  return `sim:${scope}:${KEYS[key]}`;
}

function legacyKey(key: keyof typeof KEYS): string {
  return KEYS[key];
}

async function readJson<T>(keys: string[]): Promise<T | null> {
  try {
    for (const key of keys) {
      const raw = await AsyncStorage.getItem(key);
      if (raw) return JSON.parse(raw) as T;
    }
    return null;
  } catch {
    return null;
  }
}

async function writeJson(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // silently skip — storage failure should never crash the training app
  }
}

export async function loadLearnerProfile(scope = 'guest'): Promise<LearnerProfile | null> {
  return readJson<LearnerProfile>([
    scopedKey(scope, 'learnerProfile'),
    ...(scope === 'guest' ? [legacyKey('learnerProfile')] : []),
  ]);
}

export async function saveLearnerProfile(profile: LearnerProfile, scope = 'guest'): Promise<void> {
  await writeJson(scopedKey(scope, 'learnerProfile'), profile);
}

export async function loadCompletedSessions(scope = 'guest'): Promise<CompletedSession[]> {
  const sessions = await readJson<CompletedSession[]>([
    scopedKey(scope, 'completedSessions'),
    ...(scope === 'guest' ? [legacyKey('completedSessions')] : []),
  ]);
  return sessions ?? [];
}

export async function saveCompletedSessions(
  sessions: CompletedSession[],
  scope = 'guest'
): Promise<void> {
  await writeJson(scopedKey(scope, 'completedSessions'), sessions);
}

export async function loadQuizResult(scope = 'guest'): Promise<QuizResult | null> {
  return readJson<QuizResult>([
    scopedKey(scope, 'quizResult'),
    ...(scope === 'guest' ? [legacyKey('quizResult')] : []),
  ]);
}

export async function saveQuizResult(result: QuizResult, scope = 'guest'): Promise<void> {
  await writeJson(scopedKey(scope, 'quizResult'), result);
}

export async function loadStreakData(scope = 'guest'): Promise<StreakData | null> {
  return readJson<StreakData>([
    scopedKey(scope, 'streakData'),
    ...(scope === 'guest' ? [legacyKey('streakData')] : []),
  ]);
}

export async function saveStreakData(data: StreakData, scope = 'guest'): Promise<void> {
  await writeJson(scopedKey(scope, 'streakData'), data);
}

export async function loadAppSettings(scope = 'guest'): Promise<AppSettings | null> {
  return readJson<AppSettings>([scopedKey(scope, 'appSettings'), legacyKey('appSettings')]);
}

export async function saveAppSettings(settings: AppSettings, scope = 'guest'): Promise<void> {
  await writeJson(scopedKey(scope, 'appSettings'), settings);
}

export async function clearAllProgress(scope = 'guest'): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      scopedKey(scope, 'completedSessions'),
      scopedKey(scope, 'quizResult'),
      scopedKey(scope, 'streakData'),
      legacyKey('completedSessions'),
      legacyKey('quizResult'),
      legacyKey('streakData'),
    ]);
  } catch {}
}
