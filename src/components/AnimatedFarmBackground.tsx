import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Circle,
  G,
} from 'react-native-svg';
import { usePreferences } from '../contexts/PreferencesContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AnimatedFarmBackgroundProps {
  variant?: 'full' | 'header' | 'subtle';
  height?: number;
}

export const AnimatedFarmBackground: React.FC<AnimatedFarmBackgroundProps> = ({
  variant = 'full',
  height,
}) => {
  const { preferences } = usePreferences();
  const isReducedMotion = preferences.reducedMotion;

  const bgHeight = height ?? (variant === 'header' ? 320 : SCREEN_HEIGHT);

  const cloud1X = useRef(new Animated.Value(-120)).current;
  const cloud2X = useRef(new Animated.Value(-200)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;
  const mistOpacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    if (isReducedMotion) return;

    const cloud1Loop = Animated.loop(
      Animated.timing(cloud1X, {
        toValue: SCREEN_WIDTH + 150,
        duration: 38000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const cloud2Loop = Animated.loop(
      Animated.timing(cloud2X, {
        toValue: SCREEN_WIDTH + 220,
        duration: 54000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const swayLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(swayAnim, {
          toValue: 1,
          duration: 3400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(swayAnim, {
          toValue: -1,
          duration: 3600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    const mistLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(mistOpacity, {
          toValue: 0.65,
          duration: 6500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(mistOpacity, {
          toValue: 0.35,
          duration: 7000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    cloud1Loop.start();
    cloud2Loop.start();
    swayLoop.start();
    mistLoop.start();

    return () => {
      cloud1Loop.stop();
      cloud2Loop.stop();
      swayLoop.stop();
      mistLoop.stop();
    };
  }, [cloud1X, cloud2X, swayAnim, mistOpacity, isReducedMotion]);

  const swayRotate = swayAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-2.5deg', '2.5deg'],
  });

  return (
    <View
      pointerEvents="none"
      style={[
        styles.container,
        {
          height: bgHeight,
          position: variant === 'full' ? 'absolute' : 'relative',
        },
      ]}
    >
      <Svg
        width={SCREEN_WIDTH}
        height={bgHeight}
        viewBox={`0 0 ${SCREEN_WIDTH} ${bgHeight}`}
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <LinearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#1E392B" stopOpacity="1" />
            <Stop offset="35%" stopColor="#183225" stopOpacity="1" />
            <Stop offset="65%" stopColor="#12271C" stopOpacity="1" />
            <Stop offset="100%" stopColor="#07150E" stopOpacity="1" />
          </LinearGradient>

          <LinearGradient id="distantHills" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#193928" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#0D2016" stopOpacity="0.95" />
          </LinearGradient>

          <LinearGradient id="midFarmland" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#28583B" stopOpacity="0.9" />
            <Stop offset="50%" stopColor="#1C422C" stopOpacity="0.95" />
            <Stop offset="100%" stopColor="#0D2217" stopOpacity="1" />
          </LinearGradient>

          <LinearGradient id="foreValley" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#1F4730" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#07150E" stopOpacity="1" />
          </LinearGradient>

          <LinearGradient id="mistGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#A7C9B6" stopOpacity="0" />
            <Stop offset="50%" stopColor="#A7C9B6" stopOpacity="0.18" />
            <Stop offset="100%" stopColor="#A7C9B6" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width={SCREEN_WIDTH} height={bgHeight} fill="url(#skyGrad)" />

        <Circle
          cx={SCREEN_WIDTH * 0.75}
          cy={bgHeight * 0.22}
          r={75}
          fill="#FDE68A"
          fillOpacity={0.06}
        />
        <Circle
          cx={SCREEN_WIDTH * 0.75}
          cy={bgHeight * 0.22}
          r={130}
          fill="#34D399"
          fillOpacity={0.04}
        />

        <Path
          d={`
            M 0 ${bgHeight * 0.42}
            Q ${SCREEN_WIDTH * 0.25} ${bgHeight * 0.36} ${SCREEN_WIDTH * 0.5} ${bgHeight * 0.41}
            T ${SCREEN_WIDTH} ${bgHeight * 0.38}
            L ${SCREEN_WIDTH} ${bgHeight}
            L 0 ${bgHeight}
            Z
          `}
          fill="url(#distantHills)"
        />

        <G fill="#132B1F" opacity={0.5}>
          {Array.from({ length: 18 }).map((_, i) => {
            const x = (SCREEN_WIDTH / 17) * i;
            const baseY = bgHeight * 0.41 + Math.sin(i * 1.3) * 12;
            const treeH = 14 + (i % 3) * 6;
            return (
              <Path
                key={`pine-${i}`}
                d={`M ${x} ${baseY} L ${x + 6} ${baseY + treeH} L ${x - 6} ${baseY + treeH} Z`}
              />
            );
          })}
        </G>

        <Path
          d={`
            M 0 ${bgHeight * 0.54}
            C ${SCREEN_WIDTH * 0.3} ${bgHeight * 0.48}, ${SCREEN_WIDTH * 0.65} ${bgHeight * 0.6}, ${SCREEN_WIDTH} ${bgHeight * 0.51}
            L ${SCREEN_WIDTH} ${bgHeight}
            L 0 ${bgHeight}
            Z
          `}
          fill="url(#midFarmland)"
        />

        <Path
          d={`M 0 ${bgHeight * 0.58} Q ${SCREEN_WIDTH * 0.4} ${bgHeight * 0.53} ${SCREEN_WIDTH} ${bgHeight * 0.56}`}
          stroke="#3D7A54"
          strokeWidth="1.2"
          strokeOpacity="0.4"
          fill="none"
        />
        <Path
          d={`M 0 ${bgHeight * 0.63} Q ${SCREEN_WIDTH * 0.45} ${bgHeight * 0.57} ${SCREEN_WIDTH} ${bgHeight * 0.61}`}
          stroke="#3D7A54"
          strokeWidth="1.5"
          strokeOpacity="0.35"
          fill="none"
        />
        <Path
          d={`M 0 ${bgHeight * 0.68} Q ${SCREEN_WIDTH * 0.5} ${bgHeight * 0.62} ${SCREEN_WIDTH} ${bgHeight * 0.67}`}
          stroke="#4F9668"
          strokeWidth="1.8"
          strokeOpacity="0.3"
          fill="none"
        />

        <Path
          d={`
            M 0 ${bgHeight * 0.76}
            Q ${SCREEN_WIDTH * 0.45} ${bgHeight * 0.71} ${SCREEN_WIDTH} ${bgHeight * 0.79}
            L ${SCREEN_WIDTH} ${bgHeight}
            L 0 ${bgHeight}
            Z
          `}
          fill="url(#foreValley)"
        />
      </Svg>

      {!isReducedMotion && (
        <Animated.View
          style={[
            styles.cloudWrapper,
            {
              top: bgHeight * 0.16,
              transform: [{ translateX: cloud1X }],
            },
          ]}
        >
          <Svg width={140} height={45} viewBox="0 0 140 45">
            <Path
              d="M 20 35 C 10 35 0 28 0 18 C 0 8 12 2 24 6 C 30 -2 46 -2 55 5 C 64 0 78 2 84 9 C 94 6 108 12 108 22 C 118 20 128 26 128 35 Z"
              fill="#FFFFFF"
              opacity={0.12}
            />
          </Svg>
        </Animated.View>
      )}

      {!isReducedMotion && (
        <Animated.View
          style={[
            styles.cloudWrapper,
            {
              top: bgHeight * 0.28,
              transform: [{ translateX: cloud2X }],
            },
          ]}
        >
          <Svg width={180} height={50} viewBox="0 0 180 50">
            <Path
              d="M 25 38 C 12 38 0 30 0 20 C 0 10 15 4 28 8 C 38 -3 58 -2 68 7 C 80 1 98 4 106 12 C 118 8 135 15 135 26 C 148 24 160 30 160 38 Z"
              fill="#A7C9B6"
              opacity={0.08}
            />
          </Svg>
        </Animated.View>
      )}

      <Animated.View
        style={[
          styles.mistLayer,
          {
            top: bgHeight * 0.38,
            height: 90,
            opacity: isReducedMotion ? 0.3 : mistOpacity,
          },
        ]}
      >
        <Svg width={SCREEN_WIDTH} height={90}>
          <Rect x="0" y="0" width={SCREEN_WIDTH} height={90} fill="url(#mistGrad)" />
        </Svg>
      </Animated.View>

      <Animated.View
        style={[
          styles.foregroundSwayContainer,
          {
            bottom: 0,
            transform: isReducedMotion ? [] : [{ rotate: swayRotate }],
          },
        ]}
      >
        <Svg width={SCREEN_WIDTH} height={70} viewBox={`0 0 ${SCREEN_WIDTH} 70`}>
          <G fill="#143623" opacity={0.75}>
            {Array.from({ length: 22 }).map((_, i) => {
              const x = (SCREEN_WIDTH / 21) * i;
              const h = 35 + (i % 4) * 8;
              return (
                <Path
                  key={`sprout-${i}`}
                  d={`
                    M ${x} 70
                    Q ${x + 4} ${70 - h * 0.6} ${x + 8} ${70 - h}
                    Q ${x + 2} ${70 - h * 0.5} ${x - 2} 70
                    Z
                  `}
                />
              );
            })}
          </G>
        </Svg>
      </Animated.View>

      <View style={[styles.bottomVignette, { height: bgHeight * 0.45 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    backgroundColor: '#07150E',
    zIndex: 0,
  },
  cloudWrapper: {
    position: 'absolute',
  },
  mistLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  foregroundSwayContainer: {
    position: 'absolute',
    left: -15,
    right: -15,
    transformOrigin: 'bottom center',
  },
  bottomVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(7, 21, 14, 0.45)',
  },
});
