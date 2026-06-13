import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radius, SimulatorColors } from '@/constants/theme';
import { useSimulator } from '@/state/SimulatorContext';

const FEATURES = [
  {
    icon: '🎯',
    title: '34 clinical scenarios',
    desc: 'Real conversations: goals of care, symptom crises, family conflict, grief.',
  },
  {
    icon: '🤖',
    title: 'AI feedback calibrated to your role',
    desc: 'Scored by clinical liaison, RN, and social worker rubrics — not generic.',
  },
  {
    icon: '🎤',
    title: 'Voice mode for hands-free practice',
    desc: "Speak your responses. The patient speaks back. Train like it's real.",
  },
];

export default function WelcomeScreen() {
  const { setSelectedRoleId, setSelectedScenarioId } = useSimulator();

  function handleTryDemo() {
    setSelectedRoleId('clinical_liaison');
    setSelectedScenarioId('hospice_means_giving_up');
    router.push('/demo' as Href);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={styles.hero}>
          <View style={styles.logoMark}>
            <Text style={styles.logoIcon}>🏥</Text>
          </View>
          <Text style={styles.appName}>Hospice Communication{'\n'}Simulator</Text>
          <Text style={styles.tagline}>
            Practice the conversations that matter most.
          </Text>
        </View>

        <View style={styles.featuresSection}>
          {FEATURES.map((f) => (
            <View key={f.title} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.ctaSection}>
          <Pressable
            style={styles.primaryButton}
            accessibilityRole="button"
            onPress={() => router.push('/sign-up' as Href)}>
            <Text style={styles.primaryButtonText}>Start Free Trial</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            accessibilityRole="button"
            onPress={() => router.push('/sign-in' as Href)}>
            <Text style={styles.secondaryButtonText}>I already have an account</Text>
          </Pressable>

          <Pressable
            style={styles.demoLink}
            accessibilityRole="button"
            onPress={handleTryDemo}>
            <Text style={styles.demoLinkText}>Try 1 free demo — no account needed</Text>
          </Pressable>
        </View>

        <Text style={styles.disclaimer}>
          For training purposes only. Does not replace clinical judgment or constitute medical advice.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SimulatorColors.brandDeep,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 32,
  },
  hero: {
    paddingTop: 40,
    paddingBottom: 32,
    alignItems: 'center',
    gap: 12,
  },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  logoIcon: {
    fontSize: 36,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresSection: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.lg,
    padding: 20,
    gap: 16,
    marginBottom: 28,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  featureIcon: {
    fontSize: 22,
    lineHeight: 28,
  },
  featureText: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 21,
  },
  featureDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.70)',
    lineHeight: 19,
  },
  ctaSection: {
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: SimulatorColors.brandDeep,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.45)',
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  demoLink: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  demoLinkText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    textDecorationLine: 'underline',
  },
  disclaimer: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.40)',
    textAlign: 'center',
    lineHeight: 16,
  },
});
