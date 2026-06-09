import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Radius, SimulatorColors } from '@/constants/theme';

export function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
});
