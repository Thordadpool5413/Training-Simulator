import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DiagnosisChip } from '@/components/DiagnosisChip';
import { SectionCard } from '@/components/SectionCard';
import { Radius, SimulatorColors } from '@/constants/theme';
import { clinicalDiagnoses } from '@/data/clinicalDiagnoses';
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
  const clinicalDx = clinicalDiagnoses.find((d) => d.diagnosisId === scenario.knownDiagnosisId);

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
          <View style={[rowStyles.row, rowStyles.rowBorder]}>
            <Text style={rowStyles.label}>Known diagnosis</Text>
            <Text style={rowStyles.value}>{diagnosis?.name ?? scenario.knownDiagnosisId}</Text>
            {clinicalDx != null && (
              <View style={styles.chipContainer}>
                <DiagnosisChip
                  icd10Code={clinicalDx.icd10Code}
                  icd10Description={clinicalDx.icd10Description}
                  lcdId={clinicalDx.lcdId}
                />
              </View>
            )}
          </View>
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

        {diagnosis != null && diagnosis.familyMisconceptions.length > 0 && (
          <SectionCard title="What the Family May Believe">
            <Text style={styles.misconceptionIntro}>
              These are common misconceptions families hold about this diagnosis. Expect to hear resistance shaped by one or more of these beliefs.
            </Text>
            {diagnosis.familyMisconceptions.map((m, i) => (
              <View key={i} style={styles.misconceptionRow}>
                <Text style={styles.misconceptionBullet}>!</Text>
                <Text style={styles.misconceptionText}>{m}</Text>
              </View>
            ))}
          </SectionCard>
        )}

        {clinicalDx != null && (
          <SectionCard title="Clinical Eligibility Context">
            <Text style={styles.eligibilityIntro}>
              Top indicators supporting hospice eligibility for this diagnosis — per CMS LCD {clinicalDx.lcdId}.
            </Text>
            {clinicalDx.eligibilityCriteria.slice(0, 3).map((criterion, i) => (
              <View key={i} style={styles.criterionRow}>
                <Text style={styles.criterionBullet}>•</Text>
                <Text style={styles.criterionText}>{criterion}</Text>
              </View>
            ))}
            <View style={styles.declineHeader}>
              <Text style={styles.declineSectionLabel}>Clinical decline indicators</Text>
            </View>
            {clinicalDx.clinicalDeclineIndicators.slice(0, 3).map((indicator, i) => (
              <View key={i} style={styles.criterionRow}>
                <Text style={styles.criterionBullet}>◦</Text>
                <Text style={styles.indicatorText}>{indicator}</Text>
              </View>
            ))}
          </SectionCard>
        )}

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
  card: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    overflow: 'hidden',
  },
  chipContainer: {
    marginTop: 8,
  },
  misconceptionIntro: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    lineHeight: 19,
    marginBottom: 8,
  },
  misconceptionRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  misconceptionBullet: {
    fontSize: 13,
    color: SimulatorColors.scoreOrange,
    fontWeight: '700',
    width: 14,
    lineHeight: 20,
  },
  misconceptionText: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
  },
  eligibilityIntro: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    lineHeight: 19,
    marginBottom: 8,
  },
  criterionRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  criterionBullet: {
    fontSize: 14,
    color: SimulatorColors.brand,
    lineHeight: 20,
    width: 12,
  },
  criterionText: {
    flex: 1,
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 20,
  },
  declineHeader: {
    marginTop: 10,
    marginBottom: 4,
  },
  declineSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  indicatorText: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
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
