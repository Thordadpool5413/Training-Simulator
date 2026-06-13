import { Text, View, StyleSheet } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';

import { SimulatorColors } from '@/constants/theme';

const DURATION = 700;

const frameKeyframe = new Keyframe({
  0: {
    transform: [{ scale: 0.92 }],
    opacity: 0,
  },
  100: {
    transform: [{ scale: 1 }],
    opacity: 1,
    easing: Easing.out(Easing.cubic),
  },
});

const glowKeyframe = new Keyframe({
  0: {
    opacity: 0,
    transform: [{ scale: 0.85 }],
  },
  100: {
    opacity: 1,
    transform: [{ scale: 1 }],
    easing: Easing.out(Easing.cubic),
  },
});

export function AnimatedSplashOverlay() {
  return null;
}

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Animated.View entering={glowKeyframe.duration(DURATION)} style={styles.glow} />
      <Animated.View entering={frameKeyframe.duration(DURATION)} style={styles.frame}>
        <View style={styles.innerFrame}>
          <Text style={styles.monogram}>H</Text>
          <View style={styles.captionRow}>
            <View style={styles.pulseDot} />
            <View style={styles.pulseBar} />
          </View>
          <Text style={styles.caption}>Hospice Training</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 132,
    height: 132,
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    width: 216,
    height: 216,
    borderRadius: 108,
    backgroundColor: 'rgba(94, 175, 255, 0.15)',
  },
  frame: {
    width: 132,
    height: 132,
    borderRadius: 36,
    backgroundColor: 'rgba(14, 22, 38, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(94, 175, 255, 0.22)',
    padding: 12,
    boxShadow: `0 24px 60px ${SimulatorColors.shadowStrong}`,
  },
  innerFrame: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: SimulatorColors.surfaceRaised,
    borderWidth: 1,
    borderColor: 'rgba(157, 176, 199, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  monogram: {
    color: SimulatorColors.textPrimary,
    fontSize: 58,
    fontWeight: '900',
    letterSpacing: -3,
    lineHeight: 58,
  },
  captionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: SimulatorColors.scoreGreen,
  },
  pulseBar: {
    width: 26,
    height: 2,
    borderRadius: 999,
    backgroundColor: SimulatorColors.brand,
  },
  caption: {
    fontSize: 10,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    color: SimulatorColors.textSecondary,
    fontWeight: '700',
  },
});
