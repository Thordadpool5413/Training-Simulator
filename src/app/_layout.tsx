import { Stack } from 'expo-router';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { SimulatorProvider } from '@/state/SimulatorContext';

export default function RootLayout() {
  return (
    <SimulatorProvider>
      <ThemeProvider value={DefaultTheme}>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </SimulatorProvider>
  );
}
