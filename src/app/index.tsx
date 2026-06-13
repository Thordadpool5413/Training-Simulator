import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  PremiumActionButton,
  PremiumBottomActions,
  PremiumPill,
  PremiumProgressRail,
  PremiumScreen,
  PremiumStatRail,
} from '@/components/premium-ui';
import { Radius, SimulatorColors } from '@/constants/theme';
import { roles } from '@/data/roles';
import { scenarioTemplates } from '@/data/scenarioTemplates';
import { useAuth } from '@/state/AuthContext';
import { useSimulator } from '@/state/SimulatorContext';

const AUTH_CONFIGURED = !!process.env.EXPO_PUBLIC_SUPABASE_URL;

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function scoreColor(score: number): string {
  if (score >= 3.5) return SimulatorColors.scoreGreen;
  if (score >= 2.5) return SimulatorColors.brand;
  if (score >= 1.5) return SimulatorColors.scoreYellow;
  return SimulatorColors.scoreOrange;
}

function formatScore(score: number | null): string {
  return score == null ? '—' : score.toFixed(1);
}

export default function IndexScreen() {
  const {
    streakData,
    learnerProfile,
    completedSessions,
    selectedRoleId,
    setSelectedRoleId,
    setSelectedScenarioId,
  } = useSimulator();
  const { currentStreak, weeklySessionCount, weeklyGoal } = streakData;
  const { isSignedIn, email, subscription, isSubscribed } = useAuth();

  const lastSession = completedSessions.length > 0 ? completedSessions[completedSessions.length - 1] : null;
  const avgScore = completedSessions.length > 0
    ? completedSessions.reduce((s, x) => s + x.overallScore, 0) / completedSessions.length
    : null;
  const bestScore = completedSessions.length > 0
    ? Math.max(...completedSessions.map((s) => s.overallScore))
    : null;

  const activeRoleId = lastSession?.roleId ?? selectedRoleId;
  const roleName = roles.find((r) => r.id === activeRoleId)?.name ?? 'Choose a role';

  const subscriptionLabel = !AUTH_CONFIGURED || !isSignedIn
    ? null
    : isSubscribed
    ? subscription.plan === 'team' ? 'Team plan' : 'Pro access'
    : 'Free trial';

  const showUpgradeBanner = AUTH_CONFIGURED && isSignedIn && !isSubscribed;
  const showCertNudge = completedSessions.length >= 5;
  const progress = weeklyGoal > 0 ? weeklySessionCount / weeklyGoal : 0;

  function handleContinue() {
    if (!lastSession) {
      router.push('/role' as Href);
      return;
    }

    const scenario = scenarioTemplates.find((s) => s.id === lastSession.scenarioId);
    setSelectedRoleId(lastSession.roleId);
    setSelectedScenarioId(lastSession.scenarioId);

    if (scenario) {
      router.push('/scenario-briefing' as Href);
    } else {
      router.push('/scenario' as Href);
    }
  }

  return (
    <PremiumScreen
      eyebrow={greeting()}
      title="Practice Hub"
      subtitle="A clinical command center for hospice communication training, performance trends, and the next best practice step."
      headerRight={
        AUTH_CONFIGURED && isSignedIn ? (
          <View style={styles.accountBar}>
            <Text style={styles.accountEmail} numberOfLines={1}>
              {email}
            </Text>
            {subscriptionLabel && (
              <PremiumPill
                label={subscriptionLabel}
                tone={isSubscribed ? 'success' : 'warning'}
              />
            )}
          </View>
        ) : (
          <PremiumPill label="Offline ready" tone="indigo" />
        )
      }
      scrollContentStyle={styles.content}>
      {showUpgradeBanner && (
        <Pressable
          style={styles.upgradeBanner}
          accessibilityRole="button"
          onPress={() => router.push('/paywall' as Href)}>
          <Text style={styles.upgradeTitle}>Unlock the full simulation library</Text>
          <Text style={styles.upgradeBody}>Start a 7-day free trial for full access, voice mode, and team reporting.</Text>
        </Pressable>
      )}

      <View style={styles.heroShell}>
        <View style={styles.heroHeader}>
          <View style={styles.heroHeadingGroup}>
            <Text style={styles.heroLabel}>Next best action</Text>
            <Text style={styles.heroTitle}>
              {lastSession ? 'Resume your strongest workflow' : 'Begin with a role and first scenario'}
            </Text>
            <Text style={styles.heroBody}>
              {lastSession
                ? `Continue the ${lastSession.scenarioTitle} case as ${roleName}.`
                : 'Select a role, review the briefing, and start a guided practice case.'}
            </Text>
          </View>
          <View style={styles.heroScore}>
            <Text style={styles.heroScoreValue}>
              {formatScore(avgScore)}
            </Text>
            <Text style={styles.heroScoreLabel}>Average score</Text>
          </View>
        </View>

        <PremiumBottomActions>
          <PremiumActionButton
            label={lastSession ? 'Resume case' : 'Choose role'}
            onPress={handleContinue}
          />
          <PremiumActionButton
            label="Browse scenario library"
            variant="secondary"
            onPress={() => router.push('/scenario' as Href)}
          />
        </PremiumBottomActions>

        <View style={styles.heroMetaRow}>
          <PremiumPill label={`${completedSessions.length} sessions`} tone="indigo" />
          <PremiumPill
            label={currentStreak > 0 ? `${currentStreak} day streak` : 'Build a streak'}
            tone={currentStreak > 0 ? 'success' : 'muted'}
          />
          <PremiumPill
            label={lastSession ? new Date(lastSession.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No sessions yet'}
            tone="muted"
          />
        </View>
      </View>

      <PremiumStatRail
        items={[
          {
            label: 'This week',
            value: `${weeklySessionCount}/${weeklyGoal}`,
            caption: 'Sessions toward goal',
            tone: weeklySessionCount >= weeklyGoal ? 'success' : 'brand',
          },
          {
            label: 'Current streak',
            value: String(currentStreak),
            caption: 'Consecutive days practiced',
            tone: currentStreak > 0 ? 'success' : 'indigo',
          },
          {
            label: 'Average score',
            value: formatScore(avgScore),
            caption: 'Across completed sessions',
            tone: avgScore != null ? (avgScore >= 3.5 ? 'success' : avgScore >= 2.5 ? 'brand' : 'warning') : 'indigo',
          },
          {
            label: 'Best score',
            value: formatScore(bestScore),
            caption: 'Highest session to date',
            tone: bestScore != null ? 'success' : 'indigo',
          },
        ]}
      />

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Weekly rhythm</Text>
          <Text style={styles.progressMeta}>
            {weeklySessionCount} of {weeklyGoal} sessions
          </Text>
        </View>
        <PremiumProgressRail
          progress={progress}
          valueLabel={progress >= 1 ? 'Goal reached' : `${Math.round(progress * 100)}%`}
          tone={progress >= 1 ? 'success' : 'brand'}
        />
      </View>

      <View style={styles.quickGrid}>
        <Pressable
          style={styles.quickCard}
          accessibilityRole="button"
          onPress={() => router.push('/learning-path' as Href)}>
          <Text style={styles.quickCardTitle}>Learning Path</Text>
          <Text style={styles.quickCardBody}>Follow the guided clinical sequence from baseline to advanced work.</Text>
        </Pressable>
        <Pressable
          style={styles.quickCard}
          accessibilityRole="button"
          onPress={() => router.push('/analytics' as Href)}>
          <Text style={styles.quickCardTitle}>Analytics</Text>
          <Text style={styles.quickCardBody}>Review patterns, trends, and your strongest communication skills.</Text>
        </Pressable>
        <Pressable
          style={styles.quickCard}
          accessibilityRole="button"
          onPress={() => router.push('/reference' as Href)}>
          <Text style={styles.quickCardTitle}>Reference</Text>
          <Text style={styles.quickCardBody}>Open hospice language, medications, diagnoses, and LCD criteria.</Text>
        </Pressable>
        <Pressable
          style={styles.quickCard}
          accessibilityRole="button"
          onPress={() => router.push('/settings' as Href)}>
          <Text style={styles.quickCardTitle}>Settings</Text>
          <Text style={styles.quickCardBody}>Manage reminders, weekly goals, profile data, and sign-in state.</Text>
        </Pressable>
      </View>

      {showCertNudge && (
        <Pressable
          style={styles.certificateCard}
          accessibilityRole="button"
          onPress={() => router.push('/certificate' as Href)}>
          <Text style={styles.certificateLabel}>Certificate ready</Text>
          <Text style={styles.certificateTitle}>{completedSessions.length} scenarios completed</Text>
          <Text style={styles.certificateBody}>Download your training certificate and share it with your team.</Text>
        </Pressable>
      )}

      {learnerProfile == null && (
        <Pressable
          style={styles.profilePrompt}
          accessibilityRole="button"
          onPress={() => router.push('/profile-setup' as Href)}>
          <Text style={styles.profilePromptText}>
            Set up your profile for more realistic coaching and role-calibrated feedback.
          </Text>
        </Pressable>
      )}

      <Text style={styles.disclaimer}>
        Fictional training simulator only. Does not replace clinical judgment or constitute medical advice.
      </Text>
    </PremiumScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
  },
  accountBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    maxWidth: 220,
  },
  accountEmail: {
    fontSize: 12,
    color: SimulatorColors.textSecondary,
    flex: 1,
  },
  upgradeBanner: {
    backgroundColor: SimulatorColors.brandDeep,
    borderRadius: Radius.xl,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    boxShadow: `0 18px 36px ${SimulatorColors.shadowStrong}`,
  },
  upgradeTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  upgradeBody: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
    lineHeight: 19,
  },
  heroShell: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    padding: 18,
    gap: 14,
    boxShadow: `0 18px 36px ${SimulatorColors.shadow}`,
  },
  heroHeader: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  heroHeadingGroup: {
    flex: 1,
    gap: 6,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: SimulatorColors.amberBadge,
    textTransform: 'uppercase',
    letterSpacing: 1.3,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: SimulatorColors.textPrimary,
    lineHeight: 30,
    letterSpacing: -0.4,
  },
  heroBody: {
    fontSize: 14,
    color: SimulatorColors.textSecondary,
    lineHeight: 20,
  },
  heroScore: {
    alignItems: 'flex-end',
    gap: 2,
    minWidth: 88,
  },
  heroScoreValue: {
    fontSize: 28,
    fontWeight: '800',
    color: SimulatorColors.brand,
    fontVariant: ['tabular-nums'],
  },
  heroScoreLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroMetaRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  progressCard: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    padding: 16,
    gap: 10,
    boxShadow: `0 18px 36px ${SimulatorColors.shadow}`,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: SimulatorColors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1.0,
  },
  progressMeta: {
    fontSize: 12,
    color: SimulatorColors.textSecondary,
    fontWeight: '600',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickCard: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    padding: 16,
    gap: 6,
    boxShadow: `0 16px 30px ${SimulatorColors.shadow}`,
  },
  quickCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: SimulatorColors.textPrimary,
  },
  quickCardBody: {
    fontSize: 12,
    color: SimulatorColors.textSecondary,
    lineHeight: 18,
  },
  certificateCard: {
    backgroundColor: SimulatorColors.indigoBackground,
    borderWidth: 1,
    borderColor: SimulatorColors.indigoBorder,
    borderRadius: Radius.xl,
    padding: 16,
    gap: 4,
  },
  certificateLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: SimulatorColors.indigoLabel,
    textTransform: 'uppercase',
    letterSpacing: 1.0,
  },
  certificateTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: SimulatorColors.textPrimary,
  },
  certificateBody: {
    fontSize: 13,
    color: SimulatorColors.indigoText,
    lineHeight: 19,
  },
  profilePrompt: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  profilePromptText: {
    fontSize: 13,
    color: SimulatorColors.brand,
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  disclaimer: {
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    color: SimulatorColors.textSecondary,
    marginTop: 4,
  },
});
