import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type {
  CompletedSession,
  ConversationMessage,
  LearnerProfile,
  PatientState,
  PatientStateSnapshot,
  SafetyEvent,
  StreakData,
} from '@/types/simulator';
import type { QuizResult } from '@/types/quiz';
import {
  loadCompletedSessions,
  loadLearnerProfile,
  loadQuizResult,
  loadStreakData,
  saveCompletedSessions,
  saveLearnerProfile,
  saveQuizResult,
  saveStreakData,
} from '@/services/persistenceService';

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
  setSelectedRoleId: (id: string) => void;
  setLearnerProfile: (profile: LearnerProfile) => void;
  setSelectedScenarioId: (id: string) => void;
  setWeeklyGoal: (goal: number) => void;
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
}

const SimulatorContext = createContext<SimulatorState | null>(null);

export function SimulatorProvider({ children }: { children: React.ReactNode }) {
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
  const [hydrated, setHydrated] = useState(false);

  const sessionIdCounter = useRef(0);

  // Load persisted state once on mount
  useEffect(() => {
    async function hydrate() {
      const [profile, sessions, quiz, streak] = await Promise.all([
        loadLearnerProfile(),
        loadCompletedSessions(),
        loadQuizResult(),
        loadStreakData(),
      ]);
      if (profile) setLearnerProfileState(profile);
      if (sessions.length > 0) setCompletedSessions(sessions);
      if (quiz) setQuizResultInternal(quiz);
      if (streak) setStreakData(streak);
      setHydrated(true);
    }
    void hydrate();
  }, []);

  // Persist learnerProfile changes after hydration
  useEffect(() => {
    if (!hydrated || !learnerProfile) return;
    void saveLearnerProfile(learnerProfile);
  }, [learnerProfile, hydrated]);

  // Persist completedSessions changes after hydration
  useEffect(() => {
    if (!hydrated) return;
    void saveCompletedSessions(completedSessions);
  }, [completedSessions, hydrated]);

  // Persist quizResult changes after hydration
  useEffect(() => {
    if (!hydrated || !quizResult) return;
    void saveQuizResult(quizResult);
  }, [quizResult, hydrated]);

  // Persist streakData changes after hydration
  useEffect(() => {
    if (!hydrated) return;
    void saveStreakData(streakData);
  }, [streakData, hydrated]);

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
        setSelectedRoleId,
        setLearnerProfile,
        setSelectedScenarioId,
        setWeeklyGoal,
        startSimulationSession,
        appendConversationMessages,
        appendSafetyEvent,
        setCurrentPatientState,
        appendPatientStateSnapshot,
        setQuizResult,
        recordCompletedSession,
        resetSimulationSession,
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
