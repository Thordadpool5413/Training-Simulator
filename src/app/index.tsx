import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radius, SimulatorColors } from '@/constants/theme';
import { useAuth } from '@/state/AuthContext';
import { useSimulator } from '@/state/SimulatorContext';

const AUTH_CONFIGURED = !!(process.env.EXPO_PUBLIC_SUPABASE_URL);

export default function IndexScreen() {
  const { streakData, learnerProfile, setSelectedRoleId, setSelectedScenarioId } = useSimulator();
  const { currentStreak, weeklySessionCount, weeklyGoal } = streakData;
  const { isSignedIn, email, subscription, isSubscribed } = useAuth();

  function handleStartDemo() {
    setSelectedRoleId('clinical_liaison');
    setSelectedScenarioId('hospice_means_giving_up');
    router.push('/demo' as Href);
  }

  const subscriptionLabel = !AUTH_CONFIGURED || !isSignedIn
    ? null
    : isSubscribed
    ? subscription.plan === 'team' ? 'Team Plan' : 'Pro'
    : 'Free Trial';

  const showUpgradeBanner = AUTH_CONFIGURED && isSignedIn && !isSubscribed;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
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

        {currentStreak > 0 && (
          <View style={styles.streakBanner}>
            <Text style={styles.streakText}>
              {`🔥 ${currentStreak}-day streak`}
            </Text>
            <View style={styles.streakDivider} />
            <Text style={styles.streakText}>
              {`📅 ${weeklySessionCount}/${weeklyGoal} this week`}
            </Text>
          </View>
        )}

        <Text style={styles.appTitle} accessibilityRole="header">
          Hospice Communication Training Simulator
        </Text>
        <Text style={styles.disclaimer}>
          This is a fictional training simulator for hospice and palliative communication practice. Do not enter real patient information. This tool does not diagnose patients, determine hospice eligibility, prescribe medications, or replace clinical judgment.
        </Text>

        {showUpgradeBanner && (
          <Pressable
            style={styles.upgradeBanner}
            accessibilityRole="button"
            onPress={() => router.push('/paywall' as Href)}>
            <Text style={styles.upgradeBannerText}>
              Unlock all 34 scenarios — Start free trial →
            </Text>
          </Pressable>
        )}

        <Pressable
          style={styles.button}
          accessibilityRole="button"
          onPress={() => router.push('/role' as Href)}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>

        <Pressable
          style={styles.demoButton}
          accessibilityRole="button"
          onPress={handleStartDemo}>
          <Text style={styles.demoButtonText}>Try a Free Demo Simulation</Text>
        </Pressable>

        <Pressable
          style={styles.referenceButton}
          accessibilityRole="button"
          onPress={() => router.push('/reference' as Href)}>
          <Text style={styles.referenceButtonText}>Clinical Reference Library</Text>
        </Pressable>

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

        <View style={styles.bottomLinks}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/team' as Href)}>
            <Text style={styles.bottomLinkText}>👥 Team</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/settings' as Href)}>
            <Text style={styles.bottomLinkText}>⚙ Settings</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SimulatorColors.screenBackground,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 0,
  },
  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: SimulatorColors.amberBackground,
    borderWidth: 1,
    borderColor: SimulatorColors.amberBorder,
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 24,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  streakDivider: {
    width: 1,
    height: 16,
    backgroundColor: SimulatorColors.amberBorder,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: SimulatorColors.textBody,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 30,
  },
  disclaimer: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    color: SimulatorColors.textSecondary,
    marginBottom: 40,
  },
  button: {
    backgroundColor: SimulatorColors.brand,
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  buttonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 16,
    fontWeight: '600',
  },
  demoButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignSelf: 'stretch',
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
  referenceButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignSelf: 'stretch',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: SimulatorColors.brand,
  },
  referenceButtonText: {
    color: SimulatorColors.brand,
    fontSize: 14,
    fontWeight: '600',
  },
  profilePrompt: {
    marginTop: 16,
    paddingVertical: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  profilePromptText: {
    fontSize: 13,
    color: SimulatorColors.brand,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  accountBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: 12,
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
  upgradeBanner: {
    backgroundColor: SimulatorColors.brandDeep,
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: 12,
  },
  upgradeBannerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomLinks: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 8,
  },
  bottomLinkText: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    fontWeight: '500',
  },
});
