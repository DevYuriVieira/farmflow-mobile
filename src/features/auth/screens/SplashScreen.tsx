import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../../contexts/AuthContext';
import { AnimatedFarmBackground } from '../../../components/AnimatedFarmBackground';
import { colors, radii, spacing, typography } from '../../../theme';

export const SplashScreen: React.FC = () => {
  const { status } = useAuth();
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, [logoScale, logoOpacity]);

  return (
    <View style={styles.container}>
      <AnimatedFarmBackground variant="full" />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={styles.logoCircle}>
          <MaterialCommunityIcons name="sprout" size={54} color={colors.primary} />
        </View>

        <Text style={styles.brandTitle}>FarmFlow</Text>
        <Text style={styles.tagline}>Gestão Agrícola Inteligente</Text>

        <View style={styles.statusRow}>
          <Text style={styles.statusText}>
            {status === 'checking' ? 'Conectando ao ecossistema...' : 'Pronto'}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: radii.xxl,
    backgroundColor: 'rgba(16, 40, 27, 0.92)',
    borderWidth: 1.5,
    borderColor: 'rgba(74, 138, 98, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: spacing.base,
  },
  brandTitle: {
    ...typography.hero,
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  tagline: {
    ...typography.captionMedium,
    color: colors.primaryLight,
    letterSpacing: 0.3,
  },
  statusRow: {
    marginTop: spacing.xxl,
    backgroundColor: 'rgba(12, 30, 21, 0.7)',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.25)',
  },
  statusText: {
    ...typography.micro,
    color: colors.textSecondary,
  },
});
