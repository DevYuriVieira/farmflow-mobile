import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
import { colors, radii, spacing, typography } from '../../../theme';

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

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl + 4,
    paddingBottom: spacing.sm,
    backgroundColor: '#F6F7F2',
  },
  headerDark: {
    backgroundColor: '#0B1410',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  titleWithBack: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: radii.pill,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  backBtnDark: {
    backgroundColor: '#182C23',
    borderColor: '#2C493A',
  },
  headerTitle: {
    ...typography.h2,
    color: '#172B23',
  },
  headerTitleDark: {
    color: '#FFFFFF',
  },
  qrHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  qrHeaderBtnDark: {
    backgroundColor: '#182C23',
    borderColor: '#2C493A',
  },
  searchContainer: {
    marginBottom: spacing.xs,
  },
  filterRow: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
    flexWrap: 'wrap',
  },
  filterChip: {
    backgroundColor: 'rgba(27, 77, 62, 0.08)',
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.25)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    marginRight: spacing.xs + 2,
    marginBottom: spacing.xs,
  },
  filterChipDark: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: 'rgba(74, 138, 98, 0.4)',
  },
  filterChipActive: {
    backgroundColor: '#1B4D3E',
    borderColor: '#1B4D3E',
  },
  filterChipActiveDark: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  filterChipText: {
    ...typography.micro,
    color: '#1B4D3E',
    fontWeight: '600',
  },
  filterChipTextDark: {
    color: '#E2E8F0',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xs,
    paddingBottom: 90,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: spacing.base,
    right: spacing.base,
  },
  addHubButton: {
    backgroundColor: '#1B4D3E',
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: 'rgba(74, 138, 98, 0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  addHubButtonDark: {
    backgroundColor: '#16A34A',
    borderColor: '#22C55E',
  },
  addHubButtonText: {
    ...typography.bodyBold,
    color: '#FFFFFF',
    letterSpacing: 0.8,
    marginLeft: spacing.sm,
    fontSize: 13,
  },
});
