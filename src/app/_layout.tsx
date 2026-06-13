import { Stack, router, useSegments } from 'expo-router';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useEffect, useRef } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { SimulatorProvider } from '@/state/SimulatorContext';
import { AuthProvider, useAuth } from '@/state/AuthContext';
import { requestNotificationPermissions } from '@/services/notificationService';
import { syncSessionToCloud } from '@/services/cloudSyncService';
import { useSimulator } from '@/state/SimulatorContext';

const PUBLIC_ROUTES = new Set(['welcome', 'sign-in', 'sign-up', 'demo']);
const AUTH_CONFIGURED = !!(process.env.EXPO_PUBLIC_SUPABASE_URL);

function NotificationSetup() {
  useEffect(() => {
    void requestNotificationPermissions();
  }, []);
  return null;
}

function CloudSyncWatcher() {
  const { userId } = useAuth();
  const { completedSessions } = useSimulator();
  const lastSyncedId = useRef<string | null>(null);

  useEffect(() => {
    if (!userId || completedSessions.length === 0) return;
    const latest = completedSessions[completedSessions.length - 1];
    if (!latest || latest.id === lastSyncedId.current) return;
    lastSyncedId.current = latest.id;
    void syncSessionToCloud(userId, latest);
  }, [userId, completedSessions]);

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
  return (
    <AuthProvider>
      <SimulatorProvider>
        <ThemeProvider value={DefaultTheme}>
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
