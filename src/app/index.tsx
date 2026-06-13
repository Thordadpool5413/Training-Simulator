import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radius, SimulatorColors } from '@/constants/theme';
import { roles } from '@/data/roles';
import { scenarioTemplates } from '@/data/scenarioTemplates';
import { useAuth } from '@/state/AuthContext';
import { useSimulator } from '@/state/SimulatorContext';

const AUTH_CONFIGURED = !!(process.env.EXPO_PUBLIC_SUPABASE_URL);

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

  const lastSession = completedSessions.length > 0
    ? completedSessions[completedSessions.length - 1]
    : null;
  const avgScore = completedSessions.length > 0
    ? completedSessions.reduce((s, x) => s + x.overallScore, 0) / completedSessions.length
    : null;

  const activeRoleId = lastSession?.roleId ?? selectedRoleId;
  const roleName = roles.find((r) => r.id === activeRoleId)?.name ?? null;

  const subscriptionLabel = !AUTH_CONFIGURED || !isSignedIn
    ? null
    : isSubscribed
    ? subscription.plan === 'team' ? 'Team Plan' : 'Pro'
    : 'Free Trial';

  const showUpgradeBanner = AUTH_CONFIGURED && isSignedIn && !isSubscribed;
  const showCertNudge = completedSessions.length >= 5;

  function handleContinue() {
    if (!lastSession) {
      router.push('/role' as Href);
      return;
    }
    const scenario = scenarioTemplates.find((s) => s.id === lastSession.scenarioId);
    if (scenario) {
      setSelectedRoleId(lastSession.roleId);
      setSelectedScenarioId(lastSession.scenarioId);
      router.push('/scenario-briefing' as Href);
    } else {
      setSelectedRoleId(lastSession.roleId);
      router.push('/scenario' as Href);
    }
  }

  function handleStartDemo() {
    setSelectedRoleId('clinical_liaison');
    setSelectedScenarioId('hospice_means_giving_up');
    router.push('/demo' as Href);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>

        {/* Top account bar */}
        {AUTH_CONFIGURED && isSignedIn && (
          <View style={styles.accountBar}>
            <Text style={styles.accountEmail} numberOfLines={1}>{email}</Text>
            {subscriptionLabel && (
              <View style={[styles.planPill, isSubscribed ? styles.planPillPro : styles.planPillFree]}>
                <Text style={[styles.planPillText, isSubscribed ? styles.planPillTextPro : styles.planPillTextFree]}>
                  {subscriptionLabel}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>
            {greeting()}{roleName ? `, ${roleName}` : ''}
          </Text>
          <Text style={styles.appName}>Hospice Communication Training</Text>
        </View>

        {/* Streak + weekly progress */}
        {(currentStreak > 0 || weeklySessionCount > 0) && (
          <View style={styles.streakCard}>
            <View style={styles.streakRow}>
              <View style={styles.streakStat}>
                <Text style={styles.streakNumber}>{currentStreak}</Text>
                <Text style={styles.streakLabel}>day streak</Text>
              </View>
              <View style={styles.streakDivider} />
              <View style={styles.streakStat}>
                <Text style={styles.streakNumber}>{weeklySessionCount}</Text>
                <Text style={styles.streakLabel}>this week</Text>
              </View>
              <View style={styles.weeklyGoalContainer}>
                <Text style={styles.weeklyGoalLabel}>Weekly goal</Text>
                <View style={styles.weeklyDots}>
                  {Array.from({ length: weeklyGoal }).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.weeklyDot,
                        i < weeklySessionCount && styles.weeklyDotFilled,
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Upgrade banner */}
        {showUpgradeBanner && (
          <Pressable
            style={styles.upgradeBanner}
            accessibilityRole="button"
            onPress={() => router.push('/paywall' as Href)}>
            <Text style={styles.upgradeBannerTitle}>Unlock all 34 scenarios</Text>
            <Text style={styles.upgradeBannerSub}>Start your 7-day free trial →</Text>
          </Pressable>
        )}

        {/* Continue practicing card */}
        {lastSession ? (
          <View style={styles.continueCard}>
            <View style={styles.continueCardHeader}>
              <Text style={styles.continueCardLabel}>Continue Practicing</Text>
              <View style={[styles.scoreChip, { borderColor: scoreColor(lastSession.overallScore) }]}>
                <Text style={[styles.scoreChipText, { color: scoreColor(lastSession.overallScore) }]}>
                  Last: {lastSession.overallScore.toFixed(1)}
                </Text>
              </View>
            </View>
            <Text style={styles.continueScenarioTitle} numberOfLines={2}>
              {lastSession.scenarioTitle}
            </Text>
            {roleName && (
              <Text style={styles.continueRoleMeta}>{roleName}</Text>
            )}
            <View style={styles.continueButtonRow}>
              <Pressable
                style={styles.continueButton}
                accessibilityRole="button"
                onPress={handleContinue}>
                <Text style={styles.continueButtonText}>Practice Again</Text>
              </Pressable>
              <Pressable
                style={styles.browseButton}
                accessibilityRole="button"
                onPress={() => router.push('/scenario' as Href)}>
                <Text style={styles.browseButtonText}>Browse All</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            style={styles.startCard}
            accessibilityRole="button"
            onPress={() => router.push('/role' as Href)}>
            <Text style={styles.startCardTitle}>Start Your First Scenario</Text>
            <Text style={styles.startCardSub}>
              Choose your clinical role and begin practicing.
            </Text>
            <View style={styles.startCardCta}>
              <Text style={styles.startCardCtaText}>Choose Role →</Text>
            </View>
          </Pressable>
        )}

        {/* Stats row */}
        {completedSessions.length > 0 && avgScore !== null && (
          <Pressable
            style={styles.statsRow}
            accessibilityRole="button"
            onPress={() => router.push('/analytics' as Href)}>
            <View style={styles.statCell}>
              <Text style={styles.statValue}>{completedSessions.length}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCell}>
              <Text style={[styles.statValue, { color: scoreColor(avgScore) }]}>
                {avgScore.toFixed(1)}
              </Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCell}>
              <Text style={styles.statValue}>
                {Math.max(...completedSessions.map((s) => s.overallScore)).toFixed(1)}
              </Text>
              <Text style={styles.statLabel}>Best Score</Text>
            </View>
            <Text style={styles.statsArrow}>→</Text>
          </Pressable>
        )}

        {/* Certificate nudge */}
        {showCertNudge && (
          <Pressable
            style={styles.certNudge}
            accessibilityRole="button"
            onPress={() => router.push('/certificate' as Href)}>
            <Text style={styles.certNudgeIcon}>🎓</Text>
            <View style={styles.certNudgeText}>
              <Text style={styles.certNudgeTitle}>
                {completedSessions.length} scenarios completed
              </Text>
              <Text style={styles.certNudgeSub}>Download your training certificate →</Text>
            </View>
          </Pressable>
        )}

        {/* Demo button — shown when no sessions or unauthenticated */}
        {completedSessions.length === 0 && (
          <Pressable
            style={styles.demoButton}
            accessibilityRole="button"
            onPress={handleStartDemo}>
            <Text style={styles.demoButtonText}>Try a Free Demo Simulation</Text>
          </Pressable>
        )}

        {/* Quick nav grid */}
        <View style={styles.quickNavGrid}>
          <Pressable
            style={styles.quickNavCell}
            accessibilityRole="button"
            onPress={() => router.push('/learning-path' as Href)}>
            <Text style={styles.quickNavIcon}>🗺️</Text>
            <Text style={styles.quickNavLabel}>Learning Path</Text>
          </Pressable>
          <Pressable
            style={styles.quickNavCell}
            accessibilityRole="button"
            onPress={() => router.push('/analytics' as Href)}>
            <Text style={styles.quickNavIcon}>📊</Text>
            <Text style={styles.quickNavLabel}>Analytics</Text>
          </Pressable>
          <Pressable
            style={styles.quickNavCell}
            accessibilityRole="button"
            onPress={() => router.push('/reference' as Href)}>
            <Text style={styles.quickNavIcon}>📚</Text>
            <Text style={styles.quickNavLabel}>Reference</Text>
          </Pressable>
          <Pressable
            style={styles.quickNavCell}
            accessibilityRole="button"
            onPress={() => router.push('/settings' as Href)}>
            <Text style={styles.quickNavIcon}>⚙️</Text>
            <Text style={styles.quickNavLabel}>Settings</Text>
          </Pressable>
        </View>

        {learnerProfile == null && (
          <Pressable
            style={styles.profilePrompt}
            accessibilityRole="button"
            onPress={() => router.push('/profile-setup' as Href)}>
            <Text style={styles.profilePromptText}>
              Set up your profile for personalized AI coaching →
            </Text>
          </Pressable>
        )}

        <Text style={styles.disclaimer}>
          Fictional training simulator only. Does not replace clinical judgment or constitute medical advice.
        </Text>
      </ScrollView>
    </SafeAreaView>
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
    gap: 14,
  },
  accountBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  accountEmail: {
    fontSize: 12,
    color: SimulatorColors.textSecondary,
    flex: 1,
  },
  planPill: {
    borderRadius: Radius.lg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  planPillPro: {
    backgroundColor: SimulatorColors.brandTint,
    borderColor: SimulatorColors.brand,
  },
  planPillFree: {
    backgroundColor: SimulatorColors.warningBackground,
    borderColor: SimulatorColors.warningBorder,
  },
  planPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  planPillTextPro: {
    color: SimulatorColors.brandDeep,
  },
  planPillTextFree: {
    color: SimulatorColors.warningLabelText,
  },
  greetingSection: {
    gap: 2,
    marginBottom: 4,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '800',
    color: SimulatorColors.textPrimary,
    letterSpacing: -0.3,
  },
  appName: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    fontWeight: '500',
  },
  streakCard: {
    backgroundColor: SimulatorColors.amberBackground,
    borderWidth: 1,
    borderColor: SimulatorColors.amberBorder,
    borderRadius: Radius.lg,
    padding: 16,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  streakStat: {
    alignItems: 'center',
    gap: 2,
  },
  streakNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: SimulatorColors.textPrimary,
    lineHeight: 30,
  },
  streakLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  streakDivider: {
    width: 1,
    height: 32,
    backgroundColor: SimulatorColors.amberBorder,
  },
  weeklyGoalContainer: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 6,
  },
  weeklyGoalLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  weeklyDots: {
    flexDirection: 'row',
    gap: 6,
  },
  weeklyDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: SimulatorColors.amberBorder,
  },
  weeklyDotFilled: {
    backgroundColor: '#D97706',
  },
  upgradeBanner: {
    backgroundColor: SimulatorColors.brandDeep,
    borderRadius: Radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 2,
  },
  upgradeBannerTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  upgradeBannerSub: {
    color: 'rgba(255,255,255,0.70)',
    fontSize: 13,
    fontWeight: '500',
  },
  continueCard: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: SimulatorColors.brand,
    padding: 18,
    gap: 8,
  },
  continueCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  continueCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.brand,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  scoreChip: {
    borderRadius: Radius.sm,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  scoreChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  continueScenarioTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
    lineHeight: 23,
  },
  continueRoleMeta: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
  },
  continueButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  continueButton: {
    flex: 1,
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 14,
    fontWeight: '700',
  },
  browseButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: SimulatorColors.borderInput,
    alignItems: 'center',
  },
  browseButtonText: {
    color: SimulatorColors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  startCard: {
    backgroundColor: SimulatorColors.brandTint,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: SimulatorColors.brand,
    padding: 20,
    gap: 6,
    alignItems: 'flex-start',
  },
  startCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: SimulatorColors.brandDeep,
  },
  startCardSub: {
    fontSize: 14,
    color: SimulatorColors.textSecondary,
    lineHeight: 20,
  },
  startCardCta: {
    marginTop: 6,
  },
  startCardCtaText: {
    fontSize: 15,
    fontWeight: '700',
    color: SimulatorColors.brand,
  },
  statsRow: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: SimulatorColors.borderDivider,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: SimulatorColors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statsArrow: {
    fontSize: 16,
    color: SimulatorColors.textSecondary,
    paddingLeft: 4,
  },
  certNudge: {
    backgroundColor: SimulatorColors.greenBackground,
    borderWidth: 1,
    borderColor: SimulatorColors.greenBorder,
    borderRadius: Radius.lg,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  certNudgeIcon: {
    fontSize: 28,
  },
  certNudgeText: {
    flex: 1,
    gap: 2,
  },
  certNudgeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: SimulatorColors.greenText,
  },
  certNudgeSub: {
    fontSize: 13,
    color: SimulatorColors.scoreGreen,
    fontWeight: '500',
  },
  demoButton: {
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
    backgroundColor: SimulatorColors.greenBackground,
    borderWidth: 1,
    borderColor: SimulatorColors.greenBorder,
  },
  demoButtonText: {
    color: SimulatorColors.greenText,
    fontSize: 15,
    fontWeight: '600',
  },
  quickNavGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  quickNavCell: {
    flex: 1,
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
  },
  quickNavIcon: {
    fontSize: 22,
  },
  quickNavLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: SimulatorColors.textSecondary,
    textAlign: 'center',
  },
  profilePrompt: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  profilePromptText: {
    fontSize: 13,
    color: SimulatorColors.brand,
    fontWeight: '500',
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
