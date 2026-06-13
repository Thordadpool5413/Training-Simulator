import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PremiumPill, PremiumScreen } from '@/components/premium-ui';
import { Radius, SimulatorColors } from '@/constants/theme';
import { scenarioTemplates } from '@/data/scenarioTemplates';
import { LEARNING_PATHS, type LearningStage, type RoleLearningPath } from '@/data/learningPaths';
import { useAuth } from '@/state/AuthContext';
import { useSimulator } from '@/state/SimulatorContext';
import type { CompletedSession } from '@/types/simulator';
import { useState } from 'react';

const AUTH_CONFIGURED = !!(process.env.EXPO_PUBLIC_SUPABASE_URL);
const FREE_SCENARIO_ID = 'hospice_means_giving_up';

// --- helpers ---

function completedIdsInStage(
  stage: LearningStage,
  roleId: string,
  sessions: CompletedSession[],
): Set<string> {
  const ids = new Set<string>();
  sessions
    .filter((s) => s.roleId === roleId && stage.scenarioIds.includes(s.scenarioId))
    .forEach((s) => ids.add(s.scenarioId));
  return ids;
}

function stageUnlocked(
  stageIndex: number,
  path: RoleLearningPath,
  roleId: string,
  sessions: CompletedSession[],
): boolean {
  if (stageIndex === 0) return true;
  const prev = path.stages[stageIndex - 1];
  if (!prev) return false;
  return completedIdsInStage(prev, roleId, sessions).size >= path.stages[stageIndex]!.requiredFromPrevious;
}

function bestScoreForScenario(scenarioId: string, roleId: string, sessions: CompletedSession[]): number | null {
  const matches = sessions.filter((s) => s.scenarioId === scenarioId && s.roleId === roleId);
  if (matches.length === 0) return null;
  return Math.max(...matches.map((s) => s.overallScore));
}

function scoreColor(score: number): string {
  if (score >= 3.5) return SimulatorColors.scoreGreen;
  if (score >= 2.5) return SimulatorColors.brand;
  if (score >= 1.5) return SimulatorColors.scoreYellow;
  return SimulatorColors.scoreOrange;
}

// --- screen ---

export default function LearningPathScreen() {
  const { completedSessions, setSelectedRoleId, setSelectedScenarioId, selectedRoleId } = useSimulator();
  const { isSubscribed } = useAuth();

  const defaultRoleId = selectedRoleId ?? 'clinical_liaison';
  const [activeRoleId, setActiveRoleId] = useState<string>(
    LEARNING_PATHS.find((p) => p.roleId === defaultRoleId) ? defaultRoleId : 'clinical_liaison',
  );

  const path = LEARNING_PATHS.find((p) => p.roleId === activeRoleId)!;

  const totalScenarios = path.stages.reduce((n, s) => n + s.scenarioIds.length, 0);
  const totalCompleted = path.stages.reduce((n, s) => {
    return n + completedIdsInStage(s, activeRoleId, completedSessions).size;
  }, 0);

  function handleSelect(scenarioId: string) {
    const isLocked = AUTH_CONFIGURED && !isSubscribed && scenarioId !== FREE_SCENARIO_ID;
    if (isLocked) {
      router.push('/paywall' as Href);
      return;
    }
    setSelectedRoleId(activeRoleId);
    setSelectedScenarioId(scenarioId);
    router.push('/scenario-briefing' as Href);
  }

  // Find the very first "next up" scenario across all unlocked stages
  let foundNextUp = false;

  return (
    <PremiumScreen
      eyebrow="Learning Path"
      title="Structured Progression"
      subtitle="A guided sequence of hospice communication practice from foundations to advanced conversations."
      onBack={() => router.back()}
      backLabel="Back"
      headerRight={<PremiumPill label={`${totalCompleted}/${totalScenarios} complete`} tone="success" />}
      scrollContentStyle={styles.scroll}>

        {/* Role tabs */}
        <View style={styles.roleTabs}>
          {LEARNING_PATHS.map((p) => (
            <Pressable
              key={p.roleId}
              style={[styles.roleTab, activeRoleId === p.roleId && styles.roleTabActive]}
              accessibilityRole="button"
              onPress={() => setActiveRoleId(p.roleId)}>
              <Text style={[styles.roleTabText, activeRoleId === p.roleId && styles.roleTabTextActive]}>
                {p.roleName}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Overall progress bar */}
        <View style={styles.overallProgress}>
          <View style={styles.overallProgressMeta}>
            <Text style={styles.overallProgressLabel}>Overall progress</Text>
            <Text style={styles.overallProgressFraction}>{totalCompleted} / {totalScenarios}</Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: totalScenarios > 0 ? `${(totalCompleted / totalScenarios) * 100}%` as `${number}%` : '0%' },
              ]}
            />
          </View>
        </View>

        {/* Stages */}
        {path.stages.map((stage, stageIndex) => {
          const unlocked = stageUnlocked(stageIndex, path, activeRoleId, completedSessions);
          const completedIds = completedIdsInStage(stage, activeRoleId, completedSessions);
          const prevStage = path.stages[stageIndex - 1];
          const completedInPrev = prevStage
            ? completedIdsInStage(prevStage, activeRoleId, completedSessions).size
            : 0;
          const neededMore = unlocked || !prevStage
            ? 0
            : stage.requiredFromPrevious - completedInPrev;

          return (
            <View key={stage.stageNumber}>
              {/* Gate connector between stages */}
              {stageIndex > 0 && (
                <View style={styles.gate}>
                  <View style={styles.gateLine} />
                  <View style={[
                    styles.gateChip,
                    unlocked ? styles.gateChipUnlocked : styles.gateChipLocked,
                  ]}>
                    <Text style={[
                      styles.gateChipText,
                      unlocked ? styles.gateChipTextUnlocked : styles.gateChipTextLocked,
                    ]}>
                      {unlocked
                        ? '✓ Stage ' + stage.stageNumber + ' unlocked'
                        : `Complete ${neededMore} more in Stage ${stageIndex} to unlock`}
                    </Text>
                  </View>
                  <View style={styles.gateLine} />
                </View>
              )}

              {/* Stage card */}
              <View style={[
                styles.stageCard,
                { borderColor: unlocked ? stage.border : SimulatorColors.border },
                !unlocked && styles.stageCardLocked,
              ]}>
                {/* Stage header */}
                <View style={[styles.stageHeader, { backgroundColor: unlocked ? stage.tint : SimulatorColors.surface }]}>
                  <View style={styles.stageHeaderLeft}>
                    <View style={[styles.stageBadge, { backgroundColor: unlocked ? stage.color : SimulatorColors.textSecondary }]}>
                      <Text style={styles.stageBadgeText}>{stage.stageNumber}</Text>
                    </View>
                    <View style={styles.stageTitleGroup}>
                      <Text style={[styles.stageSubtitle, { color: unlocked ? stage.color : SimulatorColors.textSecondary }]}>
                        {stage.subtitle.toUpperCase()}
                      </Text>
                      <Text style={[styles.stageTitle, !unlocked && styles.stageTitleLocked]}>
                        {stage.title}
                      </Text>
                    </View>
                  </View>
                  {unlocked ? (
                    <View style={styles.stageFraction}>
                      <Text style={[styles.stageFractionText, { color: stage.color }]}>
                        {completedIds.size}/{stage.scenarioIds.length}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.lockIcon}>🔒</Text>
                  )}
                </View>

                {/* Stage description */}
                <Text style={[styles.stageDescription, !unlocked && styles.stageDescriptionLocked]}>
                  {stage.description}
                </Text>

                {/* Stage progress bar (unlocked only) */}
                {unlocked && (
                  <View style={styles.stageProgressTrack}>
                    <View
                      style={[
                        styles.stageProgressFill,
                        { backgroundColor: stage.color },
                        {
                          width: stage.scenarioIds.length > 0
                            ? `${(completedIds.size / stage.scenarioIds.length) * 100}%` as `${number}%`
                            : '0%',
                        },
                      ]}
                    />
                  </View>
                )}

                {/* Scenario rows */}
                <View style={styles.scenarioList}>
                  {stage.scenarioIds.map((scenarioId, idx) => {
                    const template = scenarioTemplates.find((s) => s.id === scenarioId);
                    if (!template) return null;

                    const bestScore = bestScoreForScenario(scenarioId, activeRoleId, completedSessions);
                    const isDone = bestScore !== null;
                    const isSubscriptionLocked = AUTH_CONFIGURED && !isSubscribed && scenarioId !== FREE_SCENARIO_ID;

                    // "Next up" = first incomplete scenario in first unlocked stage
                    const isNextUp = unlocked && !isDone && !foundNextUp;
                    if (isNextUp) foundNextUp = true;

                    return (
                      <Pressable
                        key={scenarioId}
                        style={({ pressed }) => [
                          styles.scenarioRow,
                          idx < stage.scenarioIds.length - 1 && styles.scenarioRowBorder,
                          !unlocked && styles.scenarioRowLocked,
                          pressed && unlocked && styles.scenarioRowPressed,
                        ]}
                        accessibilityRole="button"
                        disabled={!unlocked}
                        onPress={() => handleSelect(scenarioId)}>

                        {/* Number */}
                        <View style={[
                          styles.scenarioNumber,
                          isDone && { backgroundColor: stage.tint, borderColor: stage.border },
                        ]}>
                          <Text style={[styles.scenarioNumberText, isDone && { color: stage.color }]}>
                            {isDone ? '✓' : String(idx + 1)}
                          </Text>
                        </View>

                        {/* Text block */}
                        <View style={styles.scenarioTextBlock}>
                          <Text style={[styles.scenarioTitle, !unlocked && styles.scenarioTitleLocked]} numberOfLines={2}>
                            {template.title}
                          </Text>
                          <Text style={styles.scenarioMeta} numberOfLines={1}>
                            {template.patient.name} · {template.setting}
                          </Text>
                        </View>

                        {/* Right badge */}
                        {!unlocked ? (
                          <Text style={styles.scenarioLockIcon}>🔒</Text>
                        ) : isNextUp ? (
                          <View style={[styles.nextUpBadge, { backgroundColor: stage.color }]}>
                            <Text style={styles.nextUpText}>Next →</Text>
                          </View>
                        ) : isDone ? (
                          <View style={[styles.scoreBadge, { borderColor: scoreColor(bestScore) }]}>
                            <Text style={[styles.scoreBadgeText, { color: scoreColor(bestScore) }]}>
                              {bestScore.toFixed(1)}
                            </Text>
                          </View>
                        ) : isSubscriptionLocked ? (
                          <Text style={styles.scenarioLockIcon}>🔒</Text>
                        ) : (
                          <View style={styles.startBadge}>
                            <Text style={styles.startBadgeText}>Start</Text>
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>
          );
        })}

        {/* Completion callout */}
        {totalCompleted === totalScenarios && totalScenarios > 0 && (
          <View style={styles.completionCard}>
            <Text style={styles.completionIcon}>🎓</Text>
            <Text style={styles.completionTitle}>Path Complete!</Text>
            <Text style={styles.completionBody}>
              You have completed every scenario in the {path.roleName} learning path. Download your certificate.
            </Text>
            <Pressable
              style={styles.completionButton}
              accessibilityRole="button"
              onPress={() => router.push('/certificate' as Href)}>
              <Text style={styles.completionButtonText}>Download Certificate</Text>
            </Pressable>
          </View>
        )}

    </PremiumScreen>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SimulatorColors.screenBackground,
  },
  scroll: {
    padding: 20,
    paddingBottom: 48,
    gap: 16,
  },
  header: {
    gap: 10,
  },
  backLink: {
    alignSelf: 'flex-start',
  },
  backLinkText: {
    fontSize: 14,
    color: SimulatorColors.brand,
    fontWeight: '600',
  },
  headerText: {
    gap: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: SimulatorColors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: SimulatorColors.textSecondary,
    lineHeight: 21,
  },
  roleTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: SimulatorColors.borderInput,
    backgroundColor: SimulatorColors.surface,
  },
  roleTabActive: {
    borderColor: SimulatorColors.brand,
    backgroundColor: SimulatorColors.brandTint,
  },
  roleTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: SimulatorColors.textSecondary,
  },
  roleTabTextActive: {
    color: SimulatorColors.brandDeep,
    fontWeight: '700',
  },
  overallProgress: {
    gap: 8,
  },
  overallProgressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overallProgressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: SimulatorColors.textSecondary,
  },
  overallProgressFraction: {
    fontSize: 13,
    fontWeight: '700',
    color: SimulatorColors.brand,
  },
  progressTrack: {
    height: 8,
    backgroundColor: SimulatorColors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: SimulatorColors.brand,
    borderRadius: 4,
  },
  gate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  gateLine: {
    flex: 1,
    height: 1,
    backgroundColor: SimulatorColors.border,
  },
  gateChip: {
    borderRadius: Radius.lg,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
  },
  gateChipUnlocked: {
    backgroundColor: SimulatorColors.greenBackground,
    borderColor: SimulatorColors.greenBorder,
  },
  gateChipLocked: {
    backgroundColor: SimulatorColors.surface,
    borderColor: SimulatorColors.borderInput,
  },
  gateChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  gateChipTextUnlocked: {
    color: SimulatorColors.scoreGreen,
  },
  gateChipTextLocked: {
    color: SimulatorColors.textSecondary,
  },
  stageCard: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  stageCardLocked: {
    opacity: 0.75,
  },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 14,
  },
  stageHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  stageBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stageBadgeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stageTitleGroup: {
    flex: 1,
    gap: 1,
  },
  stageSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  stageTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
    lineHeight: 22,
  },
  stageTitleLocked: {
    color: SimulatorColors.textSecondary,
  },
  stageFraction: {
    flexShrink: 0,
  },
  stageFractionText: {
    fontSize: 16,
    fontWeight: '800',
  },
  lockIcon: {
    fontSize: 18,
  },
  stageDescription: {
    fontSize: 13,
    color: SimulatorColors.textBody,
    lineHeight: 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  stageDescriptionLocked: {
    color: SimulatorColors.textSecondary,
  },
  stageProgressTrack: {
    height: 4,
    backgroundColor: SimulatorColors.border,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 2,
    overflow: 'hidden',
  },
  stageProgressFill: {
    height: 4,
    borderRadius: 2,
  },
  scenarioList: {
    borderTopWidth: 1,
    borderTopColor: SimulatorColors.borderDivider,
  },
  scenarioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  scenarioRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: SimulatorColors.borderDivider,
  },
  scenarioRowLocked: {
    opacity: 0.5,
  },
  scenarioRowPressed: {
    backgroundColor: SimulatorColors.brandTint,
  },
  scenarioNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: SimulatorColors.borderInput,
    backgroundColor: SimulatorColors.screenBackground,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  scenarioNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: SimulatorColors.textSecondary,
  },
  scenarioTextBlock: {
    flex: 1,
    gap: 2,
  },
  scenarioTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: SimulatorColors.textPrimary,
    lineHeight: 20,
  },
  scenarioTitleLocked: {
    color: SimulatorColors.textSecondary,
  },
  scenarioMeta: {
    fontSize: 12,
    color: SimulatorColors.textSecondary,
    lineHeight: 17,
  },
  scenarioLockIcon: {
    fontSize: 14,
    flexShrink: 0,
  },
  nextUpBadge: {
    borderRadius: Radius.md,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexShrink: 0,
  },
  nextUpText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scoreBadge: {
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexShrink: 0,
  },
  scoreBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  startBadge: {
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: SimulatorColors.borderInput,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexShrink: 0,
  },
  startBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: SimulatorColors.textSecondary,
  },
  completionCard: {
    backgroundColor: SimulatorColors.greenBackground,
    borderWidth: 1.5,
    borderColor: SimulatorColors.greenBorder,
    borderRadius: Radius.lg,
    padding: 24,
    alignItems: 'center',
    gap: 10,
  },
  completionIcon: {
    fontSize: 40,
  },
  completionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: SimulatorColors.greenText,
  },
  completionBody: {
    fontSize: 14,
    color: SimulatorColors.greenText,
    textAlign: 'center',
    lineHeight: 21,
  },
  completionButton: {
    backgroundColor: SimulatorColors.scoreGreen,
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 4,
  },
  completionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
