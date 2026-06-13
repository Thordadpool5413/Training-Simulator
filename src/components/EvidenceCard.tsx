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

      <Text style={styles.citation}>{evidence.citation}</Text>
      {evidence.pmid && (
        <Text style={styles.pmid}>PubMed PMID: {evidence.pmid}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8FAF5',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: SimulatorColors.greenBorder,
    padding: 14,
    gap: 8,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  tag: {
    backgroundColor: SimulatorColors.greenBackground,
    borderRadius: Radius.sm,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: SimulatorColors.greenBorder,
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
    color: '#6B7280',
    fontStyle: 'italic',
  },
  headline: {
    fontSize: 14,
    fontWeight: '700',
    color: '#14532D',
    lineHeight: 20,
  },
  statement: {
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 20,
  },
  contextBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: Radius.sm,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: SimulatorColors.greenBorder,
  },
  contextLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: SimulatorColors.greenText,
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  contextText: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 18,
  },
  citation: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 16,
    marginTop: 2,
  },
  pmid: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});
