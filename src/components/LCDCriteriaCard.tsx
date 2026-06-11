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
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    padding: 14,
    gap: 8,
  },
  header: {
    marginBottom: 4,
  },
  lcdId: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338CA',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  lcdTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E1B4B',
    marginBottom: 2,
  },
  contractor: {
    fontSize: 12,
    color: '#6B7280',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: SimulatorColors.brandDeep,
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
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 20,
  },
  indicatorText: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
  },
});
