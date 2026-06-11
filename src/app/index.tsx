import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radius, SimulatorColors } from '@/constants/theme';

export default function IndexScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.appTitle} accessibilityRole="header">
          Hospice Communication Training Simulator
        </Text>
        <Text style={styles.disclaimer}>
          This is a fictional training simulator for hospice and palliative communication practice. Do not enter real patient information. This tool does not diagnose patients, determine hospice eligibility, prescribe medications, or replace clinical judgment.
        </Text>
        <Pressable
          style={styles.button}
          accessibilityRole="button"
          onPress={() => router.push('/role' as Href)}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SimulatorColors.screenBackground,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 30,
  },
  disclaimer: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    color: SimulatorColors.textSecondary,
    marginBottom: 40,
  },
  button: {
    backgroundColor: SimulatorColors.brand,
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  buttonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 16,
    fontWeight: '600',
  },
});
