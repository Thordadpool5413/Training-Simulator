import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radius, SimulatorColors } from '@/constants/theme';
import { generateDashboardSummary } from '@/services/dashboardService';
import { useSimulator } from '@/state/SimulatorContext';
import type { DashboardSummary } from '@/types/simulator';
import { SectionCard } from '@/components/SectionCard';

export default function DashboardScreen() {
  const {
    activeScenarioId,
    selectedRoleId,
    conversationMessages,
    safetyEvents,
    patientStateSnapshots,
  } = useSimulator();

  const hasSession =
    !!activeScenarioId && conversationMessages.some((m) => m.sender === 'learner');

  const summary = useMemo<DashboardSummary | null>(() => {
    if (!activeScenarioId || !conversationMessages.some((m) => m.sender === 'learner')) return null;
    return generateDashboardSummary(
      activeScenarioId,
      selectedRoleId,
      conversationMessages,
      safetyEvents,
      patientStateSnapshots
    );
  }, [activeScenarioId, selectedRoleId, conversationMessages, safetyEvents, patientStateSnapshots]);

  if (!hasSession || !summary) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No completed simulation yet.</Text>
          <Pressable style={styles.button} onPress={() => router.push('/role' as Href)}>
            <Text style={styles.buttonText}>Start Practice</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>Dashboard</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>{summary.summaryMessage}</Text>
        </View>

        <SectionCard title="Session">
          <StatRow label="Scenario" value={summary.scenarioTitle} />
          <StatRow label="Role" value={summary.learnerRole} />
          <StatRow label="Scenarios Completed" value={String(summary.completedScenarios)} />
        </SectionCard>

        <SectionCard title="Skill Summary">
          <StatRow label="Average Score" value={`${summary.averageScore.toFixed(1)} / 4`} />
          <StatRow label="Strongest Skill" value={summary.strongestSkill} stacked />
          <StatRow label="Growth Area" value={summary.mainGrowthArea} stacked />
        </SectionCard>

        <SectionCard title="Safety">
          <View style={statStyles.row}>
            <Text style={statStyles.label}>Safety Corrections</Text>
            {summary.safetyFlagsResolved > 0 ? (
              <View style={styles.amberBadge}>
                <Text style={styles.amberBadgeText}>{String(summary.safetyFlagsResolved)}</Text>
              </View>
            ) : (
              <Text style={statStyles.value}>{String(summary.safetyFlagsResolved)}</Text>
            )}
          </View>
        </SectionCard>

        <SectionCard title="Next Steps">
          <StatRow label="Next Recommended Scenario" value={summary.nextRecommendedScenario} stacked />
          <View style={styles.practiceBlock}>
            <Text style={styles.practiceLabel}>Next Practice Focus</Text>
            <Text style={styles.practiceText}>{summary.nextPracticeFocus}</Text>
          </View>
        </SectionCard>

        <Pressable
          style={[styles.button, styles.returnButton]}
          onPress={() => router.push('/role' as Href)}>
          <Text style={styles.buttonText}>Return to Role Selection</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatRow({ label, value, stacked = false }: { label: string; value: string; stacked?: boolean }) {
  return (
    <View style={[statStyles.row, stacked && statStyles.rowStacked]}>
      <Text style={[statStyles.label, stacked && statStyles.labelStacked]}>{label}</Text>
      <Text style={[statStyles.value, stacked && statStyles.valueStacked]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SimulatorColors.screenBackground,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 48,
    gap: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
    marginBottom: 8,
  },
  summaryCard: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    padding: 16,
  },
  summaryText: {
    fontSize: 16,
    color: SimulatorColors.textBody,
    lineHeight: 23,
  },
  practiceBlock: {
    gap: 4,
  },
  practiceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: SimulatorColors.textSecondary,
  },
  practiceText: {
    fontSize: 14,
    color: SimulatorColors.textBody,
    lineHeight: 20,
  },
  amberBadge: {
    backgroundColor: SimulatorColors.amberBadge,
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  amberBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
  },
  button: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  returnButton: {
    marginTop: 4,
  },
  buttonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: SimulatorColors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
});

const statStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  rowStacked: {
    flexDirection: 'column',
    gap: 3,
  },
  label: {
    fontSize: 14,
    color: SimulatorColors.textSecondary,
    flex: 1,
  },
  labelStacked: {
    flex: 0,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: SimulatorColors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  valueStacked: {
    flex: 0,
    textAlign: 'left',
  },
});
