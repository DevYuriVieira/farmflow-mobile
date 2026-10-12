import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { observabilityService } from '../services/observability/observability.service';
import { styles } from './styles/errorBoundary.styles';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  eventId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      eventId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    void (async () => {
      const eventId = await observabilityService.captureException(error, {
        level: 'fatal',
        extra: {
          componentStack: errorInfo.componentStack,
        },
      });
      this.setState({ eventId });
    })();
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      eventId: null,
    });
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="alert-decagram" size={64} color={colors.danger} />
          </View>

          <Text style={styles.title}>Falha Inesperada no FarmFlow</Text>
          <Text style={styles.subtitle}>
            Detectamos um erro na interface do aplicativo. O incidente foi registrado para
            investigação técnica.
          </Text>

          {this.state.eventId && (
            <View style={styles.incidentBadge}>
              <Text style={styles.incidentLabel}>ID do Incidente:</Text>
              <Text style={styles.incidentId}>{this.state.eventId}</Text>
            </View>
          )}

          {__DEV__ && this.state.error && (
            <View style={styles.devErrorBox}>
              <Text style={styles.devErrorTitle}>{this.state.error.name}:</Text>
              <Text style={styles.devErrorMessage}>{this.state.error.message}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.retryButton}
            onPress={this.handleReset}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Tentar novamente"
          >
            <MaterialCommunityIcons name="reload" size={20} color={colors.textInverse} />
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

