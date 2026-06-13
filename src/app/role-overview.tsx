import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PremiumPill, PremiumScreen } from '@/components/premium-ui';
import { SectionCard } from '@/components/SectionCard';
import { Radius, SimulatorColors } from '@/constants/theme';
import { roles } from '@/data/roles';
import { scenarioTemplates } from '@/data/scenarioTemplates';
import { useSimulator } from '@/state/SimulatorContext';

export default function RoleOverviewScreen() {
  const { selectedRoleId } = useSimulator();

  const role = roles.find((r) => r.id === selectedRoleId);
  const scenarioCount = scenarioTemplates.filter((s) => s.allowedRoleId === selectedRoleId).length;

  if (!role) {
    return (
      <PremiumScreen
        eyebrow="Role Overview"
        title="Choose a Role"
        subtitle="Select a practice role first so we can tailor the overview."
        onBack={() => router.back()}
        backLabel="Back"
        headerRight={<PremiumPill label="Role required" tone="warning" />}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No role selected. Please go back and select a role.</Text>
          <Pressable style={styles.button} accessibilityRole="button" onPress={() => router.push('/role' as Href)}>
            <Text style={styles.buttonText}>Back to Role Selection</Text>
          </Pressable>
        </View>
      </PremiumScreen>
    );
  }

  return (
    <PremiumScreen
      eyebrow="Role Overview"
      title={role.name}
      subtitle={`${scenarioCount} practice scenarios available`}
      onBack={() => router.push('/role' as Href)}
      backLabel="Change Role"
      headerRight={<PremiumPill label={`${scenarioCount} scenarios`} tone="indigo" />}
      scrollContentStyle={styles.scrollContent}>
      <SectionCard title="What You Can Do">
        {role.allowed.map((item, i) => (
          <View key={i} style={styles.listRow}>
            <Text style={styles.checkMark}>✓</Text>
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard title="What Is Outside This Role">
        {role.blocked.map((item, i) => (
          <View key={i} style={styles.listRow}>
            <Text style={styles.xMark}>✗</Text>
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard title="Common Mistakes to Avoid">
        {role.commonMistakes.map((item, i) => (
          <View key={i} style={styles.listRow}>
            <Text style={styles.warningMark}>!</Text>
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard title="Scoring Categories">
        <Text style={styles.scoringIntro}>
          Your performance in each simulation is scored across these skill areas.
        </Text>
        <View style={styles.categoryGrid}>
          {role.scoringCategories.map((cat, i) => (
            <View key={i} style={styles.categoryChip}>
              <Text style={styles.categoryText}>{cat}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <Pressable
        style={styles.startButton}
        accessibilityRole="button"
        onPress={() => router.push('/scenario' as Href)}>
        <Text style={styles.startButtonText}>Choose a Scenario</Text>
      </Pressable>
    </PremiumScreen>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SimulatorColors.screenBackground,
  },
  scrollContent: {
    padding: 24,
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
  roleName: {
    fontSize: 28,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
    marginTop: 4,
  },
  scenarioCount: {
    fontSize: 14,
    color: SimulatorColors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  listRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
  },
  checkMark: {
    fontSize: 14,
    color: SimulatorColors.scoreGreen,
    fontWeight: '700',
    lineHeight: 21,
    width: 16,
  },
  xMark: {
    fontSize: 14,
    color: SimulatorColors.scoreOrange,
    fontWeight: '700',
    lineHeight: 21,
    width: 16,
  },
  warningMark: {
    fontSize: 14,
    color: SimulatorColors.warningBorder,
    fontWeight: '700',
    lineHeight: 21,
    width: 16,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: SimulatorColors.textBody,
    lineHeight: 21,
  },
  scoringIntro: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    lineHeight: 19,
    marginBottom: 10,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: SimulatorColors.brandTint,
    borderRadius: Radius.lg,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: SimulatorColors.brand,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: SimulatorColors.brand,
  },
  startButton: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  startButtonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 16,
    fontWeight: '600',
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
  button: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 15,
    fontWeight: '600',
  },
});
