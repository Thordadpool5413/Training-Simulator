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
    borderRadius: Radius.md,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: `${SimulatorColors.brand}40`,
  },
  codeText: {
    fontSize: 13,
    fontWeight: '700',
    color: SimulatorColors.brand,
    fontFamily: 'monospace',
  },
  description: {
    flex: 1,
    fontSize: 13,
    color: SimulatorColors.textBody,
    lineHeight: 18,
  },
  lcdBadge: {
    backgroundColor: SimulatorColors.indigoBackground,
    borderRadius: Radius.md,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: `${SimulatorColors.indigoBorder}33`,
  },
  lcdText: {
    fontSize: 11,
    fontWeight: '600',
    color: SimulatorColors.indigoLabel,
  },
});
