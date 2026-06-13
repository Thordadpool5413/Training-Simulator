import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PremiumActionButton, PremiumPill, PremiumScreen, PremiumStatRail } from '@/components/premium-ui';
import { Radius, SimulatorColors } from '@/constants/theme';

const FEATURES = [
  {
    title: 'Clinical realism',
    desc: 'Hospice scenarios, family dynamics, and role boundaries modeled for real-world practice.',
  },
  {
    title: 'Role-calibrated coaching',
    desc: 'Feedback tuned for clinical liaison, RN, and social worker workflows.',
  },
  {
    title: 'Secure growth path',
    desc: 'Local seed content first, with Supabase sync and protected backend AI work behind the scenes.',
  },
];

export default function WelcomeScreen() {
  return (
    <PremiumScreen
      eyebrow="Premium iOS training"
      title="Hospice Communication Simulator"
      subtitle="A polished practice environment for nurses, social workers, and clinical liaisons."
      scrollContentStyle={styles.content}>
      <View style={styles.heroCard}>
        <View style={styles.pillRow}>
          <PremiumPill label="Offline ready" tone="indigo" />
          <PremiumPill label="Supabase backed" tone="success" />
          <PremiumPill label="Protected AI proxy" tone="brand" />
        </View>
        <Text style={styles.heroCopy}>
          Train for family meetings, symptom updates, role boundaries, and end-of-life conversations in a high-trust iOS flow designed for repeated practice and visible progress.
        </Text>
      </View>

      <PremiumStatRail
        items={[
          { label: 'Scenarios', value: '34', caption: 'Clinical cases', tone: 'brand' },
          { label: 'Roles', value: '3', caption: 'Liaison, RN, SW', tone: 'indigo' },
          { label: 'Flow', value: 'Local', caption: 'Seed-first behavior', tone: 'success' },
        ]}
      />

      <View style={styles.featuresSection}>
        {FEATURES.map((f) => (
          <View key={f.title} style={styles.featureRow}>
            <View style={styles.featureMarker} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.ctaSection}>
        <PremiumActionButton
          label="Start Free Trial"
          onPress={() => router.push('/sign-up' as Href)}
        />
        <PremiumActionButton
          label="I already have an account"
          variant="secondary"
          onPress={() => router.push('/sign-in' as Href)}
        />
      </View>

      <Text style={styles.disclaimer}>
        For training purposes only. Does not replace clinical judgment or constitute medical advice.
      </Text>
    </PremiumScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  heroCard: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    padding: 18,
    gap: 12,
    borderCurve: 'continuous',
    boxShadow: `0 18px 36px ${SimulatorColors.shadow}`,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  heroCopy: {
    fontSize: 16,
    color: SimulatorColors.textBody,
    lineHeight: 24,
  },
  featuresSection: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.xl,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    borderCurve: 'continuous',
    boxShadow: `0 18px 36px ${SimulatorColors.shadow}`,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  featureMarker: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    backgroundColor: SimulatorColors.brand,
    boxShadow: `0 0 0 4px rgba(105, 182, 255, 0.10)`,
  },
  featureText: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: SimulatorColors.textPrimary,
    lineHeight: 21,
  },
  featureDesc: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    lineHeight: 19,
  },
  ctaSection: {
    gap: 12,
  },
  disclaimer: {
    fontSize: 11,
    color: SimulatorColors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    paddingTop: 4,
  },
});
