import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { radii, spacing } from '../theme';
import { usePreferences } from '../contexts/PreferencesContext';

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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8DB',
  },
  cardDark: {
    backgroundColor: '#182C23',
    borderColor: '#2C493A',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
    marginRight: spacing.md,
  },
  headerTexts: {
    flex: 1,
  },
  lineLarge: {
    height: 14,
    width: '75%',
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    marginBottom: 8,
  },
  lineMedium: {
    height: 10,
    width: '45%',
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: spacing.sm,
  },
  pill: {
    height: 18,
    width: 80,
    backgroundColor: '#E2E8F0',
    borderRadius: radii.pill,
  },
  pillSmall: {
    height: 18,
    width: 60,
    backgroundColor: '#E2E8F0',
    borderRadius: radii.pill,
  },
  boneDark: {
    backgroundColor: '#2A4638',
  },
});
