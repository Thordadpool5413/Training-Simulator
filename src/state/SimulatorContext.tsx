import React, { createContext, useContext, useState } from 'react';
import type {
  ConversationMessage,
  LearnerProfile,
  PatientState,
  PatientStateSnapshot,
  SafetyEvent,
} from '@/types/simulator';

interface SimulatorState {
  selectedRoleId: string | null;
  learnerProfile: LearnerProfile | null;
  activeScenarioId: string | null;
  conversationMessages: ConversationMessage[];
  safetyEvents: SafetyEvent[];
  currentPatientState: PatientState | null;
  patientStateSnapshots: PatientStateSnapshot[];
  setSelectedRoleId: (id: string) => void;
  setLearnerProfile: (profile: LearnerProfile) => void;
  startSimulationSession: (
    scenarioId: string,
    openingMessage: ConversationMessage,
    initialPatientState: PatientState
  ) => void;
  appendConversationMessages: (messages: ConversationMessage[]) => void;
  appendSafetyEvent: (event: SafetyEvent) => void;
  setCurrentPatientState: (state: PatientState) => void;
  appendPatientStateSnapshot: (snapshot: PatientStateSnapshot) => void;
  resetSimulationSession: () => void;
}

const SimulatorContext = createContext<SimulatorState | null>(null);

export function SimulatorProvider({ children }: { children: React.ReactNode }) {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile | null>(null);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);
  const [safetyEvents, setSafetyEvents] = useState<SafetyEvent[]>([]);
  const [currentPatientState, setCurrentPatientStateInternal] = useState<PatientState | null>(null);
  const [patientStateSnapshots, setPatientStateSnapshots] = useState<PatientStateSnapshot[]>([]);

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

  function appendPatientStateSnapshot(snapshot: PatientStateSnapshot): void {
    setPatientStateSnapshots((prev) => [...prev, snapshot]);
  }

  function resetSimulationSession(): void {
    setActiveScenarioId(null);
    setConversationMessages([]);
    setSafetyEvents([]);
    setCurrentPatientStateInternal(null);
    setPatientStateSnapshots([]);
  }

  return (
    <SimulatorContext.Provider
      value={{
        selectedRoleId,
        learnerProfile,
        activeScenarioId,
        conversationMessages,
        safetyEvents,
        currentPatientState,
        patientStateSnapshots,
        setSelectedRoleId,
        setLearnerProfile,
        startSimulationSession,
        appendConversationMessages,
        appendSafetyEvent,
        setCurrentPatientState,
        appendPatientStateSnapshot,
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
