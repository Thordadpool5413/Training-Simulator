import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PremiumEmptyState, PremiumPill, PremiumScreen } from '@/components/premium-ui';
import { Radius, SimulatorColors } from '@/constants/theme';
import { diagnoses } from '@/data/diagnoses';
import { roles } from '@/data/roles';
import { scenarioTemplates } from '@/data/scenarioTemplates';
import { SCENARIO_TOPICS, TOPIC_LABELS } from '@/data/scenarioTopics';
import { useAuth } from '@/state/AuthContext';
import { useSimulator } from '@/state/SimulatorContext';
import type { ScenarioDifficulty, ScenarioTopic } from '@/types/simulator';

const AUTH_CONFIGURED = !!(process.env.EXPO_PUBLIC_SUPABASE_URL);
const FREE_SCENARIO_ID = 'hospice_means_giving_up';

type DifficultyFilter = ScenarioDifficulty | 'all';
type TopicFilter = ScenarioTopic | 'all';

const DIFFICULTY_FILTERS: { value: DifficultyFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const TOPIC_FILTERS: { value: TopicFilter; label: string }[] = [
  { value: 'all', label: 'All Topics' },
  ...Object.entries(TOPIC_LABELS).map(([value, label]) => ({
    value: value as ScenarioTopic,
    label,
  })),
];

const DIFFICULTY_COLORS: Record<ScenarioDifficulty, string> = {
  beginner: SimulatorColors.scoreGreen,
  intermediate: '#B45309',
  advanced: SimulatorColors.scoreOrange,
};

export default function ScenarioScreen() {
  const { selectedRoleId, setSelectedScenarioId, completedSessions } = useSimulator();
  const { isSubscribed } = useAuth();
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [topicFilter, setTopicFilter] = useState<TopicFilter>('all');
  const [searchText, setSearchText] = useState('');

  if (!selectedRoleId) {
    return (
      <PremiumScreen
        eyebrow="Scenario Selection"
        title="Choose a Scenario"
        subtitle="Pick a scenario after selecting the role you want to practice."
        onBack={() => router.back()}
        backLabel="Back"
        headerRight={<PremiumPill label="Role required" tone="warning" />}>
        <PremiumEmptyState
          icon="🧭"
          title="Please select a role first"
          body="Choose a role before picking a scenario so the training path stays aligned."
          actionLabel="Go to Role Selection"
          onAction={() => router.push('/role' as Href)}
        />
      </PremiumScreen>
    );
  }

  const roleScenarios = scenarioTemplates.filter((s) => s.allowedRoleId === selectedRoleId);
  let availableScenarios = difficultyFilter === 'all'
    ? roleScenarios
    : roleScenarios.filter((s) => s.difficulty === difficultyFilter);
  if (topicFilter !== 'all') {
    availableScenarios = availableScenarios.filter(
      (s) => SCENARIO_TOPICS[s.id] === topicFilter
    );
  }
  if (searchText.trim()) {
    const q = searchText.trim().toLowerCase();
    availableScenarios = availableScenarios.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.patient.name.toLowerCase().includes(q) ||
        s.learnerObjective.toLowerCase().includes(q)
    );
  }

  if (roleScenarios.length === 0) {
    return (
      <PremiumScreen
        eyebrow="Scenario Selection"
        title="Choose a Scenario"
        subtitle="No scenarios are available for the selected role."
        onBack={() => router.back()}
        backLabel="Back"
        headerRight={<PremiumPill label="No scenarios" tone="muted" />}>
        <PremiumEmptyState
          icon="🗂️"
          title="No scenarios available"
          body="Try a different role to explore a different simulation path."
          actionLabel="Go to Role Selection"
          onAction={() => router.push('/role' as Href)}
        />
      </PremiumScreen>
    );
  }

  function handleSelect(scenarioId: string) {
    const isLocked = AUTH_CONFIGURED && !isSubscribed && scenarioId !== FREE_SCENARIO_ID;
    if (isLocked) {
      router.push('/paywall' as Href);
      return;
    }
    setSelectedScenarioId(scenarioId);
    router.push('/scenario-briefing' as Href);
  }

  const selectedRole = roles.find((r) => r.id === selectedRoleId);
  const uniqueCompletedIds = new Set(
    completedSessions.filter((s) => s.roleId === selectedRoleId).map((s) => s.scenarioId)
  );
  const uniqueCompleted = uniqueCompletedIds.size;

  return (
    <PremiumScreen
      eyebrow="Scenario Library"
      title="Select a Scenario"
      subtitle="Filter by difficulty, topic, and search terms. Locked scenarios stay gated behind the premium tier."
      onBack={() => router.back()}
      backLabel="Role"
      headerRight={
        <PremiumPill
          label={`${uniqueCompleted}/${roleScenarios.length} complete`}
          tone={uniqueCompleted > 0 ? 'success' : 'muted'}
        />
      }
      scrollContentStyle={styles.container}>
      <View style={styles.roleMeta}>
        <Text style={styles.roleLabel}>Role: {selectedRole?.name ?? selectedRoleId}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change role"
          onPress={() => router.push('/role' as Href)}>
          <Text style={styles.changeRoleText}>Change Role</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search by title, patient, or objective..."
        placeholderTextColor={SimulatorColors.textPlaceholder}
        accessibilityLabel="Search scenarios"
        clearButtonMode="while-editing"
        returnKeyType="search"
      />

      <View style={styles.filterRow}>
        {DIFFICULTY_FILTERS.map((f) => (
          <Pressable
            key={f.value}
            style={[styles.filterChip, difficultyFilter === f.value && styles.filterChipActive]}
            accessibilityRole="button"
            onPress={() => setDifficultyFilter(f.value)}>
            <Text style={[styles.filterText, difficultyFilter === f.value && styles.filterTextActive]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.filterRow}>
        {TOPIC_FILTERS.map((f) => (
          <Pressable
            key={f.value}
            style={[styles.filterChip, topicFilter === f.value && styles.topicChipActive]}
            accessibilityRole="button"
            onPress={() => setTopicFilter(f.value)}>
            <Text style={[styles.filterText, topicFilter === f.value && styles.topicTextActive]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {availableScenarios.length === 0 && (
        <Text style={styles.emptyFilter}>
          No scenarios match these filters. Try adjusting the difficulty, topic, or search.
        </Text>
      )}

      {availableScenarios.map((scenario) => {
        const diagnosis = diagnoses.find((d) => d.id === scenario.knownDiagnosisId);
        const completed = completedSessions.find(
          (s) => s.scenarioId === scenario.id && s.roleId === selectedRoleId
        );
        const isLocked = AUTH_CONFIGURED && !isSubscribed && scenario.id !== FREE_SCENARIO_ID;
        return (
          <Pressable
            key={scenario.id}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
              completed != null && styles.cardCompleted,
              isLocked && styles.cardLocked,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${scenario.title}, ${scenario.patient.name}, age ${scenario.patient.age}, ${scenario.setting}${isLocked ? ', locked — requires subscription' : ''}`}
            onPress={() => handleSelect(scenario.id)}>
            <View style={styles.cardHeader}>
              <Text style={[styles.scenarioTitle, isLocked && styles.scenarioTitleLocked]}>
                {scenario.title}
              </Text>
              <View style={styles.badgeRow}>
                {isLocked && (
                  <View style={styles.lockBadge}>
                    <Text style={styles.lockBadgeText}>🔒</Text>
                  </View>
                )}
                {scenario.difficulty != null && !isLocked && (
                  <View style={[styles.diffBadge, { backgroundColor: diffBadgeBg(scenario.difficulty) }]}>
                    <Text style={[styles.diffBadgeText, { color: DIFFICULTY_COLORS[scenario.difficulty] }]}>
                      {scenario.difficulty}
                    </Text>
                  </View>
                )}
                {completed != null && (
                  <View style={styles.doneBadge}>
                    <Text style={styles.doneBadgeText}>✓ {completed.overallScore.toFixed(1)}</Text>
                  </View>
                )}
              </View>
            </View>
            <Text style={styles.scenarioMeta}>
              {scenario.patient.name}, age {scenario.patient.age} · {scenario.setting}
            </Text>
            {diagnosis != null && (
              <Text style={styles.scenarioMeta}>{diagnosis.name}</Text>
            )}
            <Text style={styles.scenarioObjective} numberOfLines={2}>
              {scenario.learnerObjective}
            </Text>
            {SCENARIO_TOPICS[scenario.id] != null && (
              <View style={styles.topicTagRow}>
                <View style={styles.topicTag}>
                  <Text style={styles.topicTagText}>
                    {TOPIC_LABELS[SCENARIO_TOPICS[scenario.id] as ScenarioTopic]}
                  </Text>
                </View>
              </View>
            )}
          </Pressable>
        );
      })}
    </PremiumScreen>
  );
}

function diffBadgeBg(difficulty: ScenarioDifficulty): string {
  switch (difficulty) {
    case 'beginner': return SimulatorColors.greenBackground;
    case 'intermediate': return '#FEF3C7';
    case 'advanced': return '#FEF2F2';
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 48,
    gap: 16,
  },
  changeRoleText: {
    fontSize: 14,
    color: SimulatorColors.brand,
    fontWeight: '600',
  },
  roleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  roleLabel: {
    fontSize: 14,
    color: SimulatorColors.textSecondary,
    lineHeight: 20,
  },
  progressPill: {
    backgroundColor: SimulatorColors.greenBackground,
    borderWidth: 1,
    borderColor: SimulatorColors.greenBorder,
    borderRadius: Radius.lg,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  progressPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: SimulatorColors.scoreGreen,
  },
  searchInput: {
    backgroundColor: SimulatorColors.surface,
    borderWidth: 1,
    borderColor: SimulatorColors.borderInput,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: SimulatorColors.textPrimary,
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  topicChipActive: {
    backgroundColor: SimulatorColors.indigoBackground,
    borderColor: SimulatorColors.indigoBorder,
  },
  topicTextActive: {
    color: SimulatorColors.indigoLabel,
    fontWeight: '700',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: SimulatorColors.borderInput,
    backgroundColor: SimulatorColors.surface,
  },
  filterChipActive: {
    backgroundColor: SimulatorColors.brand,
    borderColor: SimulatorColors.brand,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: SimulatorColors.textBody,
  },
  filterTextActive: {
    color: SimulatorColors.textOnBrand,
    fontWeight: '700',
  },
  emptyFilter: {
    fontSize: 15,
    color: SimulatorColors.textSecondary,
    textAlign: 'center',
    paddingVertical: 32,
    lineHeight: 22,
  },
  card: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.lg,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
  },
  cardPressed: {
    backgroundColor: SimulatorColors.brandTint,
    borderColor: SimulatorColors.brand,
  },
  cardCompleted: {
    borderLeftWidth: 3,
    borderLeftColor: SimulatorColors.scoreGreen,
  },
  cardLocked: {
    opacity: 0.65,
  },
  lockBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  lockBadgeText: {
    fontSize: 14,
  },
  scenarioTitleLocked: {
    color: SimulatorColors.textSecondary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 8,
  },
  scenarioTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    flexShrink: 0,
  },
  diffBadge: {
    borderRadius: Radius.sm,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  diffBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  doneBadge: {
    backgroundColor: SimulatorColors.greenBackground,
    borderRadius: Radius.sm,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  doneBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.scoreGreen,
  },
  scenarioMeta: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    lineHeight: 19,
    marginBottom: 4,
  },
  scenarioObjective: {
    fontSize: 14,
    color: SimulatorColors.textBody,
    lineHeight: 20,
    marginTop: 8,
  },
  topicTagRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  topicTag: {
    backgroundColor: SimulatorColors.indigoBackground,
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  topicTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: SimulatorColors.indigoLabel,
    letterSpacing: 0.2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: SimulatorColors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  errorButton: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  errorButtonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 15,
    fontWeight: '600',
  },
});
