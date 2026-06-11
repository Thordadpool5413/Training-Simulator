import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radius, SimulatorColors } from '@/constants/theme';
import { useSimulator } from '@/state/SimulatorContext';

export default function IndexScreen() {
  const { streakData, learnerProfile, setSelectedRoleId, setSelectedScenarioId } = useSimulator();
  const { currentStreak, weeklySessionCount, weeklyGoal } = streakData;

  function handleStartDemo() {
    setSelectedRoleId('clinical_liaison');
    setSelectedScenarioId('hospice_means_giving_up');
    router.push('/demo' as Href);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
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

        <Pressable
          style={styles.settingsLink}
          accessibilityRole="button"
          onPress={() => router.push('/settings' as Href)}>
          <Text style={styles.settingsLinkText}>⚙ Settings</Text>
        </Pressable>
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
  settingsLink: {
    marginTop: 4,
    paddingVertical: 8,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  settingsLinkText: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    fontWeight: '500',
  },
});
