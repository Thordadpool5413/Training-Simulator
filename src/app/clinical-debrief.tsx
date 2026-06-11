import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DiagnosisChip } from '@/components/DiagnosisChip';
import { EvidenceCard } from '@/components/EvidenceCard';
import { KnowledgeQuizCard } from '@/components/KnowledgeQuizCard';
import { LCDCriteriaCard } from '@/components/LCDCriteriaCard';
import { MedicationCard } from '@/components/MedicationCard';
import { SectionCard } from '@/components/SectionCard';
import { Radius, SimulatorColors } from '@/constants/theme';
import { clinicalDiagnoses } from '@/data/clinicalDiagnoses';
import { evidenceStatements } from '@/data/evidenceStatements';
import { hospiceMedications } from '@/data/hospiceMedications';
import { scenarioTemplates } from '@/data/scenarioTemplates';
import { getQuizForScenario } from '@/services/knowledgeQuizService';
import { useSimulator } from '@/state/SimulatorContext';
import type { QuizAnswer } from '@/types/quiz';

export default function ClinicalDebriefScreen() {
  const { activeScenarioId, selectedRoleId, setQuizResult } = useSimulator();

  const scenario = scenarioTemplates.find((s) => s.id === activeScenarioId);
  const clinicalDiagnosis = clinicalDiagnoses.find(
    (d) => d.diagnosisId === scenario?.knownDiagnosisId
  );
  const questions = activeScenarioId ? getQuizForScenario(activeScenarioId) : [];
  const evidence = evidenceStatements.find((e) => e.scenarioId === activeScenarioId);
  const relevantMeds = hospiceMedications.filter(
    (m) => activeScenarioId != null && m.scenarioRelevance.includes(activeScenarioId)
  );

  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  const handleAnswer = useCallback(
    (questionId: string, selectedIndex: number, isCorrect: boolean) => {
      setAnswers((prev) => {
        if (prev.some((a) => a.questionId === questionId)) return prev;
        return [...prev, { questionId, selectedIndex, isCorrect }];
      });
    },
    []
  );

  const score = answers.filter((a) => a.isCorrect).length;
  const allAnswered = answers.length === questions.length && questions.length > 0;

  useEffect(() => {
    if (allAnswered && activeScenarioId) {
      setQuizResult({
        scenarioId: activeScenarioId,
        answers,
        score,
        totalQuestions: questions.length,
        completedAt: new Date().toISOString(),
      });
    }
  }, [allAnswered, activeScenarioId, answers, score, questions.length, setQuizResult]);

  if (!scenario || !clinicalDiagnosis) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No simulation found. Complete a scenario first.</Text>
          <Pressable
            style={styles.button}
            accessibilityRole="button"
            onPress={() => router.push('/role' as Href)}
          >
            <Text style={styles.buttonText}>Return to Role Selection</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle} accessibilityRole="header">
          Clinical Knowledge Debrief
        </Text>
        <Text style={styles.screenSubtitle}>{scenario.title}</Text>

        <SectionCard title="Diagnosis">
          <DiagnosisChip
            icd10Code={clinicalDiagnosis.icd10Code}
            icd10Description={clinicalDiagnosis.icd10Description}
            lcdId={clinicalDiagnosis.lcdId}
          />
          <View style={styles.divider} />
          <View style={styles.roleRow}>
            {Object.entries(clinicalDiagnosis.roleRelevance).map(([roleKey, text]) => (
              <View key={roleKey} style={styles.roleBlock}>
                <Text style={styles.roleLabel}>{ROLE_LABELS[roleKey] ?? roleKey}</Text>
                <Text style={styles.roleText}>{text}</Text>
              </View>
            ))}
          </View>
        </SectionCard>

        <SectionCard title="CMS Coverage Criteria">
          <LCDCriteriaCard diagnosis={clinicalDiagnosis} />
        </SectionCard>

        <SectionCard title="Knowledge Check">
          {allAnswered && (
            <View style={[styles.scoreSummary, score === questions.length ? styles.scorePerfect : score >= 2 ? styles.scoreGood : styles.scoreLow]}>
              <Text style={styles.scoreText}>
                {score} / {questions.length} correct
              </Text>
              <Text style={styles.scoreMessage}>
                {score === questions.length
                  ? 'All correct — excellent clinical knowledge.'
                  : score >= 2
                  ? 'Good foundation — review the explanations for any missed questions.'
                  : 'Review the explanations carefully — clinical knowledge builds over time.'}
              </Text>
            </View>
          )}
          {questions.map((q, i) => (
            <KnowledgeQuizCard
              key={q.id}
              question={q}
              questionNumber={i + 1}
              onAnswer={(selectedIndex, isCorrect) =>
                handleAnswer(q.id, selectedIndex, isCorrect)
              }
            />
          ))}
          {questions.length === 0 && (
            <Text style={styles.bodyText}>No quiz questions available for this scenario.</Text>
          )}
        </SectionCard>

        {evidence != null && (
          <SectionCard title="Clinical Evidence">
            <EvidenceCard evidence={evidence} />
          </SectionCard>
        )}

        {relevantMeds.length > 0 && (
          <SectionCard title="Hospice Medications">
            <Text style={styles.medsIntro}>
              Medications commonly used in this clinical scenario. Tap any card to expand.
            </Text>
            {relevantMeds.map((med) => (
              <MedicationCard key={med.id} medication={med} roleId={selectedRoleId ?? undefined} />
            ))}
          </SectionCard>
        )}

        <Pressable
          style={styles.dashboardButton}
          accessibilityRole="button"
          onPress={() => router.push('/dashboard' as Href)}
        >
          <Text style={styles.dashboardButtonText}>View Dashboard</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.returnButton]}
          accessibilityRole="button"
          onPress={() => router.push('/role' as Href)}
        >
          <Text style={styles.buttonText}>Return to Role Selection</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  medsIntro: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    lineHeight: 19,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: SimulatorColors.border,
    marginVertical: 10,
  },
  roleRow: {
    gap: 10,
  },
  roleBlock: {
    gap: 3,
  },
  roleLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.brandDeep,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  roleText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
  },
  scoreSummary: {
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: 4,
    gap: 4,
  },
  scorePerfect: {
    backgroundColor: SimulatorColors.greenBackground,
    borderWidth: 1,
    borderColor: SimulatorColors.greenBorder,
  },
  scoreGood: {
    backgroundColor: SimulatorColors.brandTint,
    borderWidth: 1,
    borderColor: SimulatorColors.brand,
  },
  scoreLow: {
    backgroundColor: SimulatorColors.warningBackground,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
  },
  scoreMessage: {
    fontSize: 13,
    color: SimulatorColors.textBody,
    lineHeight: 19,
  },
  dashboardButton: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  dashboardButtonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  returnButton: {
    backgroundColor: SimulatorColors.surface,
    borderWidth: 1,
    borderColor: SimulatorColors.brand,
  },
  buttonText: {
    color: SimulatorColors.brand,
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
