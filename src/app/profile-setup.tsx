import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SectionCard } from '@/components/SectionCard';
import { Radius, SimulatorColors } from '@/constants/theme';
import { useSimulator } from '@/state/SimulatorContext';
import type {
  ComfortLevel,
  HospiceExperienceLevel,
  LearnerProfile,
  PrimarySetting,
} from '@/types/simulator';

const YEARS_OPTIONS: { label: string; value: string }[] = [
  { label: '< 1 year', value: '< 1' },
  { label: '1–2 years', value: '1-2' },
  { label: '3–5 years', value: '3-5' },
  { label: '5–10 years', value: '5-10' },
  { label: '10+ years', value: '10+' },
];

const EXPERIENCE_OPTIONS: { label: string; value: HospiceExperienceLevel; desc: string }[] = [
  { label: 'None', value: 'none', desc: 'Little to no hospice exposure' },
  { label: 'Some', value: 'some', desc: 'Some cases or training' },
  { label: 'Extensive', value: 'extensive', desc: 'Regular hospice practice' },
];

const SETTING_OPTIONS: { label: string; value: PrimarySetting }[] = [
  { label: 'Hospital', value: 'hospital' },
  { label: 'Home', value: 'home' },
  { label: 'Facility', value: 'facility' },
  { label: 'Other', value: 'other' },
];

const COMFORT_LABELS: Record<number, string> = {
  1: 'New',
  2: 'Building',
  3: 'OK',
  4: 'Confident',
  5: 'Expert',
};

const COMFORT_FIELDS: { key: keyof LearnerProfile; label: string }[] = [
  { key: 'comfortHospiceConversations', label: 'Hospice conversations' },
  { key: 'comfortFamilyObjections', label: 'Family objections' },
  { key: 'comfortMedicationQuestions', label: 'Medication questions' },
  { key: 'comfortDeathAndDying', label: 'Death and dying' },
];

export default function ProfileSetupScreen() {
  const { learnerProfile, setLearnerProfile } = useSimulator();

  const [yearsInRole, setYearsInRole] = useState(learnerProfile?.yearsInRole ?? '');
  const [hospiceExperience, setHospiceExperience] = useState<HospiceExperienceLevel>(
    learnerProfile?.hospiceExperienceLevel ?? 'none'
  );
  const [primarySetting, setPrimarySetting] = useState<PrimarySetting>(
    learnerProfile?.primarySetting ?? 'hospital'
  );
  const [comfortHospice, setComfortHospice] = useState<ComfortLevel>(
    learnerProfile?.comfortHospiceConversations ?? 3
  );
  const [comfortObjections, setComfortObjections] = useState<ComfortLevel>(
    learnerProfile?.comfortFamilyObjections ?? 3
  );
  const [comfortMeds, setComfortMeds] = useState<ComfortLevel>(
    learnerProfile?.comfortMedicationQuestions ?? 3
  );
  const [comfortDeath, setComfortDeath] = useState<ComfortLevel>(
    learnerProfile?.comfortDeathAndDying ?? 3
  );

  const canSave = yearsInRole !== '';

  function handleSave() {
    const profile: LearnerProfile = {
      yearsInRole,
      hospiceExperienceLevel: hospiceExperience,
      primarySetting,
      comfortHospiceConversations: comfortHospice,
      comfortFamilyObjections: comfortObjections,
      comfortMedicationQuestions: comfortMeds,
      comfortDeathAndDying: comfortDeath,
    };
    setLearnerProfile(profile);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/role');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          style={styles.backLink}
          accessibilityRole="button"
          onPress={() => router.canGoBack() ? router.back() : router.replace('/')}>
          <Text style={styles.backLinkText}>← Back</Text>
        </Pressable>

        <Text style={styles.title} accessibilityRole="header">
          {learnerProfile ? 'Update Your Profile' : 'Set Up Your Profile'}
        </Text>
        <Text style={styles.subtitle}>
          Helps tailor coaching feedback to your actual experience level.
        </Text>

        <SectionCard title="Years in Your Clinical Role">
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
        </SectionCard>

        <SectionCard title="Hospice Experience">
          {EXPERIENCE_OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              style={[styles.optionRow, hospiceExperience === opt.value && styles.optionRowActive]}
              accessibilityRole="button"
              onPress={() => setHospiceExperience(opt.value)}>
              <View style={[styles.radioOuter, hospiceExperience === opt.value && styles.radioOuterActive]}>
                {hospiceExperience === opt.value && <View style={styles.radioInner} />}
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.optionLabel, hospiceExperience === opt.value && styles.optionLabelActive]}>
                  {opt.label}
                </Text>
                <Text style={styles.optionDesc}>{opt.desc}</Text>
              </View>
            </Pressable>
          ))}
        </SectionCard>

        <SectionCard title="Primary Practice Setting">
          <View style={styles.chipRow}>
            {SETTING_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value}
                style={[styles.chip, primarySetting === opt.value && styles.chipActive]}
                accessibilityRole="button"
                onPress={() => setPrimarySetting(opt.value)}>
                <Text style={[styles.chipText, primarySetting === opt.value && styles.chipTextActive]}>
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </SectionCard>

        <SectionCard title="Comfort Levels">
          <Text style={styles.comfortNote}>
            Rate your comfort from 1 (new to this) to 5 (expert).
          </Text>
          {[
            { key: 'comfortHospice' as const, label: 'Hospice conversations', value: comfortHospice, setter: setComfortHospice },
            { key: 'comfortObjections' as const, label: 'Family objections', value: comfortObjections, setter: setComfortObjections },
            { key: 'comfortMeds' as const, label: 'Medication questions', value: comfortMeds, setter: setComfortMeds },
            { key: 'comfortDeath' as const, label: 'Death and dying', value: comfortDeath, setter: setComfortDeath },
          ].map(({ key, label, value, setter }) => (
            <View key={key} style={styles.comfortRow}>
              <Text style={styles.comfortLabel}>{label}</Text>
              <View style={styles.raterRow}>
                {([1, 2, 3, 4, 5] as ComfortLevel[]).map((n) => (
                  <Pressable
                    key={n}
                    style={[styles.raterButton, value === n && styles.raterButtonActive]}
                    accessibilityRole="button"
                    accessibilityLabel={`${label}: ${COMFORT_LABELS[n]}`}
                    onPress={() => setter(n)}>
                    <Text style={[styles.raterNum, value === n && styles.raterNumActive]}>{n}</Text>
                    <Text style={[styles.raterLbl, value === n && styles.raterLblActive]}>
                      {COMFORT_LABELS[n]}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </SectionCard>

        <Pressable
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          accessibilityRole="button"
          disabled={!canSave}
          onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {learnerProfile ? 'Update Profile' : 'Save Profile'}
          </Text>
        </Pressable>

        <Text style={styles.note}>
          Your profile is stored locally and never shared.
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
  subtitle: {
    fontSize: 15,
    color: SimulatorColors.textSecondary,
    lineHeight: 22,
    marginTop: -8,
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
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 4,
  },
  optionRowActive: {
    backgroundColor: SimulatorColors.brandTint,
    borderColor: SimulatorColors.brand,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: SimulatorColors.borderInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: SimulatorColors.brand,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: SimulatorColors.brand,
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: SimulatorColors.textPrimary,
  },
  optionLabelActive: {
    color: SimulatorColors.brandDeep,
  },
  optionDesc: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
  },
  comfortNote: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    marginBottom: 8,
  },
  comfortRow: {
    gap: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: SimulatorColors.borderDivider,
  },
  comfortLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: SimulatorColors.textBody,
  },
  raterRow: {
    flexDirection: 'row',
    gap: 6,
  },
  raterButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: SimulatorColors.borderInput,
    backgroundColor: SimulatorColors.surface,
    gap: 2,
  },
  raterButtonActive: {
    backgroundColor: SimulatorColors.brand,
    borderColor: SimulatorColors.brand,
  },
  raterNum: {
    fontSize: 16,
    fontWeight: '700',
    color: SimulatorColors.textBody,
  },
  raterNumActive: {
    color: SimulatorColors.textOnBrand,
  },
  raterLbl: {
    fontSize: 9,
    color: SimulatorColors.textSecondary,
    textAlign: 'center',
  },
  raterLblActive: {
    color: SimulatorColors.brandTint,
  },
  saveButton: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: SimulatorColors.brandDisabled,
  },
  saveButtonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 16,
    fontWeight: '700',
  },
  note: {
    fontSize: 12,
    color: SimulatorColors.textSecondary,
    textAlign: 'center',
  },
});

// suppress unused import warning
void COMFORT_FIELDS;
