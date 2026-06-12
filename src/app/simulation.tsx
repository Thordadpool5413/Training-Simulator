import { Audio } from 'expo-av';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radius, SimulatorColors } from '@/constants/theme';
import { patientStateDefaults } from '@/data/patientStateDefaults';
import { roles } from '@/data/roles';
import { safeLanguage } from '@/data/safeLanguage';
import { scenarioHints } from '@/data/scenarioHints';
import { scenarioTemplates } from '@/data/scenarioTemplates';
import { fetchPatientResponse } from '@/services/aiPatientService';
import { fetchCoachHint } from '@/services/aiCoachService';
import { checkMedicationSafety } from '@/services/medicationSafetyService';
import { updateScenarioPatientState } from '@/services/patientStateDispatcher';
import { generateScenarioResponse } from '@/services/scenarioResponseService';
import { startRecording, stopAndTranscribe, speakText } from '@/services/voiceService';
import { useSimulator } from '@/state/SimulatorContext';
import type {
  ConversationMessage,
  PatientState,
  PatientStateSnapshot,
  SafetyEvent,
} from '@/types/simulator';

const MEDICATION_FALLBACK_MESSAGE =
  'That response gives medication guidance outside your selected role. Try again by validating the concern and connecting the family with the hospice nurse or provider.';

export default function SimulationScreen() {
  const {
    selectedRoleId,
    selectedScenarioId,
    conversationMessages,
    currentPatientState,
    startSimulationSession,
    appendConversationMessages,
    appendSafetyEvent,
    setCurrentPatientState,
    appendPatientStateSnapshot,
  } = useSimulator();

  const scenario = selectedScenarioId
    ? (scenarioTemplates.find((s) => s.id === selectedScenarioId) ?? null)
    : null;

  const role = selectedRoleId
    ? (roles.find((r) => r.id === selectedRoleId) ?? null)
    : null;

  const [inputText, setInputText] = useState('');
  const [hintVisible, setHintVisible] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const lastHintMsgCount = useRef(-1);
  const scrollViewRef = useRef<ScrollView>(null);

  // AI patient response states
  const [isPatientTyping, setIsPatientTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Voice mode states
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);

  // Patient state panel
  const [patientPanelOpen, setPatientPanelOpen] = useState(false);

  // Static fallback phrases
  const hintIds = scenario ? (scenarioHints[scenario.id] ?? []) : [];
  const staticFallback = hintIds.length > 0
    ? (safeLanguage.find((e) => e.id === hintIds[0])?.text ?? null)
    : null;

  function handleHint() {
    if (!hintVisible) {
      setHintVisible(true);
      const currentCount = conversationMessages.length;
      if (currentCount !== lastHintMsgCount.current && scenario) {
        setHintLoading(true);
        setAiHint(null);
        void fetchCoachHint({
          scenarioId: scenario.id,
          scenarioTitle: scenario.title,
          role: role?.name ?? selectedRoleId ?? 'clinician',
          learnerObjective: scenario.learnerObjective,
          recentMessages: conversationMessages.slice(-4),
        }).then((hint) => {
          lastHintMsgCount.current = currentCount;
          setAiHint(hint ?? staticFallback);
          setHintLoading(false);
        });
      }
    } else {
      setHintVisible(false);
    }
  }

  async function handleSend(textOverride?: string) {
    if (!scenario || !selectedRoleId) return;
    const text = (textOverride ?? inputText).trim();
    if (!text || isSending || isPatientTyping) return;

    const scenarioId = scenario.id;
    const now = Date.now();
    const msgCount = conversationMessages.length;

    setIsSending(true);

    const newMessage: ConversationMessage = {
      id: `${now}-${msgCount}`,
      sender: 'learner',
      speakerName: role?.name ?? 'You',
      text,
      createdAt: new Date().toISOString(),
    };

    const safetyResult = checkMedicationSafety(text, selectedRoleId, roles);

    if (safetyResult.trainingPauseRequired) {
      const pauseMessage: ConversationMessage = {
        id: `${now}-${msgCount + 1}`,
        sender: 'system',
        speakerName: 'Training Pause',
        text: safetyResult.message ?? MEDICATION_FALLBACK_MESSAGE,
        createdAt: new Date().toISOString(),
      };
      const safetyEvent: SafetyEvent = {
        id: `${now}-safety`,
        scenarioId,
        learnerMessageText: text,
        violationCategory: safetyResult.violationCategory ?? 'medication_outside_role',
        severity: safetyResult.severity ?? 'critical_simulation_stop',
        message: safetyResult.message ?? MEDICATION_FALLBACK_MESSAGE,
        feedbackHook: safetyResult.feedbackHook ?? null,
        createdAt: new Date().toISOString(),
      };
      appendConversationMessages([newMessage, pauseMessage]);
      appendSafetyEvent(safetyEvent);
      setInputText('');
      setIsSending(false);
      return;
    }

    // Update hidden patient state
    const initialFallback: PatientState =
      (patientStateDefaults as Record<string, PatientState | undefined>)[
        scenario.patientStateDefaultId
      ] ?? patientStateDefaults.hospice_means_giving_up;
    const stateBefore: PatientState = currentPatientState ?? initialFallback;
    const result = updateScenarioPatientState(scenarioId, stateBefore, text, conversationMessages);
    setCurrentPatientState(result.updatedState);

    const snapshot: PatientStateSnapshot = {
      id: `${now}-snapshot`,
      scenarioId,
      learnerMessageId: newMessage.id,
      stateBefore: { ...stateBefore },
      stateAfter: { ...result.updatedState },
      detectedBehaviors: result.detectedBehaviors,
      stateChangeSummary: result.stateChangeSummary,
      createdAt: new Date().toISOString(),
    };
    appendPatientStateSnapshot(snapshot);

    // Append learner message immediately
    appendConversationMessages([newMessage]);
    setInputText('');
    setIsSending(false);

    // Get AI patient response
    setIsPatientTyping(true);
    try {
      const historyWithLearner = [...conversationMessages, newMessage];
      const aiText = await fetchPatientResponse({
        scenarioId: scenario.id,
        diagnosisId: scenario.knownDiagnosisId,
        scenarioTitle: scenario.title,
        openingSpeakerName: scenario.openingSpeakerName,
        role: role?.name ?? selectedRoleId ?? 'clinician',
        learnerObjective: scenario.learnerObjective,
        patientState: result.updatedState,
        conversationHistory: historyWithLearner,
      });

      let responseText: string;
      let responseSender: 'patient' | 'family';
      let responseSpeakerName: string;

      if (aiText) {
        responseText = aiText;
        responseSender = 'family';
        responseSpeakerName = scenario.openingSpeakerName;
      } else {
        const fallback = generateScenarioResponse(scenarioId, text, historyWithLearner);
        responseText = fallback.text;
        responseSender = fallback.sender;
        responseSpeakerName = fallback.speakerName;
      }

      const responseMessage: ConversationMessage = {
        id: `${Date.now()}-response`,
        sender: responseSender,
        speakerName: responseSpeakerName,
        text: responseText,
        createdAt: new Date().toISOString(),
      };
      appendConversationMessages([responseMessage]);

      if (voiceEnabled && aiText) {
        void speakText(responseText);
      }
    } finally {
      setIsPatientTyping(false);
    }
  }

  async function handleMicPress() {
    if (isRecording) {
      setIsRecording(false);
      setIsTranscribing(true);
      try {
        if (recordingRef.current) {
          const transcript = await stopAndTranscribe(recordingRef.current);
          recordingRef.current = null;
          if (transcript) {
            await handleSend(transcript);
          }
        }
      } finally {
        setIsTranscribing(false);
      }
    } else {
      try {
        const rec = await startRecording();
        recordingRef.current = rec;
        setIsRecording(true);
      } catch {
        // Permission denied — silently fall back to text mode
        setVoiceEnabled(false);
      }
    }
  }

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [conversationMessages.length, isPatientTyping]);

  useEffect(() => {
    if (!scenario) return;
    const openingMessage: ConversationMessage = {
      id: `${Date.now()}-0`,
      sender: 'family',
      speakerName: scenario.openingSpeakerName,
      text: scenario.openingLine,
      createdAt: new Date().toISOString(),
    };
    const initialPatientState: PatientState =
      (patientStateDefaults as Record<string, PatientState | undefined>)[
        scenario.patientStateDefaultId
      ] ?? patientStateDefaults.hospice_means_giving_up;
    startSimulationSession(scenario.id, openingMessage, initialPatientState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario?.id]);

  if (!selectedRoleId) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerContainer}>
          <Text style={styles.centerText}>
            Please select a role before starting a simulation.
          </Text>
          <Pressable style={styles.button} accessibilityRole="button" onPress={() => router.push('/role' as Href)}>
            <Text style={styles.buttonText}>Go to Role Selection</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!selectedScenarioId) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerContainer}>
          <Text style={styles.centerText}>
            Please select a scenario before starting a simulation.
          </Text>
          <Pressable style={styles.button} accessibilityRole="button" onPress={() => router.push('/scenario' as Href)}>
            <Text style={styles.buttonText}>Go to Scenario Selection</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!scenario) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerContainer}>
          <Text style={styles.centerText}>
            Scenario not found. Please select a scenario.
          </Text>
          <Pressable style={styles.button} accessibilityRole="button" onPress={() => router.push('/scenario' as Href)}>
            <Text style={styles.buttonText}>Go to Scenario Selection</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {scenario.title}
            </Text>
            <Text style={styles.headerMeta} numberOfLines={1}>
              {role?.name ?? 'Learner'} · {scenario.setting} ·{' '}
              {scenario.patient.name}, age {scenario.patient.age}
            </Text>
          </View>
          <Pressable
            style={styles.finishButton}
            accessibilityRole="button"
            accessibilityLabel="Finish simulation and view feedback"
            onPress={() => router.push('/feedback' as Href)}>
            <Text style={styles.finishButtonText}>Finish</Text>
          </Pressable>
        </View>

        {/* Role reminder */}
        <View style={styles.reminder}>
          <Text style={styles.reminderLabel}>Role reminder</Text>
          <Text style={styles.reminderText} numberOfLines={4}>{scenario.roleReminder}</Text>
        </View>

        {/* Patient state panel */}
        {currentPatientState != null && (
          <PatientStatePanel
            state={currentPatientState}
            open={patientPanelOpen}
            onToggle={() => setPatientPanelOpen((v) => !v)}
          />
        )}

        {/* Chat area */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatContent}>
          {conversationMessages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isPatientTyping && <TypingBubble speakerName={scenario.openingSpeakerName} />}
        </ScrollView>

        {/* Hint banner */}
        {hintVisible && (
          <View style={styles.hintBanner}>
            <View style={styles.hintHeader}>
              <Text style={styles.hintLabel}>AI Coach</Text>
              <Pressable
                onPress={() => setHintVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Dismiss hint">
                <Text style={styles.hintDismiss}>✕</Text>
              </Pressable>
            </View>
            {hintLoading && aiHint == null ? (
              <View style={styles.hintLoadingRow}>
                <ActivityIndicator size="small" color={SimulatorColors.indigoLabel} />
                <Text style={styles.hintLoadingText}>Getting coaching tip...</Text>
              </View>
            ) : (
              <Text style={styles.hintText}>{aiHint ?? 'Try acknowledging the concern before explaining.'}</Text>
            )}
          </View>
        )}

        {/* Input bar */}
        <View style={styles.inputBar}>
          {scenario != null && (
            <Pressable
              style={[styles.hintButton, hintLoading && styles.hintButtonLoading]}
              accessibilityRole="button"
              accessibilityLabel="Get AI coaching hint"
              onPress={handleHint}>
              <Text style={styles.hintButtonText}>Hint</Text>
            </Pressable>
          )}

          {voiceEnabled ? (
            <Pressable
              style={[
                styles.micButton,
                isRecording && styles.micButtonRecording,
                isTranscribing && styles.micButtonTranscribing,
              ]}
              accessibilityRole="button"
              accessibilityLabel={isRecording ? 'Stop recording' : 'Start recording'}
              disabled={isTranscribing || isPatientTyping || isSending}
              onPress={() => { void handleMicPress(); }}>
              {isTranscribing ? (
                <ActivityIndicator size="small" color={SimulatorColors.textOnBrand} />
              ) : (
                <Text style={styles.micButtonText}>
                  {isRecording ? '⏹ Stop' : '🎤 Speak'}
                </Text>
              )}
            </Pressable>
          ) : (
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your response..."
              placeholderTextColor={SimulatorColors.textPlaceholder}
              accessibilityLabel="Type your response"
              multiline
              maxLength={500}
            />
          )}

          <Pressable
            style={[styles.voiceToggle, voiceEnabled && styles.voiceToggleActive]}
            accessibilityRole="button"
            accessibilityLabel={voiceEnabled ? 'Switch to text mode' : 'Switch to voice mode'}
            onPress={() => {
              if (voiceEnabled && isRecording && recordingRef.current) {
                void recordingRef.current.stopAndUnloadAsync().catch(() => null);
                recordingRef.current = null;
                setIsRecording(false);
              }
              setVoiceEnabled((v) => !v);
            }}>
            <Text style={[styles.voiceToggleText, voiceEnabled && styles.voiceToggleTextActive]}>
              {voiceEnabled ? '🎤' : '🎤'}
            </Text>
          </Pressable>

          {!voiceEnabled && (
            <Pressable
              style={[
                styles.sendButton,
                (!inputText.trim() || isSending || isPatientTyping) && styles.sendButtonDisabled,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Send response"
              accessibilityState={{ disabled: !inputText.trim() || isSending || isPatientTyping }}
              onPress={() => { void handleSend(); }}
              disabled={!inputText.trim() || isSending || isPatientTyping}>
              {isSending ? (
                <ActivityIndicator size="small" color={SimulatorColors.textOnBrand} />
              ) : (
                <Text style={styles.sendButtonText}>Send</Text>
              )}
            </Pressable>
          )}
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function TypingBubble({ speakerName }: { speakerName: string }) {
  return (
    <View style={bubbleStyles.container}>
      <Text style={bubbleStyles.speakerName}>{speakerName}</Text>
      <View style={[bubbleStyles.bubble, bubbleStyles.bubbleFamily, typingStyles.bubble]}>
        <Text style={typingStyles.dots}>• • •</Text>
      </View>
    </View>
  );
}

function PatientStatePanel({
  state,
  open,
  onToggle,
}: {
  state: PatientState;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={panelStyles.container}>
      <Pressable style={panelStyles.header} accessibilityRole="button" onPress={onToggle}>
        <Text style={panelStyles.headerLabel}>Patient Signals</Text>
        <Text style={panelStyles.toggle}>{open ? '▲' : '▼'}</Text>
      </Pressable>
      {open && (
        <View style={panelStyles.bars}>
          <SignalBar label="Trust" value={state.trust} positiveHigh />
          <SignalBar label="Fear" value={state.fear} positiveHigh={false} />
          <SignalBar label="Understanding" value={state.understanding} positiveHigh />
          <SignalBar label="Readiness" value={state.readiness} positiveHigh />
        </View>
      )}
    </View>
  );
}

function SignalBar({
  label,
  value,
  positiveHigh,
}: {
  label: string;
  value: number;
  positiveHigh: boolean;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const fillColor =
    positiveHigh
      ? pct >= 60 ? SimulatorColors.scoreGreen : pct >= 35 ? SimulatorColors.scoreYellow : SimulatorColors.scoreOrange
      : pct >= 60 ? SimulatorColors.scoreOrange : pct >= 35 ? SimulatorColors.scoreYellow : SimulatorColors.scoreGreen;

  return (
    <View style={panelStyles.barRow}>
      <Text style={panelStyles.barLabel}>{label}</Text>
      <View style={panelStyles.barTrack}>
        <View style={[panelStyles.barFill, { width: `${pct}%` as `${number}%`, backgroundColor: fillColor }]} />
      </View>
      <Text style={panelStyles.barValue}>{pct}</Text>
    </View>
  );
}

function MessageBubble({ message }: { message: ConversationMessage }) {
  if (message.sender === 'system') {
    return (
      <View style={systemStyles.container}>
        <Text style={systemStyles.label}>{message.speakerName}</Text>
        <Text style={systemStyles.text}>{message.text}</Text>
      </View>
    );
  }

  const isLearner = message.sender === 'learner';
  return (
    <View style={[bubbleStyles.container, isLearner && bubbleStyles.containerRight]}>
      {!isLearner && (
        <Text style={bubbleStyles.speakerName}>{message.speakerName}</Text>
      )}
      <View
        style={[
          bubbleStyles.bubble,
          isLearner ? bubbleStyles.bubbleLearner : bubbleStyles.bubbleFamily,
        ]}>
        <Text style={[bubbleStyles.text, isLearner && bubbleStyles.textLearner]}>
          {message.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SimulatorColors.screenBackground,
  },
  flex: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  centerText: {
    fontSize: 16,
    color: SimulatorColors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 15,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: SimulatorColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: SimulatorColors.border,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
    marginBottom: 2,
  },
  headerMeta: {
    fontSize: 12,
    color: SimulatorColors.textSecondary,
  },
  finishButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: SimulatorColors.brand,
    backgroundColor: SimulatorColors.screenBackground,
  },
  finishButtonText: {
    fontSize: 14,
    color: SimulatorColors.brand,
    fontWeight: '600',
  },
  reminder: {
    backgroundColor: SimulatorColors.indigoBackground,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: SimulatorColors.indigoBorder,
  },
  reminderLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: SimulatorColors.indigoLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  reminderText: {
    fontSize: 13,
    color: SimulatorColors.indigoText,
    lineHeight: 19,
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    gap: 12,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: SimulatorColors.surface,
    borderTopWidth: 1,
    borderTopColor: SimulatorColors.border,
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: SimulatorColors.screenBackground,
    borderWidth: 1,
    borderColor: SimulatorColors.borderInput,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 15,
    color: SimulatorColors.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 58,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: SimulatorColors.brandDisabled,
  },
  sendButtonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 15,
    fontWeight: '600',
  },
  hintButton: {
    backgroundColor: SimulatorColors.indigoBackground,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: SimulatorColors.indigoBorder,
  },
  hintButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: SimulatorColors.indigoLabel,
  },
  hintBanner: {
    backgroundColor: SimulatorColors.indigoBackground,
    borderTopWidth: 1,
    borderTopColor: SimulatorColors.indigoBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
  },
  hintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hintLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.indigoLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  hintDismiss: {
    fontSize: 14,
    color: SimulatorColors.textSecondary,
    paddingHorizontal: 4,
  },
  hintText: {
    fontSize: 14,
    color: SimulatorColors.indigoText,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  hintLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  hintLoadingText: {
    fontSize: 13,
    color: SimulatorColors.indigoLabel,
    fontStyle: 'italic',
  },
  hintButtonLoading: {
    opacity: 0.6,
  },
  micButton: {
    flex: 1,
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  micButtonRecording: {
    backgroundColor: SimulatorColors.scoreOrange,
  },
  micButtonTranscribing: {
    backgroundColor: SimulatorColors.brandDisabled,
  },
  micButtonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 15,
    fontWeight: '600',
  },
  voiceToggle: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: SimulatorColors.borderInput,
    backgroundColor: SimulatorColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceToggleActive: {
    backgroundColor: SimulatorColors.indigoBackground,
    borderColor: SimulatorColors.indigoBorder,
  },
  voiceToggleText: {
    fontSize: 16,
    opacity: 0.4,
  },
  voiceToggleTextActive: {
    opacity: 1,
  },
});

const typingStyles = StyleSheet.create({
  bubble: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  dots: {
    fontSize: 18,
    color: SimulatorColors.textSecondary,
    letterSpacing: 3,
  },
});

const panelStyles = StyleSheet.create({
  container: {
    backgroundColor: SimulatorColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: SimulatorColors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  toggle: {
    fontSize: 10,
    color: SimulatorColors.textSecondary,
  },
  bars: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 6,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barLabel: {
    fontSize: 12,
    color: SimulatorColors.textSecondary,
    width: 88,
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: SimulatorColors.borderDivider,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  barValue: {
    fontSize: 11,
    fontWeight: '600',
    color: SimulatorColors.textSecondary,
    width: 26,
    textAlign: 'right',
  },
});

const systemStyles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    backgroundColor: SimulatorColors.warningBackground,
    borderWidth: 1,
    borderColor: SimulatorColors.warningBorder,
    borderRadius: Radius.md,
    padding: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.warningLabelText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: SimulatorColors.warningBodyText,
    lineHeight: 20,
  },
});

const bubbleStyles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  containerRight: {
    alignItems: 'flex-end',
  },
  speakerName: {
    fontSize: 11,
    fontWeight: '600',
    color: SimulatorColors.textSecondary,
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  bubble: {
    borderRadius: Radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '80%',
  },
  bubbleFamily: {
    backgroundColor: SimulatorColors.surface,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
  },
  bubbleLearner: {
    backgroundColor: SimulatorColors.brand,
  },
  text: {
    fontSize: 15,
    color: SimulatorColors.textPrimary,
    lineHeight: 22,
  },
  textLearner: {
    color: SimulatorColors.textOnBrand,
  },
});
