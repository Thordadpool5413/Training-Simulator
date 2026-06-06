import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.appTitle} accessibilityRole="header">
        Hospice Communication Training Simulator
      </Text>
      <Text style={styles.disclaimer}>
        This is a fictional training simulator for hospice and palliative communication practice. Do not enter real patient information. This tool does not diagnose patients, determine hospice eligibility, prescribe medications, or replace clinical judgment.
      </Text>
      <Pressable style={styles.button} onPress={() => router.push('/role' as Href)}>
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F9FAFB',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 30,
  },
  disclaimer: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
