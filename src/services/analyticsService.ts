import type { CompletedSession } from '@/types/simulator';

export type ImprovementTrend = 'improving' | 'declining' | 'stable' | 'insufficient_data';

export interface AnalyticsSummary {
  totalSessions: number;
  averageScore: number;
  scoreHistory: Array<{
    scenarioId: string;
    title: string;
    score: number;
    completedAt: string;
  }>;
  skillAverages: Array<{ category: string; average: number }>;
  improvementTrend: ImprovementTrend;
  bestScore: number;
}

export function computeAnalytics(sessions: CompletedSession[]): AnalyticsSummary {
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      averageScore: 0,
      scoreHistory: [],
      skillAverages: [],
      improvementTrend: 'insufficient_data',
      bestScore: 0,
    };
  }

  const sorted = [...sessions].sort((a, b) => a.completedAt.localeCompare(b.completedAt));

  const scoreHistory = sorted.map((s) => ({
    scenarioId: s.scenarioId,
    title: s.scenarioTitle,
    score: s.overallScore,
    completedAt: s.completedAt,
  }));

  const averageScore =
    sessions.reduce((sum, s) => sum + s.overallScore, 0) / sessions.length;

  const bestScore = Math.max(...sessions.map((s) => s.overallScore));

  const skillTotals: Record<string, { sum: number; count: number }> = {};
  sessions.forEach((s) => {
    (s.skillScores ?? []).forEach(({ category, score }) => {
      if (!skillTotals[category]) skillTotals[category] = { sum: 0, count: 0 };
      skillTotals[category].sum += score;
      skillTotals[category].count += 1;
    });
  });
  const skillAverages = Object.entries(skillTotals).map(([category, { sum, count }]) => ({
    category,
    average: sum / count,
  }));

  let improvementTrend: ImprovementTrend = 'insufficient_data';
  if (sorted.length >= 3) {
    const recentScores = sorted.slice(-3).map((s) => s.overallScore);
    const olderScores = sorted.slice(0, sorted.length - 3).map((s) => s.overallScore);
    const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const olderAvg = olderScores.length
      ? olderScores.reduce((a, b) => a + b, 0) / olderScores.length
      : recentAvg;
    if (recentAvg - olderAvg > 0.2) improvementTrend = 'improving';
    else if (olderAvg - recentAvg > 0.2) improvementTrend = 'declining';
    else improvementTrend = 'stable';
  } else if (sorted.length === 2) {
    const delta = sorted[1].overallScore - sorted[0].overallScore;
    if (delta > 0.2) improvementTrend = 'improving';
    else if (delta < -0.2) improvementTrend = 'declining';
    else improvementTrend = 'stable';
  }

  return { totalSessions: sessions.length, averageScore, scoreHistory, skillAverages, improvementTrend, bestScore };
}
