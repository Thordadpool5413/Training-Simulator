import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PremiumPill, PremiumScreen } from '@/components/premium-ui';
import { Radius, SimulatorColors } from '@/constants/theme';

const QUICK_START_STEPS = [
  { icon: '🎭', label: 'Choose the role you want to practice' },
  { icon: '💬', label: 'Review the scenario briefing' },
  { icon: '📊', label: 'Start the live conversation flow' },
];

export default function QuickStartScreen() {
  function handleStartPractice() {
    router.replace('/role' as Href);
  }

  return (
    <PremiumScreen
      eyebrow="Quick start"
      title="Launch your first case"
      subtitle="Jump into the real practice flow, or browse the full scenario library first."
      onBack={() => router.back()}
      backLabel="Back"
      headerRight={<PremiumPill label="Practice mode" tone="success" />}
      scrollContentStyle={styles.content}>
      <View style={styles.stepsCard}>
        {QUICK_START_STEPS.map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <Text style={styles.stepIcon}>{step.icon}</Text>
            <Text style={styles.stepLabel}>{step.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.scenarioPreview}>
        <Text style={styles.scenarioLabel}>Starter case</Text>
        <Text style={styles.scenarioTitle}>"Hospice Means Giving Up"</Text>
        <Text style={styles.scenarioMeta}>
          Clinical Liaison · Beginner · Hospital Setting
        </Text>
        <Text style={styles.scenarioDesc}>
          A family member insists that choosing hospice means abandoning their mother. You need to reframe hospice as active comfort care without invalidating their grief.
        </Text>
      </View>

      <Pressable
        style={styles.startButton}
        accessibilityRole="button"
        onPress={handleStartPractice}>
        <Text style={styles.startButtonText}>Open Role Selection</Text>
      </Pressable>

      <Text style={styles.disclaimer}>
        This simulation uses fictional training scenarios only. No real patient data required.
      </Text>

      <Pressable
        style={styles.fullAccessButton}
        accessibilityRole="button"
        onPress={() => router.push('/scenario' as Href)}>
        <Text style={styles.fullAccessText}>Browse Full Scenario Library</Text>
      </Pressable>
    </PremiumScreen>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SimulatorColors.screenBackground,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
    gap: 16,
  },
  backLink: {
    alignSelf: 'flex-start',
  },
  backLinkText: {
    fontSize: 14,
    color: SimulatorColors.brand,
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: SimulatorColors.textSecondary,
    lineHeight: 24,
  },
  stepsCard: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    padding: 20,
    gap: 14,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  stepIcon: {
    fontSize: 22,
    width: 30,
    textAlign: 'center',
  },
  stepLabel: {
    fontSize: 15,
    color: SimulatorColors.textBody,
    fontWeight: '500',
    flex: 1,
  },
  scenarioPreview: {
    backgroundColor: SimulatorColors.brandTint,
    borderWidth: 1,
    borderColor: SimulatorColors.brand,
    borderRadius: Radius.lg,
    padding: 20,
    gap: 6,
  },
  scenarioLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.brandDeep,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scenarioTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
  },
  scenarioMeta: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
  },
  scenarioDesc: {
    fontSize: 14,
    color: SimulatorColors.textBody,
    lineHeight: 21,
    marginTop: 4,
  },
  startButton: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButtonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 17,
    fontWeight: '700',
  },
  disclaimer: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },
  fullAccessButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: SimulatorColors.borderInput,
    backgroundColor: SimulatorColors.surface,
  },
  fullAccessText: {
    fontSize: 14,
    color: SimulatorColors.textSecondary,
    fontWeight: '500',
  },
});
