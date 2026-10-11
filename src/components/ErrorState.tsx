import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import { Button } from './Button';

export interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Ocorreu um erro ao carregar as informações.',
  onRetry,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name="alert-circle-outline" size={36} color={colors.danger} />
      </View>
      <Text style={styles.title}>Falha na Operação</Text>
      <Text style={styles.description}>{message}</Text>
      {onRetry && (
        <Button
          title="Tentar Novamente"
          onPress={onRetry}
          size="md"
          variant="secondary"
          leftIcon={<MaterialCommunityIcons name="reload" size={18} color={colors.textPrimary} />}
          style={styles.retryButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    minHeight: 280,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 290,
    marginBottom: spacing.lg,
  },
  retryButton: {
    minWidth: 180,
  },
});
