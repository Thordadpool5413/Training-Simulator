import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SectionCard } from '@/components/SectionCard';
import { Radius, SimulatorColors } from '@/constants/theme';
import { rescheduleDailyReminder } from '@/services/notificationService';
import { useSimulator } from '@/state/SimulatorContext';

const WEEKLY_GOAL_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

const NOTIFICATION_TIMES: { label: string; hour: number; minute: number }[] = [
  { label: '8:00 AM', hour: 8, minute: 0 },
  { label: '12:00 PM', hour: 12, minute: 0 },
  { label: '6:00 PM', hour: 18, minute: 0 },
  { label: '9:00 PM', hour: 21, minute: 0 },
];

export default function SettingsScreen() {
  const {
    streakData,
    appSettings,
    learnerProfile,
    setWeeklyGoal,
    updateAppSettings,
    resetAllProgress,
  } = useSimulator();

  const [savingNotif, setSavingNotif] = useState(false);

  async function handleToggleNotifications(value: boolean) {
    setSavingNotif(true);
    updateAppSettings({ notificationsEnabled: value });
    await rescheduleDailyReminder(
      appSettings.notificationHour,
      appSettings.notificationMinute,
      value
    );
    setSavingNotif(false);
  }

  async function handleTimeSelect(hour: number, minute: number) {
    setSavingNotif(true);
    updateAppSettings({ notificationHour: hour, notificationMinute: minute });
    await rescheduleDailyReminder(hour, minute, appSettings.notificationsEnabled);
    setSavingNotif(false);
  }

  function handleResetProgress() {
    Alert.alert(
      'Reset Progress?',
      'This will clear all completed sessions, quiz results, and your streak. Your profile and settings will be kept. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetAllProgress();
          },
        },
      ]
    );
  }

  const selectedTime = NOTIFICATION_TIMES.find(
    (t) => t.hour === appSettings.notificationHour && t.minute === appSettings.notificationMinute
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          style={styles.backLink}
          accessibilityRole="button"
          onPress={() => router.back()}>
          <Text style={styles.backLinkText}>← Back</Text>
        </Pressable>

        <Text style={styles.title} accessibilityRole="header">Settings</Text>

        <SectionCard title="Weekly Practice Goal">
          <Text style={styles.sectionDesc}>
            How many simulation sessions do you aim to complete each week?
          </Text>
          <View style={styles.goalRow}>
            {WEEKLY_GOAL_OPTIONS.map((n) => (
              <Pressable
                key={n}
                style={[styles.goalChip, streakData.weeklyGoal === n && styles.goalChipActive]}
                accessibilityRole="button"
                accessibilityLabel={`Set weekly goal to ${n}`}
                onPress={() => setWeeklyGoal(n)}>
                <Text style={[styles.goalChipText, streakData.weeklyGoal === n && styles.goalChipTextActive]}>
                  {n}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.goalCurrent}>
            Current goal: {streakData.weeklyGoal} session{streakData.weeklyGoal !== 1 ? 's' : ''} per week
          </Text>
        </SectionCard>

        <SectionCard title="Daily Practice Reminder">
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Enable reminder</Text>
            <Switch
              value={appSettings.notificationsEnabled}
              onValueChange={(v) => { void handleToggleNotifications(v); }}
              trackColor={{ true: SimulatorColors.brand, false: SimulatorColors.borderInput }}
              thumbColor={SimulatorColors.surface}
              disabled={savingNotif}
            />
          </View>
          {appSettings.notificationsEnabled && (
            <>
              <Text style={styles.sectionDesc}>Reminder time</Text>
              <View style={styles.timeRow}>
                {NOTIFICATION_TIMES.map((t) => {
                  const isActive = t.hour === appSettings.notificationHour &&
                    t.minute === appSettings.notificationMinute;
                  return (
                    <Pressable
                      key={t.label}
                      style={[styles.timeChip, isActive && styles.timeChipActive]}
                      accessibilityRole="button"
                      onPress={() => { void handleTimeSelect(t.hour, t.minute); }}
                      disabled={savingNotif}>
                      <Text style={[styles.timeChipText, isActive && styles.timeChipTextActive]}>
                        {t.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {selectedTime && (
                <Text style={styles.timeNote}>
                  Reminder set for {selectedTime.label} daily
                </Text>
              )}
            </>
          )}
        </SectionCard>

        <SectionCard title="Learning Profile">
          {learnerProfile ? (
            <View style={styles.profileSummary}>
              <Text style={styles.profileLine}>
                {learnerProfile.yearsInRole} years · {learnerProfile.hospiceExperienceLevel} hospice experience
              </Text>
              <Text style={styles.profileLine}>
                Setting: {learnerProfile.primarySetting}
              </Text>
            </View>
          ) : (
            <Text style={styles.profileMissing}>
              No profile set — add yours for personalized AI coaching.
            </Text>
          )}
          <Pressable
            style={styles.profileButton}
            accessibilityRole="button"
            onPress={() => router.push('/profile-setup' as Href)}>
            <Text style={styles.profileButtonText}>
              {learnerProfile ? 'Edit Profile' : 'Set Up Profile'}
            </Text>
          </Pressable>
        </SectionCard>

        <SectionCard title="Progress">
          <Pressable
            style={styles.resetButton}
            accessibilityRole="button"
            onPress={handleResetProgress}>
            <Text style={styles.resetButtonText}>Reset All Progress</Text>
          </Pressable>
          <Text style={styles.resetNote}>
            Clears completed sessions, quiz scores, and streak. Profile and settings are kept.
          </Text>
        </SectionCard>
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
  sectionDesc: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    lineHeight: 19,
    marginBottom: 12,
  },
  goalRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  goalChip: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: SimulatorColors.borderInput,
    backgroundColor: SimulatorColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalChipActive: {
    backgroundColor: SimulatorColors.brand,
    borderColor: SimulatorColors.brand,
  },
  goalChipText: {
    fontSize: 16,
    fontWeight: '600',
    color: SimulatorColors.textBody,
  },
  goalChipTextActive: {
    color: SimulatorColors.textOnBrand,
  },
  goalCurrent: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    marginTop: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleLabel: {
    fontSize: 15,
    color: SimulatorColors.textBody,
    fontWeight: '500',
  },
  timeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: SimulatorColors.borderInput,
    backgroundColor: SimulatorColors.surface,
  },
  timeChipActive: {
    backgroundColor: SimulatorColors.brand,
    borderColor: SimulatorColors.brand,
  },
  timeChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: SimulatorColors.textBody,
  },
  timeChipTextActive: {
    color: SimulatorColors.textOnBrand,
    fontWeight: '700',
  },
  timeNote: {
    fontSize: 12,
    color: SimulatorColors.textSecondary,
    fontStyle: 'italic',
  },
  profileSummary: {
    gap: 4,
    marginBottom: 12,
  },
  profileLine: {
    fontSize: 14,
    color: SimulatorColors.textBody,
    lineHeight: 20,
    textTransform: 'capitalize',
  },
  profileMissing: {
    fontSize: 14,
    color: SimulatorColors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  profileButton: {
    backgroundColor: SimulatorColors.brandTint,
    borderWidth: 1,
    borderColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  profileButtonText: {
    color: SimulatorColors.brand,
    fontSize: 15,
    fontWeight: '600',
  },
  resetButton: {
    borderWidth: 1,
    borderColor: SimulatorColors.scoreOrange,
    borderRadius: Radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  resetButtonText: {
    color: SimulatorColors.scoreOrange,
    fontSize: 15,
    fontWeight: '600',
  },
  resetNote: {
    fontSize: 12,
    color: SimulatorColors.textSecondary,
    lineHeight: 18,
  },
});
