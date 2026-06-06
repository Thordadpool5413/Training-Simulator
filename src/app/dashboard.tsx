import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { generateDashboardSummary } from '@/services/dashboardService';
import { useSimulator } from '@/state/SimulatorContext';
import type { DashboardSummary } from '@/types/simulator';

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

        <SectionBlock title="Session">
          <StatRow label="Scenario" value={summary.scenarioTitle} />
          <StatRow label="Role" value={summary.learnerRole} />
          <StatRow label="Scenarios Completed" value={String(summary.completedScenarios)} />
        </SectionBlock>

        <SectionBlock title="Skill Summary">
          <StatRow label="Average Score" value={`${summary.averageScore.toFixed(1)} / 4`} />
          <StatRow label="Strongest Skill" value={summary.strongestSkill} stacked />
          <StatRow label="Growth Area" value={summary.mainGrowthArea} stacked />
        </SectionBlock>

        <SectionBlock title="Safety">
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
        </SectionBlock>

        <SectionBlock title="Next Steps">
          <StatRow label="Next Recommended Scenario" value={summary.nextRecommendedScenario} stacked />
          <View style={styles.practiceBlock}>
            <Text style={styles.practiceLabel}>Next Practice Focus</Text>
            <Text style={styles.practiceText}>{summary.nextPracticeFocus}</Text>
          </View>
        </SectionBlock>

        <Pressable
          style={[styles.button, styles.returnButton]}
          onPress={() => router.push('/role' as Href)}>
          <Text style={styles.buttonText}>Return to Role Selection</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={sectionStyles.container}>
      <Text style={sectionStyles.title}>{title}</Text>
      {children}
    </View>
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
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 48,
    gap: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  summaryText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 23,
  },
  practiceBlock: {
    gap: 4,
  },
  practiceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  practiceText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  amberBadge: {
    backgroundColor: '#F59E0B',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  amberBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  returnButton: {
    marginTop: 4,
  },
  buttonText: {
    color: '#FFFFFF',
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
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
});

const sectionStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
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
    color: '#6B7280',
    flex: 1,
  },
  labelStacked: {
    flex: 0,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  valueStacked: {
    flex: 0,
    textAlign: 'left',
  },
});
