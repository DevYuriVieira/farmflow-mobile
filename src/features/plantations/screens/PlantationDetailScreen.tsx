import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { usePlantation, useDeletePlantation } from '../hooks/usePlantations';
import { useFarm } from '../../farms/hooks/useFarms';
import { useActivities, useToggleActivityComplete } from '../../activities/hooks/useActivities';
import { shareService } from '../../../services/share.service';

import { Screen } from '../../../components/Screen';
import { LoadingState } from '../../../components/LoadingState';
import { ErrorState } from '../../../components/ErrorState';
import { ActivityCard } from '../../../components/ActivityCard';
import { PlantationFormModal } from './PlantationFormModal';
import { AppDrawerParamList, AppNavigationProp } from '../../../navigation/types';
import { colors } from '../../../theme';
import { styles } from '../styles/plantationDetail.styles';
import { getCropLabel, getPlantationStatusLabel, formatHectares, getPlantationName, getPlantationNotes, getFarmDisplayName } from '../../../utils/formatters';
import { formatDatePtBr } from '../../../utils/dates';
import { usePreferences } from '../../../contexts/PreferencesContext';

type DetailRouteProp = RouteProp<AppDrawerParamList, 'PlantationDetail'>;

export const PlantationDetailScreen: React.FC = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<AppNavigationProp>();
  const { isDark, language } = usePreferences();
  const { plantationId } = route.params;

  const { data: plantation, isLoading, isError, refetch } = usePlantation(plantationId);
  const { data: farm } = useFarm(plantation?.farmId || '');
  const { data: activities } = useActivities({ plantationId });
  const deleteMutation = useDeletePlantation();
  const toggleCompleteMutation = useToggleActivityComplete();

  const [editModalVisible, setEditModalVisible] = useState(false);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Plantations');
    }
  };

  if (isLoading) {
    return (
      <LoadingState
        message={language === 'en' ? 'Loading field details...' : 'Carregando detalhes do talhão...'}
      />
    );
  }

  if (isError || !plantation) {
    return (
      <ErrorState
        message={language === 'en' ? 'Field not found or removed.' : 'Talhão não encontrado ou removido.'}
        onRetry={refetch}
      />
    );
  }

  const handleDelete = () => {
    Alert.alert(
      language === 'en' ? 'Delete Field' : 'Excluir Talhão',
      language === 'en'
        ? `Are you sure you want to delete field "${plantation.name}"? This action cannot be undone.`
        : `Tem certeza que deseja excluir o talhão "${plantation.name}"? Esta ação não pode ser desfeita.`,
      [
        { text: language === 'en' ? 'Cancel' : 'Cancelar', style: 'cancel' },
        {
          text: language === 'en' ? 'Delete' : 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteMutation.mutateAsync(plantation.id);
            handleBack();
          },
        },
      ]
    );
  };

  const handleShare = () => {
    void shareService.sharePlantation(plantation, farm?.name);
  };

  const handleOpenQr = () => {
    navigation.navigate('QrGenerator', {
      entityType: 'plantation',
      id: plantation.id,
      name: plantation.name,
    });
  };

  return (
    <Screen scrollable withTopInset={false}>
      <View style={styles.imageHeader}>
        {plantation.imageUri ? (
          <Image source={{ uri: plantation.imageUri }} style={styles.headerImage} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderHeader}>
            <MaterialCommunityIcons name="sprout" size={64} color={colors.primaryLight} />
          </View>
        )}

        <View style={styles.navBarOverlay}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleBack}
            style={styles.circleBtn}
            accessibilityLabel="Voltar"
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.rightActionsRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleOpenQr}
              style={styles.circleBtn}
              accessibilityLabel="Ver QR Code"
            >
              <MaterialCommunityIcons name="qrcode" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleShare}
              style={styles.circleBtn}
              accessibilityLabel="Compartilhar"
            >
              <MaterialCommunityIcons name="share-variant-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setEditModalVisible(true)}
              style={styles.circleBtn}
              accessibilityLabel="Editar"
            >
              <MaterialCommunityIcons name="pencil-outline" size={20} color="#4ADE80" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleDelete}
              style={styles.circleBtn}
              accessibilityLabel="Excluir"
            >
              <MaterialCommunityIcons name="trash-can-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>
            {getPlantationStatusLabel(plantation.status, language)}
          </Text>
        </View>
      </View>

      <View style={[styles.content, isDark && { backgroundColor: '#0B1410' }]}>
        <Text style={[styles.title, isDark && { color: '#FFFFFF' }]}>
          {getPlantationName(plantation, language)}
        </Text>
        <View style={styles.farmRow}>
          <MaterialCommunityIcons name="home-outline" size={16} color={colors.primaryLight} />
          <Text style={[styles.farmName, isDark && { color: '#E2E8F0' }]}>
            {farm ? getFarmDisplayName(farm, language) : (language === 'en' ? 'Associated farm' : 'Fazenda associada')}
          </Text>
        </View>

        <View style={styles.propsGrid}>
          <View style={styles.propCard}>
            <MaterialCommunityIcons name="grain" size={20} color={colors.primaryLight} />
            <Text style={styles.propLabel}>{language === 'en' ? 'Crop' : 'Cultura'}</Text>
            <Text style={styles.propValue}>{getCropLabel(plantation.cropType, language)}</Text>
          </View>

          <View style={styles.propCard}>
            <MaterialCommunityIcons name="vector-square" size={20} color={colors.accentLime} />
            <Text style={styles.propLabel}>{language === 'en' ? 'Total Area' : 'Área Total'}</Text>
            <Text style={styles.propValue}>{formatHectares(plantation.areaHectares, language)}</Text>
          </View>

          <View style={styles.propCard}>
            <MaterialCommunityIcons name="calendar-start" size={20} color={colors.accentGold} />
            <Text style={styles.propLabel}>{language === 'en' ? 'Planted At' : 'Plantio'}</Text>
            <Text style={styles.propValue}>{formatDatePtBr(plantation.plantedAt)}</Text>
          </View>

          <View style={styles.propCard}>
            <MaterialCommunityIcons name="calendar-check" size={20} color={colors.accentBlue} />
            <Text style={styles.propLabel}>{language === 'en' ? 'Expected Harvest' : 'Colheita Prevista'}</Text>
            <Text style={styles.propValue}>{formatDatePtBr(plantation.expectedHarvestAt)}</Text>
          </View>
        </View>

        {plantation.notes && (
          <View style={styles.notesCard}>
            <View style={styles.notesHeader}>
              <MaterialCommunityIcons name="notebook-outline" size={18} color={colors.primaryLight} />
              <Text style={styles.notesTitle}>
                {language === 'en' ? 'Farmer Notes' : 'Anotações do Produtor'}
              </Text>
            </View>
            <Text style={styles.notesText}>{getPlantationNotes(plantation, language)}</Text>
          </View>
        )}

        <View style={styles.activitiesSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              {language === 'en' ? 'Field Activities' : 'Atividades do Talhão'}
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ActivityForm', {
                  activity: { farmId: plantation.farmId, plantationId: plantation.id },
                })
              }
              style={styles.addActivityBtn}
            >
              <MaterialCommunityIcons name="plus" size={16} color={colors.primaryLight} />
              <Text style={styles.addActivityBtnText}>
                {language === 'en' ? 'New Activity' : 'Nova Atividade'}
              </Text>
            </TouchableOpacity>
          </View>

          {activities?.length === 0 ? (
            <View style={styles.emptyActivitiesBox}>
              <Text style={styles.emptyActivitiesText}>
                {language === 'en'
                  ? 'No activities linked to this field.'
                  : 'Nenhuma atividade vinculada diretamente a este talhão.'}
              </Text>
            </View>
          ) : (
            activities?.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onToggleComplete={(completed) =>
                  toggleCompleteMutation.mutate({ id: activity.id, completed })
                }
                onPress={() =>
                  navigation.navigate('ActivityDetail', { activityId: activity.id })
                }
              />
            ))
          )}
        </View>
      </View>

      <PlantationFormModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        plantationToEdit={plantation}
      />
    </Screen>
  );
};

