import { Stack } from 'expo-router';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useEffect } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { SimulatorProvider } from '@/state/SimulatorContext';
import { requestNotificationPermissions } from '@/services/notificationService';

function NotificationSetup() {
  useEffect(() => {
    void requestNotificationPermissions();
  }, []);
  return null;
}

export default function RootLayout() {
  return (
    <SimulatorProvider>
      <ThemeProvider value={DefaultTheme}>
        <NotificationSetup />
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </SimulatorProvider>
  );
}
