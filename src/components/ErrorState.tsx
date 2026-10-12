import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme';
import { Button } from './Button';
import { styles } from './styles/errorState.styles';

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

