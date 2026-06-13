import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MaxContentWidth, Radius, SimulatorColors } from '@/constants/theme';

type PremiumScreenProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  onBack?: () => void;
  backLabel?: string;
  headerRight?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  scrollContentStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
};

export function PremiumScreen({
  title,
  subtitle,
  eyebrow,
  onBack,
  backLabel = 'Back',
  headerRight,
  children,
  footer,
  scrollContentStyle,
  headerStyle,
}: PremiumScreenProps) {
  const { width } = useWindowDimensions();
  const horizontalPadding = Math.max(18, Math.min(28, Math.round(width * 0.045)));

  return (
    <SafeAreaView style={styles.safe}>
      <PremiumBackdrop />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewport}>
        <View style={[styles.frame, { paddingHorizontal: horizontalPadding }]}>
          <View style={styles.shell}>
            <View style={styles.topRow}>
              {onBack ? (
                <Pressable style={styles.backButton} accessibilityRole="button" onPress={onBack}>
                  <Text style={styles.backButtonText}>← {backLabel}</Text>
                </Pressable>
              ) : (
                <View />
              )}
              {headerRight ?? <View />}
            </View>

            <View style={[styles.header, headerStyle]}>
              {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
              <Text style={styles.title} accessibilityRole="header">
                {title}
              </Text>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>

            <View style={[styles.body, scrollContentStyle]}>{children}</View>

            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function PremiumBackdrop() {
  return (
    <View style={[StyleSheet.absoluteFill, styles.backdropIgnore]}>
      <View style={styles.backdropBase} />
      <View style={styles.backdropGlowTop} />
      <View style={styles.backdropGlowMid} />
      <View style={styles.backdropGlowBottom} />
      <View style={styles.backdropRailLeft} />
      <View style={styles.backdropRailRight} />
      <View style={styles.backdropSheen} />
    </View>
  );
}

type PremiumPillProps = {
  label: string;
  tone?: 'brand' | 'success' | 'warning' | 'indigo' | 'muted' | 'danger';
};

export function PremiumPill({ label, tone = 'brand' }: PremiumPillProps) {
  return (
    <View style={[styles.pill, pillToneStyles[tone]]}>
      <Text style={[styles.pillText, pillTextToneStyles[tone]]}>{label}</Text>
    </View>
  );
}

type PremiumStatTileProps = {
  label: string;
  value: string;
  caption?: string;
  tone?: 'brand' | 'success' | 'warning' | 'indigo';
};

export function PremiumStatTile({ label, value, caption, tone = 'brand' }: PremiumStatTileProps) {
  return (
    <View style={styles.statTile}>
      <Text style={[styles.statValue, { color: statToneStyles[tone] }]} selectable>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
      {caption ? <Text style={styles.statCaption}>{caption}</Text> : null}
    </View>
  );
}

type PremiumStatRailProps = {
  items: Array<PremiumStatTileProps>;
};

export function PremiumStatRail({ items }: PremiumStatRailProps) {
  return (
    <View style={styles.statRail}>
      {items.map((item) => (
        <PremiumStatTile
          key={`${item.label}-${item.value}`}
          label={item.label}
          value={item.value}
          caption={item.caption}
          tone={item.tone}
        />
      ))}
    </View>
  );
}

type PremiumProgressRailProps = {
  label?: string;
  valueLabel?: string;
  progress: number;
  tone?: 'brand' | 'success' | 'warning' | 'indigo';
};

export function PremiumProgressRail({
  label,
  valueLabel,
  progress,
  tone = 'brand',
}: PremiumProgressRailProps) {
  const pct = Math.max(0, Math.min(100, progress * 100));
  return (
    <View style={styles.progressBlock}>
      {label || valueLabel ? (
        <View style={styles.progressMeta}>
          {label ? <Text style={styles.progressLabel}>{label}</Text> : <View />}
          {valueLabel ? (
            <Text style={[styles.progressValue, { color: statToneStyles[tone] }]}>{valueLabel}</Text>
          ) : null}
        </View>
      ) : null}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: statToneStyles[tone] }]} />
      </View>
    </View>
  );
}

type PremiumActionButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  busy?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
};

export function PremiumActionButton({
  label,
  onPress,
  variant = 'primary',
  busy = false,
  disabled = false,
  accessibilityLabel,
}: PremiumActionButtonProps) {
  const isDisabled = busy || disabled;
  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionButton,
        actionToneStyles[variant],
        pressed && !isDisabled && styles.actionButtonPressed,
        isDisabled && styles.actionButtonDisabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      disabled={isDisabled}>
      {busy ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? SimulatorColors.textOnBrand : SimulatorColors.brand}
        />
      ) : (
        <Text style={[styles.actionButtonText, actionTextToneStyles[variant]]}>{label}</Text>
      )}
    </Pressable>
  );
}

type PremiumBottomActionsProps = {
  children: ReactNode;
};

export function PremiumBottomActions({ children }: PremiumBottomActionsProps) {
  return <View style={styles.bottomActions}>{children}</View>;
}

type PremiumEmptyStateProps = {
  icon: string;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function PremiumEmptyState({ icon, title, body, actionLabel, onAction }: PremiumEmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconWrap}>
        <Text style={styles.emptyIcon}>{icon}</Text>
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
      {actionLabel && onAction ? <PremiumActionButton label={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}

type PremiumLoadingStateProps = {
  label?: string;
};

export function PremiumLoadingState({ label = 'Loading…' }: PremiumLoadingStateProps) {
  return (
    <View style={styles.loadingState}>
      <ActivityIndicator size="small" color={SimulatorColors.brand} />
      <Text style={styles.loadingText}>{label}</Text>
    </View>
  );
}

type PremiumErrorStateProps = {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function PremiumErrorState({ title, body, actionLabel, onAction }: PremiumErrorStateProps) {
  return (
    <View style={[styles.emptyState, styles.errorState]}>
      <View style={styles.emptyIconWrap}>
        <Text style={styles.emptyIcon}>!</Text>
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
      {actionLabel && onAction ? (
        <PremiumActionButton label={actionLabel} onPress={onAction} variant="secondary" />
      ) : null}
    </View>
  );
}

const statToneStyles = {
  brand: SimulatorColors.brand,
  success: SimulatorColors.scoreGreen,
  warning: SimulatorColors.warningBorder,
  indigo: SimulatorColors.indigoBorder,
} as const;

const pillToneStyles = {
  brand: {
    backgroundColor: SimulatorColors.brandTint,
    borderColor: `${SimulatorColors.brand}33`,
  },
  success: {
    backgroundColor: SimulatorColors.greenBackground,
    borderColor: `${SimulatorColors.greenBorder}33`,
  },
  warning: {
    backgroundColor: SimulatorColors.warningBackground,
    borderColor: `${SimulatorColors.warningBorder}33`,
  },
  indigo: {
    backgroundColor: SimulatorColors.indigoBackground,
    borderColor: `${SimulatorColors.indigoBorder}33`,
  },
  muted: {
    backgroundColor: SimulatorColors.surfaceMuted,
    borderColor: SimulatorColors.border,
  },
  danger: {
    backgroundColor: 'rgba(255, 107, 122, 0.12)',
    borderColor: 'rgba(255, 107, 122, 0.32)',
  },
} as const;

const pillTextToneStyles = {
  brand: { color: SimulatorColors.brand },
  success: { color: SimulatorColors.scoreGreen },
  warning: { color: SimulatorColors.warningLabelText },
  indigo: { color: SimulatorColors.indigoLabel },
  muted: { color: SimulatorColors.textSecondary },
  danger: { color: SimulatorColors.scoreRed },
} as const;

const actionToneStyles = {
  primary: {
    backgroundColor: SimulatorColors.brand,
    borderColor: SimulatorColors.brand,
  },
  secondary: {
    backgroundColor: SimulatorColors.surfaceRaised,
    borderColor: SimulatorColors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  danger: {
    backgroundColor: SimulatorColors.scoreRed,
    borderColor: SimulatorColors.scoreRed,
  },
} as const;

const actionTextToneStyles = {
  primary: { color: SimulatorColors.textOnBrand },
  secondary: { color: SimulatorColors.brand },
  ghost: { color: SimulatorColors.textSecondary },
  danger: { color: SimulatorColors.textOnBrand },
} as const;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SimulatorColors.screenBackground,
  },
  scrollViewport: {
    flexGrow: 1,
    paddingTop: 8,
    paddingBottom: 24,
    alignItems: 'center',
  },
  frame: {
    width: '100%',
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },
  shell: {
    flex: 1,
  },
  backdropBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: SimulatorColors.screenBackground,
  },
  backdropGlowTop: {
    position: 'absolute',
    top: -110,
    right: -48,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(105, 182, 255, 0.12)',
  },
  backdropGlowMid: {
    position: 'absolute',
    top: 110,
    left: -120,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(49, 208, 192, 0.09)',
  },
  backdropGlowBottom: {
    position: 'absolute',
    bottom: -120,
    right: 36,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
  },
  backdropRailLeft: {
    position: 'absolute',
    left: 18,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(167, 183, 203, 0.08)',
  },
  backdropRailRight: {
    position: 'absolute',
    right: 18,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(167, 183, 203, 0.08)',
  },
  backdropSheen: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 120,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  backdropIgnore: {
    pointerEvents: 'none',
  },
  topRow: {
    minHeight: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 14,
    color: SimulatorColors.brand,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  header: {
    gap: 8,
    marginBottom: 4,
    paddingTop: 2,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: SimulatorColors.amberBadge,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: SimulatorColors.textPrimary,
    letterSpacing: -0.7,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 15,
    color: SimulatorColors.textSecondary,
    lineHeight: 22,
  },
  body: {
    gap: 14,
  },
  footer: {
    marginTop: 6,
    gap: 10,
  },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderCurve: 'continuous',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.45,
    textTransform: 'uppercase',
  },
  statRail: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statTile: {
    flexGrow: 1,
    flexBasis: 132,
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 2,
    borderCurve: 'continuous',
    boxShadow: `0 16px 30px ${SimulatorColors.shadow}`,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 28,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  statCaption: {
    fontSize: 11,
    color: SimulatorColors.textSecondary,
    textAlign: 'center',
    lineHeight: 15,
  },
  progressBlock: {
    gap: 8,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    fontWeight: '700',
  },
  progressValue: {
    fontSize: 13,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: SimulatorColors.surfaceRaised,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 999,
  },
  actionButton: {
    minHeight: 52,
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderCurve: 'continuous',
    boxShadow: `0 12px 24px ${SimulatorColors.shadow}`,
  },
  actionButtonPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.92,
  },
  actionButtonDisabled: {
    opacity: 0.55,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  bottomActions: {
    gap: 12,
  },
  loadingState: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  loadingText: {
    fontSize: 14,
    color: SimulatorColors.textSecondary,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    padding: 20,
    gap: 10,
    alignItems: 'center',
    borderCurve: 'continuous',
    boxShadow: `0 18px 40px ${SimulatorColors.shadow}`,
  },
  errorState: {
    borderColor: 'rgba(255, 107, 122, 0.28)',
  },
  emptyIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: SimulatorColors.surfaceRaised,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 24,
    fontWeight: '800',
    color: SimulatorColors.textPrimary,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: SimulatorColors.textPrimary,
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 14,
    color: SimulatorColors.textSecondary,
    lineHeight: 21,
    textAlign: 'center',
  },
});
