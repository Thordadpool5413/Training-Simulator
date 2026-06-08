import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
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
import { scenarioTemplates } from '@/data/scenarioTemplates';
import { checkMedicationSafety } from '@/services/medicationSafetyService';
import { updateScenarioPatientState } from '@/services/patientStateDispatcher';
import { generateScenarioResponse } from '@/services/scenarioResponseService';
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
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [conversationMessages.length]);

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
          <Pressable style={styles.button} onPress={() => router.push('/role' as Href)}>
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
          <Pressable style={styles.button} onPress={() => router.push('/scenario' as Href)}>
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
          <Pressable style={styles.button} onPress={() => router.push('/scenario' as Href)}>
            <Text style={styles.buttonText}>Go to Scenario Selection</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  function handleSend() {
    if (!scenario) return;
    if (!selectedRoleId) return;
    const scenarioId = scenario.id;
    const trimmed = inputText.trim();
    if (!trimmed) return;
    const now = Date.now();
    const newMessage: ConversationMessage = {
      id: `${now}-${conversationMessages.length}`,
      sender: 'learner',
      speakerName: role?.name ?? 'You',
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    const safetyResult = checkMedicationSafety(trimmed, selectedRoleId, roles);

    if (safetyResult.trainingPauseRequired) {
      const pauseMessage: ConversationMessage = {
        id: `${now}-${conversationMessages.length + 1}`,
        sender: 'system',
        speakerName: 'Training Pause',
        text: safetyResult.message ?? MEDICATION_FALLBACK_MESSAGE,
        createdAt: new Date().toISOString(),
      };
      const safetyEvent: SafetyEvent = {
        id: `${now}-safety`,
        scenarioId,
        learnerMessageText: trimmed,
        violationCategory: safetyResult.violationCategory ?? 'medication_outside_role',
        severity: safetyResult.severity ?? 'critical_simulation_stop',
        message: safetyResult.message ?? MEDICATION_FALLBACK_MESSAGE,
        feedbackHook: safetyResult.feedbackHook ?? null,
        createdAt: new Date().toISOString(),
      };
      appendConversationMessages([newMessage, pauseMessage]);
      appendSafetyEvent(safetyEvent);
      setInputText('');
      return;
    }

    // Safe path — update hidden patient state before generating response
    const initialFallback: PatientState =
      (patientStateDefaults as Record<string, PatientState | undefined>)[
        scenario.patientStateDefaultId
      ] ?? patientStateDefaults.hospice_means_giving_up;
    const stateBefore: PatientState = currentPatientState ?? initialFallback;

    const result = updateScenarioPatientState(scenarioId, stateBefore, trimmed, conversationMessages);
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

    const response = generateScenarioResponse(scenarioId, trimmed, conversationMessages);
    const responseMessage: ConversationMessage = {
      id: `${now}-${conversationMessages.length + 1}`,
      sender: response.sender,
      speakerName: response.speakerName,
      text: response.text,
      createdAt: new Date().toISOString(),
    };
    appendConversationMessages([newMessage, responseMessage]);
    setInputText('');
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
              {role?.name ?? selectedRoleId} · {scenario.setting} ·{' '}
              {scenario.patient.name}, age {scenario.patient.age}
            </Text>
          </View>
          <Pressable
            style={styles.finishButton}
            onPress={() => router.push('/feedback' as Href)}>
            <Text style={styles.finishButtonText}>Finish</Text>
          </Pressable>
        </View>

        {/* Role reminder */}
        <View style={styles.reminder}>
          <Text style={styles.reminderLabel}>Role reminder</Text>
          <Text style={styles.reminderText}>{scenario.roleReminder}</Text>
        </View>

        {/* Chat area */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatContent}>
          {conversationMessages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </ScrollView>

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your response..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={500}
          />
          <Pressable
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}>
            <Text style={styles.sendButtonText}>Send</Text>
          </Pressable>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
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
    borderColor: SimulatorColors.textBody,
    backgroundColor: SimulatorColors.screenBackground,
  },
  finishButtonText: {
    fontSize: 14,
    color: SimulatorColors.textBody,
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
  },
  sendButtonDisabled: {
    backgroundColor: SimulatorColors.brandDisabled,
  },
  sendButtonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 15,
    fontWeight: '600',
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
