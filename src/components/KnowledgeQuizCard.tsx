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
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
    borderRadius: Radius.sm,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: SimulatorColors.brandDeep,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  question: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 21,
  },
  options: {
    gap: 8,
  },
  optionBase: {
    borderRadius: Radius.md,
    borderWidth: 1.5,
    padding: 12,
  },
  optionDefault: {
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
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
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  optionDimmed: {
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
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
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  optionLetterCorrect: {
    backgroundColor: SimulatorColors.greenBorder,
  },
  optionLetterWrong: {
    backgroundColor: '#FCA5A5',
  },
  optionLetterText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#374151',
  },
  optionTextBase: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  optionTextDefault: {
    color: '#374151',
  },
  optionTextCorrect: {
    color: SimulatorColors.greenText,
    fontWeight: '500',
  },
  optionTextWrong: {
    color: '#B91C1C',
  },
  optionTextDimmed: {
    color: '#9CA3AF',
  },
  explanationBox: {
    borderRadius: Radius.md,
    padding: 12,
    gap: 4,
  },
  explanationCorrect: {
    backgroundColor: SimulatorColors.greenBackground,
    borderWidth: 1,
    borderColor: SimulatorColors.greenBorder,
  },
  explanationWrong: {
    backgroundColor: SimulatorColors.warningBackground,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  explanationLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  explanationText: {
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 20,
  },
  evidenceNote: {
    fontSize: 11,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 4,
  },
});
