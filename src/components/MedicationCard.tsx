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
      <Pressable
        onPress={() => setExpanded((v) => !v)}
        style={({ pressed }) => [styles.header, pressed && styles.headerPressed]}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{medication.name}</Text>
          <View style={styles.classBadge}>
            <Text style={styles.classText}>{medication.drugClass}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.rxcui} selectable>
            RxCUI {medication.rxcui}
          </Text>
          <Text style={styles.chevron}>{expanded ? '−' : '+'}</Text>
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
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    padding: 16,
    gap: 8,
    borderCurve: 'continuous',
    boxShadow: `0 18px 36px ${SimulatorColors.shadow}`,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerPressed: {
    opacity: 0.95,
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
    fontSize: 16,
    fontWeight: '800',
    color: SimulatorColors.textPrimary,
  },
  classBadge: {
    backgroundColor: SimulatorColors.indigoBackground,
    borderRadius: Radius.md,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: `${SimulatorColors.indigoBorder}33`,
  },
  classText: {
    fontSize: 11,
    color: SimulatorColors.indigoLabel,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  rxcui: {
    fontSize: 11,
    color: SimulatorColors.textPlaceholder,
    fontFamily: 'monospace',
  },
  chevron: {
    fontSize: 10,
    color: SimulatorColors.textPlaceholder,
  },
  purpose: {
    fontSize: 14,
    color: SimulatorColors.textBody,
    lineHeight: 21,
  },
  expandedContent: {
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: SimulatorColors.borderDivider,
    marginVertical: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: SimulatorColors.brand,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  bodyText: {
    fontSize: 14,
    color: SimulatorColors.textBody,
    lineHeight: 20,
  },
  highlightBox: {
    backgroundColor: SimulatorColors.brandTint,
    borderRadius: Radius.md,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: SimulatorColors.brand,
  },
  highlightText: {
    fontSize: 13,
    color: SimulatorColors.brand,
    lineHeight: 19,
  },
  familyBox: {
    backgroundColor: SimulatorColors.greenBackground,
    borderRadius: Radius.md,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: SimulatorColors.greenBorder,
  },
  familyText: {
    fontSize: 13,
    color: SimulatorColors.greenText,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  roleNoteText: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    lineHeight: 19,
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
    color: SimulatorColors.textSecondary,
    fontWeight: '700',
  },
  routeBadge: {
    backgroundColor: SimulatorColors.surfaceRaised,
    borderRadius: Radius.md,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
  },
  routeText: {
    fontSize: 11,
    color: SimulatorColors.textBody,
  },
});
