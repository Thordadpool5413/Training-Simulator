import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SimulatorColors, Radius } from '@/constants/theme';
import type { QuizQuestion } from '@/types/quiz';

interface Props {
  question: QuizQuestion;
  questionNumber: number;
  onAnswer: (selectedIndex: number, isCorrect: boolean) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  clinical: 'Clinical Knowledge',
  role_boundary: 'Role Boundary',
  communication: 'Communication',
};

export function KnowledgeQuizCard({ question, questionNumber, onAnswer }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const revealed = selectedIndex !== null;

  function handleSelect(index: number) {
    if (revealed) return;
    setSelectedIndex(index);
    onAnswer(index, index === question.correctIndex);
  }

  function getOptionStyle(index: number) {
    if (!revealed) return styles.optionDefault;
    if (index === question.correctIndex) return styles.optionCorrect;
    if (index === selectedIndex) return styles.optionWrong;
    return styles.optionDimmed;
  }

  function getOptionTextStyle(index: number) {
    if (!revealed) return styles.optionTextDefault;
    if (index === question.correctIndex) return styles.optionTextCorrect;
    if (index === selectedIndex) return styles.optionTextWrong;
    return styles.optionTextDimmed;
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{questionNumber}</Text>
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{CATEGORY_LABELS[question.category] ?? question.category}</Text>
        </View>
      </View>

      <Text style={styles.question}>{question.question}</Text>

      <View style={styles.options}>
        {question.options.map((option, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.optionBase,
              getOptionStyle(index),
              pressed && !revealed && styles.optionPressed,
            ]}
            onPress={() => handleSelect(index)}
          >
            <View style={styles.optionInner}>
              <View style={[styles.optionLetter, revealed && index === question.correctIndex && styles.optionLetterCorrect, revealed && index === selectedIndex && index !== question.correctIndex && styles.optionLetterWrong]}>
                <Text style={styles.optionLetterText}>
                  {String.fromCharCode(65 + index)}
                </Text>
              </View>
              <Text style={[styles.optionTextBase, getOptionTextStyle(index)]}>
                {option}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      {revealed && (
        <View style={[styles.explanationBox, selectedIndex === question.correctIndex ? styles.explanationCorrect : styles.explanationWrong]}>
          <Text style={styles.explanationLabel}>
            {selectedIndex === question.correctIndex ? 'Correct' : 'Explanation'}
          </Text>
          <Text style={styles.explanationText}>{question.explanation}</Text>
          {question.evidenceNote && (
            <Text style={styles.evidenceNote}>{question.evidenceNote}</Text>
          )}
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
    padding: 18,
    gap: 12,
    borderCurve: 'continuous',
    boxShadow: `0 18px 36px ${SimulatorColors.shadow}`,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  numberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: SimulatorColors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  categoryBadge: {
    backgroundColor: SimulatorColors.brandTint,
    borderRadius: Radius.md,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: `${SimulatorColors.brand}33`,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.brand,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  question: {
    fontSize: 15,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
    lineHeight: 22,
  },
  options: {
    gap: 8,
  },
  optionBase: {
    borderRadius: Radius.md,
    borderWidth: 1.5,
    padding: 13,
  },
  optionDefault: {
    borderColor: SimulatorColors.borderInput,
    backgroundColor: SimulatorColors.surfaceRaised,
  },
  optionPressed: {
    backgroundColor: SimulatorColors.brandTint,
    borderColor: SimulatorColors.brand,
  },
  optionCorrect: {
    borderColor: SimulatorColors.greenBorder,
    backgroundColor: SimulatorColors.greenBackground,
  },
  optionWrong: {
    borderColor: 'rgba(255, 107, 122, 0.42)',
    backgroundColor: 'rgba(255, 107, 122, 0.12)',
  },
  optionDimmed: {
    borderColor: SimulatorColors.border,
    backgroundColor: SimulatorColors.surfaceRaised,
    opacity: 0.6,
  },
  optionInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  optionLetter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: SimulatorColors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  optionLetterCorrect: {
    backgroundColor: SimulatorColors.greenBorder,
  },
  optionLetterWrong: {
    backgroundColor: 'rgba(255, 107, 122, 0.22)',
  },
  optionLetterText: {
    fontSize: 10,
    fontWeight: '700',
    color: SimulatorColors.textSecondary,
  },
  optionTextBase: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
  },
  optionTextDefault: {
    color: SimulatorColors.textBody,
  },
  optionTextCorrect: {
    color: SimulatorColors.greenText,
    fontWeight: '500',
  },
  optionTextWrong: {
    color: SimulatorColors.scoreRed,
  },
  optionTextDimmed: {
    color: SimulatorColors.textPlaceholder,
  },
  explanationBox: {
    borderRadius: Radius.md,
    padding: 12,
    gap: 4,
  },
  explanationCorrect: {
    backgroundColor: SimulatorColors.greenBackground,
    borderWidth: 1,
    borderColor: `${SimulatorColors.greenBorder}44`,
  },
  explanationWrong: {
    backgroundColor: SimulatorColors.warningBackground,
    borderWidth: 1,
    borderColor: `${SimulatorColors.warningBorder}44`,
  },
  explanationLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  explanationText: {
    fontSize: 13,
    color: SimulatorColors.textBody,
    lineHeight: 20,
  },
  evidenceNote: {
    fontSize: 11,
    color: SimulatorColors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
});
