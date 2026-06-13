import { router } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radius, SimulatorColors } from '@/constants/theme';
import { LEARNING_PATHS, type LearningStage } from '@/data/learningPaths';
import { useSimulator } from '@/state/SimulatorContext';
import type { CompletedSession } from '@/types/simulator';

// ── cert tier config ───────────────────────────────────────────────────────────

interface CertTier {
  stageNumber: 1 | 2 | 3;
  designation: string;    // shown large on the card
  credential: string;     // formal credential line on PDF
  description: string;    // what the earner demonstrated
  color: string;
  tint: string;
  border: string;
  accentColor: string;    // PDF accent (gold for expert)
}

const CERT_TIERS: CertTier[] = [
  {
    stageNumber: 1,
    designation: 'Communication Foundations',
    credential: 'Foundation Certificate',
    description: 'has demonstrated foundational proficiency in hospice communication, including explaining hospice support, addressing family concerns, and navigating common barriers to care.',
    color: '#16A34A',
    tint: '#F0FDF4',
    border: '#86EFAC',
    accentColor: '#16A34A',
  },
  {
    stageNumber: 2,
    designation: 'Advanced Clinical Practice',
    credential: 'Core Practice Certificate',
    description: 'has demonstrated advanced proficiency in complex hospice communication, including difficult care transitions, family resistance, and challenging clinical conversations.',
    color: '#2563EB',
    tint: '#EFF6FF',
    border: '#BFDBFE',
    accentColor: '#2563EB',
  },
  {
    stageNumber: 3,
    designation: 'Clinical Expert',
    credential: 'Clinical Expert Certificate',
    description: 'has achieved clinical expert status in hospice and palliative care communication, demonstrating mastery across all scenario types including prognostic uncertainty, grief, family conflict, and end-of-life conversations.',
    color: '#7C3AED',
    tint: '#F5F3FF',
    border: '#DDD6FE',
    accentColor: '#F59E0B',  // gold accents on the expert cert
  },
];

// ── helpers ────────────────────────────────────────────────────────────────────

function stageStats(
  stage: LearningStage,
  roleId: string,
  sessions: CompletedSession[],
): { completedCount: number; avgScore: number; earnedDate: string | null } {
  const bestByScenario = new Map<string, number>();
  let latestDate: string | null = null;

  sessions
    .filter((s) => s.roleId === roleId && stage.scenarioIds.includes(s.scenarioId))
    .forEach((s) => {
      const best = bestByScenario.get(s.scenarioId) ?? 0;
      if (s.overallScore > best) bestByScenario.set(s.scenarioId, s.overallScore);
      if (!latestDate || s.completedAt > latestDate) latestDate = s.completedAt;
    });

  const completedCount = bestByScenario.size;
  const scores = [...bestByScenario.values()];
  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

  return { completedCount, avgScore, earnedDate: latestDate };
}

function formatDate(iso: string | null): string {
  if (!iso) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function scoreGrade(avg: number): string {
  if (avg >= 3.7) return 'With Distinction';
  if (avg >= 3.0) return 'With Merit';
  return 'Passing';
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── PDF builders ───────────────────────────────────────────────────────────────

function buildFoundationPDF(params: {
  roleName: string; designation: string; description: string;
  scenarioCount: number; avgScore: number; dateLabel: string; grade: string;
}): string {
  const { roleName, designation, description, scenarioCount, avgScore, dateLabel, grade } = params;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Georgia,'Times New Roman',serif;background:#fff;padding:0}
  .page{width:100%;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px}
  .frame{border:5px double #16A34A;padding:48px 56px;max-width:720px;width:100%;text-align:center;position:relative}
  .corner{position:absolute;width:24px;height:24px;background:#16A34A}
  .tl{top:-2px;left:-2px}.tr{top:-2px;right:-2px}.bl{bottom:-2px;left:-2px}.br{bottom:-2px;right:-2px}
  .org{font-size:11px;font-family:Arial,sans-serif;letter-spacing:2.5px;text-transform:uppercase;color:#6B7280;margin-bottom:8px}
  .tier-label{font-size:11px;font-family:Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;color:#16A34A;font-weight:700;margin-bottom:18px}
  .cert-title{font-size:36px;color:#166534;margin-bottom:6px}
  .divider{width:80px;height:2px;background:#16A34A;margin:16px auto}
  .this{font-size:14px;color:#6B7280;font-style:italic;margin-bottom:6px;font-family:Arial,sans-serif}
  .role{font-size:28px;color:#111827;font-weight:bold;margin-bottom:6px}
  .desig{font-size:20px;color:#166534;font-weight:600;margin-bottom:16px;font-family:Arial,sans-serif}
  .body{font-size:14px;color:#374151;line-height:1.7;font-family:Arial,sans-serif;margin-bottom:20px;max-width:540px;margin-left:auto;margin-right:auto}
  .stats{display:flex;justify-content:center;gap:48px;margin:12px 0;font-family:Arial,sans-serif}
  .stat-val{font-size:32px;font-weight:bold;color:#16A34A}
  .stat-lbl{font-size:11px;color:#6B7280;text-transform:uppercase;letter-spacing:1px;margin-top:3px}
  .grade{display:inline-block;background:#F0FDF4;border:1px solid #86EFAC;border-radius:4px;padding:4px 14px;font-size:13px;font-weight:700;color:#166534;font-family:Arial,sans-serif;margin:8px 0}
  .date{font-size:13px;color:#9CA3AF;margin-top:16px;font-family:Arial,sans-serif}
  .disclaimer{font-size:10px;color:#D1D5DB;margin-top:14px;font-family:Arial,sans-serif}
</style></head><body><div class="page"><div class="frame">
  <div class="corner tl"></div><div class="corner tr"></div>
  <div class="corner bl"></div><div class="corner br"></div>
  <div class="org">Hospice Communication Training Simulator</div>
  <div class="tier-label">Foundation Certificate</div>
  <div class="cert-title">Certificate of Achievement</div>
  <div class="divider"></div>
  <div class="this">This certifies that</div>
  <div class="role">${escapeHtml(roleName)}</div>
  <div class="desig">${escapeHtml(designation)}</div>
  <div class="body">${escapeHtml(description)}</div>
  <div class="divider"></div>
  <div class="stats">
    <div><div class="stat-val">${scenarioCount}</div><div class="stat-lbl">Scenarios</div></div>
    <div><div class="stat-val">${avgScore.toFixed(1)}<span style="font-size:18px;color:#6B7280"> /4</span></div><div class="stat-lbl">Avg Score</div></div>
  </div>
  <div class="grade">${escapeHtml(grade)}</div>
  <div class="divider"></div>
  <div class="date">${escapeHtml(dateLabel)}</div>
  <div class="disclaimer">For personal training records only. Does not constitute a professional credential.</div>
</div></div></body></html>`;
}

function buildCorePDF(params: {
  roleName: string; designation: string; description: string;
  scenarioCount: number; avgScore: number; dateLabel: string; grade: string;
}): string {
  const { roleName, designation, description, scenarioCount, avgScore, dateLabel, grade } = params;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Georgia,'Times New Roman',serif;background:#fff;padding:0}
  .page{width:100%;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px}
  .outer{border:3px solid #2563EB;padding:6px;max-width:720px;width:100%}
  .inner{border:1px solid #BFDBFE;padding:48px 56px;text-align:center;position:relative}
  .header-bar{background:linear-gradient(135deg,#1E40AF,#2563EB);padding:16px 24px;margin:-48px -56px 32px;text-align:center}
  .header-org{font-size:10px;font-family:Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.75)}
  .header-title{font-size:13px;font-family:Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:#fff;font-weight:700;margin-top:4px}
  .cert-title{font-size:34px;color:#1E3A8A;margin-bottom:4px}
  .tier-label{font-size:11px;font-family:Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;color:#2563EB;font-weight:700;margin-bottom:20px}
  .divider{width:80px;height:2px;background:#2563EB;margin:16px auto}
  .this{font-size:14px;color:#6B7280;font-style:italic;margin-bottom:6px;font-family:Arial,sans-serif}
  .role{font-size:28px;color:#111827;font-weight:bold;margin-bottom:6px}
  .desig{font-size:20px;color:#1D4ED8;font-weight:600;margin-bottom:16px;font-family:Arial,sans-serif}
  .body{font-size:14px;color:#374151;line-height:1.7;font-family:Arial,sans-serif;margin-bottom:20px;max-width:540px;margin-left:auto;margin-right:auto}
  .stats{display:flex;justify-content:center;gap:48px;margin:12px 0;font-family:Arial,sans-serif}
  .stat-val{font-size:32px;font-weight:bold;color:#2563EB}
  .stat-lbl{font-size:11px;color:#6B7280;text-transform:uppercase;letter-spacing:1px;margin-top:3px}
  .grade{display:inline-block;background:#EFF6FF;border:1px solid #BFDBFE;border-radius:4px;padding:4px 14px;font-size:13px;font-weight:700;color:#1D4ED8;font-family:Arial,sans-serif;margin:8px 0}
  .date{font-size:13px;color:#9CA3AF;margin-top:16px;font-family:Arial,sans-serif}
  .disclaimer{font-size:10px;color:#D1D5DB;margin-top:14px;font-family:Arial,sans-serif}
</style></head><body><div class="page"><div class="outer"><div class="inner">
  <div class="header-bar">
    <div class="header-org">Hospice Communication Training Simulator</div>
    <div class="header-title">Core Practice Certificate</div>
  </div>
  <div class="cert-title">Certificate of Advanced Practice</div>
  <div class="tier-label">Core Clinical Conversations</div>
  <div class="divider"></div>
  <div class="this">This certifies that</div>
  <div class="role">${escapeHtml(roleName)}</div>
  <div class="desig">${escapeHtml(designation)}</div>
  <div class="body">${escapeHtml(description)}</div>
  <div class="divider"></div>
  <div class="stats">
    <div><div class="stat-val">${scenarioCount}</div><div class="stat-lbl">Scenarios</div></div>
    <div><div class="stat-val">${avgScore.toFixed(1)}<span style="font-size:18px;color:#6B7280"> /4</span></div><div class="stat-lbl">Avg Score</div></div>
  </div>
  <div class="grade">${escapeHtml(grade)}</div>
  <div class="divider"></div>
  <div class="date">${escapeHtml(dateLabel)}</div>
  <div class="disclaimer">For personal training records only. Does not constitute a professional credential.</div>
</div></div></div></body></html>`;
}

function buildExpertPDF(params: {
  roleName: string; designation: string; description: string;
  totalScenarios: number; avgScore: number; dateLabel: string; grade: string;
}): string {
  const { roleName, designation, description, totalScenarios, avgScore, dateLabel, grade } = params;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Georgia,'Times New Roman',serif;background:#fff;padding:0}
  .page{width:100%;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px;background:#FAF5FF}
  .frame{border:4px solid #7C3AED;padding:0;max-width:740px;width:100%;background:#fff;position:relative;overflow:hidden}
  .gold-rule{height:6px;background:linear-gradient(90deg,#F59E0B,#FCD34D,#F59E0B)}
  .header-bar{background:linear-gradient(135deg,#4C1D95,#6D28D9,#7C3AED);padding:28px 56px 24px;text-align:center}
  .header-org{font-size:10px;font-family:Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.65)}
  .header-expert{font-size:22px;font-family:Arial,sans-serif;letter-spacing:4px;text-transform:uppercase;color:#FCD34D;font-weight:700;margin-top:8px}
  .seal{font-size:48px;margin:20px 0 12px}
  .body-section{padding:32px 56px 40px;text-align:center}
  .cert-title{font-size:32px;color:#4C1D95;margin-bottom:4px}
  .tier-sub{font-size:12px;font-family:Arial,sans-serif;letter-spacing:2.5px;text-transform:uppercase;color:#7C3AED;font-weight:700;margin-bottom:24px}
  .gold-divider{width:100px;height:3px;background:linear-gradient(90deg,#F59E0B,#FCD34D,#F59E0B);margin:16px auto;border-radius:2px}
  .this{font-size:14px;color:#6B7280;font-style:italic;margin-bottom:6px;font-family:Arial,sans-serif}
  .role{font-size:30px;color:#111827;font-weight:bold;margin-bottom:6px}
  .desig{font-size:20px;color:#4C1D95;font-weight:700;margin-bottom:20px;font-family:Arial,sans-serif}
  .body{font-size:14px;color:#374151;line-height:1.75;font-family:Arial,sans-serif;margin-bottom:24px;max-width:560px;margin-left:auto;margin-right:auto}
  .stats{display:flex;justify-content:center;gap:56px;margin:16px 0;font-family:Arial,sans-serif}
  .stat-val{font-size:34px;font-weight:bold;color:#7C3AED}
  .stat-lbl{font-size:11px;color:#6B7280;text-transform:uppercase;letter-spacing:1px;margin-top:3px}
  .grade{display:inline-block;background:linear-gradient(135deg,#FEF3C7,#FDE68A);border:1px solid #F59E0B;border-radius:4px;padding:5px 18px;font-size:13px;font-weight:800;color:#92400E;font-family:Arial,sans-serif;margin:8px 0;letter-spacing:0.5px}
  .date{font-size:13px;color:#9CA3AF;margin-top:18px;font-family:Arial,sans-serif}
  .disclaimer{font-size:10px;color:#D1D5DB;margin-top:12px;font-family:Arial,sans-serif}
</style></head><body><div class="page"><div class="frame">
  <div class="gold-rule"></div>
  <div class="header-bar">
    <div class="header-org">Hospice Communication Training Simulator</div>
    <div class="header-expert">★ Clinical Expert ★</div>
  </div>
  <div class="gold-rule"></div>
  <div class="body-section">
    <div class="seal">🏅</div>
    <div class="cert-title">Clinical Expert Certificate</div>
    <div class="tier-sub">Hospice &amp; Palliative Care Communication</div>
    <div class="gold-divider"></div>
    <div class="this">This certifies that</div>
    <div class="role">${escapeHtml(roleName)}</div>
    <div class="desig">${escapeHtml(designation)}</div>
    <div class="body">${escapeHtml(description)}</div>
    <div class="gold-divider"></div>
    <div class="stats">
      <div><div class="stat-val">${totalScenarios}</div><div class="stat-lbl">Scenarios</div></div>
      <div><div class="stat-val">${avgScore.toFixed(1)}<span style="font-size:18px;color:#6B7280"> /4</span></div><div class="stat-lbl">Avg Score</div></div>
      <div><div class="stat-val">3</div><div class="stat-lbl">Stages</div></div>
    </div>
    <div class="grade">✦ ${escapeHtml(grade)} ✦</div>
    <div class="gold-divider"></div>
    <div class="date">${escapeHtml(dateLabel)}</div>
    <div class="disclaimer">For personal training records only. Does not constitute a professional credential.</div>
  </div>
  <div class="gold-rule"></div>
</div></div></body></html>`;
}

// ── screen ─────────────────────────────────────────────────────────────────────

export default function CertificateScreen() {
  const { completedSessions, selectedRoleId } = useSimulator();

  const defaultRole = selectedRoleId ?? 'clinical_liaison';
  const [activeRoleId, setActiveRoleId] = useState<string>(
    LEARNING_PATHS.find((p) => p.roleId === defaultRole) ? defaultRole : 'clinical_liaison',
  );
  const [generating, setGenerating] = useState<1 | 2 | 3 | null>(null);

  const path = LEARNING_PATHS.find((p) => p.roleId === activeRoleId)!;

  const tierData = path.stages.map((stage, idx) => {
    const tier = CERT_TIERS[idx]!;
    const { completedCount, avgScore, earnedDate } = stageStats(stage, activeRoleId, completedSessions);
    const isEarned = completedCount === stage.scenarioIds.length;
    return { tier, stage, completedCount, avgScore, earnedDate, isEarned };
  });

  const allEarned = tierData.every((t) => t.isEarned);
  const expertAvg = allEarned
    ? tierData.reduce((sum, t) => sum + t.avgScore, 0) / tierData.length
    : 0;
  const expertDate = allEarned
    ? tierData.reduce((latest, t) => (!t.earnedDate || (latest && latest > t.earnedDate) ? latest : t.earnedDate), null as string | null)
    : null;
  const totalScenarios = path.stages.reduce((n, s) => n + s.scenarioIds.length, 0);

  async function handleDownload(stageNumber: 1 | 2 | 3) {
    const idx = stageNumber - 1;
    const td = tierData[idx];
    if (!td?.isEarned && stageNumber !== 3) return;
    if (stageNumber === 3 && !allEarned) return;

    setGenerating(stageNumber);
    try {
      const dateLabel = stageNumber === 3
        ? formatDate(expertDate)
        : formatDate(td?.earnedDate ?? null);
      const avg = stageNumber === 3 ? expertAvg : (td?.avgScore ?? 0);
      const count = stageNumber === 3 ? totalScenarios : (td?.stage.scenarioIds.length ?? 0);
      const grade = scoreGrade(avg);
      const tier = CERT_TIERS[idx]!;

      let html = '';
      const baseParams = {
        roleName: path.roleName,
        designation: tier.designation,
        description: tier.description,
        avgScore: avg,
        dateLabel,
        grade,
      };

      if (stageNumber === 1) {
        html = buildFoundationPDF({ ...baseParams, scenarioCount: count });
      } else if (stageNumber === 2) {
        html = buildCorePDF({ ...baseParams, scenarioCount: count });
      } else {
        html = buildExpertPDF({ ...baseParams, totalScenarios: count });
      }

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
      setGenerating(null);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Pressable style={styles.backLink} accessibilityRole="button" onPress={() => router.back()}>
            <Text style={styles.backLinkText}>← Back</Text>
          </Pressable>
          <Text style={styles.title} accessibilityRole="header">Certificates</Text>
          <Text style={styles.subtitle}>
            Earn certificates by completing each stage of your learning path.
          </Text>
        </View>

        {/* Role tabs */}
        <View style={styles.roleTabs}>
          {LEARNING_PATHS.map((p) => (
            <Pressable
              key={p.roleId}
              style={[styles.roleTab, activeRoleId === p.roleId && styles.roleTabActive]}
              accessibilityRole="button"
              onPress={() => setActiveRoleId(p.roleId)}>
              <Text style={[styles.roleTabText, activeRoleId === p.roleId && styles.roleTabTextActive]}>
                {p.roleName}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Stage certificates */}
        {tierData.map(({ tier, stage, completedCount, avgScore, earnedDate, isEarned }, idx) => {
          const isExpert = tier.stageNumber === 3;
          const isDownloading = generating === tier.stageNumber;

          return (
            <View
              key={tier.stageNumber}
              style={[
                styles.certCard,
                isEarned
                  ? [styles.certCardEarned, { borderColor: tier.border }]
                  : styles.certCardLocked,
                isExpert && isEarned && styles.certCardExpert,
              ]}>

              {/* Card header strip */}
              <View style={[
                styles.certStrip,
                { backgroundColor: isEarned ? tier.color : SimulatorColors.border },
              ]}>
                {isExpert && isEarned && (
                  <View style={styles.expertGoldBar} />
                )}
                <View style={styles.certStripInner}>
                  <View style={[styles.stageBadge, { backgroundColor: isEarned ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)' }]}>
                    <Text style={[styles.stageBadgeText, { color: isEarned ? '#fff' : SimulatorColors.textSecondary }]}>
                      {tier.stageNumber}
                    </Text>
                  </View>
                  <View style={styles.certStripText}>
                    <Text style={[styles.certStripLabel, { color: isEarned ? 'rgba(255,255,255,0.75)' : SimulatorColors.textSecondary }]}>
                      {isEarned ? 'Stage ' + tier.stageNumber + ' · Earned' : 'Stage ' + tier.stageNumber + ' · Locked'}
                    </Text>
                    <Text style={[styles.certStripTitle, { color: isEarned ? '#fff' : SimulatorColors.textSecondary }]}>
                      {tier.credential}
                    </Text>
                  </View>
                  {isEarned ? (
                    <Text style={styles.earnedStamp}>✓</Text>
                  ) : (
                    <Text style={styles.lockStamp}>🔒</Text>
                  )}
                </View>
                {isExpert && isEarned && (
                  <View style={styles.expertGoldBar} />
                )}
              </View>

              {/* Card body */}
              <View style={styles.certBody}>
                {isEarned ? (
                  <>
                    {/* Preview */}
                    <View style={[styles.certPreview, { backgroundColor: tier.tint, borderColor: tier.border }]}>
                      {isExpert && (
                        <Text style={styles.expertSeal}>🏅</Text>
                      )}
                      <Text style={[styles.certPreviewDesig, { color: tier.color }]}>
                        {tier.designation}
                      </Text>
                      <Text style={styles.certPreviewRole}>{path.roleName}</Text>
                      <View style={styles.certPreviewStats}>
                        <View style={styles.certPreviewStat}>
                          <Text style={[styles.certPreviewStatVal, { color: tier.color }]}>
                            {isExpert ? totalScenarios : stage.scenarioIds.length}
                          </Text>
                          <Text style={styles.certPreviewStatLabel}>Scenarios</Text>
                        </View>
                        <View style={styles.certPreviewStatDivider} />
                        <View style={styles.certPreviewStat}>
                          <Text style={[styles.certPreviewStatVal, { color: tier.color }]}>
                            {(isExpert ? expertAvg : avgScore).toFixed(1)}
                          </Text>
                          <Text style={styles.certPreviewStatLabel}>Avg Score</Text>
                        </View>
                        <View style={styles.certPreviewStatDivider} />
                        <View style={styles.certPreviewStat}>
                          <Text style={[styles.certPreviewStatVal, { color: tier.color }]}>
                            {scoreGrade(isExpert ? expertAvg : avgScore)}
                          </Text>
                          <Text style={styles.certPreviewStatLabel}>Grade</Text>
                        </View>
                      </View>
                      <Text style={styles.certPreviewDate}>
                        Earned {formatDate(isExpert ? expertDate : earnedDate)}
                      </Text>
                    </View>

                    {/* Download button */}
                    <Pressable
                      style={[styles.downloadButton, { backgroundColor: tier.color }, isDownloading && styles.downloadButtonDisabled]}
                      accessibilityRole="button"
                      disabled={isDownloading}
                      onPress={() => { void handleDownload(tier.stageNumber); }}>
                      {isDownloading ? (
                        <View style={styles.downloadRow}>
                          <ActivityIndicator size="small" color="#fff" />
                          <Text style={styles.downloadButtonText}>Generating PDF…</Text>
                        </View>
                      ) : (
                        <Text style={styles.downloadButtonText}>📄  Download PDF Certificate</Text>
                      )}
                    </Pressable>
                  </>
                ) : (
                  <>
                    {/* Locked state */}
                    <Text style={styles.lockedDesig}>{tier.designation}</Text>
                    <Text style={styles.lockedDesc}>
                      Complete all {stage.scenarioIds.length} scenarios in Stage {tier.stageNumber} to earn this certificate.
                    </Text>
                    <View style={styles.progressSection}>
                      <View style={styles.progressMeta}>
                        <Text style={styles.progressLabel}>Your progress</Text>
                        <Text style={styles.progressFraction}>{completedCount} / {stage.scenarioIds.length}</Text>
                      </View>
                      <View style={styles.progressTrack}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              backgroundColor: tier.color,
                              width: stage.scenarioIds.length > 0
                                ? `${(completedCount / stage.scenarioIds.length) * 100}%` as `${number}%`
                                : '0%',
                            },
                          ]}
                        />
                      </View>
                    </View>
                    <Pressable
                      style={styles.pathButton}
                      accessibilityRole="button"
                      onPress={() => router.push('/learning-path')}>
                      <Text style={styles.pathButtonText}>Go to Learning Path →</Text>
                    </Pressable>
                  </>
                )}
              </View>
            </View>
          );
        })}

        <Text style={styles.disclaimer}>
          Certificates are for personal training records only and do not constitute a professional credential or CE credit.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: SimulatorColors.screenBackground },
  scroll: { padding: 20, paddingBottom: 48, gap: 16 },
  header: { gap: 4 },
  backLink: { alignSelf: 'flex-start', marginBottom: 4 },
  backLinkText: { fontSize: 14, color: SimulatorColors.brand, fontWeight: '600' },
  title: { fontSize: 26, fontWeight: '800', color: SimulatorColors.textPrimary, letterSpacing: -0.3 },
  subtitle: { fontSize: 14, color: SimulatorColors.textSecondary, lineHeight: 21 },

  roleTabs: { flexDirection: 'row', gap: 8 },
  roleTab: {
    flex: 1, paddingVertical: 9, alignItems: 'center',
    borderRadius: Radius.md, borderWidth: 1.5,
    borderColor: SimulatorColors.borderInput, backgroundColor: SimulatorColors.surface,
  },
  roleTabActive: { borderColor: SimulatorColors.brand, backgroundColor: SimulatorColors.brandTint },
  roleTabText: { fontSize: 13, fontWeight: '600', color: SimulatorColors.textSecondary },
  roleTabTextActive: { color: SimulatorColors.brandDeep, fontWeight: '700' },

  certCard: {
    borderRadius: Radius.lg, borderWidth: 1.5,
    overflow: 'hidden', backgroundColor: SimulatorColors.surface,
  },
  certCardEarned: { borderWidth: 1.5 },
  certCardLocked: { borderColor: SimulatorColors.border, opacity: 0.8 },
  certCardExpert: { borderWidth: 2.5 },

  certStrip: { overflow: 'hidden' },
  expertGoldBar: { height: 5, backgroundColor: '#F59E0B' },
  certStripInner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 16, paddingVertical: 14,
  },
  stageBadge: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stageBadgeText: { fontSize: 16, fontWeight: '800' },
  certStripText: { flex: 1, gap: 1 },
  certStripLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  certStripTitle: { fontSize: 17, fontWeight: '700', lineHeight: 22 },
  earnedStamp: { fontSize: 22, flexShrink: 0 },
  lockStamp: { fontSize: 18, flexShrink: 0 },

  certBody: { padding: 16, gap: 12 },
  certPreview: {
    borderRadius: Radius.md, borderWidth: 1,
    padding: 20, alignItems: 'center', gap: 6,
  },
  expertSeal: { fontSize: 36, marginBottom: 4 },
  certPreviewDesig: { fontSize: 18, fontWeight: '800', textAlign: 'center', letterSpacing: -0.2 },
  certPreviewRole: { fontSize: 15, fontWeight: '600', color: SimulatorColors.textSecondary, textAlign: 'center' },
  certPreviewStats: { flexDirection: 'row', alignItems: 'center', gap: 0, marginTop: 8 },
  certPreviewStat: { flex: 1, alignItems: 'center', gap: 2 },
  certPreviewStatVal: { fontSize: 20, fontWeight: '800' },
  certPreviewStatLabel: { fontSize: 10, fontWeight: '600', color: SimulatorColors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.3 },
  certPreviewStatDivider: { width: 1, height: 28, backgroundColor: SimulatorColors.borderDivider },
  certPreviewDate: { fontSize: 12, color: SimulatorColors.textSecondary, marginTop: 6 },

  downloadButton: { borderRadius: Radius.md, paddingVertical: 13, alignItems: 'center' },
  downloadButtonDisabled: { opacity: 0.6 },
  downloadRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  downloadButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  lockedDesig: { fontSize: 17, fontWeight: '700', color: SimulatorColors.textSecondary },
  lockedDesc: { fontSize: 14, color: SimulatorColors.textSecondary, lineHeight: 21 },
  progressSection: { gap: 8 },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { fontSize: 13, color: SimulatorColors.textSecondary, fontWeight: '600' },
  progressFraction: { fontSize: 13, fontWeight: '700', color: SimulatorColors.brand },
  progressTrack: { height: 8, backgroundColor: SimulatorColors.border, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4 },
  pathButton: { paddingVertical: 10, alignItems: 'center' },
  pathButtonText: { fontSize: 14, color: SimulatorColors.brand, fontWeight: '600' },

  disclaimer: { fontSize: 11, color: SimulatorColors.textSecondary, textAlign: 'center', lineHeight: 17 },
});
