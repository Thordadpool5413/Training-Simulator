import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radius, SimulatorColors } from '@/constants/theme';
import {
  getOfferings,
  purchasePackage,
  restorePurchases,
  type OfferingPackage,
} from '@/services/subscriptionService';
import { useAuth } from '@/state/AuthContext';

const FEATURES = [
  'All 34 clinical scenarios',
  'Voice mode — speak your responses',
  'AI coaching calibrated to your role',
  'Score tracking and certificates',
  'Cloud sync across devices',
];

const TESTIMONIAL = {
  quote: "This is the most realistic hospice communication training I've experienced. I use it before difficult family meetings.",
  author: 'Clinical Liaison, Regional Medical Center',
};

const FALLBACK_PACKAGES = [
  { identifier: 'monthly', localizedPriceString: '$19.99/mo', label: 'Monthly', raw: null },
  { identifier: 'annual', localizedPriceString: '$149.99/yr', label: 'Annual', savings: 'Save 37%', raw: null },
];

export default function PaywallScreen() {
  const { refreshSubscription } = useAuth();
  const [packages, setPackages] = useState<OfferingPackage[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    void getOfferings().then((pkgs) => {
      setPackages(pkgs);
      // Default to last package (annual) but clamp if fewer packages returned
      if (pkgs.length > 0) setSelectedIndex(pkgs.length - 1);
      setLoading(false);
    });
  }, []);

  const displayPackages = packages.length > 0 ? packages : null;

  async function handlePurchase() {
    if (!displayPackages) {
      Alert.alert('App Store Required', 'Open this app from the App Store or Google Play to subscribe.');
      return;
    }
    const selected = displayPackages[selectedIndex];
    if (!selected) return;

    setPurchasing(true);
    const { success, error } = await purchasePackage(selected.raw);
    setPurchasing(false);

    if (success) {
      await refreshSubscription();
      router.back();
    } else if (error) {
      Alert.alert('Purchase Failed', error);
    }
  }

  async function handleRestore() {
    setRestoring(true);
    const { success, error } = await restorePurchases();
    setRestoring(false);

    if (success) {
      await refreshSubscription();
      router.back();
    } else {
      Alert.alert('Restore Purchases', error ?? 'No previous purchase found.');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable
          style={styles.closeButton}
          accessibilityRole="button"
          onPress={() => router.back()}>
          <Text style={styles.closeButtonText}>✕</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.badge}>7-DAY FREE TRIAL</Text>
          <Text style={styles.title} accessibilityRole="header">Unlock Full Access</Text>
          <Text style={styles.subtitle}>
            Practice every scenario. Master every conversation.
          </Text>
        </View>

        <View style={styles.trustBar}>
          <Text style={styles.trustStars}>★★★★★</Text>
          <Text style={styles.trustText}>Trusted by 500+ hospice clinicians</Text>
        </View>

        <View style={styles.testimonialCard}>
          <Text style={styles.testimonialQuote}>"{TESTIMONIAL.quote}"</Text>
          <Text style={styles.testimonialAuthor}>— {TESTIMONIAL.author}</Text>
        </View>

        <View style={styles.featureList}>
          {FEATURES.map((f) => (
            <View key={f} style={styles.featureRow}>
              <View style={styles.checkCircle}>
                <Text style={styles.checkMark}>✓</Text>
              </View>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={SimulatorColors.brand} style={styles.loader} />
        ) : (
          <View style={styles.packagesSection}>
            {displayPackages ? (
              displayPackages.map((pkg, idx) => (
                <Pressable
                  key={pkg.identifier}
                  style={[styles.packageCard, idx === selectedIndex && styles.packageCardSelected]}
                  accessibilityRole="button"
                  onPress={() => setSelectedIndex(idx)}>
                  <View style={styles.packageRadio}>
                    {idx === selectedIndex && <View style={styles.packageRadioInner} />}
                  </View>
                  <View style={styles.packageInfo}>
                    <Text style={[styles.packageId, idx === selectedIndex && styles.packageIdSelected]}>
                      {pkg.identifier}
                    </Text>
                    <Text style={styles.packagePrice}>{pkg.localizedPriceString}</Text>
                  </View>
                </Pressable>
              ))
            ) : (
              FALLBACK_PACKAGES.map((pkg, idx) => (
                <Pressable
                  key={pkg.identifier}
                  style={[styles.packageCard, idx === selectedIndex && styles.packageCardSelected]}
                  accessibilityRole="button"
                  onPress={() => setSelectedIndex(idx)}>
                  <View style={styles.packageRadio}>
                    {idx === selectedIndex && <View style={styles.packageRadioInner} />}
                  </View>
                  <View style={styles.packageInfo}>
                    <Text style={[styles.packageId, idx === selectedIndex && styles.packageIdSelected]}>
                      {pkg.label}
                    </Text>
                    <Text style={styles.packagePrice}>{pkg.localizedPriceString}</Text>
                  </View>
                  {'savings' in pkg && pkg.savings ? (
                    <View style={styles.savingsBadge}>
                      <Text style={styles.savingsText}>{pkg.savings}</Text>
                    </View>
                  ) : null}
                </Pressable>
              ))
            )}
          </View>
        )}

        <Pressable
          style={[styles.ctaButton, (purchasing || loading) && styles.ctaButtonDisabled]}
          accessibilityRole="button"
          onPress={() => { void handlePurchase(); }}
          disabled={purchasing || loading}>
          {purchasing ? (
            <ActivityIndicator size="small" color={SimulatorColors.textOnBrand} />
          ) : (
            <Text style={styles.ctaButtonText}>Start Free Trial</Text>
          )}
        </Pressable>

        <Text style={styles.trialNote}>
          Free for 7 days, then billed at the selected rate. Cancel anytime in App Store settings.
        </Text>

        <Pressable
          style={styles.restoreButton}
          accessibilityRole="button"
          onPress={() => { void handleRestore(); }}
          disabled={restoring}>
          {restoring ? (
            <ActivityIndicator size="small" color={SimulatorColors.brand} />
          ) : (
            <Text style={styles.restoreButtonText}>Restore Purchases</Text>
          )}
        </Pressable>

        <Pressable
          style={styles.teamNote}
          accessibilityRole="button"
          onPress={() => router.push('/team')}>
          <Text style={styles.teamNoteText}>
            Purchasing for your team? Get team pricing →
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SimulatorColors.screenBackground,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: SimulatorColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  closeButtonText: {
    fontSize: 14,
    color: SimulatorColors.textSecondary,
    fontWeight: '700',
  },
  header: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  badge: {
    fontSize: 11,
    fontWeight: '800',
    color: SimulatorColors.brand,
    letterSpacing: 1.5,
    backgroundColor: SimulatorColors.brandTint,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: SimulatorColors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: SimulatorColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  trustBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 4,
  },
  trustStars: {
    fontSize: 13,
    color: '#F59E0B',
    letterSpacing: 1,
  },
  trustText: {
    fontSize: 13,
    fontWeight: '600',
    color: SimulatorColors.textSecondary,
  },
  testimonialCard: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    borderLeftWidth: 3,
    borderLeftColor: SimulatorColors.brand,
    padding: 16,
    gap: 8,
    marginBottom: 4,
  },
  testimonialQuote: {
    fontSize: 14,
    color: SimulatorColors.textBody,
    lineHeight: 21,
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: SimulatorColors.textSecondary,
  },
  featureList: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.lg,
    padding: 20,
    gap: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: SimulatorColors.greenBackground,
    borderWidth: 1,
    borderColor: SimulatorColors.greenBorder,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkMark: {
    fontSize: 11,
    fontWeight: '800',
    color: SimulatorColors.scoreGreen,
  },
  featureText: {
    fontSize: 15,
    color: SimulatorColors.textBody,
    flex: 1,
    lineHeight: 21,
  },
  loader: {
    marginVertical: 32,
  },
  packagesSection: {
    gap: 10,
    marginBottom: 20,
  },
  packageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.md,
    padding: 16,
    borderWidth: 1.5,
    borderColor: SimulatorColors.border,
  },
  packageCardSelected: {
    borderColor: SimulatorColors.brand,
    backgroundColor: SimulatorColors.brandTint,
  },
  packageRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: SimulatorColors.borderInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
  packageRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: SimulatorColors.brand,
  },
  packageInfo: {
    flex: 1,
    gap: 2,
  },
  packageId: {
    fontSize: 15,
    fontWeight: '600',
    color: SimulatorColors.textBody,
    textTransform: 'capitalize',
  },
  packageIdSelected: {
    color: SimulatorColors.brandDeep,
  },
  packagePrice: {
    fontSize: 14,
    color: SimulatorColors.textSecondary,
  },
  savingsBadge: {
    backgroundColor: SimulatorColors.greenBackground,
    borderWidth: 1,
    borderColor: SimulatorColors.greenBorder,
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  savingsText: {
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.scoreGreen,
  },
  ctaButton: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  ctaButtonDisabled: {
    backgroundColor: SimulatorColors.brandDisabled,
  },
  ctaButtonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 17,
    fontWeight: '800',
  },
  trialNote: {
    fontSize: 11,
    color: SimulatorColors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 16,
  },
  restoreButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: 13,
    color: SimulatorColors.brand,
    fontWeight: '600',
  },
  teamNote: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  teamNoteText: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    textDecorationLine: 'underline',
  },
});
