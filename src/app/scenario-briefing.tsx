import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radius, SimulatorColors } from '@/constants/theme';
import { diagnoses } from '@/data/diagnoses';
import { roles } from '@/data/roles';
import { scenarioTemplates } from '@/data/scenarioTemplates';
import { useSimulator } from '@/state/SimulatorContext';

export default function ScenarioBriefingScreen() {
  const { selectedRoleId, selectedScenarioId } = useSimulator();

  if (!selectedRoleId) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Please select a role before viewing a scenario.</Text>
          <Pressable style={styles.button} accessibilityRole="button" onPress={() => router.push('/role' as Href)}>
            <Text style={styles.buttonText}>Go to Role Selection</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!selectedScenarioId) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Please select a scenario before viewing the briefing.</Text>
          <Pressable style={styles.button} accessibilityRole="button" onPress={() => router.push('/scenario' as Href)}>
            <Text style={styles.buttonText}>Go to Scenario Selection</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const scenario = scenarioTemplates.find((s) => s.id === selectedScenarioId);

  if (!scenario) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Scenario not found. Please select a scenario.</Text>
          <Pressable style={styles.button} accessibilityRole="button" onPress={() => router.push('/scenario' as Href)}>
            <Text style={styles.buttonText}>Go to Scenario Selection</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const role = roles.find((r) => r.id === selectedRoleId);
  const diagnosis = diagnoses.find((d) => d.id === scenario.knownDiagnosisId);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable
          style={styles.backLink}
          accessibilityRole="button"
          accessibilityLabel="Back to scenarios"
          onPress={() => router.back()}>
          <Text style={styles.backLinkText}>← Back to Scenarios</Text>
        </Pressable>
        <Text style={styles.title} accessibilityRole="header">{scenario.title}</Text>

        <View style={styles.card}>
          <BriefingRow label="Your role" value={role?.name ?? selectedRoleId} />
          <BriefingRow label="Setting" value={scenario.setting} />
          <BriefingRow
            label="Patient"
            value={`${scenario.patient.name}, age ${scenario.patient.age}`}
          />
          <BriefingRow
            label="Known diagnosis"
            value={diagnosis?.name ?? scenario.knownDiagnosisId}
          />
          <BriefingRow
            label="Recent clinical change"
            value={scenario.recentClinicalChange}
          />
          <BriefingRow
            label="Who is present"
            value={scenario.whoIsPresent.join(', ')}
          />
          <BriefingRow label="Your objective" value={scenario.learnerObjective} emphasized />
          <BriefingRow label="Role reminder" value={scenario.roleReminder} emphasized last />
        </View>

        <Pressable
          style={styles.button}
          accessibilityRole="button"
          onPress={() => router.push('/simulation' as Href)}>
          <Text style={styles.buttonText}>Start Simulation</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function BriefingRow({
  label,
  value,
  last,
  emphasized,
}: {
  label: string;
  value: string;
  last?: boolean;
  emphasized?: boolean;
}) {
  return (
    <View style={[rowStyles.row, !last && rowStyles.rowBorder, emphasized && rowStyles.rowEmphasized]}>
      <Text style={[rowStyles.label, emphasized && rowStyles.labelEmphasized]}>{label}</Text>
      <Text style={rowStyles.value}>{value}</Text>
    </View>
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
  backLink: {
    marginBottom: 12,
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
    marginBottom: 20,
  },
  card: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    marginBottom: 28,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 16,
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
});

const rowStyles = StyleSheet.create({
  row: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: SimulatorColors.borderDivider,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  labelEmphasized: {
    color: SimulatorColors.brandDark,
    fontWeight: '700',
  },
  rowEmphasized: {
    backgroundColor: SimulatorColors.brandTint,
  },
  value: {
    fontSize: 15,
    color: SimulatorColors.textPrimary,
    lineHeight: 22,
  },
});
