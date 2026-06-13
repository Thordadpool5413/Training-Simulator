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

// ── tier config ────────────────────────────────────────────────────────────────

interface CertTier {
  stageNumber: 1 | 2 | 3;
  credential: string;
  designation: string;
  programLine: string;
  bodyText: string;
  color: string;
  tint: string;
  border: string;
}

const CERT_TIERS: CertTier[] = [
  {
    stageNumber: 1,
    credential: 'Foundation Certificate',
    designation: 'Communication Foundations',
    programLine: 'Hospice & Palliative Care Communication',
    bodyText:
      'has demonstrated foundational proficiency in hospice communication — explaining hospice support, addressing family concerns, and navigating common barriers to care.',
    color: '#15803D',
    tint: '#F0FDF4',
    border: '#86EFAC',
  },
  {
    stageNumber: 2,
    credential: 'Core Practice Certificate',
    designation: 'Advanced Clinical Practice',
    programLine: 'Hospice & Palliative Care Communication',
    bodyText:
      'has demonstrated advanced proficiency in complex hospice communication, including difficult care transitions, family resistance, and high-stakes clinical conversations.',
    color: '#1D4ED8',
    tint: '#EFF6FF',
    border: '#BFDBFE',
  },
  {
    stageNumber: 3,
    credential: 'Clinical Expert',
    designation: 'Clinical Expert',
    programLine: 'Hospice & Palliative Care Communication',
    bodyText:
      'has achieved the highest designation in this training program, demonstrating mastery across all clinical conversation types — including prognostic uncertainty, grief, family conflict, medication management, and end-of-life communication.',
    color: '#6D28D9',
    tint: '#F5F3FF',
    border: '#DDD6FE',
  },
];

// ── helpers ────────────────────────────────────────────────────────────────────

function stageStats(
  stage: LearningStage,
  roleId: string,
  sessions: CompletedSession[],
): { completedCount: number; avgScore: number; earnedDate: string | null } {
  const best = new Map<string, number>();
  let latestDate: string | null = null;
  sessions
    .filter((s) => s.roleId === roleId && stage.scenarioIds.includes(s.scenarioId))
    .forEach((s) => {
      if ((best.get(s.scenarioId) ?? 0) < s.overallScore) best.set(s.scenarioId, s.overallScore);
      if (!latestDate || s.completedAt > latestDate) latestDate = s.completedAt;
    });
  const vals = [...best.values()];
  return {
    completedCount: best.size,
    avgScore: vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0,
    earnedDate: latestDate,
  };
}

function fmtDate(iso: string | null): string {
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function grade(avg: number): string {
  if (avg >= 3.7) return 'With Distinction';
  if (avg >= 3.0) return 'With Merit';
  return 'Passing';
}

function certId(roleId: string, stage: number, date: string | null): string {
  const d = date ? new Date(date) : new Date();
  return `HCS-${roleId.slice(0, 2).toUpperCase()}${stage}-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── PDF builders ───────────────────────────────────────────────────────────────

const FONT_STACK_SERIF = `'Garamond','EB Garamond','Palatino Linotype','Palatino','Book Antiqua','Georgia','Times New Roman',serif`;
const FONT_STACK_SANS = `'Optima','Candara','Gill Sans','Trebuchet MS','Arial',sans-serif`;

function buildFoundationPDF(p: {
  roleName: string; designation: string; programLine: string; bodyText: string;
  count: number; avg: number; gradeLabel: string; dateLabel: string; id: string;
}): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#FAFDF6; font-family:${FONT_STACK_SERIF}; }
  .page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:36px; }
  .frame {
    max-width:720px; width:100%; background:#fff;
    border:1px solid #86EFAC;
    box-shadow:0 0 0 6px #F0FDF4, 0 0 0 8px #86EFAC, 0 0 0 14px #F0FDF4, 0 0 0 16px #15803D;
    padding:52px 64px 48px;
    text-align:center; position:relative;
  }
  .corner { position:absolute; font-size:22px; color:#15803D; line-height:1; }
  .tl { top:20px; left:24px; } .tr { top:20px; right:24px; }
  .bl { bottom:20px; left:24px; } .br { bottom:20px; right:24px; }
  .org {
    font-family:${FONT_STACK_SANS}; font-size:9.5px; letter-spacing:3.5px;
    text-transform:uppercase; color:#6B7280; margin-bottom:6px;
  }
  .prog {
    font-family:${FONT_STACK_SANS}; font-size:10px; letter-spacing:2px;
    text-transform:uppercase; color:#15803D; font-weight:600; margin-bottom:20px;
  }
  .orn-line { display:flex; align-items:center; gap:10px; justify-content:center; margin:16px 0; }
  .orn-rule { flex:1; max-width:120px; height:1px; background:#86EFAC; }
  .orn-sym { font-size:14px; color:#15803D; }
  .cert-name { font-size:36px; color:#14532D; font-weight:700; line-height:1.2; margin-bottom:4px; }
  .cert-sub { font-family:${FONT_STACK_SANS}; font-size:11px; letter-spacing:2.5px; text-transform:uppercase; color:#15803D; font-weight:700; }
  .awarded { font-size:14px; color:#9CA3AF; font-style:italic; margin-bottom:6px; margin-top:4px; }
  .role { font-size:32px; font-weight:700; color:#111827; margin-bottom:4px; }
  .desig { font-size:17px; color:#15803D; font-weight:600; font-family:${FONT_STACK_SANS}; margin-bottom:16px; }
  .body { font-size:14px; color:#374151; line-height:1.8; max-width:520px; margin:0 auto 20px; }
  .stats { display:flex; justify-content:center; gap:40px; margin:12px 0; }
  .stat-val { font-size:30px; font-weight:700; color:#15803D; }
  .stat-small { font-size:16px; color:#9CA3AF; }
  .stat-lbl { font-family:${FONT_STACK_SANS}; font-size:9px; letter-spacing:1.5px; text-transform:uppercase; color:#9CA3AF; margin-top:3px; }
  .grade-badge {
    display:inline-block; border:1.5px solid #86EFAC; background:#F0FDF4;
    border-radius:3px; padding:5px 18px; margin:10px 0;
    font-family:${FONT_STACK_SANS}; font-size:12px; font-weight:700;
    color:#14532D; letter-spacing:1.5px; text-transform:uppercase;
  }
  .date { font-family:${FONT_STACK_SANS}; font-size:12px; color:#9CA3AF; margin-top:14px; }
  .cert-id { font-family:${FONT_STACK_SANS}; font-size:9px; color:#D1D5DB; margin-top:8px; letter-spacing:1px; }
  .disclaimer { font-family:${FONT_STACK_SANS}; font-size:9px; color:#E5E7EB; margin-top:8px; }
</style></head>
<body><div class="page"><div class="frame">
  <div class="corner tl">❧</div><div class="corner tr">❧</div>
  <div class="corner bl">❧</div><div class="corner br">❧</div>
  <div class="org">Hospice Communication Training Simulator</div>
  <div class="prog">${esc(p.programLine)}</div>
  <div class="cert-name">Certificate of Achievement</div>
  <div class="cert-sub">Foundation Level</div>
  <div class="orn-line"><div class="orn-rule"></div><div class="orn-sym">✦</div><div class="orn-rule"></div></div>
  <div class="awarded">This certificate is proudly awarded to</div>
  <div class="role">${esc(p.roleName)}</div>
  <div class="desig">${esc(p.designation)}</div>
  <div class="orn-line"><div class="orn-rule"></div><div class="orn-sym">✦</div><div class="orn-rule"></div></div>
  <div class="body">${esc(p.bodyText)}</div>
  <div class="stats">
    <div><div class="stat-val">${p.count}</div><div class="stat-lbl">Scenarios Completed</div></div>
    <div><div class="stat-val">${p.avg.toFixed(1)}<span class="stat-small"> / 4</span></div><div class="stat-lbl">Average Score</div></div>
  </div>
  <div class="grade-badge">✦ ${esc(p.gradeLabel)} ✦</div>
  <div class="orn-line"><div class="orn-rule"></div><div class="orn-sym">✦</div><div class="orn-rule"></div></div>
  <div class="date">${esc(p.dateLabel)}</div>
  <div class="cert-id">Certificate ID: ${esc(p.id)}</div>
  <div class="disclaimer">For personal training records only · Not a professional credential or CE credit</div>
</div></div></body></html>`;
}

function buildCorePDF(p: {
  roleName: string; designation: string; programLine: string; bodyText: string;
  count: number; avg: number; gradeLabel: string; dateLabel: string; id: string;
}): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#F8FAFF; font-family:${FONT_STACK_SERIF}; }
  .page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:36px; }
  .frame {
    max-width:740px; width:100%; background:#fff; overflow:hidden;
    box-shadow:0 0 0 4px #1D4ED8, 0 0 0 10px #EFF6FF, 0 0 0 12px #1D4ED8;
  }
  .top-bar {
    background:linear-gradient(135deg,#1E3A8A 0%,#1D4ED8 50%,#2563EB 100%);
    padding:28px 60px 24px; text-align:center;
  }
  .top-bar-org { font-family:${FONT_STACK_SANS}; font-size:9px; letter-spacing:4px; text-transform:uppercase; color:rgba(255,255,255,0.55); }
  .top-bar-title { font-family:${FONT_STACK_SANS}; font-size:13px; letter-spacing:3px; text-transform:uppercase; color:#fff; font-weight:700; margin-top:8px; }
  .top-bar-rule { height:1px; background:rgba(255,255,255,0.25); margin:14px 0 0; }
  .body-section { padding:44px 64px 40px; text-align:center; }
  .cert-name { font-size:38px; color:#1E3A8A; font-weight:700; line-height:1.2; }
  .cert-sub { font-family:${FONT_STACK_SANS}; font-size:11px; letter-spacing:2.5px; text-transform:uppercase; color:#1D4ED8; font-weight:700; margin-top:6px; }
  .orn-line { display:flex; align-items:center; gap:10px; justify-content:center; margin:18px 0; }
  .orn-rule { flex:1; max-width:130px; height:1px; background:#BFDBFE; }
  .orn-sym { font-size:14px; color:#1D4ED8; }
  .awarded { font-size:14px; color:#9CA3AF; font-style:italic; margin-bottom:6px; }
  .role { font-size:34px; font-weight:700; color:#111827; margin-bottom:4px; }
  .desig { font-size:17px; color:#1D4ED8; font-weight:600; font-family:${FONT_STACK_SANS}; margin-bottom:18px; }
  .body { font-size:14px; color:#374151; line-height:1.8; max-width:530px; margin:0 auto 22px; }
  .stats { display:flex; justify-content:center; gap:48px; margin:12px 0; }
  .stat-val { font-size:32px; font-weight:700; color:#1D4ED8; }
  .stat-small { font-size:17px; color:#9CA3AF; }
  .stat-lbl { font-family:${FONT_STACK_SANS}; font-size:9px; letter-spacing:1.5px; text-transform:uppercase; color:#9CA3AF; margin-top:3px; }
  .grade-badge {
    display:inline-block; border:1.5px solid #BFDBFE; background:#EFF6FF;
    border-radius:3px; padding:5px 18px; margin:10px 0;
    font-family:${FONT_STACK_SANS}; font-size:12px; font-weight:700;
    color:#1E3A8A; letter-spacing:1.5px; text-transform:uppercase;
  }
  .date { font-family:${FONT_STACK_SANS}; font-size:12px; color:#9CA3AF; margin-top:14px; }
  .bottom-bar { background:#1E3A8A; height:10px; }
  .cert-id { font-family:${FONT_STACK_SANS}; font-size:9px; color:#D1D5DB; margin-top:8px; letter-spacing:1px; }
  .disclaimer { font-family:${FONT_STACK_SANS}; font-size:9px; color:#E5E7EB; margin-top:4px; margin-bottom:32px; }
</style></head>
<body><div class="page"><div class="frame">
  <div class="top-bar">
    <div class="top-bar-org">Hospice Communication Training Simulator</div>
    <div class="top-bar-title">${esc(p.programLine)}</div>
    <div class="top-bar-rule"></div>
  </div>
  <div class="body-section">
    <div class="cert-name">Certificate of Advanced Practice</div>
    <div class="cert-sub">Core Clinical Conversations</div>
    <div class="orn-line"><div class="orn-rule"></div><div class="orn-sym">✦</div><div class="orn-rule"></div></div>
    <div class="awarded">This certificate is proudly awarded to</div>
    <div class="role">${esc(p.roleName)}</div>
    <div class="desig">${esc(p.designation)}</div>
    <div class="orn-line"><div class="orn-rule"></div><div class="orn-sym">✦</div><div class="orn-rule"></div></div>
    <div class="body">${esc(p.bodyText)}</div>
    <div class="stats">
      <div><div class="stat-val">${p.count}</div><div class="stat-lbl">Scenarios Completed</div></div>
      <div><div class="stat-val">${p.avg.toFixed(1)}<span class="stat-small"> / 4</span></div><div class="stat-lbl">Average Score</div></div>
    </div>
    <div class="grade-badge">✦ ${esc(p.gradeLabel)} ✦</div>
    <div class="orn-line"><div class="orn-rule"></div><div class="orn-sym">✦</div><div class="orn-rule"></div></div>
    <div class="date">${esc(p.dateLabel)}</div>
    <div class="cert-id">Certificate ID: ${esc(p.id)}</div>
    <div class="disclaimer">For personal training records only · Not a professional credential or CE credit</div>
  </div>
  <div class="bottom-bar"></div>
</div></div></body></html>`;
}

function buildExpertPDF(p: {
  roleName: string; designation: string; programLine: string; bodyText: string;
  totalScenarios: number; avg: number; gradeLabel: string; dateLabel: string; id: string;
}): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#1E0040; font-family:${FONT_STACK_SERIF}; }
  .page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:32px; }
  .outer-frame {
    max-width:760px; width:100%; overflow:hidden;
    border:3px solid #6D28D9;
    box-shadow:0 0 0 1px #F59E0B, 0 0 0 3px #6D28D9, 0 0 0 6px #F59E0B;
  }
  /* Top gold bar */
  .gold-bar { height:8px; background:linear-gradient(90deg,#92400E,#F59E0B,#FDE68A,#F59E0B,#92400E); }
  /* Deep purple header */
  .header {
    background:linear-gradient(160deg,#1E0040 0%,#2D0060 40%,#3B0080 70%,#4C1D95 100%);
    padding:36px 60px 28px; text-align:center; position:relative;
  }
  .header::before,.header::after {
    content:''; position:absolute; top:0; bottom:0; width:6px;
    background:linear-gradient(180deg,transparent,rgba(245,158,11,0.3),transparent);
  }
  .header::before { left:0; } .header::after { right:0; }
  .header-star { font-size:11px; letter-spacing:5px; color:#F59E0B; font-family:${FONT_STACK_SANS}; }
  .header-expert {
    font-family:'Cinzel',${FONT_STACK_SANS}; font-size:28px; font-weight:700;
    color:#FDE68A; letter-spacing:5px; text-transform:uppercase;
    text-shadow:0 0 20px rgba(245,158,11,0.5); margin:10px 0;
  }
  .header-prog { font-family:${FONT_STACK_SANS}; font-size:10px; letter-spacing:3px; text-transform:uppercase; color:rgba(253,230,138,0.6); }
  .header-gold-line { height:1px; background:linear-gradient(90deg,transparent,#F59E0B,transparent); margin:16px 0 0; }
  /* White body */
  .body-section { background:#fff; padding:40px 64px 36px; text-align:center; }
  .medal { font-size:56px; margin-bottom:10px; line-height:1; }
  .cert-name { font-size:36px; color:#3B0080; font-weight:700; line-height:1.2; }
  .cert-sub {
    font-family:'Cinzel',${FONT_STACK_SANS}; font-size:10px; letter-spacing:3px;
    text-transform:uppercase; color:#6D28D9; font-weight:600; margin-top:6px;
  }
  .orn-gold { display:flex; align-items:center; gap:10px; justify-content:center; margin:18px 0; }
  .orn-gold-rule { flex:1; max-width:130px; height:2px; background:linear-gradient(90deg,transparent,#F59E0B,transparent); }
  .orn-gold-sym { font-size:14px; color:#D97706; }
  .awarded { font-size:14px; color:#9CA3AF; font-style:italic; margin-bottom:6px; }
  .role { font-size:34px; font-weight:700; color:#111827; margin-bottom:4px; }
  .desig {
    font-family:'Cinzel',${FONT_STACK_SANS}; font-size:13px; letter-spacing:1.5px;
    text-transform:uppercase; color:#6D28D9; font-weight:700; margin-bottom:18px;
  }
  .body { font-size:14px; color:#374151; line-height:1.8; max-width:540px; margin:0 auto 22px; }
  .stats { display:flex; justify-content:center; gap:48px; margin:12px 0; }
  .stat-val { font-size:32px; font-weight:700; color:#6D28D9; }
  .stat-small { font-size:17px; color:#9CA3AF; }
  .stat-lbl { font-family:${FONT_STACK_SANS}; font-size:9px; letter-spacing:1.5px; text-transform:uppercase; color:#9CA3AF; margin-top:3px; }
  .grade-badge {
    display:inline-block; margin:10px 0; padding:7px 22px;
    background:linear-gradient(135deg,#FEF3C7,#FDE68A);
    border:1.5px solid #F59E0B; border-radius:3px;
    font-family:${FONT_STACK_SANS}; font-size:12px; font-weight:800;
    color:#78350F; letter-spacing:2px; text-transform:uppercase;
  }
  .date { font-family:${FONT_STACK_SANS}; font-size:12px; color:#9CA3AF; margin-top:14px; }
  .highest { font-family:${FONT_STACK_SANS}; font-size:10px; letter-spacing:1.5px; text-transform:uppercase; color:#D1D5DB; margin-top:6px; }
  .cert-id { font-family:${FONT_STACK_SANS}; font-size:9px; color:#D1D5DB; margin-top:8px; letter-spacing:1px; }
</style></head>
<body><div class="page"><div class="outer-frame">
  <div class="gold-bar"></div>
  <div class="header">
    <div class="header-star">★ ★ ★</div>
    <div class="header-expert">Clinical Expert</div>
    <div class="header-prog">${esc(p.programLine)}</div>
    <div class="header-gold-line"></div>
  </div>
  <div class="gold-bar"></div>
  <div class="body-section">
    <div class="medal">🏅</div>
    <div class="cert-name">Clinical Expert Certificate</div>
    <div class="cert-sub">The Highest Designation in This Program</div>
    <div class="orn-gold"><div class="orn-gold-rule"></div><div class="orn-gold-sym">✦</div><div class="orn-gold-rule"></div></div>
    <div class="awarded">This certificate is proudly awarded to</div>
    <div class="role">${esc(p.roleName)}</div>
    <div class="desig">${esc(p.designation)}</div>
    <div class="orn-gold"><div class="orn-gold-rule"></div><div class="orn-gold-sym">✦</div><div class="orn-gold-rule"></div></div>
    <div class="body">${esc(p.bodyText)}</div>
    <div class="stats">
      <div><div class="stat-val">${p.totalScenarios}</div><div class="stat-lbl">Scenarios Mastered</div></div>
      <div><div class="stat-val">${p.avg.toFixed(1)}<span class="stat-small"> / 4</span></div><div class="stat-lbl">Average Score</div></div>
      <div><div class="stat-val">3</div><div class="stat-lbl">Stages Completed</div></div>
    </div>
    <div class="grade-badge">✦ ${esc(p.gradeLabel)} ✦</div>
    <div class="orn-gold"><div class="orn-gold-rule"></div><div class="orn-gold-sym">✦</div><div class="orn-gold-rule"></div></div>
    <div class="date">${esc(p.dateLabel)}</div>
    <div class="highest">Highest Designation · Hospice Communication Training Simulator</div>
    <div class="cert-id">Certificate ID: ${esc(p.id)}</div>
  </div>
  <div class="gold-bar"></div>
</div></div></body></html>`;
}

// ── in-app certificate document component ─────────────────────────────────────

function OrnamentalDivider({ color }: { color: string }) {
  return (
    <View style={ornStyles.row}>
      <View style={[ornStyles.rule, { backgroundColor: color + '55' }]} />
      <Text style={[ornStyles.sym, { color }]}>✦</Text>
      <View style={[ornStyles.rule, { backgroundColor: color + '55' }]} />
    </View>
  );
}

function CertificateDocument({
  tier, roleName, scenarioCount, avgScore, gradeLabel, earnedDate, isExpert,
}: {
  tier: CertTier;
  roleName: string;
  scenarioCount: number;
  avgScore: number;
  gradeLabel: string;
  earnedDate: string | null;
  isExpert: boolean;
}) {
  return (
    <View style={[docStyles.frame, { borderColor: tier.color },
      isExpert && docStyles.frameExpert]}>
      {/* Expert: purple header band */}
      {isExpert && (
        <>
          <View style={docStyles.expertGoldBar} />
          <View style={docStyles.expertHeader}>
            <Text style={docStyles.expertHeaderStars}>★  ★  ★</Text>
            <Text style={docStyles.expertHeaderTitle}>CLINICAL EXPERT</Text>
            <Text style={docStyles.expertHeaderSub}>The Highest Designation</Text>
          </View>
          <View style={docStyles.expertGoldBar} />
        </>
      )}

      <View style={docStyles.inner}>
        {/* Organisation */}
        <Text style={[docStyles.orgName, { color: tier.color }]}>
          HOSPICE COMMUNICATION TRAINING
        </Text>
        <Text style={[docStyles.programLine, { color: tier.color + 'AA' }]}>
          {tier.programLine.toUpperCase()}
        </Text>

        <OrnamentalDivider color={tier.color} />

        {/* Cert title */}
        {isExpert ? (
          <>
            <Text style={docStyles.medalEmoji}>🏅</Text>
            <Text style={[docStyles.certTitle, { color: tier.color }]}>
              Clinical Expert Certificate
            </Text>
          </>
        ) : tier.stageNumber === 1 ? (
          <Text style={[docStyles.certTitle, { color: tier.color }]}>
            Certificate of Achievement
          </Text>
        ) : (
          <Text style={[docStyles.certTitle, { color: tier.color }]}>
            Certificate of Advanced Practice
          </Text>
        )}
        <Text style={[docStyles.certSub, { color: tier.color }]}>
          {tier.credential.toUpperCase()}
        </Text>

        <OrnamentalDivider color={tier.color} />

        {/* Awarded to */}
        <Text style={docStyles.awardedTo}>awarded to</Text>
        <Text style={docStyles.roleName}>{roleName}</Text>
        <Text style={[docStyles.designation, { color: tier.color }]}>
          {tier.designation}
        </Text>

        <OrnamentalDivider color={tier.color} />

        {/* Stats */}
        <View style={docStyles.statsRow}>
          <View style={docStyles.statCell}>
            <Text style={[docStyles.statVal, { color: tier.color }]}>{scenarioCount}</Text>
            <Text style={docStyles.statLbl}>
              {isExpert ? 'Scenarios\nMastered' : 'Scenarios\nCompleted'}
            </Text>
          </View>
          <View style={[docStyles.statDivider, { backgroundColor: tier.color + '30' }]} />
          <View style={docStyles.statCell}>
            <Text style={[docStyles.statVal, { color: tier.color }]}>
              {avgScore.toFixed(1)}
              <Text style={docStyles.statValSmall}>/4</Text>
            </Text>
            <Text style={docStyles.statLbl}>Average{'\n'}Score</Text>
          </View>
          {isExpert && (
            <>
              <View style={[docStyles.statDivider, { backgroundColor: tier.color + '30' }]} />
              <View style={docStyles.statCell}>
                <Text style={[docStyles.statVal, { color: tier.color }]}>3</Text>
                <Text style={docStyles.statLbl}>Stages{'\n'}Completed</Text>
              </View>
            </>
          )}
        </View>

        {/* Grade badge */}
        <View style={[docStyles.gradeBadge,
          isExpert ? docStyles.gradeBadgeExpert : { borderColor: tier.border, backgroundColor: tier.tint }]}>
          <Text style={[docStyles.gradeBadgeText,
            isExpert ? docStyles.gradeBadgeTextExpert : { color: tier.color }]}>
            ✦  {gradeLabel.toUpperCase()}  ✦
          </Text>
        </View>

        {/* Date */}
        <Text style={docStyles.dateText}>
          {fmtDate(earnedDate)}
        </Text>
      </View>
    </View>
  );
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
    ? tierData.reduce((s, t) => s + t.avgScore, 0) / tierData.length : 0;
  const expertDate = allEarned
    ? tierData.reduce(
        (latest, t) => (!t.earnedDate || (latest && latest > t.earnedDate) ? latest : t.earnedDate),
        null as string | null,
      )
    : null;
  const totalScenarios = path.stages.reduce((n, s) => n + s.scenarioIds.length, 0);

  async function handleDownload(stageNumber: 1 | 2 | 3) {
    const idx = stageNumber - 1;
    const td = tierData[idx];
    const isExpert = stageNumber === 3;
    if (!isExpert && !td?.isEarned) return;
    if (isExpert && !allEarned) return;

    setGenerating(stageNumber);
    try {
      const tier = CERT_TIERS[idx]!;
      const avg = isExpert ? expertAvg : (td?.avgScore ?? 0);
      const dateLabel = fmtDate(isExpert ? expertDate : (td?.earnedDate ?? null));
      const gradeLabel = grade(avg);
      const id = certId(activeRoleId, stageNumber, isExpert ? expertDate : (td?.earnedDate ?? null));
      const count = isExpert ? totalScenarios : (td?.stage.scenarioIds.length ?? 0);

      const baseParams = {
        roleName: path.roleName,
        designation: tier.designation,
        programLine: tier.programLine,
        bodyText: tier.bodyText,
        avg,
        gradeLabel,
        dateLabel,
        id,
      };

      let html = '';
      if (stageNumber === 1) html = buildFoundationPDF({ ...baseParams, count });
      else if (stageNumber === 2) html = buildCorePDF({ ...baseParams, count });
      else html = buildExpertPDF({ ...baseParams, totalScenarios: count });

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
            Earn expert credentials by completing each stage of your learning path.
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

        {/* Certificate cards */}
        {tierData.map(({ tier, stage, completedCount, avgScore, earnedDate, isEarned }, idx) => {
          const isExpert = tier.stageNumber === 3;
          const effectiveEarned = isExpert ? allEarned : isEarned;
          const effectiveAvg = isExpert ? expertAvg : avgScore;
          const effectiveDate = isExpert ? expertDate : earnedDate;
          const effectiveCount = isExpert ? totalScenarios : stage.scenarioIds.length;
          const isDownloading = generating === tier.stageNumber;

          return (
            <View key={tier.stageNumber} style={[
              styles.card,
              effectiveEarned ? [styles.cardEarned, { borderColor: tier.border }] : styles.cardLocked,
              isExpert && effectiveEarned && styles.cardExpert,
            ]}>
              {effectiveEarned ? (
                <>
                  <CertificateDocument
                    tier={tier}
                    roleName={path.roleName}
                    scenarioCount={effectiveCount}
                    avgScore={effectiveAvg}
                    gradeLabel={grade(effectiveAvg)}
                    earnedDate={effectiveDate}
                    isExpert={isExpert}
                  />
                  <Pressable
                    style={[styles.downloadButton,
                      isExpert ? styles.downloadButtonExpert : { backgroundColor: tier.color },
                      isDownloading && styles.downloadButtonDisabled]}
                    accessibilityRole="button"
                    disabled={isDownloading}
                    onPress={() => { void handleDownload(tier.stageNumber); }}>
                    {isDownloading ? (
                      <View style={styles.downloadRow}>
                        <ActivityIndicator size="small" color="#fff" />
                        <Text style={styles.downloadButtonText}>Generating PDF…</Text>
                      </View>
                    ) : (
                      <Text style={styles.downloadButtonText}>
                        {isExpert ? '🏅  Download Expert PDF' : '📄  Download PDF Certificate'}
                      </Text>
                    )}
                  </Pressable>
                </>
              ) : (
                <View style={styles.lockedBody}>
                  <View style={styles.lockedHeader}>
                    <Text style={styles.lockIcon}>🔒</Text>
                    <View style={styles.lockedHeaderText}>
                      <Text style={[styles.lockedStage, { color: tier.color }]}>
                        Stage {tier.stageNumber} · {tier.credential}
                      </Text>
                      <Text style={styles.lockedDesig}>{tier.designation}</Text>
                    </View>
                  </View>
                  <Text style={styles.lockedDesc}>
                    Complete all {stage.scenarioIds.length} scenarios in Stage {tier.stageNumber} to earn this certificate.
                  </Text>
                  <View style={styles.progressSection}>
                    <View style={styles.progressMeta}>
                      <Text style={styles.progressLabel}>Progress</Text>
                      <Text style={[styles.progressFraction, { color: tier.color }]}>
                        {completedCount} / {stage.scenarioIds.length}
                      </Text>
                    </View>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, {
                        backgroundColor: tier.color,
                        width: stage.scenarioIds.length > 0
                          ? `${(completedCount / stage.scenarioIds.length) * 100}%` as `${number}%`
                          : '0%',
                      }]} />
                    </View>
                  </View>
                  <Pressable style={styles.pathButton} accessibilityRole="button"
                    onPress={() => router.push('/learning-path')}>
                    <Text style={[styles.pathButtonText, { color: tier.color }]}>
                      Continue in Learning Path →
                    </Text>
                  </Pressable>
                </View>
              )}
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

const ornStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 10 },
  rule: { flex: 1, height: 1 },
  sym: { fontSize: 12 },
});

const docStyles = StyleSheet.create({
  frame: {
    borderWidth: 1,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: '#fff',
    // second inner border effect via shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  frameExpert: {
    borderWidth: 2,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  expertGoldBar: { height: 5, backgroundColor: '#F59E0B' },
  expertHeader: {
    backgroundColor: '#3B0080',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 4,
  },
  expertHeaderStars: {
    fontSize: 10,
    color: '#F59E0B',
    letterSpacing: 6,
    fontWeight: '700',
  },
  expertHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FDE68A',
    letterSpacing: 4,
  },
  expertHeaderSub: {
    fontSize: 10,
    color: 'rgba(253,230,138,0.6)',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  inner: {
    padding: 24,
    alignItems: 'center',
  },
  orgName: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
  },
  programLine: {
    fontSize: 8,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginTop: 2,
  },
  medalEmoji: { fontSize: 40, marginBottom: 4, lineHeight: 48 },
  certTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  certSub: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 2.5,
    textAlign: 'center',
    marginTop: 2,
  },
  awardedTo: {
    fontSize: 12,
    color: SimulatorColors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 2,
  },
  roleName: {
    fontSize: 22,
    fontWeight: '800',
    color: SimulatorColors.textPrimary,
    textAlign: 'center',
  },
  designation: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    marginVertical: 4,
  },
  statCell: { flex: 1, alignItems: 'center', gap: 3 },
  statVal: { fontSize: 24, fontWeight: '800', lineHeight: 28 },
  statValSmall: { fontSize: 13, fontWeight: '400', color: SimulatorColors.textSecondary },
  statDivider: { width: 1, height: 36 },
  statLbl: {
    fontSize: 9,
    fontWeight: '600',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    textAlign: 'center',
    lineHeight: 13,
  },
  gradeBadge: {
    borderWidth: 1.5,
    borderRadius: 3,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginTop: 6,
  },
  gradeBadgeExpert: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  gradeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  gradeBadgeTextExpert: { color: '#78350F' },
  dateText: {
    fontSize: 11,
    color: SimulatorColors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
});

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

  card: {
    borderRadius: Radius.lg, overflow: 'hidden',
    backgroundColor: SimulatorColors.surface,
    borderWidth: 1.5,
  },
  cardEarned: {},
  cardLocked: { borderColor: SimulatorColors.border },
  cardExpert: { borderWidth: 2.5, borderColor: '#6D28D9' },

  downloadButton: {
    margin: 16, marginTop: 12, borderRadius: Radius.md,
    paddingVertical: 14, alignItems: 'center',
  },
  downloadButtonExpert: {
    backgroundColor: '#6D28D9',
  },
  downloadButtonDisabled: { opacity: 0.6 },
  downloadRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  downloadButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  lockedBody: { padding: 20, gap: 12 },
  lockedHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  lockIcon: { fontSize: 24 },
  lockedHeaderText: { flex: 1, gap: 2 },
  lockedStage: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  lockedDesig: { fontSize: 16, fontWeight: '700', color: SimulatorColors.textSecondary },
  lockedDesc: { fontSize: 13, color: SimulatorColors.textSecondary, lineHeight: 20 },
  progressSection: { gap: 8 },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { fontSize: 13, color: SimulatorColors.textSecondary, fontWeight: '600' },
  progressFraction: { fontSize: 13, fontWeight: '700' },
  progressTrack: { height: 7, backgroundColor: SimulatorColors.border, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 7, borderRadius: 4 },
  pathButton: { paddingVertical: 8, alignItems: 'center' },
  pathButtonText: { fontSize: 14, fontWeight: '600' },

  disclaimer: { fontSize: 11, color: SimulatorColors.textSecondary, textAlign: 'center', lineHeight: 17 },
});
