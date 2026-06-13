import { useWindowDimensions, View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useState } from 'react';

import { SimulatorColors } from '@/constants/theme';

const DURATION = 700;

export function AnimatedSplashOverlay() {
  const [visible, setVisible] = useState(true);
  const { height } = useWindowDimensions();
  const size = Math.min(156, Math.max(124, Math.round(height * 0.18)));

  if (!visible) return null;

  const splashKeyframe = new Keyframe({
    0: {
      opacity: 1,
    },
    85: {
      opacity: 1,
    },
    100: {
      opacity: 0,
      easing: Easing.out(Easing.quad),
    },
  });

  return (
    <Animated.View
      entering={splashKeyframe.duration(DURATION).withCallback((finished) => {
        'worklet';
        if (finished) {
          scheduleOnRN(setVisible, false);
        }
      })}
      style={styles.overlay}
    >
      <AnimatedIcon size={size} />
    </Animated.View>
  );
}

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

type AnimatedIconProps = {
  size?: number;
};

export function AnimatedIcon({ size = 132 }: AnimatedIconProps) {
  const glowSize = Math.round(size * 1.65);
  const cornerRadius = Math.round(size * 0.27);
  const monogramSize = Math.round(size * 0.44);

  return (
    <View style={[styles.iconContainer, { width: size, height: size }]}>
      <Animated.View
        entering={glowKeyframe.duration(DURATION)}
        style={[
          styles.glow,
          {
            width: glowSize,
            height: glowSize,
            borderRadius: glowSize / 2,
            top: -(glowSize - size) / 2,
            left: -(glowSize - size) / 2,
          },
        ]}
      />

      <Animated.View
        entering={frameKeyframe.duration(DURATION)}
        style={[
          styles.frame,
          {
            width: size,
            height: size,
            borderRadius: cornerRadius,
          },
        ]}
      >
        <View style={[styles.innerFrame, { borderRadius: Math.round(cornerRadius * 0.82) }]}>
          <Text style={[styles.monogram, { fontSize: monogramSize }]}>H</Text>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: SimulatorColors.screenBackground,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    backgroundColor: 'rgba(94, 175, 255, 0.15)',
    boxShadow: `0 0 40px rgba(105, 182, 255, 0.45)`,
  },
  frame: {
    backgroundColor: 'rgba(14, 22, 38, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(94, 175, 255, 0.22)',
    padding: 12,
    boxShadow: `0 24px 60px ${SimulatorColors.shadowStrong}`,
  },
  innerFrame: {
    flex: 1,
    backgroundColor: SimulatorColors.surfaceRaised,
    borderWidth: 1,
    borderColor: 'rgba(157, 176, 199, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  monogram: {
    color: SimulatorColors.textPrimary,
    fontWeight: '900',
    letterSpacing: -3,
    lineHeight: 1,
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
