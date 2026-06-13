import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radius, SimulatorColors } from '@/constants/theme';
import { scenarioTemplates } from '@/data/scenarioTemplates';
import { generateFeedbackReport } from '@/services/feedbackService';
import { generateSkillScoreReport } from '@/services/scoringService';
import { fetchAIEvaluation } from '@/services/aiEvaluationService';
import { schedulePostSessionReminder } from '@/services/notificationService';
import { useAuth } from '@/state/AuthContext';
import { useSimulator } from '@/state/SimulatorContext';
import type { AIEvaluation, FeedbackReport, SkillScore, SkillScoreReport } from '@/types/simulator';
import { SectionCard } from '@/components/SectionCard';

const AUTH_CONFIGURED = !!(process.env.EXPO_PUBLIC_SUPABASE_URL);

export default function FeedbackScreen() {
  const {
    activeScenarioId,
    selectedRoleId,
    learnerProfile,
    conversationMessages,
    safetyEvents,
    patientStateSnapshots,
    completedSessions,
    streakData,
    recordCompletedSession,
  } = useSimulator();
  const { isSubscribed } = useAuth();

  const scenario = scenarioTemplates.find((s) => s.id === activeScenarioId);
  const sessionRecorded = useRef(false);
  const [aiEval, setAiEval] = useState<AIEvaluation | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const report = useMemo<FeedbackReport | null>(() => {
    if (!activeScenarioId || conversationMessages.length === 0) return null;
    return generateFeedbackReport(
      activeScenarioId,
      conversationMessages,
      safetyEvents,
      patientStateSnapshots,
      learnerProfile
    );
  }, [activeScenarioId, conversationMessages, safetyEvents, patientStateSnapshots, learnerProfile]);

  const scoreReport = useMemo<SkillScoreReport | null>(() => {
    if (!activeScenarioId || conversationMessages.length === 0) return null;
    return generateSkillScoreReport(
      activeScenarioId,
      conversationMessages,
      safetyEvents,
      patientStateSnapshots
    );
  }, [activeScenarioId, conversationMessages, safetyEvents, patientStateSnapshots]);

  // Capture previous score at mount, before the current session is recorded
  const previousScore = useMemo<number | null>(() => {
    const prev = completedSessions
      .filter((s) => s.scenarioId === activeScenarioId)
      .at(-1);
    return prev?.overallScore ?? null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scoreReport && activeScenarioId && !sessionRecorded.current) {
      sessionRecorded.current = true;
      recordCompletedSession({
        scenarioId: activeScenarioId,
        scenarioTitle: scenario?.title ?? activeScenarioId,
        roleId: selectedRoleId ?? '',
        overallScore: scoreReport.overallScore,
        skillScores: scoreReport.scores.map((s) => ({ category: s.category, score: s.score })),
      });
      void schedulePostSessionReminder(streakData.currentStreak);
    }
  }, [scoreReport, activeScenarioId, scenario, selectedRoleId, recordCompletedSession, streakData.currentStreak]);

  useEffect(() => {
    if (!scoreReport || !activeScenarioId || aiLoading || aiEval) return;
    setAiLoading(true);
    fetchAIEvaluation({
      scenarioId: activeScenarioId,
      scenarioTitle: scenario?.title ?? activeScenarioId,
      role: selectedRoleId ?? 'unknown',
      learnerObjective: scenario?.learnerObjective,
      roleReminder: scenario?.roleReminder,
      hiddenFamilyFear: scenario?.hiddenFamilyFear,
      successCriteria: scenario?.successCriteria,
      failureCriteria: scenario?.failureCriteria,
      messages: conversationMessages,
      safetyEventCount: safetyEvents.length,
      overallScore: scoreReport.overallScore,
    }).then((result) => {
      setAiEval(result);
      setAiLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scoreReport, activeScenarioId]);

  function handleShareFeedback() {
    if (!report) return;
    const lines: string[] = [
      `SIMULATION FEEDBACK — ${scenario?.title ?? activeScenarioId ?? 'Scenario'}`,
      '',
      '== Overall Summary ==',
      report.overallCoachingSummary,
    ];
    if (report.whatWentWell.length > 0) {
      lines.push('', '== What Went Well ==');
      report.whatWentWell.forEach((item) => lines.push(`• ${item}`));
    }
    if (scoreReport) {
      lines.push('', `== Skill Score: ${scoreReport.overallScore.toFixed(1)} / 4 ==`);
      lines.push(`Strength: ${scoreReport.primaryStrength}`);
      lines.push(`Growth area: ${scoreReport.primaryGrowthArea}`);
    }
    lines.push('', '== Next Practice Focus ==', report.nextPracticeFocus);
    void Share.share({ message: lines.join('\n') });
  }

  if (!report) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No completed simulation found.</Text>
          <Pressable style={styles.button} accessibilityRole="button" onPress={() => router.push('/role' as Href)}>
            <Text style={styles.buttonText}>Return to Role Selection</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle} accessibilityRole="header">Simulation Feedback</Text>
        {scenario != null && (
          <Text style={styles.screenSubtitle}>{scenario.title}</Text>
        )}

        {scoreReport !== null && (
          <View style={heroStyles.container}>
            <View style={[heroStyles.scoreBox, { borderColor: heroScoreColor(scoreReport.overallScore) }]}>
              <Text style={[heroStyles.scoreNumber, { color: heroScoreColor(scoreReport.overallScore) }]}>
                {scoreReport.overallScore.toFixed(1)}
              </Text>
              <Text style={heroStyles.scoreDenom}> / 4.0</Text>
            </View>
            <View style={heroStyles.meta}>
              <Text style={heroStyles.scoreLabel}>Overall Score</Text>
              {previousScore !== null && (() => {
                const delta = scoreReport.overallScore - previousScore;
                const sign = delta > 0 ? '↑ +' : delta < 0 ? '↓ ' : '→ ';
                const color = delta > 0 ? SimulatorColors.scoreGreen : delta < 0 ? SimulatorColors.scoreOrange : SimulatorColors.textSecondary;
                return (
                  <Text style={[heroStyles.trendText, { color }]}>
                    {sign}{Math.abs(delta).toFixed(1)} vs last attempt
                  </Text>
                );
              })()}
            </View>
          </View>
        )}

        <SectionCard title="Overall Coaching Summary">
          <Text style={styles.bodyText}>{report.overallCoachingSummary}</Text>
        </SectionCard>

        <SectionCard title="What Went Well">
          {report.whatWentWell.length > 0 ? (
            report.whatWentWell.map((item, i) => (
              <Text key={i} style={styles.bulletItem}>{'• '}{item}</Text>
            ))
          ) : (
            <Text style={styles.bodyText}>Nothing specific detected yet — keep practicing.</Text>
          )}
        </SectionCard>

        <SectionCard title="What Changed the Room">
          {report.whatChangedTheRoom.length > 0 ? (
            report.whatChangedTheRoom.map((item, i) => (
              <Text key={i} style={styles.bulletItem}>{'• '}{item}</Text>
            ))
          ) : (
            <Text style={styles.bodyText}>Nothing specific detected yet — keep practicing.</Text>
          )}
        </SectionCard>

        <SectionCard title="Missed Emotional Cues">
          {report.missedEmotionalCues.length > 0 ? (
            report.missedEmotionalCues.map((item, i) => (
              <Text key={i} style={styles.bodyText}>{item}</Text>
            ))
          ) : (
            <Text style={styles.bodyText}>No missed cues detected.</Text>
          )}
        </SectionCard>

        <SectionCard title="Role Boundary Review">
          <Text style={styles.bodyText}>{report.roleBoundaryReview}</Text>
        </SectionCard>

        <SectionCard title="Medication Safety Review">
          <Text style={styles.bodyText}>{report.medicationSafetyReview}</Text>
        </SectionCard>

        <SectionCard title="Hospice Language Review">
          <Text style={styles.bodyText}>{report.hospiceLanguageReview}</Text>
        </SectionCard>

        <SectionCard title="Suggested Wording">
          {report.suggestedWording.map((text, i) => (
            <View key={i} style={styles.wordingCard}>
              <Text style={styles.wordingText}>{text}</Text>
            </View>
          ))}
        </SectionCard>

        {scoreReport !== null && (
          <SectionCard title="Skill Scores">
            <View style={scoreStyles.overallRow}>
              <Text style={scoreStyles.overallLabel}>Overall</Text>
              <Text style={scoreStyles.overallValue}>{scoreReport.overallScore.toFixed(1)} / 4</Text>
            </View>
            {scoreReport.scores.map((item, i) => (
              <ScoreRow key={i} item={item} />
            ))}
            <View style={scoreStyles.strengthCallout}>
              <Text style={scoreStyles.calloutLabel}>Primary Strength</Text>
              <Text style={scoreStyles.calloutText}>{scoreReport.primaryStrength}</Text>
            </View>
            <View style={scoreStyles.growthCallout}>
              <Text style={scoreStyles.calloutLabel}>Growth Area</Text>
              <Text style={scoreStyles.calloutText}>{scoreReport.primaryGrowthArea}</Text>
            </View>
          </SectionCard>
        )}

        {(aiLoading || aiEval != null) && (
          <SectionCard title="AI Coach Insights">
            {aiLoading && aiEval == null ? (
              <View style={aiStyles.loadingRow}>
                <ActivityIndicator size="small" color={SimulatorColors.brand} />
                <Text style={aiStyles.loadingText}>Analyzing your session...</Text>
              </View>
            ) : aiEval != null ? (
              <>
                <Text style={styles.bodyText}>{aiEval.overallImpression}</Text>
                <View style={aiStyles.scoreRow}>
                  <AIScorePill label="Empathy" score={aiEval.empathyScore} />
                  <AIScorePill label="Clarity" score={aiEval.clarityScore} />
                  <AIScorePill label="Professional" score={aiEval.professionalismScore} />
                </View>
                <View style={aiStyles.callout}>
                  <Text style={aiStyles.calloutLabel}>Top Strength</Text>
                  <Text style={aiStyles.calloutText}>{aiEval.topStrength}</Text>
                </View>
                <View style={[aiStyles.callout, aiStyles.calloutAmber]}>
                  <Text style={aiStyles.calloutLabel}>Growth Area</Text>
                  <Text style={aiStyles.calloutText}>{aiEval.topGrowthArea}</Text>
                </View>
                {aiEval.coachingNotes.map((note, i) => (
                  <Text key={i} style={styles.bulletItem}>{'• '}{note}</Text>
                ))}
              </>
            ) : null}
          </SectionCard>
        )}

        {scenario != null && (
          <SectionCard title="Scenario Criteria">
            {aiEval?.criteriaResults && aiEval.criteriaResults.length > 0 ? (
              <>
                <Text style={criteriaStyles.aiLabel}>Evaluated by AI coach</Text>
                {aiEval.criteriaResults.map((r, i) => (
                  <View key={i} style={styles.criterionRow}>
                    <Text style={r.met ? styles.successBullet : styles.failBullet}>
                      {r.met ? '✓' : '✗'}
                    </Text>
                    <Text style={[styles.criterionText, !r.met && criteriaStyles.missedText]}>
                      {r.criterion}
                    </Text>
                  </View>
                ))}
              </>
            ) : (
              <>
                <Text style={criteriaStyles.sectionLabel}>What to aim for</Text>
                {scenario.successCriteria.map((criterion, i) => (
                  <View key={i} style={styles.criterionRow}>
                    <Text style={styles.successBullet}>✓</Text>
                    <Text style={styles.criterionText}>{criterion}</Text>
                  </View>
                ))}
                <Text style={[criteriaStyles.sectionLabel, criteriaStyles.watchLabel]}>Watch out for</Text>
                {scenario.failureCriteria.map((criterion, i) => (
                  <View key={i} style={styles.criterionRow}>
                    <Text style={styles.failBullet}>✗</Text>
                    <Text style={styles.criterionText}>{criterion}</Text>
                  </View>
                ))}
              </>
            )}
          </SectionCard>
        )}

        {aiEval?.modelResponse != null && aiEval.modelResponse.trim().length > 0 && (
          <SectionCard title="Model Response">
            <Text style={modelStyles.intro}>
              What an expert response to this opening might sound like:
            </Text>
            <View style={modelStyles.responseBox}>
              <Text style={modelStyles.responseText}>{aiEval.modelResponse}</Text>
            </View>
          </SectionCard>
        )}

        <SectionCard title="Next Practice Focus">
          <View style={styles.focusCallout}>
            <Text style={styles.focusText}>{report.nextPracticeFocus}</Text>
          </View>
        </SectionCard>

        {AUTH_CONFIGURED && !isSubscribed && activeScenarioId === 'hospice_means_giving_up' && scoreReport !== null && (
          <View style={demoCtaStyles.container}>
            <Text style={demoCtaStyles.headline}>
              You scored {scoreReport.overallScore.toFixed(1)}/4.0 on your first scenario
            </Text>
            <Text style={demoCtaStyles.body}>
              Unlock 33 more clinical scenarios, AI coaching, and voice practice with a free trial.
            </Text>
            <Pressable
              style={demoCtaStyles.button}
              accessibilityRole="button"
              onPress={() => router.push('/paywall' as Href)}>
              <Text style={demoCtaStyles.buttonText}>Start 7-Day Free Trial</Text>
            </Pressable>
            <Text style={demoCtaStyles.sub}>No credit card required to start</Text>
          </View>
        )}

        <Pressable
          style={styles.button}
          accessibilityRole="button"
          onPress={() => router.push('/clinical-debrief' as Href)}>
          <Text style={styles.buttonText}>Clinical Knowledge Check</Text>
        </Pressable>
        <Pressable
          style={styles.shareButton}
          accessibilityRole="button"
          onPress={handleShareFeedback}>
          <Text style={styles.shareButtonText}>Share / Export Feedback</Text>
        </Pressable>
        <Pressable
          style={styles.viewDashboardButton}
          accessibilityRole="button"
          onPress={() => router.push('/dashboard' as Href)}>
          <Text style={styles.viewDashboardButtonText}>View Dashboard</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.returnButton]}
          accessibilityRole="button"
          onPress={() => router.push('/role' as Href)}>
          <Text style={styles.buttonText}>Return to Role Selection</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function AIScorePill({ label, score }: { label: string; score: number }) {
  const pct = Math.round((score / 5) * 100);
  const color =
    score >= 4 ? SimulatorColors.scoreGreen :
    score >= 3 ? SimulatorColors.brand :
    score >= 2 ? SimulatorColors.scoreYellow :
    SimulatorColors.scoreOrange;
  return (
    <View style={aiStyles.pill}>
      <Text style={aiStyles.pillLabel}>{label}</Text>
      <Text style={[aiStyles.pillScore, { color }]}>{pct}%</Text>
    </View>
  );
}

function scoreBadgeColor(score: 0 | 1 | 2 | 3 | 4): string {
  switch (score) {
    case 0: return SimulatorColors.scoreRed;
    case 1: return SimulatorColors.scoreOrange;
    case 2: return SimulatorColors.scoreYellow;
    case 3: return SimulatorColors.brand;
    case 4: return SimulatorColors.scoreGreen;
  }
}

function ScoreRow({ item }: { item: SkillScore }) {
  return (
    <View style={scoreRowStyles.container}>
      <View style={scoreRowStyles.header}>
        <Text style={scoreRowStyles.category}>{item.category}</Text>
        <View style={[scoreRowStyles.badge, { backgroundColor: scoreBadgeColor(item.score) }]}>
          <Text style={scoreRowStyles.badgeText}>{item.score} / 4</Text>
        </View>
      </View>
      <Text style={scoreRowStyles.evidence}>{item.evidence}</Text>
      <Text style={scoreRowStyles.coachingNote}>{item.coachingNote}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SimulatorColors.screenBackground,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 48,
    gap: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 14,
    color: SimulatorColors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 15,
    color: SimulatorColors.textBody,
    lineHeight: 22,
  },
  bulletItem: {
    fontSize: 15,
    color: SimulatorColors.textBody,
    lineHeight: 22,
    marginBottom: 2,
  },
  criterionRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 3,
  },
  successBullet: {
    fontSize: 14,
    color: SimulatorColors.scoreGreen,
    fontWeight: '700',
    lineHeight: 21,
    width: 16,
  },
  failBullet: {
    fontSize: 14,
    color: SimulatorColors.scoreOrange,
    fontWeight: '700',
    lineHeight: 21,
    width: 16,
  },
  criterionText: {
    flex: 1,
    fontSize: 14,
    color: SimulatorColors.textBody,
    lineHeight: 21,
  },
  wordingCard: {
    backgroundColor: SimulatorColors.brandTint,
    borderLeftWidth: 3,
    borderLeftColor: SimulatorColors.brand,
    borderRadius: Radius.sm,
    padding: 14,
    marginBottom: 8,
  },
  wordingText: {
    fontSize: 14,
    color: SimulatorColors.brandDeep,
    lineHeight: 21,
    fontStyle: 'italic',
  },
  focusCallout: {
    backgroundColor: SimulatorColors.greenBackground,
    borderWidth: 1,
    borderColor: SimulatorColors.greenBorder,
    borderRadius: Radius.md,
    padding: 14,
  },
  focusText: {
    fontSize: 15,
    color: SimulatorColors.greenText,
    lineHeight: 22,
  },
  button: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  returnButton: {
    marginTop: 4,
  },
  shareButton: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: SimulatorColors.border,
  },
  shareButtonText: {
    color: SimulatorColors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  viewDashboardButton: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: SimulatorColors.brand,
  },
  viewDashboardButtonText: {
    color: SimulatorColors.brand,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: SimulatorColors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
});

const scoreStyles = StyleSheet.create({
  overallRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: SimulatorColors.border,
    marginBottom: 4,
  },
  overallLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: SimulatorColors.textBody,
  },
  overallValue: {
    fontSize: 22,
    fontWeight: '700',
    color: SimulatorColors.brand,
  },
  strengthCallout: {
    backgroundColor: SimulatorColors.greenBackground,
    borderWidth: 1,
    borderColor: SimulatorColors.greenBorder,
    borderRadius: Radius.md,
    padding: 12,
    marginTop: 4,
  },
  growthCallout: {
    backgroundColor: SimulatorColors.amberBackground,
    borderWidth: 1,
    borderColor: SimulatorColors.amberBorder,
    borderRadius: Radius.md,
    padding: 12,
  },
  calloutLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  calloutText: {
    fontSize: 14,
    fontWeight: '600',
    color: SimulatorColors.textPrimary,
  },
});

const aiStyles = StyleSheet.create({
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  loadingText: {
    fontSize: 14,
    color: SimulatorColors.textSecondary,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    marginBottom: 4,
  },
  pill: {
    flex: 1,
    backgroundColor: SimulatorColors.screenBackground,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    padding: 10,
    alignItems: 'center',
    gap: 2,
  },
  pillLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  pillScore: {
    fontSize: 18,
    fontWeight: '700',
  },
  callout: {
    backgroundColor: SimulatorColors.greenBackground,
    borderWidth: 1,
    borderColor: SimulatorColors.greenBorder,
    borderRadius: Radius.md,
    padding: 12,
    marginTop: 8,
    gap: 3,
  },
  calloutAmber: {
    backgroundColor: SimulatorColors.amberBackground,
    borderColor: SimulatorColors.amberBorder,
  },
  calloutLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  calloutText: {
    fontSize: 14,
    fontWeight: '600',
    color: SimulatorColors.textPrimary,
  },
});

const modelStyles = StyleSheet.create({
  intro: {
    fontSize: 12,
    fontWeight: '600',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 10,
  },
  responseBox: {
    backgroundColor: SimulatorColors.indigoBackground,
    borderLeftWidth: 3,
    borderLeftColor: SimulatorColors.indigoBorder,
    borderRadius: Radius.sm,
    padding: 16,
  },
  responseText: {
    fontSize: 15,
    color: SimulatorColors.indigoText,
    lineHeight: 23,
    fontStyle: 'italic',
  },
});

const criteriaStyles = StyleSheet.create({
  aiLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.brand,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    marginTop: 4,
  },
  watchLabel: {
    marginTop: 12,
  },
  missedText: {
    color: SimulatorColors.scoreOrange,
    fontWeight: '500',
  },
});

function heroScoreColor(score: number): string {
  if (score >= 3.5) return SimulatorColors.scoreGreen;
  if (score >= 2.5) return SimulatorColors.brand;
  if (score >= 1.5) return SimulatorColors.scoreYellow;
  return SimulatorColors.scoreOrange;
}

const heroStyles = StyleSheet.create({
  container: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: SimulatorColors.border,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 2,
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexShrink: 0,
  },
  scoreNumber: {
    fontSize: 40,
    fontWeight: '800',
    lineHeight: 46,
  },
  scoreDenom: {
    fontSize: 18,
    fontWeight: '600',
    color: SimulatorColors.textSecondary,
    paddingBottom: 4,
  },
  meta: {
    flex: 1,
    gap: 4,
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

const demoCtaStyles = StyleSheet.create({
  container: {
    backgroundColor: SimulatorColors.brandDeep,
    borderRadius: Radius.lg,
    padding: 20,
    gap: 10,
    alignItems: 'center',
  },
  headline: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.80)',
    textAlign: 'center',
    lineHeight: 21,
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: SimulatorColors.brandDeep,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  sub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
  },
});

const scoreRowStyles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: SimulatorColors.borderDivider,
    paddingTop: 10,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
    color: SimulatorColors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  badge: {
    borderRadius: Radius.lg,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: SimulatorColors.textOnBrand,
  },
  evidence: {
    fontSize: 13,
    color: SimulatorColors.textBody,
    lineHeight: 19,
  },
  coachingNote: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    lineHeight: 19,
    fontStyle: 'italic',
  },
});
