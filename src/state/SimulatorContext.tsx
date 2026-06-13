import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type {
  AppSettings,
  CompletedSession,
  ConversationMessage,
  LearnerProfile,
  PatientState,
  PatientStateSnapshot,
  SafetyEvent,
  StreakData,
} from '@/types/simulator';
import type { QuizResult } from '@/types/quiz';
import { useAuth } from '@/state/AuthContext';
import {
  clearCloudProgress,
  loadCloudCompletedSessions,
  loadCloudLearnerProfile,
} from '@/services/cloudSyncService';
import {
  clearAllProgress,
  loadAppSettings,
  loadCompletedSessions,
  loadLearnerProfile,
  loadQuizResult,
  loadStreakData,
  saveAppSettings,
  saveCompletedSessions,
  saveLearnerProfile,
  saveQuizResult,
  saveStreakData,
} from '@/services/persistenceService';

const DEFAULT_APP_SETTINGS: AppSettings = {
  notificationHour: 18,
  notificationMinute: 0,
  notificationsEnabled: true,
};

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  lastPracticeDate: null,
  weeklySessionCount: 0,
  weeklyGoalStart: null,
  weeklyGoal: 3,
};

function computeNewStreakData(prev: StreakData): StreakData {
  const today = new Date().toISOString().slice(0, 10);
  if (prev.lastPracticeDate === today) return prev;

  let newStreak: number;
  if (!prev.lastPracticeDate) {
    newStreak = 1;
  } else {
    const diffMs = new Date(today).getTime() - new Date(prev.lastPracticeDate).getTime();
    const diffDays = Math.round(diffMs / 86400000);
    newStreak = diffDays === 1 ? prev.currentStreak + 1 : 1;
  }

  const d = new Date(today);
  const diffToMon = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - diffToMon);
  const weekStart = d.toISOString().slice(0, 10);

  const weeklyCount =
    prev.weeklyGoalStart === weekStart ? prev.weeklySessionCount + 1 : 1;

  return {
    currentStreak: newStreak,
    lastPracticeDate: today,
    weeklySessionCount: weeklyCount,
    weeklyGoalStart: weekStart,
    weeklyGoal: prev.weeklyGoal,
  };
}

function isoDate(value: string): string {
  return value.slice(0, 10);
}

function startOfWeekIso(value: string): string {
  const date = new Date(value);
  const diffToMon = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - diffToMon);
  return date.toISOString().slice(0, 10);
}

function diffDays(aIso: string, bIso: string): number {
  return Math.round((new Date(aIso).getTime() - new Date(bIso).getTime()) / 86400000);
}

function mergeCompletedSessions(
  localSessions: CompletedSession[],
  cloudSessions: CompletedSession[]
): CompletedSession[] {
  const byScenarioRole = new Map<string, CompletedSession>();
  const allSessions = [...localSessions, ...cloudSessions].sort(
    (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
  );

  for (const session of allSessions) {
    const key = `${session.scenarioId}::${session.roleId}`;
    const existing = byScenarioRole.get(key);
    if (!existing || new Date(session.completedAt).getTime() >= new Date(existing.completedAt).getTime()) {
      byScenarioRole.set(key, session);
    }
  }

  return Array.from(byScenarioRole.values()).sort(
    (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
  );
}

function deriveStreakDataFromSessions(
  sessions: CompletedSession[],
  weeklyGoal: number
): StreakData {
  if (sessions.length === 0) {
    return {
      ...DEFAULT_STREAK,
      weeklyGoal,
    };
  }

  const todayIso = new Date().toISOString().slice(0, 10);
  const weekStart = startOfWeekIso(todayIso);
  const sessionsThisWeek = sessions.filter((session) => startOfWeekIso(session.completedAt) === weekStart);
  const uniquePracticeDates = Array.from(new Set(sessions.map((session) => isoDate(session.completedAt)))).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );
  const latestPracticeDate = uniquePracticeDates[0] ?? null;
  let currentStreak = 0;

  if (latestPracticeDate && diffDays(todayIso, latestPracticeDate) <= 1) {
    currentStreak = 1;
    for (let i = 1; i < uniquePracticeDates.length; i += 1) {
      if (diffDays(uniquePracticeDates[i - 1], uniquePracticeDates[i]) === 1) {
        currentStreak += 1;
      } else {
        break;
      }
    }
  }

  return {
    currentStreak,
    lastPracticeDate: latestPracticeDate,
    weeklySessionCount: sessionsThisWeek.length,
    weeklyGoalStart: weekStart,
    weeklyGoal,
  };
}

interface SimulatorState {
  selectedRoleId: string | null;
  learnerProfile: LearnerProfile | null;
  selectedScenarioId: string | null;
  activeScenarioId: string | null;
  conversationMessages: ConversationMessage[];
  safetyEvents: SafetyEvent[];
  currentPatientState: PatientState | null;
  patientStateSnapshots: PatientStateSnapshot[];
  quizResult: QuizResult | null;
  completedSessions: CompletedSession[];
  streakData: StreakData;
  appSettings: AppSettings;
  setSelectedRoleId: (id: string) => void;
  setLearnerProfile: (profile: LearnerProfile) => void;
  setSelectedScenarioId: (id: string) => void;
  setWeeklyGoal: (goal: number) => void;
  updateAppSettings: (patch: Partial<AppSettings>) => void;
  resetAllProgress: () => void;
  startSimulationSession: (
    scenarioId: string,
    openingMessage: ConversationMessage,
    initialPatientState: PatientState
  ) => void;
  appendConversationMessages: (messages: ConversationMessage[]) => void;
  appendSafetyEvent: (event: SafetyEvent) => void;
  setCurrentPatientState: (state: PatientState) => void;
  appendPatientStateSnapshot: (snapshot: PatientStateSnapshot) => void;
  setQuizResult: (result: QuizResult) => void;
  recordCompletedSession: (session: Omit<CompletedSession, 'id' | 'completedAt' | 'previousScore'>) => void;
  resetSimulationSession: () => void;
  isHydrated: boolean;
}

const SimulatorContext = createContext<SimulatorState | null>(null);

export function SimulatorProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [learnerProfile, setLearnerProfileState] = useState<LearnerProfile | null>(null);
  const [selectedScenarioId, setSelectedScenarioIdInternal] = useState<string | null>(null);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);
  const [safetyEvents, setSafetyEvents] = useState<SafetyEvent[]>([]);
  const [currentPatientState, setCurrentPatientStateInternal] = useState<PatientState | null>(null);
  const [patientStateSnapshots, setPatientStateSnapshots] = useState<PatientStateSnapshot[]>([]);
  const [quizResult, setQuizResultInternal] = useState<QuizResult | null>(null);
  const [completedSessions, setCompletedSessions] = useState<CompletedSession[]>([]);
  const [streakData, setStreakData] = useState<StreakData>(DEFAULT_STREAK);
  const [appSettings, setAppSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  const sessionIdCounter = useRef(0);
  const hydrationToken = useRef(0);
  const storageScope = userId ?? 'guest';

  // Load persisted state once per account scope.
  useEffect(() => {
    const token = ++hydrationToken.current;
    setHydrated(false);
    setLearnerProfileState(null);
    setCompletedSessions([]);
    setQuizResultInternal(null);
    setStreakData(DEFAULT_STREAK);
    setAppSettings(DEFAULT_APP_SETTINGS);

    async function hydrate() {
      const [profile, sessions, quiz, streak, settings] = await Promise.all([
        loadLearnerProfile(storageScope),
        loadCompletedSessions(storageScope),
        loadQuizResult(storageScope),
        loadStreakData(storageScope),
        loadAppSettings(storageScope),
      ]);

      if (token !== hydrationToken.current) return;

      let nextProfile = profile;
      let nextSessions = sessions;
      let nextGoal = streak?.weeklyGoal ?? DEFAULT_STREAK.weeklyGoal;

      if (userId) {
        const [cloudProfile, cloudSessions] = await Promise.all([
          loadCloudLearnerProfile(userId),
          loadCloudCompletedSessions(userId),
        ]);

        if (token !== hydrationToken.current) return;

        nextProfile = cloudProfile ?? nextProfile;
        nextSessions = mergeCompletedSessions(nextSessions, cloudSessions);
        nextGoal = streak?.weeklyGoal ?? DEFAULT_STREAK.weeklyGoal;
      }

      setLearnerProfileState(nextProfile ?? null);
      setCompletedSessions(nextSessions);
      setQuizResultInternal(quiz);
      setStreakData(deriveStreakDataFromSessions(nextSessions, nextGoal));
      if (settings) setAppSettings(settings);
      else setAppSettings(DEFAULT_APP_SETTINGS);
      setHydrated(true);
    }
    void hydrate();
    return () => {
      hydrationToken.current += 1;
    };
  }, [storageScope]);

  // Persist learnerProfile changes after hydration
  useEffect(() => {
    if (!hydrated || !learnerProfile) return;
    void saveLearnerProfile(learnerProfile, storageScope);
  }, [learnerProfile, hydrated, storageScope]);

  // Persist completedSessions changes after hydration
  useEffect(() => {
    if (!hydrated) return;
    void saveCompletedSessions(completedSessions, storageScope);
  }, [completedSessions, hydrated, storageScope]);

  // Persist quizResult changes after hydration
  useEffect(() => {
    if (!hydrated || !quizResult) return;
    void saveQuizResult(quizResult, storageScope);
  }, [quizResult, hydrated, storageScope]);

  // Persist streakData changes after hydration
  useEffect(() => {
    if (!hydrated) return;
    void saveStreakData(streakData, storageScope);
  }, [streakData, hydrated, storageScope]);

  // Persist appSettings changes after hydration
  useEffect(() => {
    if (!hydrated) return;
    void saveAppSettings(appSettings, storageScope);
  }, [appSettings, hydrated, storageScope]);

  function startSimulationSession(
    scenarioId: string,
    openingMessage: ConversationMessage,
    initialPatientState: PatientState
  ): void {
    if (activeScenarioId === scenarioId) return;
    setActiveScenarioId(scenarioId);
    setConversationMessages([openingMessage]);
    setSafetyEvents([]);
    setCurrentPatientStateInternal({ ...initialPatientState });
    setPatientStateSnapshots([]);
    setQuizResultInternal(null);
  }

  function appendConversationMessages(messages: ConversationMessage[]): void {
    setConversationMessages((prev) => [...prev, ...messages]);
  }

  function appendSafetyEvent(event: SafetyEvent): void {
    setSafetyEvents((prev) => [...prev, event]);
  }

  function setCurrentPatientState(state: PatientState): void {
    setCurrentPatientStateInternal(state);
  }

  function setSelectedScenarioId(id: string): void {
    setSelectedScenarioIdInternal(id);
  }

  function appendPatientStateSnapshot(snapshot: PatientStateSnapshot): void {
    setPatientStateSnapshots((prev) => [...prev, snapshot]);
  }

  const setQuizResult = useCallback((result: QuizResult): void => {
    setQuizResultInternal(result);
  }, []);

  const setLearnerProfile = useCallback((profile: LearnerProfile): void => {
    setLearnerProfileState(profile);
  }, []);

  const setWeeklyGoal = useCallback((goal: number): void => {
    setStreakData((prev) => ({ ...prev, weeklyGoal: goal }));
  }, []);

  const updateAppSettings = useCallback((patch: Partial<AppSettings>): void => {
    setAppSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetAllProgress = useCallback((): void => {
    setCompletedSessions([]);
    setQuizResultInternal(null);
    setStreakData(DEFAULT_STREAK);
    if (userId) {
      void clearCloudProgress(userId);
      void clearAllProgress('guest');
    }
    void clearAllProgress(storageScope);
  }, [storageScope, userId]);

  const recordCompletedSession = useCallback(
    (session: Omit<CompletedSession, 'id' | 'completedAt' | 'previousScore'>): void => {
      sessionIdCounter.current += 1;
      setCompletedSessions((prev) => {
        const existing = prev.find(
          (s) => s.scenarioId === session.scenarioId && s.roleId === session.roleId
        );
        const full: CompletedSession = {
          ...session,
          id: `session_${sessionIdCounter.current}_${Date.now()}`,
          completedAt: new Date().toISOString(),
          previousScore: existing?.overallScore,
        };
        const withoutDuplicate = prev.filter(
          (s) => s.scenarioId !== session.scenarioId || s.roleId !== session.roleId
        );
        return [...withoutDuplicate, full];
      });
      setStreakData((prev) => computeNewStreakData(prev));
    },
    []
  );

  function resetSimulationSession(): void {
    setSelectedScenarioIdInternal(null);
    setActiveScenarioId(null);
    setConversationMessages([]);
    setSafetyEvents([]);
    setCurrentPatientStateInternal(null);
    setPatientStateSnapshots([]);
    // quizResult and completedSessions are intentionally preserved across resets
  }

  return (
    <SimulatorContext.Provider
      value={{
        selectedRoleId,
        learnerProfile,
        selectedScenarioId,
        activeScenarioId,
        conversationMessages,
        safetyEvents,
        currentPatientState,
        patientStateSnapshots,
        quizResult,
        completedSessions,
        streakData,
        appSettings,
        setSelectedRoleId,
        setLearnerProfile,
        setSelectedScenarioId,
        setWeeklyGoal,
        updateAppSettings,
        resetAllProgress,
        startSimulationSession,
        appendConversationMessages,
        appendSafetyEvent,
        setCurrentPatientState,
        appendPatientStateSnapshot,
        setQuizResult,
        recordCompletedSession,
        resetSimulationSession,
        isHydrated: hydrated,
      }}>
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulator(): SimulatorState {
  const ctx = useContext(SimulatorContext);
  if (!ctx) throw new Error('useSimulator must be used within SimulatorProvider');
  return ctx;
}
