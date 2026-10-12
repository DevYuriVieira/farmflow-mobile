import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { colors } from '../theme';
import { usePreferences } from '../contexts/PreferencesContext';
import { styles } from './styles/loadingState.styles';

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


