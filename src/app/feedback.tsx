import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radius, SimulatorColors } from '@/constants/theme';
import { generateFeedbackReport } from '@/services/feedbackService';
import { generateSkillScoreReport } from '@/services/scoringService';
import { useSimulator } from '@/state/SimulatorContext';
import type { FeedbackReport, SkillScore, SkillScoreReport } from '@/types/simulator';

export default function FeedbackScreen() {
  const {
    activeScenarioId,
    conversationMessages,
    safetyEvents,
    patientStateSnapshots,
  } = useSimulator();

  const report = useMemo<FeedbackReport | null>(() => {
    if (!activeScenarioId || conversationMessages.length === 0) return null;
    return generateFeedbackReport(
      activeScenarioId,
      conversationMessages,
      safetyEvents,
      patientStateSnapshots
    );
  }, [activeScenarioId, conversationMessages, safetyEvents, patientStateSnapshots]);

  const scoreReport = useMemo<SkillScoreReport | null>(() => {
    if (!activeScenarioId || conversationMessages.length === 0) return null;
    return generateSkillScoreReport(
      activeScenarioId,
      conversationMessages,
      safetyEvents,
      patientStateSnapshots
    );
  }, [activeScenarioId, conversationMessages, safetyEvents, patientStateSnapshots]);

  if (!report) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No completed simulation found.</Text>
          <Pressable style={styles.button} onPress={() => router.push('/role' as Href)}>
            <Text style={styles.buttonText}>Return to Role Selection</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>Simulation Feedback</Text>

        <SectionBlock title="Overall Coaching Summary">
          <Text style={styles.bodyText}>{report.overallCoachingSummary}</Text>
        </SectionBlock>

        <SectionBlock title="What Went Well">
          {report.whatWentWell.length > 0 ? (
            report.whatWentWell.map((item, i) => (
              <Text key={i} style={styles.bulletItem}>{'• '}{item}</Text>
            ))
          ) : (
            <Text style={styles.bodyText}>Nothing specific detected yet — keep practicing.</Text>
          )}
        </SectionBlock>

        <SectionBlock title="What Changed the Room">
          {report.whatChangedTheRoom.map((item, i) => (
            <Text key={i} style={styles.bodyText}>{item}</Text>
          ))}
        </SectionBlock>

        <SectionBlock title="Missed Emotional Cues">
          {report.missedEmotionalCues.length > 0 ? (
            report.missedEmotionalCues.map((item, i) => (
              <Text key={i} style={styles.bodyText}>{item}</Text>
            ))
          ) : (
            <Text style={styles.bodyText}>No missed cues detected.</Text>
          )}
        </SectionBlock>

        <SectionBlock title="Role Boundary Review">
          <Text style={styles.bodyText}>{report.roleBoundaryReview}</Text>
        </SectionBlock>

        <SectionBlock title="Medication Safety Review">
          <Text style={styles.bodyText}>{report.medicationSafetyReview}</Text>
        </SectionBlock>

        <SectionBlock title="Hospice Language Review">
          <Text style={styles.bodyText}>{report.hospiceLanguageReview}</Text>
        </SectionBlock>

        <SectionBlock title="Suggested Wording">
          {report.suggestedWording.map((text, i) => (
            <View key={i} style={styles.wordingCard}>
              <Text style={styles.wordingText}>{text}</Text>
            </View>
          ))}
        </SectionBlock>

        {scoreReport !== null && (
          <SectionBlock title="Skill Scores">
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
          </SectionBlock>
        )}

        <SectionBlock title="Next Practice Focus">
          <View style={styles.focusCallout}>
            <Text style={styles.focusText}>{report.nextPracticeFocus}</Text>
          </View>
        </SectionBlock>

        <Pressable
          style={styles.viewDashboardButton}
          onPress={() => router.push('/dashboard' as Href)}>
          <Text style={styles.viewDashboardButtonText}>View Dashboard</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.returnButton]}
          onPress={() => router.push('/role' as Href)}>
          <Text style={styles.buttonText}>Return to Role Selection</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={sectionStyles.container}>
      <Text style={sectionStyles.title}>{title}</Text>
      {children}
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

const sectionStyles = StyleSheet.create({
  container: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
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
