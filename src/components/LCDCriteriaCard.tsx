import { View, Text, StyleSheet } from 'react-native';
import { SimulatorColors, Radius } from '@/constants/theme';
import type { ClinicalDiagnosis } from '@/types/clinicalKnowledge';

interface Props {
  diagnosis: ClinicalDiagnosis;
}

export function LCDCriteriaCard({ diagnosis }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.lcdId}>{diagnosis.lcdId}</Text>
        <Text style={styles.lcdTitle}>{diagnosis.lcdTitle}</Text>
        <Text style={styles.contractor}>{diagnosis.lcdContractor}</Text>
      </View>

      <Text style={styles.sectionLabel}>Hospice Eligibility Criteria</Text>
      {diagnosis.eligibilityCriteria.map((criterion, i) => (
        <View key={i} style={styles.criterionRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.criterionText}>{criterion}</Text>
        </View>
      ))}

      <Text style={styles.sectionLabel}>Clinical Decline Indicators</Text>
      {diagnosis.clinicalDeclineIndicators.map((indicator, i) => (
        <View key={i} style={styles.criterionRow}>
          <Text style={styles.bullet}>◦</Text>
          <Text style={styles.indicatorText}>{indicator}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: `${SimulatorColors.indigoBorder}33`,
    padding: 18,
    gap: 8,
    borderCurve: 'continuous',
    boxShadow: `0 18px 36px ${SimulatorColors.shadow}`,
  },
  header: {
    marginBottom: 4,
  },
  lcdId: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.indigoLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  lcdTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: SimulatorColors.textPrimary,
    marginBottom: 2,
  },
  contractor: {
    fontSize: 12,
    color: SimulatorColors.textSecondary,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: SimulatorColors.indigoLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: 4,
    marginBottom: 2,
  },
  criterionRow: {
    flexDirection: 'row',
    gap: 6,
    paddingLeft: 2,
  },
  bullet: {
    fontSize: 14,
    color: SimulatorColors.brand,
    lineHeight: 20,
    width: 10,
  },
  criterionText: {
    flex: 1,
    fontSize: 14,
    color: SimulatorColors.textBody,
    lineHeight: 21,
  },
  indicatorText: {
    flex: 1,
    fontSize: 14,
    color: SimulatorColors.textBody,
    lineHeight: 21,
  },
});
