import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SectionCard } from '@/components/SectionCard';
import { Radius, SimulatorColors } from '@/constants/theme';
import { computeAnalytics } from '@/services/analyticsService';
import type { ImprovementTrend } from '@/services/analyticsService';
import { useSimulator } from '@/state/SimulatorContext';

export default function AnalyticsScreen() {
  const { completedSessions } = useSimulator();
  const analytics = useMemo(() => computeAnalytics(completedSessions), [completedSessions]);

  if (analytics.totalSessions === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyContainer}>
          <Pressable style={styles.backLink} accessibilityRole="button" onPress={() => router.back()}>
            <Text style={styles.backLinkText}>← Back</Text>
          </Pressable>
          <Text style={styles.emptyText}>No sessions yet — complete a simulation to see analytics.</Text>
          <Pressable style={styles.button} accessibilityRole="button" onPress={() => router.push('/role')}>
            <Text style={styles.buttonText}>Start Practice</Text>
          </Pressable>
        </View>
      </SafeAreaView>
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

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable style={styles.backLink} accessibilityRole="button" onPress={() => router.back()}>
          <Text style={styles.backLinkText}>← Back</Text>
        </Pressable>

        <Text style={styles.title} accessibilityRole="header">Progress Analytics</Text>

        {/* Summary stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{analytics.totalSessions}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{analytics.averageScore.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Avg Score / 4</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{analytics.bestScore.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Best Score</Text>
          </View>
        </View>

        <View style={[styles.trendBadge, { borderColor: trendColor[analytics.improvementTrend] }]}>
          <Text style={[styles.trendText, { color: trendColor[analytics.improvementTrend] }]}>
            {trendLabel[analytics.improvementTrend]}
          </Text>
        </View>

        {/* Score history */}
        <SectionCard title="Score History">
          {analytics.scoreHistory.map((entry, i) => {
            const barPct = Math.max(4, Math.round((entry.score / 4) * 100));
            const barColor =
              entry.score >= 3 ? SimulatorColors.scoreGreen
              : entry.score >= 2 ? SimulatorColors.brand
              : SimulatorColors.scoreOrange;
            const date = new Date(entry.completedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });
            return (
              <View key={i} style={historyStyles.row}>
                <View style={historyStyles.meta}>
                  <Text style={historyStyles.title} numberOfLines={1}>{entry.title}</Text>
                  <Text style={historyStyles.date}>{date}</Text>
                </View>
                <View style={historyStyles.barArea}>
                  <View style={historyStyles.track}>
                    <View
                      style={[historyStyles.fill, { width: `${barPct}%` as `${number}%`, backgroundColor: barColor }]}
                    />
                  </View>
                  <Text style={[historyStyles.score, { color: barColor }]}>
                    {entry.score.toFixed(1)}
                  </Text>
                </View>
              </View>
            );
          })}
        </SectionCard>

        {/* Skill averages (only shown if skillScores are available) */}
        {analytics.skillAverages.length > 0 && (
          <SectionCard title="Skill Averages">
            {analytics.skillAverages
              .sort((a, b) => b.average - a.average)
              .map((skill, i) => {
                const pct = Math.max(4, Math.round((skill.average / 4) * 100));
                const color =
                  skill.average >= 3 ? SimulatorColors.scoreGreen
                  : skill.average >= 2 ? SimulatorColors.brand
                  : SimulatorColors.scoreOrange;
                return (
                  <View key={i} style={skillStyles.row}>
                    <Text style={skillStyles.label} numberOfLines={1}>{skill.category}</Text>
                    <View style={skillStyles.track}>
                      <View
                        style={[skillStyles.fill, { width: `${pct}%` as `${number}%`, backgroundColor: color }]}
                      />
                    </View>
                    <Text style={[skillStyles.value, { color }]}>{skill.average.toFixed(1)}</Text>
                  </View>
                );
              })}
          </SectionCard>
        )}
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
    gap: 10,
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
    fontSize: 24,
    fontWeight: '700',
    color: SimulatorColors.brand,
  },
  statLabel: {
    fontSize: 11,
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
  button: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  buttonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 15,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: SimulatorColors.textSecondary,
    lineHeight: 24,
    marginTop: 24,
    textAlign: 'center',
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
  title: {
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
