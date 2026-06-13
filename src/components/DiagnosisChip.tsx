import { View, Text, StyleSheet } from 'react-native';
import { SimulatorColors, Radius } from '@/constants/theme';

interface Props {
  icd10Code: string;
  icd10Description: string;
  lcdId: string;
}

export function DiagnosisChip({ icd10Code, icd10Description, lcdId }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.codeBadge}>
        <Text style={styles.codeText}>{icd10Code}</Text>
      </View>
      <Text style={styles.description} numberOfLines={2}>{icd10Description}</Text>
      <View style={styles.lcdBadge}>
        <Text style={styles.lcdText}>LCD {lcdId}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  codeBadge: {
    backgroundColor: SimulatorColors.brandTint,
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: SimulatorColors.brand,
  },
  codeText: {
    fontSize: 13,
    fontWeight: '700',
    color: SimulatorColors.brandDeep,
    fontFamily: 'monospace',
  },
  description: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
  lcdBadge: {
    backgroundColor: SimulatorColors.indigoBackground,
    borderRadius: Radius.sm,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  lcdText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4338CA',
  },
});
