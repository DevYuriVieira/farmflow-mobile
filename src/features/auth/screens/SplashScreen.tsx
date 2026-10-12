import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../../contexts/AuthContext';
import { AnimatedFarmBackground } from '../../../components/AnimatedFarmBackground';
import { colors } from '../../../theme';
import { styles } from '../styles/splash.styles';

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

