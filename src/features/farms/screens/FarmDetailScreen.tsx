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

import { useFarm, useDeleteFarm } from '../hooks/useFarms';
import { usePlantations } from '../../plantations/hooks/usePlantations';
import { shareService } from '../../../services/share.service';

import { Screen } from '../../../components/Screen';
import { LoadingState } from '../../../components/LoadingState';
import { ErrorState } from '../../../components/ErrorState';
import { PlantationCard } from '../../../components/PlantationCard';
import { AppDrawerParamList, AppNavigationProp } from '../../../navigation/types';
import { colors, radii, spacing, typography } from '../../../theme';
import { formatHectares, getFarmDisplayName } from '../../../utils/formatters';
import { formatDatePtBr } from '../../../utils/dates';
import { usePreferences } from '../../../contexts/PreferencesContext';

type RouteProps = RouteProp<AppDrawerParamList, 'FarmDetail'>;

export const FarmDetailScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<AppNavigationProp>();
  const { isDark, language } = usePreferences();
  const { farmId } = route.params;

  const { data: farm, isLoading, isError, refetch } = useFarm(farmId);
  const { data: plantations } = usePlantations({ farmId });
  const deleteMutation = useDeleteFarm();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Farms');
    }
  };

  if (isLoading) {
    return (
      <LoadingState
        message={language === 'en' ? 'Loading property information...' : 'Carregando informações da propriedade...'}
      />
    );
  }

  if (isError || !farm) {
    return (
      <ErrorState
        message={language === 'en' ? 'Farm not found.' : 'Fazenda não encontrada.'}
        onRetry={refetch}
      />
    );
  }

  const handleDelete = () => {
    Alert.alert(
      language === 'en' ? 'Delete Farm' : 'Excluir Fazenda',
      language === 'en'
        ? `Are you sure you want to remove "${farm.name}"? All associated fields and activities will be deleted.`
        : `Tem certeza que deseja remover "${farm.name}"? Todos os talhões e atividades vinculados serão apagados.`,
      [
        { text: language === 'en' ? 'Cancel' : 'Cancelar', style: 'cancel' },
        {
          text: language === 'en' ? 'Delete' : 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteMutation.mutateAsync(farm.id);
            handleBack();
          },
        },
      ]
    );
  };

  const handleShare = () => {
    void shareService.shareFarm(farm);
  };

  const handleOpenQr = () => {
    navigation.navigate('QrGenerator', {
      entityType: 'farm',
      id: farm.id,
      name: farm.name,
    });
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
            onPress={handleOpenQr}
            style={[styles.circleBtn, isDark && styles.circleBtnDark]}
            accessibilityLabel="Gerar QR Code"
          >
            <MaterialCommunityIcons
              name="qrcode"
              size={20}
              color={isDark ? '#FFFFFF' : '#1E293B'}
            />
          </TouchableOpacity>

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
            onPress={() => navigation.navigate('FarmForm', { farm })}
            style={[styles.circleBtn, isDark && styles.circleBtnDark]}
            accessibilityLabel="Editar fazenda"
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
            accessibilityLabel="Excluir fazenda"
          >
            <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.farmName, isDark && styles.farmNameDark]}>
          {getFarmDisplayName(farm, language)}
        </Text>
        <View style={styles.locationRow}>
          <MaterialCommunityIcons
            name="map-marker"
            size={16}
            color={isDark ? '#4ADE80' : colors.primaryLight}
          />
          <Text style={[styles.locationText, isDark && styles.locationTextDark]}>
            {farm.location}
          </Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.gridCard}>
            <MaterialCommunityIcons name="vector-square" size={20} color={colors.primaryLight} />
            <Text style={styles.gridLabel}>
              {language === 'en' ? 'Registered Total Area' : 'Área Total Registrada'}
            </Text>
            <Text style={styles.gridValue}>{formatHectares(farm.totalAreaHectares, language)}</Text>
          </View>

          <View style={styles.gridCard}>
            <MaterialCommunityIcons name="sprout" size={20} color={colors.accentLime} />
            <Text style={styles.gridLabel}>
              {language === 'en' ? 'Active Fields' : 'Talhões Ativos'}
            </Text>
            <Text style={styles.gridValue}>
              {plantations?.length || 0} {language === 'en' ? 'Fields' : 'Talhões'}
            </Text>
          </View>

          <View style={styles.gridCard}>
            <MaterialCommunityIcons name="crosshairs-gps" size={20} color={colors.accentBlue} />
            <Text style={styles.gridLabel}>
              {language === 'en' ? 'Latitude / Longitude' : 'Latitude / Longitude'}
            </Text>
            <Text style={styles.gridValue}>
              {farm.coordinates.latitude.toFixed(4)}, {farm.coordinates.longitude.toFixed(4)}
            </Text>
          </View>

          <View style={styles.gridCard}>
            <MaterialCommunityIcons name="calendar-outline" size={20} color={colors.accentGold} />
            <Text style={styles.gridLabel}>
              {language === 'en' ? 'Registration Date' : 'Data de Cadastro'}
            </Text>
            <Text style={styles.gridValue}>{formatDatePtBr(farm.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.plantationsHeader}>
          <Text style={styles.sectionTitle}>
            {language === 'en' ? 'Fields in this Property' : 'Talhões desta Propriedade'}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Plantations')}
            style={styles.seeAllBtn}
          >
            <Text style={styles.seeAllBtnText}>
              {language === 'en' ? 'Manage' : 'Gerenciar'}
            </Text>
          </TouchableOpacity>
        </View>

        {plantations?.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              {language === 'en'
                ? 'No fields registered in this farm yet.'
                : 'Nenhum talhão cadastrado nesta fazenda ainda.'}
            </Text>
          </View>
        ) : (
          plantations?.map((p) => (
            <PlantationCard
              key={p.id}
              plantation={p}
              onPress={() =>
                navigation.navigate('PlantationDetail', { plantationId: p.id })
              }
            />
          ))
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl + 8,
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
  farmName: {
    ...typography.h1,
    color: '#172B23',
    marginBottom: spacing.xs,
  },
  farmNameDark: {
    color: '#FFFFFF',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  locationText: {
    ...typography.captionMedium,
    color: '#4A5E54',
    marginLeft: 4,
  },
  locationTextDark: {
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
  plantationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: '#172B23',
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  seeAllBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  seeAllBtnText: {
    ...typography.captionMedium,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.caption,
    color: '#64748B',
  },
});
