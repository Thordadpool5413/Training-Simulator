import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PremiumEmptyState, PremiumPill, PremiumScreen } from '@/components/premium-ui';
import { SectionCard } from '@/components/SectionCard';
import { Radius, SimulatorColors } from '@/constants/theme';
import { roles } from '@/data/roles';
import { scenarioTemplates } from '@/data/scenarioTemplates';
import { generateDashboardSummary } from '@/services/dashboardService';
import { useSimulator } from '@/state/SimulatorContext';
import type { CompletedSession, DashboardSummary } from '@/types/simulator';

export default function DashboardScreen() {
  const {
    activeScenarioId,
    selectedRoleId,
    conversationMessages,
    safetyEvents,
    patientStateSnapshots,
    quizResult,
    completedSessions,
    streakData,
    setSelectedScenarioId,
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

  const hasPriorProgress = completedSessions.length > 0;

  if (!hasSession && !hasPriorProgress) {
    return (
      <PremiumScreen
        eyebrow="Dashboard"
        title="Progress Dashboard"
        subtitle="Track session quality, safety corrections, and your training streak in one place."
        headerRight={<PremiumPill label="No sessions yet" tone="muted" />}>
        <PremiumEmptyState
          icon="📊"
          title="No completed simulations yet"
          body="Complete a scenario to see your progress, streaks, and mastery trends here."
          actionLabel="Start Practice"
          onAction={() => router.push('/role' as Href)}
        />
      </PremiumScreen>
    );
  }

  return (
    <PremiumScreen
      eyebrow="Dashboard"
      title="Progress Dashboard"
      subtitle="Track session quality, safety corrections, and your training streak in one place."
      headerRight={
        streakData.currentStreak > 0 ? (
          <PremiumPill label={`${streakData.currentStreak} day streak`} tone="success" />
        ) : (
          <PremiumPill label="Build your streak" tone="indigo" />
        )
      }>

        {hasSession && summary && (
          <>
            {streakData.currentStreak > 0 && (
              <View style={styles.streakRow}>
                <View style={styles.streakPill}>
                  <Text style={styles.streakPillValue}>{streakData.currentStreak}</Text>
                  <Text style={styles.streakPillLabel}>day streak 🔥</Text>
                </View>
                <View style={styles.streakPill}>
                  <Text style={styles.streakPillValue}>
                    {`${streakData.weeklySessionCount}/${streakData.weeklyGoal}`}
                  </Text>
                  <Text style={styles.streakPillLabel}>this week</Text>
                </View>
              </View>
            )}

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

            {quizResult != null && (
              <SectionCard title="Knowledge Check Score">
                <View style={quizStyles.scoreRow}>
                  <Text style={quizStyles.scoreValue}>
                    {quizResult.score} / {quizResult.totalQuestions}
                  </Text>
                  <View style={[quizStyles.scoreBadge, quizResult.score === quizResult.totalQuestions ? quizStyles.badgePerfect : quizResult.score >= 2 ? quizStyles.badgeGood : quizStyles.badgeLow]}>
                    <Text style={quizStyles.badgeText}>
                      {quizResult.score === quizResult.totalQuestions
                        ? 'Excellent'
                        : quizResult.score >= 2
                        ? 'Good'
                        : 'Needs Review'}
                    </Text>
                  </View>
                </View>
                <Text style={quizStyles.scenarioLabel}>
                  {scenarioTemplates.find((s) => s.id === quizResult.scenarioId)?.title ?? quizResult.scenarioId}
                </Text>
              </SectionCard>
            )}
          </>
        )}

        {hasPriorProgress && (
          <SectionCard title="Scenario Mastery">
            {roles.map((role) => {
              const roleScenarios = scenarioTemplates.filter((s) => s.allowedRoleId === role.id);
              const uniqueDone = new Set(
                completedSessions
                  .filter((cs) => roleScenarios.some((s) => s.id === cs.scenarioId))
                  .map((cs) => cs.scenarioId)
              ).size;
              return (
                <View key={role.id} style={masteryStyles.roleGroup}>
                  <Text style={masteryStyles.roleHeader}>
                    {role.name} — {uniqueDone} / {roleScenarios.length}
                  </Text>
                  {roleScenarios.map((scenario) => {
                    const session = completedSessions.find((s) => s.scenarioId === scenario.id);
                    return (
                      <MasteryRow
                        key={scenario.id}
                        title={scenario.title}
                        session={session}
                      />
                    );
                  })}
                </View>
              );
            })}
          </SectionCard>
        )}

        {hasSession && summary && summary.nextRecommendedScenarioId != null && (
          <Pressable
            style={styles.practiceAgainButton}
            accessibilityRole="button"
            onPress={() => {
              setSelectedScenarioId(summary!.nextRecommendedScenarioId!);
              router.push('/scenario-briefing' as Href);
            }}>
            <Text style={styles.practiceAgainButtonText}>
              Practice: {scenarioTemplates.find((s) => s.id === summary.nextRecommendedScenarioId)?.title ?? 'Next Scenario'}
            </Text>
          </Pressable>
        )}
        <Pressable
          style={[styles.practiceAgainButton, (hasSession && summary?.nextRecommendedScenarioId != null) && styles.secondaryButton]}
          accessibilityRole="button"
          onPress={() => router.push('/scenario' as Href)}>
          <Text style={[styles.practiceAgainButtonText, (hasSession && summary?.nextRecommendedScenarioId != null) && styles.secondaryButtonText]}>
            Browse All Scenarios
          </Text>
        </Pressable>
        {hasPriorProgress && (
          <Pressable
            style={styles.analyticsButton}
            accessibilityRole="button"
            onPress={() => router.push('/analytics' as Href)}>
            <Text style={styles.analyticsButtonText}>View Progress Analytics</Text>
          </Pressable>
        )}
        {hasPriorProgress && (
          <Pressable
            style={styles.certificateButton}
            accessibilityRole="button"
            onPress={() => router.push('/certificate' as Href)}>
            <Text style={styles.certificateButtonText}>Download Training Certificate</Text>
          </Pressable>
        )}
        <Pressable
          style={[styles.button, styles.returnButton]}
          accessibilityRole="button"
          onPress={() => router.push('/role' as Href)}>
          <Text style={styles.buttonText}>Return to Role Selection</Text>
        </Pressable>
    </PremiumScreen>
  );
}

function MasteryRow({ title, session }: { title: string; session: CompletedSession | undefined }) {
  const done = session != null;
  const delta =
    done && session.previousScore != null
      ? session.overallScore - session.previousScore
      : null;
  return (
    <View style={masteryStyles.row}>
      <View style={[masteryStyles.dot, done ? masteryStyles.dotDone : masteryStyles.dotEmpty]} />
      <Text style={[masteryStyles.title, !done && masteryStyles.titleMuted]} numberOfLines={1}>
        {title}
      </Text>
      {done && (
        <View style={masteryStyles.scoreCell}>
          <Text style={masteryStyles.score}>{session.overallScore.toFixed(1)}</Text>
          {delta != null && delta !== 0 && (
            <Text style={[masteryStyles.delta, delta > 0 ? masteryStyles.deltaUp : masteryStyles.deltaDown]}>
              {delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)}
            </Text>
          )}
        </View>
      )}
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
  practiceAgainButton: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  practiceAgainButtonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: SimulatorColors.surface,
    borderWidth: 1,
    borderColor: SimulatorColors.brand,
  },
  secondaryButtonText: {
    color: SimulatorColors.brand,
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
  streakRow: {
    flexDirection: 'row',
    gap: 12,
  },
  streakPill: {
    flex: 1,
    backgroundColor: SimulatorColors.amberBackground,
    borderWidth: 1,
    borderColor: SimulatorColors.amberBorder,
    borderRadius: Radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 2,
  },
  streakPillValue: {
    fontSize: 22,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
  },
  streakPillLabel: {
    fontSize: 12,
    color: SimulatorColors.textSecondary,
    fontWeight: '500',
  },
  analyticsButton: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: SimulatorColors.brand,
  },
  analyticsButtonText: {
    color: SimulatorColors.brand,
    fontSize: 15,
    fontWeight: '600',
  },
  certificateButton: {
    backgroundColor: SimulatorColors.indigoBackground,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: SimulatorColors.indigoBorder,
  },
  certificateButtonText: {
    color: SimulatorColors.indigoText,
    fontSize: 15,
    fontWeight: '600',
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

const quizStyles = StyleSheet.create({
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: '700',
    color: SimulatorColors.brand,
  },
  scoreBadge: {
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgePerfect: {
    backgroundColor: SimulatorColors.greenBackground,
    borderWidth: 1,
    borderColor: SimulatorColors.greenBorder,
  },
  badgeGood: {
    backgroundColor: SimulatorColors.brandTint,
    borderWidth: 1,
    borderColor: SimulatorColors.brand,
  },
  badgeLow: {
    backgroundColor: SimulatorColors.warningBackground,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
  },
  scenarioLabel: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    lineHeight: 19,
  },
});

const masteryStyles = StyleSheet.create({
  roleGroup: {
    marginBottom: 12,
  },
  roleHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: SimulatorColors.brand,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: SimulatorColors.brand,
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: SimulatorColors.borderDivider,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },
  dotDone: {
    backgroundColor: SimulatorColors.scoreGreen,
  },
  dotEmpty: {
    backgroundColor: SimulatorColors.borderDivider,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
  },
  title: {
    flex: 1,
    fontSize: 13,
    color: SimulatorColors.textBody,
    lineHeight: 19,
  },
  titleMuted: {
    color: SimulatorColors.textSecondary,
  },
  scoreCell: {
    alignItems: 'flex-end',
    minWidth: 48,
  },
  score: {
    fontSize: 13,
    fontWeight: '700',
    color: SimulatorColors.brand,
    textAlign: 'right',
  },
  delta: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'right',
  },
  deltaUp: {
    color: SimulatorColors.scoreGreen,
  },
  deltaDown: {
    color: SimulatorColors.scoreOrange,
  },
});
