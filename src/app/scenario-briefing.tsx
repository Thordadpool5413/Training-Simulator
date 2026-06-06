import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
          <Pressable style={styles.button} onPress={() => router.push('/role' as Href)}>
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
          <Pressable style={styles.button} onPress={() => router.push('/scenario' as Href)}>
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
          <Pressable style={styles.button} onPress={() => router.push('/scenario' as Href)}>
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
        <Text style={styles.title}>{scenario.title}</Text>

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
    backgroundColor: '#F9FAFB',
  },
  container: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 28,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
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
    color: '#6B7280',
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
    borderBottomColor: '#F3F4F6',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  labelEmphasized: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  rowEmphasized: {
    backgroundColor: '#EFF6FF',
  },
  value: {
    fontSize: 15,
    color: '#111827',
    lineHeight: 22,
  },
});
