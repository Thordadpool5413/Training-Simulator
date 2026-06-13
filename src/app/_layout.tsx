import { Stack, router, useSegments } from 'expo-router';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useEffect, useRef } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { SimulatorProvider } from '@/state/SimulatorContext';
import { AuthProvider, useAuth } from '@/state/AuthContext';
import { requestNotificationPermissions } from '@/services/notificationService';
import { syncProfileToCloud, syncSessionToCloud } from '@/services/cloudSyncService';
import { useSimulator } from '@/state/SimulatorContext';

const PUBLIC_ROUTES = new Set(['welcome', 'sign-in', 'sign-up']);
const AUTH_CONFIGURED = !!(process.env.EXPO_PUBLIC_SUPABASE_URL);

function NotificationSetup() {
  useEffect(() => {
    void requestNotificationPermissions();
  }, []);
  return null;
}

function CloudSyncWatcher() {
  const { userId } = useAuth();
  const { completedSessions, learnerProfile, isHydrated } = useSimulator();
  const syncedSessionIds = useRef<Set<string>>(new Set());
  const lastSyncedProfile = useRef<string | null>(null);

  useEffect(() => {
    syncedSessionIds.current = new Set();
    lastSyncedProfile.current = null;
  }, [userId]);

  useEffect(() => {
    if (!isHydrated || !userId || completedSessions.length === 0) return;
    for (const session of completedSessions) {
      if (syncedSessionIds.current.has(session.id)) continue;
      syncedSessionIds.current.add(session.id);
      void syncSessionToCloud(userId, session);
    }
  }, [isHydrated, userId, completedSessions]);

  useEffect(() => {
    if (!isHydrated || !userId || !learnerProfile) return;
    const serialized = JSON.stringify(learnerProfile);
    if (lastSyncedProfile.current === serialized) return;
    lastSyncedProfile.current = serialized;
    void syncProfileToCloud(userId, learnerProfile);
  }, [isHydrated, userId, learnerProfile]);

  return null;
}

function AuthGuard() {
  const { isSignedIn, isLoadingAuth } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (!AUTH_CONFIGURED || isLoadingAuth) return;
    const route = (segments[0] as string | undefined) ?? '';
    if (!isSignedIn && !PUBLIC_ROUTES.has(route)) {
      router.replace('/welcome');
    }
  }, [isSignedIn, isLoadingAuth, segments]);

  return null;
}

export default function RootLayout() {
  const premiumTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#07101C',
      card: '#111B2D',
      text: '#F4F8FF',
      border: 'rgba(157, 176, 199, 0.18)',
      primary: '#5EAFFF',
      notification: '#5EAFFF',
    },
  };

  return (
    <AuthProvider>
      <SimulatorProvider>
        <ThemeProvider value={premiumTheme}>
          <NotificationSetup />
          <AnimatedSplashOverlay />
          <AuthGuard />
          <CloudSyncWatcher />
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </SimulatorProvider>
    </AuthProvider>
  );
}
