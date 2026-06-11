import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radius, SimulatorColors } from '@/constants/theme';
import { diagnoses } from '@/data/diagnoses';
import { roles } from '@/data/roles';
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

  const selectedRole = roles.find((r) => r.id === selectedRoleId);
  const scenarioCount = availableScenarios.length;
  const scenarioCountLabel = scenarioCount === 1 ? '1 scenario' : `${scenarioCount} scenarios`;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title} accessibilityRole="header">Select a Scenario</Text>
          <Pressable onPress={() => router.push('/role' as Href)}>
            <Text style={styles.changeRoleText}>Change Role</Text>
          </Pressable>
        </View>
        <Text style={styles.roleLabel}>Role: {selectedRole?.name ?? selectedRoleId}</Text>
        <Text style={styles.subtitle}>
          {scenarioCountLabel} — choose the scenario you will practice.
        </Text>

        {availableScenarios.map((scenario) => {
          const diagnosis = diagnoses.find((d) => d.id === scenario.knownDiagnosisId);
          return (
            <Pressable
              key={scenario.id}
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
              onPress={() => handleSelect(scenario.id)}>
              <Text style={styles.scenarioTitle}>{scenario.title}</Text>
              <Text style={styles.scenarioMeta}>
                {scenario.patient.name}, age {scenario.patient.age} · {scenario.setting}
              </Text>
              {diagnosis != null && (
                <Text style={styles.scenarioMeta}>{diagnosis.name}</Text>
              )}
              <Text style={styles.scenarioObjective} numberOfLines={2}>
                {scenario.learnerObjective}
              </Text>
            </Pressable>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
  },
  changeRoleText: {
    fontSize: 14,
    color: SimulatorColors.brand,
    fontWeight: '600',
  },
  roleLabel: {
    fontSize: 14,
    color: SimulatorColors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
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
  cardPressed: {
    backgroundColor: SimulatorColors.brandTint,
    borderColor: SimulatorColors.brand,
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
