import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PremiumPill, PremiumProgressRail, PremiumScreen } from '@/components/premium-ui';
import { Radius, SimulatorColors } from '@/constants/theme';
import { roles } from '@/data/roles';
import { scenarioTemplates } from '@/data/scenarioTemplates';
import { useSimulator } from '@/state/SimulatorContext';
import type { HospiceExperienceLevel } from '@/types/simulator';

const ROLE_DESCRIPTIONS: Record<string, { icon: string; desc: string }> = {
  clinical_liaison: {
    icon: '📋',
    desc: 'Bridge between hospital and hospice — education, objections, goals of care.',
  },
  rn: {
    icon: '🩺',
    desc: 'Bedside clinical conversations — symptoms, medications, family dynamics.',
  },
  social_worker: {
    icon: '🤝',
    desc: 'Psychosocial support — grief, caregiver burnout, advance directives.',
  },
};

const YEARS_OPTIONS = [
  { label: '< 1 yr', value: '< 1' },
  { label: '1–2 yrs', value: '1-2' },
  { label: '3–5 yrs', value: '3-5' },
  { label: '5–10 yrs', value: '5-10' },
  { label: '10+ yrs', value: '10+' },
];

const EXPERIENCE_OPTIONS: { label: string; value: HospiceExperienceLevel; desc: string }[] = [
  { label: 'None', value: 'none', desc: 'Little to no hospice exposure' },
  { label: 'Some', value: 'some', desc: 'Some cases or training' },
  { label: 'Extensive', value: 'extensive', desc: 'Regular hospice practice' },
];

export default function OnboardingScreen() {
  const { setSelectedRoleId, setSelectedScenarioId, setLearnerProfile } = useSimulator();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [yearsInRole, setYearsInRole] = useState<string>('');
  const [experience, setExperience] = useState<HospiceExperienceLevel>('none');

  const recommended = selectedRole
    ? scenarioTemplates.find(
        (s) => s.allowedRoleId === selectedRole && s.difficulty === 'beginner'
      ) ?? scenarioTemplates.find((s) => s.allowedRoleId === selectedRole)
    : null;

  const roleName = roles.find((r) => r.id === selectedRole)?.name ?? '';

  function handleStartPractice() {
    if (!selectedRole || !recommended) return;

    setLearnerProfile({
      yearsInRole: yearsInRole || '< 1',
      hospiceExperienceLevel: experience,
      primarySetting: 'hospital',
      comfortHospiceConversations: 3,
      comfortFamilyObjections: 3,
      comfortMedicationQuestions: 3,
      comfortDeathAndDying: 3,
    });
    setSelectedRoleId(selectedRole);
    setSelectedScenarioId(recommended.id);
    router.replace('/scenario-briefing' as Href);
  }

  function handleBrowseAll() {
    if (selectedRole) {
      setSelectedRoleId(selectedRole);
    }
    router.replace('/scenario' as Href);
  }

  const progress = step / 3;

  return (
    <PremiumScreen
      eyebrow="Onboarding"
      title="Set up your training profile"
      subtitle="Choose your role, share your experience level, and launch a recommended case that fits your practice."
      onBack={() => router.replace('/')}
      backLabel="Home"
      headerRight={<PremiumPill label={`Step ${step}/3`} tone="indigo" />}
      scrollContentStyle={styles.content}>
      <PremiumProgressRail progress={progress} valueLabel={`Step ${step} of 3`} tone="brand" />

        {step === 1 && (
          <>
            <View style={styles.stepHeader}>
              <Text style={styles.stepLabel}>Step 1 of 3</Text>
              <Text style={styles.title} accessibilityRole="header">
                Which role are you practicing today?
              </Text>
              <Text style={styles.subtitle}>
                Scenarios and coaching feedback will be tailored to the role you select here.
              </Text>
            </View>

            <View style={styles.roleList}>
              {roles.map((role) => {
                const meta = ROLE_DESCRIPTIONS[role.id];
                const isSelected = selectedRole === role.id;
                return (
                  <Pressable
                    key={role.id}
                    style={[styles.roleCard, isSelected && styles.roleCardSelected]}
                    accessibilityRole="button"
                    onPress={() => setSelectedRole(role.id)}>
                    <View style={styles.roleCardLeft}>
                      <View style={[styles.roleIconBox, isSelected && styles.roleIconBoxSelected]}>
                        <Text style={styles.roleIcon}>{meta?.icon ?? '👤'}</Text>
                      </View>
                      <View style={styles.roleCardText}>
                        <Text style={[styles.roleName, isSelected && styles.roleNameSelected]}>
                          {role.name}
                        </Text>
                        <Text style={styles.roleDesc} numberOfLines={2}>
                          {meta?.desc ?? ''}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={[styles.continueButton, !selectedRole && styles.continueButtonDisabled]}
              accessibilityRole="button"
              disabled={!selectedRole}
              onPress={() => setStep(2)}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </Pressable>
          </>
        )}

        {step === 2 && (
          <>
            <View style={styles.stepHeader}>
              <Text style={styles.stepLabel}>Step 2 of 3</Text>
              <Text style={styles.title} accessibilityRole="header">
                Tell us about your practice background
              </Text>
              <Text style={styles.subtitle}>
                This helps the coach match the tone, depth, and expectations of your current experience.
              </Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Years in your role</Text>
              <View style={styles.chipRow}>
                {YEARS_OPTIONS.map((opt) => (
                  <Pressable
                    key={opt.value}
                    style={[styles.chip, yearsInRole === opt.value && styles.chipActive]}
                    accessibilityRole="button"
                    onPress={() => setYearsInRole(opt.value)}>
                    <Text style={[styles.chipText, yearsInRole === opt.value && styles.chipTextActive]}>
                      {opt.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Hospice experience</Text>
              {EXPERIENCE_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  style={[styles.experienceOption, experience === opt.value && styles.experienceOptionSelected]}
                  accessibilityRole="button"
                  onPress={() => setExperience(opt.value)}>
                  <View style={[styles.radioOuter, experience === opt.value && styles.radioOuterSelected]}>
                    {experience === opt.value && <View style={styles.radioInner} />}
                  </View>
                  <View>
                    <Text style={[styles.experienceLabel, experience === opt.value && styles.experienceLabelSelected]}>
                      {opt.label}
                    </Text>
                    <Text style={styles.experienceDesc}>{opt.desc}</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            <View style={styles.navRow}>
              <Pressable style={styles.backButton} accessibilityRole="button" onPress={() => setStep(1)}>
                <Text style={styles.backButtonText}>← Back</Text>
              </Pressable>
              <Pressable
                style={[styles.continueButton, styles.continueButtonFlex]}
                accessibilityRole="button"
                onPress={() => setStep(3)}>
                <Text style={styles.continueButtonText}>Continue</Text>
              </Pressable>
            </View>
          </>
        )}

        {step === 3 && recommended && (
          <>
            <View style={styles.stepHeader}>
              <Text style={styles.stepLabel}>Step 3 of 3</Text>
              <Text style={styles.title} accessibilityRole="header">
                You’re ready to begin
              </Text>
              <Text style={styles.subtitle}>
                Here’s the first recommended scenario for a {roleName}.
              </Text>
            </View>

            <View style={styles.recommendedCard}>
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedBadgeText}>Recommended for you</Text>
              </View>
              <Text style={styles.recommendedTitle}>{recommended.title}</Text>
              <Text style={styles.recommendedMeta}>
                {recommended.patient.name}, age {recommended.patient.age} · {recommended.setting}
              </Text>
              <Text style={styles.recommendedObjective}>{recommended.learnerObjective}</Text>
            </View>

            <Pressable
              style={styles.startButton}
              accessibilityRole="button"
              onPress={handleStartPractice}>
              <Text style={styles.startButtonText}>Begin Your First Practice</Text>
            </Pressable>

            <Pressable
              style={styles.browseLink}
              accessibilityRole="button"
              onPress={handleBrowseAll}>
              <Text style={styles.browseLinkText}>Browse all scenarios instead</Text>
            </Pressable>

            <Pressable
              style={styles.backButtonSmall}
              accessibilityRole="button"
              onPress={() => setStep(2)}>
              <Text style={styles.backLinkText}>← Back</Text>
            </Pressable>
          </>
        )}
    </PremiumScreen>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SimulatorColors.screenBackground,
  },
  progressBar: {
    height: 4,
    backgroundColor: SimulatorColors.border,
  },
  progressFill: {
    height: 4,
    backgroundColor: SimulatorColors.brand,
    borderRadius: 2,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  stepHeader: {
    marginBottom: 24,
    gap: 6,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: SimulatorColors.brand,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: SimulatorColors.textPrimary,
    letterSpacing: -0.3,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 15,
    color: SimulatorColors.textSecondary,
    lineHeight: 22,
  },
  roleList: {
    gap: 10,
    marginBottom: 24,
  },
  roleCard: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: SimulatorColors.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roleCardSelected: {
    borderColor: SimulatorColors.brand,
    backgroundColor: SimulatorColors.brandTint,
  },
  roleCardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roleIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: SimulatorColors.screenBackground,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  roleIconBoxSelected: {
    backgroundColor: SimulatorColors.brand,
  },
  roleIcon: {
    fontSize: 22,
  },
  roleCardText: {
    flex: 1,
    gap: 2,
  },
  roleName: {
    fontSize: 16,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
  },
  roleNameSelected: {
    color: SimulatorColors.brandDeep,
  },
  roleDesc: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    lineHeight: 18,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: SimulatorColors.borderInput,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioOuterSelected: {
    borderColor: SimulatorColors.brand,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: SimulatorColors.brand,
  },
  continueButton: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonFlex: {
    flex: 1,
  },
  continueButtonDisabled: {
    backgroundColor: SimulatorColors.brandDisabled,
  },
  continueButtonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 16,
    fontWeight: '700',
  },
  fieldGroup: {
    marginBottom: 20,
    gap: 10,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: SimulatorColors.textBody,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: SimulatorColors.borderInput,
    backgroundColor: SimulatorColors.surface,
  },
  chipActive: {
    backgroundColor: SimulatorColors.brand,
    borderColor: SimulatorColors.brand,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: SimulatorColors.textBody,
  },
  chipTextActive: {
    color: SimulatorColors.textOnBrand,
    fontWeight: '700',
  },
  experienceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  experienceOptionSelected: {
    backgroundColor: SimulatorColors.brandTint,
    borderColor: SimulatorColors.brand,
  },
  experienceLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: SimulatorColors.textPrimary,
  },
  experienceLabelSelected: {
    color: SimulatorColors.brandDeep,
  },
  experienceDesc: {
    fontSize: 12,
    color: SimulatorColors.textSecondary,
  },
  navRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  backButtonText: {
    fontSize: 15,
    color: SimulatorColors.brand,
    fontWeight: '600',
  },
  recommendedCard: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: SimulatorColors.brand,
    padding: 20,
    gap: 8,
    marginBottom: 20,
  },
  recommendedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: SimulatorColors.brandTint,
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 4,
  },
  recommendedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.brand,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
    lineHeight: 24,
  },
  recommendedMeta: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    lineHeight: 18,
  },
  recommendedObjective: {
    fontSize: 14,
    color: SimulatorColors.textBody,
    lineHeight: 21,
    marginTop: 4,
  },
  startButton: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  startButtonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 16,
    fontWeight: '800',
  },
  browseLink: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  browseLinkText: {
    fontSize: 14,
    color: SimulatorColors.textSecondary,
    textDecorationLine: 'underline',
  },
  backButtonSmall: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  backLinkText: {
    fontSize: 14,
    color: SimulatorColors.brand,
    fontWeight: '600',
  },
});
