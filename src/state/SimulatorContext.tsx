import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import type {
  CompletedSession,
  ConversationMessage,
  LearnerProfile,
  PatientState,
  PatientStateSnapshot,
  SafetyEvent,
} from '@/types/simulator';
import type { QuizResult } from '@/types/quiz';

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
  setSelectedRoleId: (id: string) => void;
  setLearnerProfile: (profile: LearnerProfile) => void;
  setSelectedScenarioId: (id: string) => void;
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
  recordCompletedSession: (session: Omit<CompletedSession, 'id' | 'completedAt'>) => void;
  resetSimulationSession: () => void;
}

const SimulatorContext = createContext<SimulatorState | null>(null);

export function SimulatorProvider({ children }: { children: React.ReactNode }) {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile | null>(null);
  const [selectedScenarioId, setSelectedScenarioIdInternal] = useState<string | null>(null);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);
  const [safetyEvents, setSafetyEvents] = useState<SafetyEvent[]>([]);
  const [currentPatientState, setCurrentPatientStateInternal] = useState<PatientState | null>(null);
  const [patientStateSnapshots, setPatientStateSnapshots] = useState<PatientStateSnapshot[]>([]);
  const [quizResult, setQuizResultInternal] = useState<QuizResult | null>(null);
  const [completedSessions, setCompletedSessions] = useState<CompletedSession[]>([]);

  const sessionIdCounter = useRef(0);

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

  const recordCompletedSession = useCallback(
    (session: Omit<CompletedSession, 'id' | 'completedAt'>): void => {
      sessionIdCounter.current += 1;
      const full: CompletedSession = {
        ...session,
        id: `session_${sessionIdCounter.current}_${Date.now()}`,
        completedAt: new Date().toISOString(),
      };
      setCompletedSessions((prev) => {
        const withoutDuplicate = prev.filter((s) => s.scenarioId !== session.scenarioId || s.roleId !== session.roleId);
        return [...withoutDuplicate, full];
      });
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
        setSelectedRoleId,
        setLearnerProfile,
        setSelectedScenarioId,
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
