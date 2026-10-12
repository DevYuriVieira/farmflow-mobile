import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { usePreferences } from '../contexts/PreferencesContext';
import { styles } from './styles/skeletonCardLoader.styles';

export interface SkeletonCardLoaderProps {
  count?: number;
}

export const SkeletonCardLoader: React.FC<SkeletonCardLoaderProps> = ({ count = 3 }) => {
  const { isDark } = usePreferences();
  const opacityAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.85,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacityAnim]);

  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <View style={styles.container}>
      {items.map((key) => (
        <Animated.View
          key={key}
          style={[
            styles.card,
            isDark && styles.cardDark,
            { opacity: opacityAnim },
          ]}
        >
          <View style={styles.headerRow}>
            <View style={[styles.avatar, isDark && styles.boneDark]} />
            <View style={styles.headerTexts}>
              <View style={[styles.lineLarge, isDark && styles.boneDark]} />
              <View style={[styles.lineMedium, isDark && styles.boneDark]} />
            </View>
          </View>
          <View style={styles.footerRow}>
            <View style={[styles.pill, isDark && styles.boneDark]} />
            <View style={[styles.pillSmall, isDark && styles.boneDark]} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

