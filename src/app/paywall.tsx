import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { PremiumActionButton, PremiumPill, PremiumScreen } from '@/components/premium-ui';
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
  'Voice mode - speak your responses',
  'Role-calibrated AI coaching',
  'Score tracking and certificates',
  'Cloud sync across devices',
];

const TESTIMONIAL = {
  quote:
    'This is the most realistic hospice communication training I have experienced. I use it before difficult family meetings.',
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
    <PremiumScreen
      eyebrow="Subscription"
      title="Unlock full access"
      subtitle="Practice every scenario. Master every conversation."
      onBack={() => router.back()}
      backLabel="Close"
      scrollContentStyle={styles.content}>
      <View style={styles.heroCard}>
        <View style={styles.heroPills}>
          <PremiumPill label="7-day free trial" tone="success" />
          <PremiumPill label="No live data" tone="indigo" />
        </View>
        <Text style={styles.heroQuote}>"{TESTIMONIAL.quote}"</Text>
        <Text style={styles.heroAuthor}>- {TESTIMONIAL.author}</Text>
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

      <View style={styles.packagesSection}>
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={SimulatorColors.brand} />
            <Text style={styles.loadingText}>Loading subscription options...</Text>
          </View>
        ) : displayPackages ? (
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

      <PremiumActionButton
        label={purchasing ? 'Starting Trial...' : 'Start Free Trial'}
        onPress={() => {
          void handlePurchase();
        }}
        busy={purchasing}
        disabled={loading}
      />

      <Text style={styles.trialNote}>
        Free for 7 days, then billed at the selected rate. Cancel anytime in App Store settings.
      </Text>

      <PremiumActionButton
        label={restoring ? 'Restoring...' : 'Restore Purchases'}
        onPress={() => {
          void handleRestore();
        }}
        variant="secondary"
        busy={restoring}
      />

      <Pressable style={styles.teamNote} accessibilityRole="button" onPress={() => router.push('/team')}>
        <Text style={styles.teamNoteText}>Purchasing for your team? Get team pricing →</Text>
      </Pressable>
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
    gap: 10,
    borderCurve: 'continuous',
    boxShadow: `0 18px 40px ${SimulatorColors.shadow}`,
  },
  heroPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  heroQuote: {
    fontSize: 15,
    color: SimulatorColors.textBody,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  heroAuthor: {
    fontSize: 12,
    fontWeight: '700',
    color: SimulatorColors.textSecondary,
  },
  featureList: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.xl,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    borderCurve: 'continuous',
    boxShadow: `0 18px 40px ${SimulatorColors.shadow}`,
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
    borderColor: `${SimulatorColors.greenBorder}66`,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkMark: {
    fontSize: 11,
    fontWeight: '900',
    color: SimulatorColors.scoreGreen,
  },
  featureText: {
    fontSize: 15,
    color: SimulatorColors.textBody,
    flex: 1,
    lineHeight: 21,
  },
  packagesSection: {
    gap: 10,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  loadingText: {
    fontSize: 14,
    color: SimulatorColors.textSecondary,
  },
  packageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    borderCurve: 'continuous',
    boxShadow: `0 16px 36px ${SimulatorColors.shadow}`,
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
    fontWeight: '800',
    color: SimulatorColors.textPrimary,
    textTransform: 'capitalize',
  },
  packageIdSelected: {
    color: SimulatorColors.brand,
  },
  packagePrice: {
    fontSize: 14,
    color: SimulatorColors.textSecondary,
  },
  savingsBadge: {
    backgroundColor: SimulatorColors.greenBackground,
    borderWidth: 1,
    borderColor: `${SimulatorColors.greenBorder}66`,
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  savingsText: {
    fontSize: 11,
    fontWeight: '800',
    color: SimulatorColors.scoreGreen,
  },
  trialNote: {
    fontSize: 11,
    color: SimulatorColors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: -2,
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
