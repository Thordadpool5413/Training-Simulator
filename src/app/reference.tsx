import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PremiumPill, PremiumScreen } from '@/components/premium-ui';
import { DiagnosisChip } from '@/components/DiagnosisChip';
import { MedicationCard } from '@/components/MedicationCard';
import { SectionCard } from '@/components/SectionCard';
import { Radius, SimulatorColors } from '@/constants/theme';
import { clinicalDiagnoses } from '@/data/clinicalDiagnoses';
import { hospiceMedications } from '@/data/hospiceMedications';
import { lcdCriteria } from '@/data/lcdCriteria';
import { safeLanguage } from '@/data/safeLanguage';
import { useSimulator } from '@/state/SimulatorContext';

type Tab = 'medications' | 'diagnoses' | 'lcds' | 'phrases';

const TABS: { id: Tab; label: string }[] = [
  { id: 'medications', label: 'Medications' },
  { id: 'diagnoses', label: 'Diagnoses' },
  { id: 'lcds', label: 'LCDs' },
  { id: 'phrases', label: 'Phrases' },
];

export default function ReferenceScreen() {
  const { selectedRoleId } = useSimulator();
  const [activeTab, setActiveTab] = useState<Tab>('medications');

  return (
    <PremiumScreen
      eyebrow="Reference"
      title="Clinical Reference"
      subtitle="Hospice medications, diagnoses, and CMS coverage criteria."
      onBack={() => router.back()}
      backLabel="Back"
      headerRight={<PremiumPill label={TABS.find((tab) => tab.id === activeTab)?.label ?? 'Reference'} tone="indigo" />}
      scrollContentStyle={styles.scrollContent}>
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            accessibilityRole="button"
            onPress={() => setActiveTab(tab.id)}>
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

        {activeTab === 'medications' && (
          <MedicationsTab roleId={selectedRoleId ?? undefined} />
        )}
        {activeTab === 'diagnoses' && <DiagnosesTab />}
        {activeTab === 'lcds' && <LCDsTab />}
        {activeTab === 'phrases' && <PhrasesTab roleId={selectedRoleId ?? undefined} />}
    </PremiumScreen>
  );
}

function MedicationsTab({ roleId }: { roleId?: string }) {
  const grouped = hospiceMedications.reduce<Record<string, typeof hospiceMedications>>((acc, med) => {
    const key = med.drugClass;
    if (!acc[key]) acc[key] = [];
    acc[key].push(med);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(grouped).map(([drugClass, meds]) => (
        <SectionCard key={drugClass} title={drugClass}>
          {meds.map((med) => (
            <MedicationCard key={med.id} medication={med} roleId={roleId} />
          ))}
        </SectionCard>
      ))}
    </>
  );
}

function DiagnosesTab() {
  return (
    <>
      {clinicalDiagnoses.map((dx) => (
        <SectionCard key={dx.id} title={dx.lcdTitle}>
          <DiagnosisChip
            icd10Code={dx.icd10Code}
            icd10Description={dx.icd10Description}
            lcdId={dx.lcdId}
          />
          {dx.clinicalNote != null && (
            <Text style={dxStyles.note}>{dx.clinicalNote}</Text>
          )}
          <Text style={dxStyles.sectionLabel}>Eligibility Criteria</Text>
          {dx.eligibilityCriteria.map((c, i) => (
            <View key={i} style={dxStyles.bulletRow}>
              <Text style={dxStyles.bullet}>•</Text>
              <Text style={dxStyles.bulletText}>{c}</Text>
            </View>
          ))}
          <Text style={dxStyles.sectionLabel}>Clinical Decline Indicators</Text>
          {dx.clinicalDeclineIndicators.map((c, i) => (
            <View key={i} style={dxStyles.bulletRow}>
              <Text style={dxStyles.bullet}>◦</Text>
              <Text style={dxStyles.bulletText}>{c}</Text>
            </View>
          ))}
          <Text style={dxStyles.sectionLabel}>Role Relevance</Text>
          {Object.entries(dx.roleRelevance).map(([role, text]) => (
            <View key={role} style={dxStyles.roleBlock}>
              <Text style={dxStyles.roleLabel}>{ROLE_LABELS[role] ?? role}</Text>
              <Text style={dxStyles.roleText}>{text}</Text>
            </View>
          ))}
        </SectionCard>
      ))}
    </>
  );
}

function LCDsTab() {
  return (
    <>
      {lcdCriteria.map((lcd) => (
        <SectionCard key={lcd.id} title={`LCD ${lcd.displayId} — ${lcd.title}`}>
          <View style={lcdStyles.metaRow}>
            <Text style={lcdStyles.metaLabel}>Contractor</Text>
            <Text style={lcdStyles.metaValue}>{lcd.contractor}</Text>
          </View>
          <View style={lcdStyles.metaRow}>
            <Text style={lcdStyles.metaLabel}>Effective</Text>
            <Text style={lcdStyles.metaValue}>{lcd.effectiveDate}</Text>
          </View>
          {lcd.diagnosisCategories.length > 0 && (
            <>
              <Text style={lcdStyles.sectionLabel}>Diagnosis Categories</Text>
              {lcd.diagnosisCategories.map((c, i) => (
                <View key={i} style={lcdStyles.bulletRow}>
                  <Text style={lcdStyles.bullet}>•</Text>
                  <Text style={lcdStyles.bulletText}>{c}</Text>
                </View>
              ))}
            </>
          )}
          <Text style={lcdStyles.sectionLabel}>General Criteria</Text>
          {lcd.generalCriteria.map((c, i) => (
            <View key={i} style={lcdStyles.bulletRow}>
              <Text style={lcdStyles.bullet}>•</Text>
              <Text style={lcdStyles.bulletText}>{c}</Text>
            </View>
          ))}
          {lcd.specificCriteria.length > 0 && (
            <>
              <Text style={lcdStyles.sectionLabel}>Specific Criteria</Text>
              {lcd.specificCriteria.map((c, i) => (
                <View key={i} style={lcdStyles.bulletRow}>
                  <Text style={lcdStyles.bullet}>◦</Text>
                  <Text style={lcdStyles.bulletText}>{c}</Text>
                </View>
              ))}
            </>
          )}
          <View style={lcdStyles.noteBox}>
            <Text style={lcdStyles.noteText}>{lcd.clinicalNote}</Text>
          </View>
        </SectionCard>
      ))}
    </>
  );
}

function PhrasesTab({ roleId }: { roleId?: string }) {
  const ROLE_ORDER = ['clinical_liaison', 'rn', 'social_worker'];
  const ROLE_DISPLAY: Record<string, string> = {
    clinical_liaison: 'Clinical Liaison',
    rn: 'RN',
    social_worker: 'Social Worker',
  };

  const filtered = roleId
    ? safeLanguage.filter((e) => e.roleId === roleId)
    : safeLanguage;

  const grouped = ROLE_ORDER.reduce<Record<string, typeof safeLanguage>>((acc, role) => {
    const entries = filtered.filter((e) => e.roleId === role);
    if (entries.length > 0) acc[role] = entries;
    return acc;
  }, {});

  const ungrouped = filtered.filter((e) => !e.roleId);

  return (
    <>
      {roleId == null && (
        <View style={phraseStyles.intro}>
          <Text style={phraseStyles.introText}>
            Approved hospice communication language, organized by role. Use these phrases as models — not scripts.
          </Text>
        </View>
      )}
      {Object.entries(grouped).map(([role, entries]) => (
        <SectionCard key={role} title={ROLE_DISPLAY[role] ?? role}>
          {entries.map((entry) => (
            <View key={entry.id} style={phraseStyles.card}>
              <Text style={phraseStyles.context}>{entry.context}</Text>
              <Text style={phraseStyles.text}>{entry.text}</Text>
            </View>
          ))}
        </SectionCard>
      ))}
      {ungrouped.length > 0 && (
        <SectionCard title="General">
          {ungrouped.map((entry) => (
            <View key={entry.id} style={phraseStyles.card}>
              <Text style={phraseStyles.context}>{entry.context}</Text>
              <Text style={phraseStyles.text}>{entry.text}</Text>
            </View>
          ))}
        </SectionCard>
      )}
      {filtered.length === 0 && (
        <View style={phraseStyles.empty}>
          <Text style={phraseStyles.emptyText}>No phrases available for this role.</Text>
        </View>
      )}
    </>
  );
}

const phraseStyles = StyleSheet.create({
  intro: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    padding: 14,
  },
  introText: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    lineHeight: 19,
  },
  card: {
    backgroundColor: SimulatorColors.brandTint,
    borderLeftWidth: 3,
    borderLeftColor: SimulatorColors.brand,
    borderRadius: Radius.sm,
    padding: 12,
    marginBottom: 10,
    gap: 6,
  },
  context: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.brandDeep,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  text: {
    fontSize: 14,
    color: SimulatorColors.textBody,
    lineHeight: 21,
    fontStyle: 'italic',
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: SimulatorColors.textSecondary,
  },
});

const ROLE_LABELS: Record<string, string> = {
  clinical_liaison: 'Clinical Liaison',
  rn: 'RN',
  social_worker: 'Social Worker',
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SimulatorColors.screenBackground,
  },
  header: {
    backgroundColor: SimulatorColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: SimulatorColors.border,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 0,
    gap: 6,
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
    fontSize: 22,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    lineHeight: 19,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: SimulatorColors.brand,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: SimulatorColors.textSecondary,
  },
  tabTextActive: {
    color: SimulatorColors.brand,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
    gap: 16,
  },
});

const dxStyles = StyleSheet.create({
  note: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    lineHeight: 19,
    fontStyle: 'italic',
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.brandDeep,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: 10,
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  bullet: {
    fontSize: 14,
    color: SimulatorColors.brand,
    lineHeight: 20,
    width: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: SimulatorColors.textBody,
    lineHeight: 20,
  },
  roleBlock: {
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: SimulatorColors.borderDivider,
    gap: 2,
  },
  roleLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  roleText: {
    fontSize: 13,
    color: SimulatorColors.textBody,
    lineHeight: 19,
  },
});

const lcdStyles = StyleSheet.create({
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'baseline',
    paddingVertical: 2,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    width: 72,
  },
  metaValue: {
    fontSize: 13,
    color: SimulatorColors.textBody,
    flex: 1,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.brandDeep,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: 10,
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  bullet: {
    fontSize: 14,
    color: SimulatorColors.brand,
    lineHeight: 20,
    width: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: SimulatorColors.textBody,
    lineHeight: 20,
  },
  noteBox: {
    backgroundColor: SimulatorColors.warningBackground,
    borderRadius: Radius.sm,
    borderLeftWidth: 3,
    borderLeftColor: SimulatorColors.warningBorder,
    padding: 10,
    marginTop: 8,
  },
  noteText: {
    fontSize: 13,
    color: SimulatorColors.warningBodyText,
    lineHeight: 19,
  },
});
