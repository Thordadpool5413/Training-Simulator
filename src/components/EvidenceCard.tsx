import { View, Text, StyleSheet } from 'react-native';
import { SimulatorColors, Radius } from '@/constants/theme';
import type { EvidenceStatement } from '@/types/clinicalKnowledge';

interface Props {
  evidence: EvidenceStatement;
}

export function EvidenceCard({ evidence }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.tagRow}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>Evidence</Text>
        </View>
        <Text style={styles.category}>{evidence.skillCategory}</Text>
      </View>

      <Text style={styles.headline}>{evidence.headline}</Text>
      <Text style={styles.statement}>{evidence.statement}</Text>

      <View style={styles.contextBox}>
        <Text style={styles.contextLabel}>Clinical Context</Text>
        <Text style={styles.contextText}>{evidence.clinicalContext}</Text>
      </View>

      <Text style={styles.citation} selectable>{evidence.citation}</Text>
      {evidence.pmid && (
        <Text style={styles.pmid} selectable>
          PubMed PMID: {evidence.pmid}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: `${SimulatorColors.greenBorder}2A`,
    padding: 18,
    gap: 10,
    borderCurve: 'continuous',
    boxShadow: `0 18px 36px ${SimulatorColors.shadow}`,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  tag: {
    backgroundColor: SimulatorColors.greenBackground,
    borderRadius: Radius.md,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: `${SimulatorColors.greenBorder}33`,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.greenText,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  category: {
    fontSize: 12,
    color: SimulatorColors.textSecondary,
    fontStyle: 'italic',
  },
  headline: {
    fontSize: 15,
    fontWeight: '800',
    color: SimulatorColors.textPrimary,
    lineHeight: 21,
  },
  statement: {
    fontSize: 14,
    color: SimulatorColors.textBody,
    lineHeight: 21,
  },
  contextBox: {
    backgroundColor: 'rgba(49, 208, 192, 0.08)',
    borderRadius: Radius.md,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: SimulatorColors.greenBorder,
  },
  contextLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.greenText,
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  contextText: {
    fontSize: 13,
    color: SimulatorColors.textBody,
    lineHeight: 19,
  },
  citation: {
    fontSize: 11,
    color: SimulatorColors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  pmid: {
    fontSize: 11,
    color: SimulatorColors.textPlaceholder,
  },
});
