import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { observabilityService } from '../services/observability/observability.service';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07150E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  incidentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 24,
  },
  incidentLabel: {
    fontSize: 12,
    color: '#64748B',
    marginRight: 6,
  },
  incidentId: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#22C55E',
    fontWeight: '600',
  },
  devErrorBox: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderColor: 'rgba(239, 68, 68, 0.25)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  devErrorTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F87171',
    marginBottom: 4,
  },
  devErrorMessage: {
    fontSize: 12,
    color: '#E2E8F0',
    fontFamily: 'monospace',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22C55E',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    maxWidth: 280,
    gap: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#07150E',
  },
});
