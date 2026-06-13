import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SimulatorColors, Radius } from '@/constants/theme';
import type { HospiceMedication } from '@/types/clinicalKnowledge';

interface Props {
  medication: HospiceMedication;
  roleId?: string;
}

const ROLE_LABELS: Record<string, string> = {
  clinical_liaison: 'CL',
  rn: 'RN',
  social_worker: 'SW',
};

export function MedicationCard({ medication, roleId }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <Pressable onPress={() => setExpanded((v) => !v)} style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{medication.name}</Text>
          <View style={styles.classBadge}>
            <Text style={styles.classText}>{medication.drugClass}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.rxcui}>RxCUI {medication.rxcui}</Text>
          <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </Pressable>

      <Text style={styles.purpose}>{medication.clinicalPurpose}</Text>

      {expanded && (
        <View style={styles.expandedContent}>
          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Hospice Context</Text>
          <Text style={styles.bodyText}>{medication.hospiceContext}</Text>

          {roleId === 'rn' && (
            <>
              <Text style={styles.sectionLabel}>RN Education Point</Text>
              <View style={styles.highlightBox}>
                <Text style={styles.highlightText}>{medication.rnEducationPoint}</Text>
              </View>
            </>
          )}

          <Text style={styles.sectionLabel}>Family Teaching Language</Text>
          <View style={styles.familyBox}>
            <Text style={styles.familyText}>{medication.familyTeachingPoint}</Text>
          </View>

          <Text style={styles.sectionLabel}>Role Note</Text>
          <Text style={styles.roleNoteText}>{medication.roleNote}</Text>

          <View style={styles.routesRow}>
            <Text style={styles.routesLabel}>Routes:</Text>
            {medication.commonRoutes.map((route) => (
              <View key={route} style={styles.routeBadge}>
                <Text style={styles.routeText}>{route}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    gap: 4,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 4,
    marginLeft: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  classBadge: {
    backgroundColor: SimulatorColors.indigoBackground,
    borderRadius: Radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  classText: {
    fontSize: 11,
    color: '#4338CA',
    fontWeight: '500',
  },
  rxcui: {
    fontSize: 11,
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
  chevron: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  purpose: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
  },
  expandedContent: {
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.brandDeep,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: 4,
  },
  bodyText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
  },
  highlightBox: {
    backgroundColor: SimulatorColors.brandTint,
    borderRadius: Radius.sm,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: SimulatorColors.brand,
  },
  highlightText: {
    fontSize: 13,
    color: SimulatorColors.brandDeep,
    lineHeight: 19,
  },
  familyBox: {
    backgroundColor: SimulatorColors.greenBackground,
    borderRadius: Radius.sm,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: SimulatorColors.greenBorder,
  },
  familyText: {
    fontSize: 13,
    color: '#14532D',
    lineHeight: 19,
    fontStyle: 'italic',
  },
  roleNoteText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  routesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  routesLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  routeBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: Radius.sm,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  routeText: {
    fontSize: 11,
    color: '#374151',
  },
});
