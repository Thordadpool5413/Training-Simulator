import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Session } from '@/services/authService';
import {
  getSession,
  getUserProfile,
  onAuthStateChange,
  signOut as authSignOut,
} from '@/services/authService';
import { getSubscriptionInfo, initSubscriptions } from '@/services/subscriptionService';
import type { SubscriptionInfo } from '@/types/auth';

interface AuthContextState {
  userId: string | null;
  email: string | null;
  displayName: string | null;
  orgId: string | null;
  isAdmin: boolean;
  isSignedIn: boolean;
  isLoadingAuth: boolean;
  subscription: SubscriptionInfo;
  isSubscribed: boolean;
  refreshSubscription: () => Promise<void>;
  signOut: () => Promise<void>;
}

const DEFAULT_SUBSCRIPTION: SubscriptionInfo = {
  plan: 'free',
  status: 'none',
  expiresAt: null,
};

const AuthContext = createContext<AuthContextState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionInfo>(DEFAULT_SUBSCRIPTION);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);

  const refreshSubscription = useCallback(async () => {
    const info = await getSubscriptionInfo();
    setSubscription(info);
  }, []);

  const loadUserProfile = useCallback(async (uid: string) => {
    const profile = await getUserProfile(uid);
    if (profile) {
      setOrgId(profile.orgId);
      setIsAdmin(profile.isAdmin);
      setDisplayName(profile.displayName);
    }
  }, []);

  useEffect(() => {
    void getSession().then(async (s) => {
      setSession(s);
      if (s?.user) {
        await Promise.all([
          initSubscriptions(s.user.id),
          loadUserProfile(s.user.id),
        ]);
        await refreshSubscription();
      }
      setIsLoadingAuth(false);
    });

    const unsubscribe = onAuthStateChange(async (s) => {
      setSession(s);
      if (s?.user) {
        await Promise.all([
          initSubscriptions(s.user.id),
          loadUserProfile(s.user.id),
        ]);
        await refreshSubscription();
      } else {
        setSubscription(DEFAULT_SUBSCRIPTION);
        setOrgId(null);
        setIsAdmin(false);
        setDisplayName(null);
      }
    });

    return unsubscribe;
  }, [refreshSubscription, loadUserProfile]);

  const signOut = useCallback(async () => {
    await authSignOut();
    setSubscription(DEFAULT_SUBSCRIPTION);
    setOrgId(null);
    setIsAdmin(false);
    setDisplayName(null);
  }, []);

  const userId = session?.user?.id ?? null;
  const email = session?.user?.email ?? null;
  const isSignedIn = !!userId;
  const isSubscribed =
    subscription.status === 'active' || subscription.status === 'trial';

  return (
    <AuthContext.Provider
      value={{
        userId,
        email,
        displayName,
        orgId,
        isAdmin,
        isSignedIn,
        isLoadingAuth,
        subscription,
        isSubscribed,
        refreshSubscription,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
