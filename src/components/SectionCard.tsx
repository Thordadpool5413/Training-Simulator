import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Radius, SimulatorColors } from '@/constants/theme';

type SectionCardProps = {
  title: string;
  subtitle?: string;
  headerRight?: ReactNode;
  children: ReactNode;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'indigo';
  style?: StyleProp<ViewStyle>;
};

const TONE_COLORS = {
  default: SimulatorColors.brand,
  brand: SimulatorColors.brand,
  success: SimulatorColors.scoreGreen,
  warning: SimulatorColors.warningBorder,
  indigo: SimulatorColors.indigoBorder,
} as const;

export function SectionCard({
  title,
  subtitle,
  headerRight,
  children,
  tone = 'default',
  style,
}: SectionCardProps) {
  return (
    <View style={[styles.container, { borderColor: `${TONE_COLORS[tone]}33` }, style]}>
      <View style={[styles.accent, { backgroundColor: TONE_COLORS[tone] }]} />
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: TONE_COLORS[tone] }]}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {headerRight ? <View style={styles.headerRight}>{headerRight}</View> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    padding: 18,
    gap: 10,
    borderCurve: 'continuous',
    boxShadow: `0 18px 36px ${SimulatorColors.shadow}`,
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.9,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    gap: 3,
  },
  headerRight: {
    flexShrink: 0,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    lineHeight: 19,
  },
});
