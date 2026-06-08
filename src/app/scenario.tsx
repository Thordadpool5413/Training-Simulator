import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radius, SimulatorColors } from '@/constants/theme';
import { diagnoses } from '@/data/diagnoses';
import { scenarioTemplates } from '@/data/scenarioTemplates';
import { useSimulator } from '@/state/SimulatorContext';

export default function ScenarioScreen() {
  const { selectedRoleId, setSelectedScenarioId } = useSimulator();

  if (!selectedRoleId) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Please select a role before choosing a scenario.</Text>
          <Pressable style={styles.errorButton} onPress={() => router.push('/role' as Href)}>
            <Text style={styles.errorButtonText}>Go to Role Selection</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const availableScenarios = scenarioTemplates.filter((s) => s.allowedRoleId === selectedRoleId);

  if (availableScenarios.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No scenarios available for the selected role.</Text>
          <Pressable style={styles.errorButton} onPress={() => router.push('/role' as Href)}>
            <Text style={styles.errorButtonText}>Go to Role Selection</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  function handleSelect(scenarioId: string) {
    setSelectedScenarioId(scenarioId);
    router.push('/scenario-briefing' as Href);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title} accessibilityRole="header">Select a Scenario</Text>
        <Text style={styles.subtitle}>Choose the scenario you will practice.</Text>

        {availableScenarios.map((scenario) => {
          const diagnosis = diagnoses.find((d) => d.id === scenario.knownDiagnosisId);
          return (
            <View key={scenario.id} style={styles.card}>
              <Text style={styles.scenarioTitle}>{scenario.title}</Text>
              <Text style={styles.scenarioMeta}>
                {scenario.patient.name}, age {scenario.patient.age} · {scenario.setting}
              </Text>
              {diagnosis != null && (
                <Text style={styles.scenarioMeta}>{diagnosis.name}</Text>
              )}
              <Text style={styles.scenarioObjective}>{scenario.learnerObjective}</Text>
              <Pressable
                style={({ pressed }) => [
                  styles.selectButton,
                  pressed && styles.selectButtonPressed,
                ]}
                onPress={() => handleSelect(scenario.id)}>
                <Text style={styles.selectButtonText}>Select</Text>
              </Pressable>
            </View>
          );
        })}
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
  card: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.lg,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
  },
  scenarioTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
    marginBottom: 6,
  },
  scenarioMeta: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    lineHeight: 19,
    marginBottom: 4,
  },
  scenarioObjective: {
    fontSize: 14,
    color: SimulatorColors.textBody,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  selectButton: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectButtonPressed: {
    backgroundColor: SimulatorColors.brandDark,
  },
  selectButtonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 15,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: SimulatorColors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  errorButton: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  errorButtonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 15,
    fontWeight: '600',
  },
});
