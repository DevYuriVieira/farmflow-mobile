import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { usePreferences } from '../contexts/PreferencesContext';

export interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message }) => {
  const { isDark, language } = usePreferences();
  const defaultMessage =
    language === 'en' ? 'Loading agricultural data...' : 'Carregando dados agrícolas...';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ActivityIndicator size="large" color={isDark ? '#4ADE80' : colors.primary} />
      <Text style={[styles.message, isDark && styles.messageDark]}>
        {message || defaultMessage}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: 'transparent',
  },
  containerDark: {
    backgroundColor: 'transparent',
  },
  message: {
    ...typography.captionMedium,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  messageDark: {
    color: '#CBD5E1',
  },
});

