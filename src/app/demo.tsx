import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radius, SimulatorColors } from '@/constants/theme';
import { useSimulator } from '@/state/SimulatorContext';

const DEMO_STEPS = [
  { icon: '🎭', label: 'Play a hospice clinical liaison' },
  { icon: '💬', label: 'Respond to a real family concern' },
  { icon: '📊', label: 'Get instant coaching feedback' },
];

export default function DemoScreen() {
  const { setSelectedRoleId, setSelectedScenarioId } = useSimulator();

  function handleStartDemo() {
    setSelectedRoleId('clinical_liaison');
    setSelectedScenarioId('hospice_means_giving_up');
    router.replace('/scenario-briefing' as Href);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          style={styles.backLink}
          accessibilityRole="button"
          onPress={() => router.back()}>
          <Text style={styles.backLinkText}>← Back</Text>
        </Pressable>

        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>FREE DEMO</Text>
        </View>

        <Text style={styles.title} accessibilityRole="header">
          Try a simulation — no account needed
        </Text>
        <Text style={styles.subtitle}>
          Experience a real hospice communication training scenario in under 10 minutes.
        </Text>

        <View style={styles.stepsCard}>
          {DEMO_STEPS.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <Text style={styles.stepIcon}>{step.icon}</Text>
              <Text style={styles.stepLabel}>{step.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.scenarioPreview}>
          <Text style={styles.scenarioLabel}>Demo Scenario</Text>
          <Text style={styles.scenarioTitle}>
            "Hospice Means Giving Up"
          </Text>
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
          onPress={handleStartDemo}>
          <Text style={styles.startButtonText}>Start Demo Simulation</Text>
        </Pressable>

        <Text style={styles.disclaimer}>
          This simulation uses fictional training scenarios only. No real patient data required.
        </Text>

        <Pressable
          style={styles.fullAccessButton}
          accessibilityRole="button"
          onPress={() => router.push('/role' as Href)}>
          <Text style={styles.fullAccessText}>Access Full Scenario Library</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
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
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: SimulatorColors.greenBackground,
    borderWidth: 1,
    borderColor: SimulatorColors.greenBorder,
    borderRadius: Radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.greenText,
    letterSpacing: 0.5,
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
