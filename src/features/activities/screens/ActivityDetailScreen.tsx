import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useActivity, useDeleteActivity, useToggleActivityComplete } from '../hooks/useActivities';
import { useFarm } from '../../farms/hooks/useFarms';
import { usePlantation } from '../../plantations/hooks/usePlantations';
import { shareService } from '../../../services/share.service';
import { googleCalendarService } from '../../../services/integrations/googleCalendar.service';
import { useToast } from '../../../contexts/ToastContext';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { getFriendlyErrorMessage } from '../../../utils/errorMessages';

import { Screen } from '../../../components/Screen';
import { LoadingState } from '../../../components/LoadingState';
import { ErrorState } from '../../../components/ErrorState';
import { AppDrawerParamList, AppNavigationProp } from '../../../navigation/types';
import { colors, radii, spacing, typography } from '../../../theme';
import { activityTypeLabels } from '../../../utils/formatters';
import { formatDateTimePtBr } from '../../../utils/dates';

type RouteProps = RouteProp<AppDrawerParamList, 'ActivityDetail'>;

export const ActivityDetailScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<AppNavigationProp>();
  const { isDark, language } = usePreferences();
  const { activityId } = route.params;

  const { data: activity, isLoading, isError, refetch } = useActivity(activityId);
  const { data: farm } = useFarm(activity?.farmId || '');
  const { data: plantation } = usePlantation(activity?.plantationId || '');
  const deleteMutation = useDeleteActivity();
  const toggleCompleteMutation = useToggleActivityComplete();
  const { showSuccess, showError } = useToast();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Activities');
    }
  };

  if (isLoading) {
    return (
      <LoadingState
        message={language === 'en' ? 'Loading activity details...' : 'Carregando detalhes da atividade...'}
      />
    );
  }

  if (isError || !activity) {
    return (
      <ErrorState
        message={language === 'en' ? 'Activity not found.' : 'Atividade não encontrada.'}
        onRetry={refetch}
      />
    );
  }

  const handleDelete = () => {
    Alert.alert(
      language === 'en' ? 'Delete Activity' : 'Excluir Atividade',
      language === 'en'
        ? `Are you sure you want to remove activity "${activity.title}"?`
        : `Deseja realmente remover a atividade "${activity.title}"?`,
      [
        { text: language === 'en' ? 'Cancel' : 'Cancelar', style: 'cancel' },
        {
          text: language === 'en' ? 'Delete' : 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteMutation.mutateAsync(activity.id);
            handleBack();
          },
        },
      ]
    );
  };

  const handleShare = () => {
    void shareService.shareActivity(activity);
  };

  const handleSyncToGoogleCalendar = async () => {
    try {
      await googleCalendarService.syncActivityToCalendar(activity);
      showSuccess(
        language === 'en'
          ? 'Activity synced with Google Calendar!'
          : 'Atividade sincronizada com o Google Agenda!'
      );
    } catch (err) {
      showError(getFriendlyErrorMessage(err));
    }
  };

  return (
    <Screen scrollable withTopInset={false}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <TouchableOpacity
          onPress={handleBack}
          style={[styles.circleBtn, isDark && styles.circleBtnDark]}
          accessibilityLabel="Voltar"
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={isDark ? '#FFFFFF' : '#1E293B'}
          />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={handleShare}
            style={[styles.circleBtn, isDark && styles.circleBtnDark]}
            accessibilityLabel="Compartilhar"
          >
            <MaterialCommunityIcons
              name="share-variant-outline"
              size={20}
              color={isDark ? '#FFFFFF' : '#1E293B'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ActivityForm', { activity })}
            style={[styles.circleBtn, isDark && styles.circleBtnDark]}
            accessibilityLabel="Editar"
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={20}
              color={isDark ? '#4ADE80' : colors.primaryLight}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            style={[styles.circleBtn, isDark && styles.circleBtnDark]}
            accessibilityLabel="Excluir"
          >
            <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            toggleCompleteMutation.mutate({ id: activity.id, completed: !activity.completed })
          }
          style={[styles.statusBanner, activity.completed && styles.statusBannerDone]}
        >
          <MaterialCommunityIcons
            name={activity.completed ? 'check-circle' : 'clock-outline'}
            size={24}
            color={activity.completed ? colors.textInverse : colors.primaryLight}
          />
          <Text style={[styles.statusBannerText, activity.completed && styles.statusBannerTextDone]}>
            {activity.completed
              ? `Concluída em ${formatDateTimePtBr(activity.completedAt)}`
              : 'Atividade Pendente — Toque para Concluir'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>{activity.title}</Text>
        <Text style={styles.description}>{activity.description}</Text>

        <View style={styles.grid}>
          <View style={styles.gridCard}>
            <MaterialCommunityIcons name="calendar-clock" size={20} color={colors.primaryLight} />
            <Text style={styles.gridLabel}>Data e Hora Agendada</Text>
            <Text style={styles.gridValue}>{formatDateTimePtBr(activity.scheduledAt)}</Text>
          </View>

          <View style={styles.gridCard}>
            <MaterialCommunityIcons name="tag-outline" size={20} color={colors.accentLime} />
            <Text style={styles.gridLabel}>Tipo de Atividade</Text>
            <Text style={styles.gridValue}>{activityTypeLabels[activity.type]}</Text>
          </View>

          <View style={styles.gridCard}>
            <MaterialCommunityIcons name="home-outline" size={20} color={colors.accentGold} />
            <Text style={styles.gridLabel}>Fazenda</Text>
            <Text style={styles.gridValue}>{farm?.name || 'Não vinculada'}</Text>
          </View>

          <View style={styles.gridCard}>
            <MaterialCommunityIcons name="sprout-outline" size={20} color={colors.accentBlue} />
            <Text style={styles.gridLabel}>Talhão</Text>
            <Text style={styles.gridValue}>{plantation?.name || 'Geral da Fazenda'}</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSyncToGoogleCalendar}
          style={styles.calendarSyncBtn}
        >
          <MaterialCommunityIcons name="calendar-sync" size={20} color={colors.primaryLight} />
          <Text style={styles.calendarSyncBtnText}>Sincronizar com Google Agenda</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl + 6,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F6F7F2',
  },
  headerDark: {
    backgroundColor: '#0B1410',
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginLeft: spacing.xs + 2,
  },
  circleBtnDark: {
    backgroundColor: '#182C23',
    borderColor: '#2C493A',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    padding: spacing.base,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(27, 77, 62, 0.08)',
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.25)',
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  statusBannerDark: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: 'rgba(74, 138, 98, 0.4)',
  },
  statusBannerDone: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  statusBannerText: {
    ...typography.captionMedium,
    color: '#1B4D3E',
    fontWeight: '700',
    marginLeft: spacing.sm,
    flex: 1,
  },
  statusBannerTextDark: {
    color: '#86EFAC',
  },
  statusBannerTextDone: {
    color: '#FFFFFF',
  },
  title: {
    ...typography.h1,
    color: '#172B23',
    marginBottom: spacing.xs,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  description: {
    ...typography.body,
    color: '#4A5E54',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  descriptionDark: {
    color: '#CBD5E1',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.25)',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  gridCardDark: {
    backgroundColor: '#182C23',
    borderColor: 'rgba(74, 138, 98, 0.45)',
  },
  gridLabel: {
    ...typography.micro,
    color: '#64748B',
    marginTop: spacing.xs,
    marginBottom: 2,
  },
  gridLabelDark: {
    color: '#94A3B8',
  },
  gridValue: {
    ...typography.captionMedium,
    color: '#172B23',
    fontWeight: '700',
  },
  gridValueDark: {
    color: '#FFFFFF',
  },
  calendarSyncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radii.pill,
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.35)',
    paddingVertical: spacing.md,
  },
  calendarSyncBtnDark: {
    backgroundColor: '#182C23',
    borderColor: 'rgba(74, 138, 98, 0.5)',
  },
  calendarSyncBtnText: {
    ...typography.captionMedium,
    color: colors.primaryLight,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  calendarSyncBtnTextDark: {
    color: '#4ADE80',
  },
});
