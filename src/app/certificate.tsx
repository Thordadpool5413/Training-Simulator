import { router } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SectionCard } from '@/components/SectionCard';
import { Radius, SimulatorColors } from '@/constants/theme';
import { roles } from '@/data/roles';
import { useSimulator } from '@/state/SimulatorContext';

export default function CertificateScreen() {
  const { completedSessions, selectedRoleId, learnerProfile } = useSimulator();
  const [generating, setGenerating] = useState(false);

  const role = roles.find((r) => r.id === selectedRoleId);
  const roleLabel = role?.name ?? selectedRoleId ?? 'Learner';

  const avgScore =
    completedSessions.length > 0
      ? completedSessions.reduce((sum, s) => sum + s.overallScore, 0) / completedSessions.length
      : 0;

  const dateLabel = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const experienceLabel = learnerProfile
    ? `${learnerProfile.yearsInRole} years in role · ${learnerProfile.hospiceExperienceLevel} hospice experience`
    : null;

  async function handleDownload() {
    setGenerating(true);
    try {
      const html = buildCertificateHTML({
        roleLabel,
        completedCount: completedSessions.length,
        avgScore,
        dateLabel,
      });
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          UTI: 'com.adobe.pdf',
          mimeType: 'application/pdf',
          dialogTitle: 'Save or share your certificate',
        });
      }
    } catch {
      // silently fail
    } finally {
      setGenerating(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          style={styles.backLink}
          accessibilityRole="button"
          onPress={() => router.back()}>
          <Text style={styles.backLinkText}>← Back</Text>
        </Pressable>

        <Text style={styles.screenTitle} accessibilityRole="header">
          Training Certificate
        </Text>

        <View style={styles.certificateCard}>
          <View style={styles.certHeader}>
            <Text style={styles.certOrg}>Hospice Communication Training Simulator</Text>
            <Text style={styles.certTitle}>Certificate of Completion</Text>
          </View>

          <View style={styles.certDivider} />

          <Text style={styles.certThis}>This certifies that</Text>
          <Text style={styles.certRole}>{roleLabel}</Text>
          <Text style={styles.certBody}>
            has successfully completed hospice and palliative care communication training
          </Text>

          {experienceLabel && (
            <Text style={styles.certMeta}>{experienceLabel}</Text>
          )}

          <View style={styles.certDivider} />

          <View style={styles.certStats}>
            <View style={styles.certStat}>
              <Text style={styles.certStatValue}>{completedSessions.length}</Text>
              <Text style={styles.certStatLabel}>
                {completedSessions.length === 1 ? 'Scenario' : 'Scenarios'} Completed
              </Text>
            </View>
            <View style={styles.certStatDivider} />
            <View style={styles.certStat}>
              <Text style={styles.certStatValue}>{avgScore.toFixed(1)}<Text style={styles.certStatValueSmall}> / 4</Text></Text>
              <Text style={styles.certStatLabel}>Avg Skill Score</Text>
            </View>
          </View>

          <View style={styles.certDivider} />
          <Text style={styles.certDate}>{dateLabel}</Text>
        </View>

        {completedSessions.length > 0 && (
          <SectionCard title="Completed Scenarios">
            {completedSessions.map((s, i) => (
              <View key={i} style={styles.sessionRow}>
                <Text style={styles.sessionTitle} numberOfLines={1}>{s.scenarioTitle}</Text>
                <Text style={styles.sessionScore}>{s.overallScore.toFixed(1)}</Text>
              </View>
            ))}
          </SectionCard>
        )}

        <Pressable
          style={[styles.downloadButton, generating && styles.downloadButtonDisabled]}
          accessibilityRole="button"
          onPress={handleDownload}
          disabled={generating}>
          {generating ? (
            <View style={styles.downloadRow}>
              <ActivityIndicator size="small" color={SimulatorColors.textOnBrand} />
              <Text style={styles.downloadButtonText}>Generating PDF...</Text>
            </View>
          ) : (
            <Text style={styles.downloadButtonText}>Download PDF Certificate</Text>
          )}
        </Pressable>

        <Text style={styles.note}>
          Certificate is for personal training records only and does not constitute a professional credential.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function buildCertificateHTML(params: {
  roleLabel: string;
  completedCount: number;
  avgScore: number;
  dateLabel: string;
}): string {
  const { roleLabel, completedCount, avgScore, dateLabel } = params;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, 'Times New Roman', serif; background: #fff; padding: 0; }
    .page { width: 100%; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 48px; }
    .frame { border: 6px double #2563EB; padding: 48px 56px; max-width: 720px; width: 100%; text-align: center; }
    .org { font-size: 13px; font-family: Arial, sans-serif; letter-spacing: 2px; text-transform: uppercase; color: #6B7280; margin-bottom: 16px; }
    .cert-title { font-size: 38px; color: #1E3A8A; font-weight: normal; margin-bottom: 24px; }
    .divider { width: 80px; height: 2px; background: #2563EB; margin: 0 auto 24px; }
    .this { font-size: 15px; color: #6B7280; font-style: italic; margin-bottom: 8px; font-family: Arial, sans-serif; }
    .role { font-size: 30px; color: #111827; font-weight: bold; margin-bottom: 12px; }
    .body { font-size: 16px; color: #374151; line-height: 1.7; font-family: Arial, sans-serif; margin-bottom: 24px; }
    .stats { display: flex; justify-content: center; gap: 48px; margin: 16px 0; font-family: Arial, sans-serif; }
    .stat-val { font-size: 36px; font-weight: bold; color: #2563EB; }
    .stat-lbl { font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
    .date { font-size: 14px; color: #9CA3AF; margin-top: 20px; font-family: Arial, sans-serif; }
  </style>
</head>
<body>
  <div class="page">
    <div class="frame">
      <div class="org">Hospice Communication Training Simulator</div>
      <div class="cert-title">Certificate of Completion</div>
      <div class="divider"></div>
      <div class="this">This certifies that</div>
      <div class="role">${escapeHtml(roleLabel)}</div>
      <div class="body">
        has successfully completed hospice and palliative<br>
        care communication training
      </div>
      <div class="divider"></div>
      <div class="stats">
        <div>
          <div class="stat-val">${completedCount}</div>
          <div class="stat-lbl">${completedCount === 1 ? 'Scenario' : 'Scenarios'} Completed</div>
        </div>
        <div>
          <div class="stat-val">${avgScore.toFixed(1)}<span style="font-size:20px;color:#6B7280"> / 4</span></div>
          <div class="stat-lbl">Avg Skill Score</div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="date">${escapeHtml(dateLabel)}</div>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SimulatorColors.screenBackground,
  },
  content: {
    padding: 20,
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
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
  },
  certificateCard: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: SimulatorColors.brand,
    padding: 28,
    alignItems: 'center',
    gap: 10,
  },
  certHeader: {
    alignItems: 'center',
    gap: 6,
  },
  certOrg: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  certTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: SimulatorColors.brandDeep,
    textAlign: 'center',
  },
  certDivider: {
    width: 60,
    height: 2,
    backgroundColor: SimulatorColors.brand,
    borderRadius: 1,
  },
  certThis: {
    fontSize: 14,
    color: SimulatorColors.textSecondary,
    fontStyle: 'italic',
  },
  certRole: {
    fontSize: 22,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
    textAlign: 'center',
  },
  certBody: {
    fontSize: 15,
    color: SimulatorColors.textBody,
    textAlign: 'center',
    lineHeight: 22,
  },
  certMeta: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    textAlign: 'center',
  },
  certStats: {
    flexDirection: 'row',
    gap: 32,
    alignItems: 'center',
  },
  certStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: SimulatorColors.border,
  },
  certStat: {
    alignItems: 'center',
    gap: 4,
  },
  certStatValue: {
    fontSize: 28,
    fontWeight: '700',
    color: SimulatorColors.brand,
  },
  certStatValueSmall: {
    fontSize: 16,
    color: SimulatorColors.textSecondary,
  },
  certStatLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  certDate: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: SimulatorColors.borderDivider,
    gap: 8,
  },
  sessionTitle: {
    flex: 1,
    fontSize: 14,
    color: SimulatorColors.textBody,
  },
  sessionScore: {
    fontSize: 14,
    fontWeight: '700',
    color: SimulatorColors.brand,
  },
  downloadButton: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  downloadButtonDisabled: {
    backgroundColor: SimulatorColors.brandDisabled,
  },
  downloadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  downloadButtonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 16,
    fontWeight: '700',
  },
  note: {
    fontSize: 12,
    color: SimulatorColors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
