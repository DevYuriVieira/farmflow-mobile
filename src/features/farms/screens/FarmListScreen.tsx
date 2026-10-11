import React, { useState } from 'react';
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

import { Farm } from '../../../types/farm.types';
import { useFarms } from '../hooks/useFarms';
import { usePlantations } from '../../plantations/hooks/usePlantations';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { useToast } from '../../../contexts/ToastContext';
import { shareService } from '../../../services/share.service';

import { Screen } from '../../../components/Screen';
import { TextField } from '../../../components/TextField';
import { FarmCard } from '../../../components/FarmCard';
import { LoadingState } from '../../../components/LoadingState';
import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { AppNavigationProp } from '../../../navigation/types';
import { radii, spacing, typography } from '../../../theme';

export const FarmListScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const { data: farms, isLoading, isError, error, refetch, isRefetching } = useFarms();
  const { data: plantations } = usePlantations();
  const { selectedFarmId, setSelectedFarmId, isDark, language } = usePreferences();
  const { showSuccess } = useToast();

  const [search, setSearch] = useState('');

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs');
    }
  };

  const filteredFarms = farms?.filter((f) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return f.name.toLowerCase().includes(q) || f.location.toLowerCase().includes(q);
  });

  const getPlantationCount = (farmId: string): number => {
    return plantations?.filter((p) => p.farmId === farmId).length || 0;
  };

  const handleSelectFarm = async (farm: Farm) => {
    await setSelectedFarmId(farm.id);
    showSuccess(
      language === 'en'
        ? `Active farm changed to "${farm.name}".`
        : `Fazenda ativa alterada para "${farm.name}".`
    );
  };

  const renderItem: ListRenderItem<Farm> = ({ item }) => (
    <FarmCard
      farm={item}
      isSelected={selectedFarmId === item.id || (!selectedFarmId && farms?.[0]?.id === item.id)}
      plantationCount={getPlantationCount(item.id)}
      onPress={() => navigation.navigate('FarmDetail', { farmId: item.id })}
      onSelect={() => handleSelectFarm(item)}
      onShare={() => shareService.shareFarm(item)}
    />
  );

  return (
    <Screen withTopInset={false}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View style={styles.titleRow}>
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
            <Text style={[styles.title, isDark && styles.titleDark]}>
              {language === 'en' ? 'Rural Properties' : 'Propriedades Rurais'}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('FarmForm', {})}
            style={[styles.addBtn, isDark && styles.addBtnDark]}
            accessibilityLabel="Cadastrar Fazenda"
          >
            <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <TextField
          placeholder={
            language === 'en'
              ? 'Search farm by name or location...'
              : 'Buscar fazenda por nome ou município...'
          }
          leftIcon="magnify"
          value={search}
          onChangeText={setSearch}
          containerStyle={styles.search}
        />
      </View>

      {isLoading ? (
        <LoadingState
          message={language === 'en' ? 'Loading registered farms...' : 'Carregando fazendas cadastradas...'}
        />
      ) : isError ? (
        <ErrorState
          message={error?.message || (language === 'en' ? 'Failed to fetch farms.' : 'Falha ao buscar fazendas.')}
          onRetry={refetch}
        />
      ) : (
        <FlatList
          data={filteredFarms}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListEmptyComponent={
            <EmptyState
              icon="home-city-outline"
              title={language === 'en' ? 'No Farms Registered' : 'Nenhuma Fazenda Cadastrada'}
              description={
                language === 'en'
                  ? 'Register your first farm to start managing your fields.'
                  : 'Cadastre sua primeira propriedade rural para começar a gerenciar seus talhões.'
              }
              actionTitle={language === 'en' ? 'Register Farm' : 'Cadastrar Fazenda'}
              onActionPress={() => navigation.navigate('FarmForm', {})}
            />
          }
        />
      )}
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
  titleRow: {
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
  title: {
    ...typography.h2,
    color: '#172B23',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1B4D3E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  addBtnDark: {
    backgroundColor: '#22C55E',
  },
  search: {
    marginBottom: 0,
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
});
