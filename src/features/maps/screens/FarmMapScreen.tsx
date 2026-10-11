import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useFarms } from '../../farms/hooks/useFarms';
import { Farm } from '../../../types/farm.types';
import { Screen } from '../../../components/Screen';
import { LoadingState } from '../../../components/LoadingState';
import { AppNavigationProp } from '../../../navigation/types';
import { colors, radii, spacing, typography } from '../../../theme';
import { formatHectares, getFarmDisplayName } from '../../../utils/formatters';
import { usePreferences } from '../../../contexts/PreferencesContext';

export const FarmMapScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const { language } = usePreferences();
  const { data: farms, isLoading } = useFarms();
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);

  if (isLoading) {
    return (
      <LoadingState
        message={language === 'en' ? 'Loading farm coordinates...' : 'Carregando coordenadas das fazendas...'}
      />
    );
  }

  const farmsWithCoords = farms?.filter(
    (f) =>
      typeof f.coordinates?.latitude === 'number' &&
      typeof f.coordinates?.longitude === 'number'
  ) || [];

  const activeFarm = selectedFarm || farmsWithCoords[0] || null;

  return (
    <Screen withTopInset={false}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === 'en' ? 'Farm GPS Mapping' : 'Mapeamento das Fazendas'}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'en'
            ? `${farmsWithCoords.length} properties with active georeferencing`
            : `${farmsWithCoords.length} propriedades com georreferenciamento ativo`}
        </Text>
      </View>

      <View style={styles.mapCanvas}>
        <View style={styles.radarRingOuter} />
        <View style={styles.radarRingMiddle} />
        <View style={styles.radarRingInner} />
        <View style={styles.radarCrosshairH} />
        <View style={styles.radarCrosshairV} />

        {farmsWithCoords.map((farm, idx) => {
          const isSelected = activeFarm?.id === farm.id;
          // Deterministic distributed layout on radar relative to coordinates
          const leftPercent = 20 + ((idx * 32) % 60);
          const topPercent = 25 + ((idx * 28) % 50);

          return (
            <TouchableOpacity
              key={farm.id}
              activeOpacity={0.8}
              onPress={() => setSelectedFarm(farm)}
              style={[
                styles.markerWrapper,
                { left: `${leftPercent}%`, top: `${topPercent}%` },
              ]}
            >
              <View style={[styles.markerPin, isSelected && styles.markerPinActive]}>
                <MaterialCommunityIcons
                  name="home-variant"
                  size={16}
                  color={isSelected ? colors.textInverse : colors.textPrimary}
                />
              </View>
              <View style={[styles.markerCallout, isSelected && styles.markerCalloutActive]}>
                <Text
                  style={[styles.markerCalloutText, isSelected && styles.markerCalloutTextActive]}
                  numberOfLines={1}
                >
                  {farm.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.providerBadge}>
          <MaterialCommunityIcons name="satellite-variant" size={14} color={colors.primaryLight} />
          <Text style={styles.providerText}>
            Camada Agroespacial • {Platform.OS === 'web' ? 'Visualizador Web' : 'GPS Mobile'}
          </Text>
        </View>
      </View>

      <View style={styles.bottomCardContainer}>
        {activeFarm ? (
          <View style={styles.bottomCard}>
            <View style={styles.bottomCardHeader}>
              <View style={styles.bottomCardTitleWrapper}>
                <Text style={styles.bottomCardTitle}>{getFarmDisplayName(activeFarm, language)}</Text>
                <View style={styles.locationRow}>
                  <MaterialCommunityIcons name="map-marker" size={14} color={colors.primaryLight} />
                  <Text style={styles.locationText}>{activeFarm.location}</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('FarmDetail', { farmId: activeFarm.id })
                }
                style={styles.openDetailBtn}
              >
                <Text style={styles.openDetailBtnText}>
                  {language === 'en' ? 'View Details' : 'Ver Ficha'}
                </Text>
                <MaterialCommunityIcons name="chevron-right" size={16} color={colors.textInverse} />
              </TouchableOpacity>
            </View>

            <View style={styles.coordsBadgeRow}>
              <View style={styles.coordPill}>
                <Text style={styles.coordPillLabel}>
                  {language === 'en' ? 'Total Area:' : 'Área Total:'}
                </Text>
                <Text style={styles.coordPillValue}>{formatHectares(activeFarm.totalAreaHectares, language)}</Text>
              </View>
              <View style={styles.coordPill}>
                <Text style={styles.coordPillLabel}>Lat/Lng:</Text>
                <Text style={styles.coordPillValue}>
                  {activeFarm.coordinates.latitude.toFixed(4)}, {activeFarm.coordinates.longitude.toFixed(4)}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.noFarmSelectedCard}>
            <Text style={styles.noFarmText}>
              {language === 'en' ? 'No farm with coordinates selected.' : 'Nenhuma fazenda com coordenadas selecionada.'}
            </Text>
          </View>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.farmsScroll}
        >
          {farmsWithCoords.map((farm) => {
            const isSelected = activeFarm?.id === farm.id;
            return (
              <TouchableOpacity
                key={farm.id}
                onPress={() => setSelectedFarm(farm)}
                style={[styles.farmSelectorChip, isSelected && styles.farmSelectorChipActive]}
              >
                <MaterialCommunityIcons
                  name="crosshairs-gps"
                  size={14}
                  color={isSelected ? colors.textInverse : colors.primaryLight}
                />
                <Text
                  style={[
                    styles.farmSelectorText,
                    isSelected && styles.farmSelectorTextActive,
                  ]}
                >
                  {getFarmDisplayName(farm, language)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl + 6,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: '#05110B',
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
  },
  radarRingOuter: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.2)',
  },
  radarRingMiddle: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.25)',
  },
  radarRingInner: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.3)',
  },
  radarCrosshairH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(74, 138, 98, 0.15)',
  },
  radarCrosshairV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(74, 138, 98, 0.15)',
  },
  markerWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceCardSolid,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  markerPinActive: {
    backgroundColor: colors.primary,
    borderColor: '#FFF',
    transform: [{ scale: 1.15 }],
  },
  markerCallout: {
    backgroundColor: 'rgba(12, 30, 21, 0.9)',
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.35)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginTop: 4,
    maxWidth: 120,
  },
  markerCalloutActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  markerCalloutText: {
    ...typography.micro,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  markerCalloutTextActive: {
    color: colors.textInverse,
  },
  providerBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(9, 25, 17, 0.85)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.3)',
  },
  providerText: {
    ...typography.micro,
    color: colors.textSecondary,
    marginLeft: 4,
    fontSize: 10,
  },
  bottomCardContainer: {
    backgroundColor: colors.backgroundElevated,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.lg,
    borderTopLeftRadius: radii.xxl,
    borderTopRightRadius: radii.xxl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(74, 138, 98, 0.3)',
  },
  bottomCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.3)',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  bottomCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  bottomCardTitleWrapper: {
    flex: 1,
    marginRight: spacing.sm,
  },
  bottomCardTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 3,
  },
  openDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.pill,
  },
  openDetailBtnText: {
    ...typography.micro,
    color: colors.textInverse,
    fontWeight: '700',
    marginRight: 2,
  },
  coordsBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coordPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceInput,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  coordPillLabel: {
    ...typography.micro,
    color: colors.textMuted,
    marginRight: 4,
  },
  coordPillValue: {
    ...typography.micro,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  noFarmSelectedCard: {
    padding: spacing.md,
    alignItems: 'center',
  },
  noFarmText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  farmsScroll: {
    paddingVertical: spacing.xs,
  },
  farmSelectorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceInput,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    marginRight: spacing.sm,
  },
  farmSelectorChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  farmSelectorText: {
    ...typography.micro,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  farmSelectorTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
});
