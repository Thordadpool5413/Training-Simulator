import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { Radius, SimulatorColors } from '@/constants/theme';
import { useSimulator } from '@/state/SimulatorContext';
import type {
  ComfortLevel,
  HospiceExperienceLevel,
  LearnerProfile,
  PrimarySetting,
} from '@/types/simulator';

const COMFORT_LEVELS: ComfortLevel[] = [1, 2, 3, 4, 5];

const EXPERIENCE_OPTIONS: { value: HospiceExperienceLevel; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'some', label: 'Some' },
  { value: 'extensive', label: 'Extensive' },
];

const SETTING_OPTIONS: { value: PrimarySetting; label: string }[] = [
  { value: 'hospital', label: 'Hospital' },
  { value: 'home', label: 'Home' },
  { value: 'facility', label: 'Facility' },
  { value: 'other', label: 'Other' },
];

function OptionRow<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (v: T) => void;
}) {
  return (
    <View style={optionStyles.row}>
      {options.map((opt) => (
        <Pressable
          key={opt.value}
          style={[optionStyles.chip, selected === opt.value && optionStyles.chipSelected]}
          onPress={() => onSelect(opt.value)}>
          <Text
            style={[
              optionStyles.chipText,
              selected === opt.value && optionStyles.chipTextSelected,
            ]}>
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function ComfortRow({
  value,
  onChange,
}: {
  value: ComfortLevel;
  onChange: (v: ComfortLevel) => void;
}) {
  return (
    <View style={optionStyles.row}>
      {COMFORT_LEVELS.map((n) => (
        <Pressable
          key={n}
          style={[optionStyles.chip, value === n && optionStyles.chipSelected]}
          onPress={() => onChange(n)}>
          <Text
            style={[optionStyles.chipText, value === n && optionStyles.chipTextSelected]}>
            {n}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function ProfileScreen() {
  const { setLearnerProfile } = useSimulator();

  const [yearsInRole, setYearsInRole] = useState('');
  const [hospiceExperienceLevel, setHospiceExperienceLevel] =
    useState<HospiceExperienceLevel>('none');
  const [primarySetting, setPrimarySetting] = useState<PrimarySetting>('hospital');
  const [comfortHospiceConversations, setComfortHospiceConversations] =
    useState<ComfortLevel>(3);
  const [comfortFamilyObjections, setComfortFamilyObjections] = useState<ComfortLevel>(3);
  const [comfortMedicationQuestions, setComfortMedicationQuestions] =
    useState<ComfortLevel>(3);
  const [comfortDeathAndDying, setComfortDeathAndDying] = useState<ComfortLevel>(3);

  function handleContinue() {
    const profile: LearnerProfile = {
      yearsInRole,
      hospiceExperienceLevel,
      primarySetting,
      comfortHospiceConversations,
      comfortFamilyObjections,
      comfortMedicationQuestions,
      comfortDeathAndDying,
    };
    setLearnerProfile(profile);
    router.push('/scenario' as Href);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Learner Profile</Text>
        <Text style={styles.subtitle}>
          This helps calibrate the simulation to your experience level.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Years in role</Text>
          <TextInput
            style={styles.textInput}
            value={yearsInRole}
            onChangeText={setYearsInRole}
            placeholder="e.g. 3"
            keyboardType="numeric"
            maxLength={3}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Hospice experience level</Text>
          <OptionRow
            options={EXPERIENCE_OPTIONS}
            selected={hospiceExperienceLevel}
            onSelect={setHospiceExperienceLevel}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Primary setting</Text>
          <OptionRow
            options={SETTING_OPTIONS}
            selected={primarySetting}
            onSelect={setPrimarySetting}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            Comfort with hospice conversations
            <Text style={styles.scale}> (1 = low, 5 = high)</Text>
          </Text>
          <ComfortRow value={comfortHospiceConversations} onChange={setComfortHospiceConversations} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            Comfort with family objections
            <Text style={styles.scale}> (1 = low, 5 = high)</Text>
          </Text>
          <ComfortRow value={comfortFamilyObjections} onChange={setComfortFamilyObjections} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            Comfort with medication questions
            <Text style={styles.scale}> (1 = low, 5 = high)</Text>
          </Text>
          <ComfortRow
            value={comfortMedicationQuestions}
            onChange={setComfortMedicationQuestions}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            Comfort with death and dying conversations
            <Text style={styles.scale}> (1 = low, 5 = high)</Text>
          </Text>
          <ComfortRow value={comfortDeathAndDying} onChange={setComfortDeathAndDying} />
        </View>

        <Pressable style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SimulatorColors.screenBackground,
  },
  container: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: SimulatorColors.textSecondary,
    marginBottom: 28,
    lineHeight: 22,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: SimulatorColors.textBody,
    marginBottom: 10,
  },
  scale: {
    fontWeight: '400',
    color: SimulatorColors.textPlaceholder,
    fontSize: 13,
  },
  textInput: {
    backgroundColor: SimulatorColors.surface,
    borderWidth: 1,
    borderColor: SimulatorColors.borderInput,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: SimulatorColors.textPrimary,
  },
  button: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 16,
    fontWeight: '600',
  },
});

const optionStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: SimulatorColors.borderInput,
    backgroundColor: SimulatorColors.surface,
  },
  chipSelected: {
    backgroundColor: SimulatorColors.brand,
    borderColor: SimulatorColors.brand,
  },
  chipText: {
    fontSize: 14,
    color: SimulatorColors.textBody,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: SimulatorColors.textOnBrand,
  },
});
