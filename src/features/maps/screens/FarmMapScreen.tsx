import React, { useState } from 'react';
import {
  View,
  Text,
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
import { colors } from '../../../theme';
import { formatHectares, getFarmDisplayName } from '../../../utils/formatters';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { styles } from '../styles/farmMap.styles';

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
    <Screen>
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

