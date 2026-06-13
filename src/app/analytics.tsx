import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PremiumEmptyState, PremiumPill, PremiumScreen } from '@/components/premium-ui';
import { SectionCard } from '@/components/SectionCard';
import { Radius, SimulatorColors } from '@/constants/theme';
import { roles } from '@/data/roles';
import { SCENARIO_TOPICS, TOPIC_LABELS } from '@/data/scenarioTopics';
import { computeAnalytics } from '@/services/analyticsService';
import type { ImprovementTrend } from '@/services/analyticsService';
import { useSimulator } from '@/state/SimulatorContext';
import type { ScenarioTopic } from '@/types/simulator';

function scoreColor(score: number): string {
  if (score >= 3.5) return SimulatorColors.scoreGreen;
  if (score >= 2.5) return SimulatorColors.brand;
  if (score >= 1.5) return SimulatorColors.scoreYellow;
  return SimulatorColors.scoreOrange;
}

export default function AnalyticsScreen() {
  const { completedSessions, streakData } = useSimulator();
  const analytics = useMemo(() => computeAnalytics(completedSessions), [completedSessions]);

  const topicBreakdown = useMemo(() => {
    const map: Record<string, { count: number; totalScore: number }> = {};
    completedSessions.forEach((s) => {
      const topic = SCENARIO_TOPICS[s.scenarioId];
      if (!topic) return;
      if (!map[topic]) map[topic] = { count: 0, totalScore: 0 };
      map[topic].count++;
      map[topic].totalScore += s.overallScore;
    });
    return Object.entries(map)
      .map(([topic, { count, totalScore }]) => ({
        topic: topic as ScenarioTopic,
        label: TOPIC_LABELS[topic as ScenarioTopic] ?? topic,
        count,
        avgScore: totalScore / count,
      }))
      .sort((a, b) => b.avgScore - a.avgScore);
  }, [completedSessions]);

  const roleBreakdown = useMemo(() => {
    const map: Record<string, { count: number; totalScore: number }> = {};
    completedSessions.forEach((s) => {
      if (!map[s.roleId]) map[s.roleId] = { count: 0, totalScore: 0 };
      map[s.roleId].count++;
      map[s.roleId].totalScore += s.overallScore;
    });
    return Object.entries(map).map(([roleId, { count, totalScore }]) => ({
      roleId,
      roleName: roles.find((r) => r.id === roleId)?.name ?? roleId,
      count,
      avgScore: totalScore / count,
    }));
  }, [completedSessions]);

  if (analytics.totalSessions === 0) {
    return (
      <PremiumScreen
        eyebrow="Analytics"
        title="Progress Analytics"
        subtitle="Complete your first simulation to start tracking progress, skill trends, and role mastery."
        onBack={() => router.back()}
        backLabel="Back"
        headerRight={<PremiumPill label="No data yet" tone="muted" />}>
        <PremiumEmptyState
          icon="📊"
          title="No data yet"
          body="Complete your first simulation to start tracking your progress here."
          actionLabel="Start Practice"
          onAction={() => router.push('/role' as Href)}
        />
      </PremiumScreen>
    );
  }

  const trendLabel: Record<ImprovementTrend, string> = {
    improving: '↑ Improving',
    declining: '↓ Declining',
    stable: '→ Stable',
    insufficient_data: '— More data needed',
  };

  const trendColor: Record<ImprovementTrend, string> = {
    improving: SimulatorColors.scoreGreen,
    declining: SimulatorColors.scoreOrange,
    stable: SimulatorColors.brand,
    insufficient_data: SimulatorColors.textSecondary,
  };

  const trendBg: Record<ImprovementTrend, string> = {
    improving: SimulatorColors.greenBackground,
    declining: '#FEF2F2',
    stable: SimulatorColors.brandTint,
    insufficient_data: SimulatorColors.screenBackground,
  };

  const recentBars = analytics.scoreHistory.slice(-12);

  return (
    <PremiumScreen
      eyebrow="Analytics"
      title="Progress Analytics"
      subtitle="See how your communication skills are trending across sessions and roles."
      onBack={() => router.back()}
      backLabel="Back"
      headerRight={<PremiumPill label={`${analytics.totalSessions} sessions`} tone="success" />}
      scrollContentStyle={styles.content}>

        {/* Hero stat cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{analytics.totalSessions}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: scoreColor(analytics.averageScore) }]}>
              {analytics.averageScore.toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>Avg / 4.0</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: scoreColor(analytics.bestScore) }]}>
              {analytics.bestScore.toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>Best</Text>
          </View>
          {streakData.currentStreak > 0 && (
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: SimulatorColors.amberBadge }]}>
                {streakData.currentStreak}
              </Text>
              <Text style={styles.statLabel}>Day streak</Text>
            </View>
          )}
        </View>

        {/* Trend badge */}
        <View style={[
          styles.trendBadge,
          {
            borderColor: trendColor[analytics.improvementTrend],
            backgroundColor: trendBg[analytics.improvementTrend],
          },
        ]}>
          <Text style={[styles.trendText, { color: trendColor[analytics.improvementTrend] }]}>
            {trendLabel[analytics.improvementTrend]}
          </Text>
        </View>

        {/* Score sparkline */}
        {recentBars.length >= 2 && (
          <SectionCard title="Score Trend">
            <View style={sparkStyles.container}>
              {recentBars.map((entry, i) => {
                const heightPx = Math.max(6, Math.round((entry.score / 4) * 56));
                const color = scoreColor(entry.score);
                return (
                  <View key={i} style={sparkStyles.barWrapper}>
                    <View style={[sparkStyles.bar, { height: heightPx, backgroundColor: color }]} />
                    <Text style={sparkStyles.barScore}>{entry.score.toFixed(1)}</Text>
                  </View>
                );
              })}
            </View>
            <View style={sparkStyles.axisRow}>
              <Text style={sparkStyles.axisLabel}>Oldest</Text>
              <Text style={sparkStyles.axisLabel}>Most recent</Text>
            </View>
          </SectionCard>
        )}

        {/* Topic breakdown */}
        {topicBreakdown.length > 0 && (
          <SectionCard title="By Topic">
            {topicBreakdown.map((item) => {
              const pct = Math.max(4, Math.round((item.avgScore / 4) * 100));
              const color = scoreColor(item.avgScore);
              return (
                <View key={item.topic} style={topicStyles.row}>
                  <View style={topicStyles.meta}>
                    <Text style={topicStyles.label}>{item.label}</Text>
                    <Text style={topicStyles.count}>{item.count} session{item.count !== 1 ? 's' : ''}</Text>
                  </View>
                  <View style={topicStyles.barArea}>
                    <View style={topicStyles.track}>
                      <View style={[topicStyles.fill, { width: `${pct}%` as `${number}%`, backgroundColor: color }]} />
                    </View>
                    <Text style={[topicStyles.score, { color }]}>{item.avgScore.toFixed(1)}</Text>
                  </View>
                </View>
              );
            })}
          </SectionCard>
        )}

        {/* Skill averages */}
        {analytics.skillAverages.length > 0 && (
          <SectionCard title="Skill Averages">
            {analytics.skillAverages
              .sort((a, b) => b.average - a.average)
              .map((skill, i) => {
                const pct = Math.max(4, Math.round((skill.average / 4) * 100));
                const color = scoreColor(skill.average);
                return (
                  <View key={i} style={skillStyles.row}>
                    <Text style={skillStyles.label} numberOfLines={1}>{skill.category}</Text>
                    <View style={skillStyles.track}>
                      <View style={[skillStyles.fill, { width: `${pct}%` as `${number}%`, backgroundColor: color }]} />
                    </View>
                    <Text style={[skillStyles.value, { color }]}>{skill.average.toFixed(1)}</Text>
                  </View>
                );
              })}
          </SectionCard>
        )}

        {/* Role breakdown */}
        {roleBreakdown.length > 1 && (
          <SectionCard title="By Role">
            {roleBreakdown.map((item) => (
              <View key={item.roleId} style={roleStyles.row}>
                <View style={roleStyles.meta}>
                  <Text style={roleStyles.name}>{item.roleName}</Text>
                  <Text style={roleStyles.count}>{item.count} session{item.count !== 1 ? 's' : ''}</Text>
                </View>
                <Text style={[roleStyles.score, { color: scoreColor(item.avgScore) }]}>
                  {item.avgScore.toFixed(1)} avg
                </Text>
              </View>
            ))}
          </SectionCard>
        )}

        {/* Score history */}
        <SectionCard title="Session History">
          {analytics.scoreHistory.slice().reverse().map((entry, i) => {
            const barPct = Math.max(4, Math.round((entry.score / 4) * 100));
            const color = scoreColor(entry.score);
            const date = new Date(entry.completedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });
            return (
              <View key={i} style={historyStyles.row}>
                <View style={historyStyles.meta}>
                  <Text style={historyStyles.histTitle} numberOfLines={1}>{entry.title}</Text>
                  <Text style={historyStyles.date}>{date}</Text>
                </View>
                <View style={historyStyles.barArea}>
                  <View style={historyStyles.track}>
                    <View style={[historyStyles.fill, { width: `${barPct}%` as `${number}%`, backgroundColor: color }]} />
                  </View>
                  <Text style={[historyStyles.score, { color }]}>
                    {entry.score.toFixed(1)}
                  </Text>
                </View>
              </View>
            );
          })}
        </SectionCard>
    </PremiumScreen>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SimulatorColors.screenBackground,
  },
  content: {
    padding: 20,
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
    fontSize: 24,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 3,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: SimulatorColors.brand,
  },
  statLabel: {
    fontSize: 10,
    color: SimulatorColors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  trendBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: Radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  trendText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    padding: 24,
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
  },
  emptyText: {
    fontSize: 15,
    color: SimulatorColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  emptyButtonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 15,
    fontWeight: '600',
  },
});

const sparkStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 68,
    paddingBottom: 4,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 3,
  },
  bar: {
    width: '100%',
    borderRadius: 3,
  },
  barScore: {
    fontSize: 8,
    color: SimulatorColors.textSecondary,
    textAlign: 'center',
  },
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  axisLabel: {
    fontSize: 10,
    color: SimulatorColors.textSecondary,
  },
});

const topicStyles = StyleSheet.create({
  row: {
    gap: 4,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: SimulatorColors.borderDivider,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: SimulatorColors.textPrimary,
  },
  count: {
    fontSize: 11,
    color: SimulatorColors.textSecondary,
  },
  barArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: SimulatorColors.borderDivider,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: 8,
    borderRadius: 4,
  },
  score: {
    fontSize: 13,
    fontWeight: '700',
    width: 28,
    textAlign: 'right',
  },
});

const skillStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: SimulatorColors.borderDivider,
  },
  label: {
    width: 130,
    fontSize: 13,
    color: SimulatorColors.textBody,
  },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: SimulatorColors.borderDivider,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: 8,
    borderRadius: 4,
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    width: 28,
    textAlign: 'right',
  },
});

const roleStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: SimulatorColors.borderDivider,
  },
  meta: {
    gap: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: SimulatorColors.textPrimary,
  },
  count: {
    fontSize: 12,
    color: SimulatorColors.textSecondary,
  },
  score: {
    fontSize: 14,
    fontWeight: '700',
  },
});

const historyStyles = StyleSheet.create({
  row: {
    gap: 4,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: SimulatorColors.borderDivider,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  histTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: SimulatorColors.textPrimary,
    marginRight: 8,
  },
  date: {
    fontSize: 11,
    color: SimulatorColors.textSecondary,
  },
  barArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: SimulatorColors.borderDivider,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: 8,
    borderRadius: 4,
  },
  score: {
    fontSize: 13,
    fontWeight: '700',
    width: 28,
    textAlign: 'right',
  },
});
