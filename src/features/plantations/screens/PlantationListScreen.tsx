import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Plantation, PlantationStatus } from '../../../types/plantation.types';
import { usePlantations } from '../hooks/usePlantations';
import { useActivities } from '../../activities/hooks/useActivities';
import { useDebounce } from '../../../hooks/useDebounce';
import { usePreferences } from '../../../contexts/PreferencesContext';

import { Screen } from '../../../components/Screen';
import { TextField } from '../../../components/TextField';
import { PlantationCard } from '../../../components/PlantationCard';
import { LoadingState } from '../../../components/LoadingState';
import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { PlantationFormModal } from './PlantationFormModal';
import { AppNavigationProp } from '../../../navigation/types';
import { colors } from '../../../theme';
import { styles } from '../styles/plantationList.styles';

export const PlantationListScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const { isDark, language } = usePreferences();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [selectedStatus, setSelectedStatus] = useState<PlantationStatus | undefined>();
  const [modalVisible, setModalVisible] = useState(false);

  const {
    data: plantations,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = usePlantations({
    searchQuery: debouncedSearch,
    status: selectedStatus,
  });

  const { data: activities } = useActivities();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs');
    }
  };

  const activityCountMap = useMemo(() => {
    const map = new Map<string, number>();
    activities?.forEach((a) => {
      if (a.plantationId) {
        map.set(a.plantationId, (map.get(a.plantationId) || 0) + 1);
      }
    });
    return map;
  }, [activities]);

  const renderItem: ListRenderItem<Plantation> = ({ item }) => (
    <PlantationCard
      plantation={item}
      activityCount={activityCountMap.get(item.id) || 0}
      onPress={() =>
        navigation.navigate('PlantationDetail', { plantationId: item.id })
      }
    />
  );

  return (
    <Screen withTopInset={false}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View style={styles.headerTitleRow}>
          <View style={styles.titleWithBack}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleBack}
              style={[styles.backBtn, isDark && styles.backBtnDark]}
              accessibilityLabel="Voltar"
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={22}
                color={isDark ? '#FFFFFF' : '#1E293B'}
              />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
              {language === 'en' ? 'Crops & Fields' : 'Talhões & Cultivos'}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('QrScanner')}
            style={[styles.qrHeaderBtn, isDark && styles.qrHeaderBtnDark]}
            accessibilityLabel="Escanear QR Code de lote"
          >
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={20}
              color={isDark ? '#4ADE80' : colors.primaryLight}
            />
          </TouchableOpacity>
        </View>

        <TextField
          placeholder={
            language === 'en'
              ? 'Search fields, crops, notes...'
              : 'Buscar talhão, cultura ou anotação...'
          }
          leftIcon="magnify"
          value={search}
          onChangeText={setSearch}
          containerStyle={styles.searchContainer}
        />

        <View style={styles.filterRow}>
          <TouchableOpacity
            onPress={() => setSelectedStatus(undefined)}
            style={[
              styles.filterChip,
              isDark && styles.filterChipDark,
              selectedStatus === undefined &&
                (isDark ? styles.filterChipActiveDark : styles.filterChipActive),
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                isDark && styles.filterChipTextDark,
                selectedStatus === undefined && styles.filterChipTextActive,
              ]}
            >
              {language === 'en' ? 'All' : 'Todos'} ({plantations?.length || 0})
            </Text>
          </TouchableOpacity>

          {(['GROWING', 'HARVEST_READY', 'SOWING', 'PLANNED'] as PlantationStatus[]).map((st) => {
            const isSelected = selectedStatus === st;
            const labels: Record<PlantationStatus, string> = {
              GROWING: language === 'en' ? 'Growing' : 'Em Desenvolvimento',
              HARVEST_READY: language === 'en' ? 'Harvest Ready' : 'Colheita',
              SOWING: language === 'en' ? 'Sowing' : 'Semeadura',
              PLANNED: language === 'en' ? 'Planned' : 'Planejado',
              HARVESTED: language === 'en' ? 'Harvested' : 'Colhido',
            };
            return (
              <TouchableOpacity
                key={st}
                onPress={() => setSelectedStatus(isSelected ? undefined : st)}
                style={[
                  styles.filterChip,
                  isDark && styles.filterChipDark,
                  isSelected &&
                    (isDark ? styles.filterChipActiveDark : styles.filterChipActive),
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isDark && styles.filterChipTextDark,
                    isSelected && styles.filterChipTextActive,
                  ]}
                >
                  {labels[st]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {isLoading ? (
        <LoadingState
          message={
            language === 'en'
              ? 'Loading agricultural fields...'
              : 'Carregando talhões agrícolas...'
          }
        />
      ) : isError ? (
        <ErrorState
          message={
            error?.message ||
            (language === 'en'
              ? 'Failed to fetch field data.'
              : 'Falha ao buscar dados dos talhões.')
          }
          onRetry={refetch}
        />
      ) : (
        <FlatList
          data={plantations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListEmptyComponent={
            <EmptyState
              icon="sprout"
              title={language === 'en' ? 'No Fields Found' : 'Nenhum Talhão Encontrado'}
              description={
                language === 'en'
                  ? 'Register your first crop field or adjust search filters.'
                  : 'Cadastre seu primeiro talhão agrícola ou ajuste os filtros de busca.'
              }
              actionTitle={language === 'en' ? 'Add Field' : 'Adicionar Talhão'}
              onActionPress={() => setModalVisible(true)}
            />
          }
        />
      )}

      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setModalVisible(true)}
          style={[styles.addHubButton, isDark && styles.addHubButtonDark]}
          accessibilityLabel={language === 'en' ? 'Add New Crop Field' : 'Adicionar Talhão'}
        >
          <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
          <Text style={styles.addHubButtonText}>
            {language === 'en' ? 'ADD NEW FIELD' : 'ADICIONAR TALHÃO'}
          </Text>
        </TouchableOpacity>
      </View>

      <PlantationFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </Screen>
  );
};

