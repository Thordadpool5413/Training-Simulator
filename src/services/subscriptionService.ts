import { Platform } from 'react-native';
import type { SubscriptionInfo } from '@/types/auth';

const RC_APPLE_KEY = process.env.EXPO_PUBLIC_RC_APPLE_API_KEY ?? '';
const RC_GOOGLE_KEY = process.env.EXPO_PUBLIC_RC_GOOGLE_API_KEY ?? '';

export const ENTITLEMENT_ID = 'pro';

// RevenueCat is loaded lazily to avoid crashing in Expo Go
let Purchases: typeof import('react-native-purchases').default | null = null;
let initialized = false;

async function getPurchases() {
  if (Purchases) return Purchases;
  try {
    const mod = await import('react-native-purchases');
    Purchases = mod.default;
    return Purchases;
  } catch {
    return null;
  }
}

export async function initSubscriptions(userId?: string): Promise<void> {
  if (Platform.OS === 'web') return;
  const apiKey = Platform.OS === 'ios' ? RC_APPLE_KEY : RC_GOOGLE_KEY;
  if (!apiKey) return;

  const P = await getPurchases();
  if (!P) return;

  try {
    P.configure({ apiKey });
    initialized = true;
    if (userId) {
      await P.logIn(userId);
    }
  } catch {
    // non-fatal — app runs without subscription gate
  }
}

export async function getSubscriptionInfo(): Promise<SubscriptionInfo> {
  if (!initialized || Platform.OS === 'web') {
    return { plan: 'free', status: 'none', expiresAt: null };
  }

  const P = await getPurchases();
  if (!P) return { plan: 'free', status: 'none', expiresAt: null };

  try {
    const customerInfo = await P.getCustomerInfo();
    const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
    if (!entitlement) {
      return { plan: 'free', status: 'none', expiresAt: null };
    }
    return {
      plan: 'pro',
      status: 'active',
      expiresAt: entitlement.expirationDate,
    };
  } catch {
    return { plan: 'free', status: 'none', expiresAt: null };
  }
}

export interface OfferingPackage {
  identifier: string;
  productIdentifier: string;
  localizedPriceString: string;
  offeringIdentifier: string;
  raw: unknown;
}

export async function getOfferings(): Promise<OfferingPackage[]> {
  if (!initialized || Platform.OS === 'web') return [];
  const P = await getPurchases();
  if (!P) return [];

  try {
    const offerings = await P.getOfferings();
    return (offerings.current?.availablePackages ?? []).map((pkg) => ({
      identifier: pkg.identifier,
      productIdentifier: pkg.product.identifier,
      localizedPriceString: pkg.product.priceString,
      offeringIdentifier: pkg.offeringIdentifier,
      raw: pkg,
    }));
  } catch {
    return [];
  }
}

export async function purchasePackage(
  rawPackage: unknown
): Promise<{ success: boolean; error: string | null }> {
  const P = await getPurchases();
  if (!P) return { success: false, error: 'Purchases not available' };
  try {
    await P.purchasePackage(rawPackage as Parameters<typeof P.purchasePackage>[0]);
    return { success: true, error: null };
  } catch (e: unknown) {
    const err = e as { userCancelled?: boolean; message?: string };
    if (err.userCancelled) return { success: false, error: null };
    return { success: false, error: err.message ?? 'Purchase failed' };
  }
}

export async function restorePurchases(): Promise<{ success: boolean; error: string | null }> {
  if (!initialized) return { success: false, error: 'Not initialized' };
  const P = await getPurchases();
  if (!P) return { success: false, error: 'Purchases not available' };

  try {
    const customerInfo = await P.restorePurchases();
    const hasActive = !!customerInfo.entitlements.active[ENTITLEMENT_ID];
    return {
      success: hasActive,
      error: hasActive ? null : 'No active subscription found',
    };
  } catch (e: unknown) {
    const err = e as { message?: string };
    return { success: false, error: err.message ?? 'Restore failed' };
  }
}
