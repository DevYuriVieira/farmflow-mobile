import React from 'react';
import {
  View,
  Text,
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
import { colors } from '../../../theme';
import { styles } from '../styles/activityDetail.styles';

import { getActivityTypeLabel, getActivityTitle, getActivityDescription } from '../../../utils/formatters';
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
              ? (language === 'en'
                  ? `Completed on ${formatDateTimePtBr(activity.completedAt)}`
                  : `Concluída em ${formatDateTimePtBr(activity.completedAt)}`)
              : (language === 'en'
                  ? 'Pending Activity — Tap to Complete'
                  : 'Atividade Pendente — Toque para Concluir')}
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>{getActivityTitle(activity, language)}</Text>
        <Text style={styles.description}>{getActivityDescription(activity, language)}</Text>

        <View style={styles.grid}>
          <View style={styles.gridCard}>
            <MaterialCommunityIcons name="calendar-clock" size={20} color={colors.primaryLight} />
            <Text style={styles.gridLabel}>
              {language === 'en' ? 'Scheduled Date & Time' : 'Data e Hora Agendada'}
            </Text>
            <Text style={styles.gridValue}>{formatDateTimePtBr(activity.scheduledAt)}</Text>
          </View>

          <View style={styles.gridCard}>
            <MaterialCommunityIcons name="tag-outline" size={20} color={colors.accentLime} />
            <Text style={styles.gridLabel}>
              {language === 'en' ? 'Activity Type' : 'Tipo de Atividade'}
            </Text>
            <Text style={styles.gridValue}>{getActivityTypeLabel(activity.type, language)}</Text>
          </View>

          <View style={styles.gridCard}>
            <MaterialCommunityIcons name="home-outline" size={20} color={colors.accentGold} />
            <Text style={styles.gridLabel}>
              {language === 'en' ? 'Farm' : 'Fazenda'}
            </Text>
            <Text style={styles.gridValue}>
              {farm?.name || (language === 'en' ? 'Unassigned' : 'Não vinculada')}
            </Text>
          </View>

          <View style={styles.gridCard}>
            <MaterialCommunityIcons name="sprout-outline" size={20} color={colors.accentBlue} />
            <Text style={styles.gridLabel}>
              {language === 'en' ? 'Field' : 'Talhão'}
            </Text>
            <Text style={styles.gridValue}>
              {plantation?.name || (language === 'en' ? 'General Farm' : 'Geral da Fazenda')}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSyncToGoogleCalendar}
          style={styles.calendarSyncBtn}
        >
          <MaterialCommunityIcons name="calendar-sync" size={20} color={colors.primaryLight} />
          <Text style={styles.calendarSyncBtnText}>
            {language === 'en' ? 'Sync with Google Calendar' : 'Sincronizar com Google Agenda'}
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

