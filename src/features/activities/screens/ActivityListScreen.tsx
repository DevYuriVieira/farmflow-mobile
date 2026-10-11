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

import { FarmActivity, ActivityType } from '../../../types/activity.types';
import { useActivities, useToggleActivityComplete } from '../hooks/useActivities';
import { useFarms } from '../../farms/hooks/useFarms';
import { usePreferences } from '../../../contexts/PreferencesContext';

import { Screen } from '../../../components/Screen';
import { ActivityCard } from '../../../components/ActivityCard';
import { LoadingState } from '../../../components/LoadingState';
import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { AppNavigationProp } from '../../../navigation/types';
import { colors, radii, spacing, typography } from '../../../theme';
import { activityTypeLabels } from '../../../utils/formatters';

export const ActivityListScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const { isDark, language } = usePreferences();
  const [selectedType, setSelectedType] = useState<ActivityType | undefined>();
  const [filterCompleted, setFilterCompleted] = useState<boolean | undefined>();

  const {
    data: activities,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useActivities({
    type: selectedType,
    completed: filterCompleted,
  });

  const { data: farms } = useFarms();
  const toggleCompleteMutation = useToggleActivityComplete();

  const getFarmName = (farmId: string): string => {
    return farms?.find((f) => f.id === farmId)?.name || 'Fazenda';
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs');
    }
  };

  const renderItem: ListRenderItem<FarmActivity> = ({ item }) => (
    <ActivityCard
      activity={item}
      farmName={getFarmName(item.farmId)}
      onToggleComplete={(completed) =>
        toggleCompleteMutation.mutate({ id: item.id, completed })
      }
      onPress={() =>
        navigation.navigate('ActivityDetail', { activityId: item.id })
      }
    />
  );

  return (
    <Screen withTopInset={false}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View style={styles.titleRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleBack}
            style={[styles.backBtn, isDark && styles.backBtnDark]}
            accessibilityLabel="Voltar para início"
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={22}
              color={isDark ? '#FFFFFF' : '#1E293B'}
            />
          </TouchableOpacity>

          <Text style={[styles.title, isDark && styles.titleDark]}>
            {language === 'en' ? 'Farm Activities' : 'Atividades Agrícolas'}
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ActivityForm', {})}
            style={[styles.addBtn, isDark && styles.addBtnDark]}
            accessibilityLabel="Nova Atividade"
          >
            <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.statusFiltersRow}>
          <TouchableOpacity
            onPress={() => setFilterCompleted(undefined)}
            style={[
              styles.filterChip,
              isDark && styles.filterChipDark,
              filterCompleted === undefined && (isDark ? styles.filterChipActiveDark : styles.filterChipActive),
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                isDark && styles.filterChipTextDark,
                filterCompleted === undefined && styles.filterChipTextActive,
              ]}
            >
              {language === 'en' ? 'All' : 'Todas'} ({activities?.length || 0})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilterCompleted(false)}
            style={[
              styles.filterChip,
              isDark && styles.filterChipDark,
              filterCompleted === false && (isDark ? styles.filterChipActiveDark : styles.filterChipActive),
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                isDark && styles.filterChipTextDark,
                filterCompleted === false && styles.filterChipTextActive,
              ]}
            >
              {language === 'en' ? 'Pending ⏳' : 'Pendentes ⏳'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilterCompleted(true)}
            style={[
              styles.filterChip,
              isDark && styles.filterChipDark,
              filterCompleted === true && (isDark ? styles.filterChipActiveDark : styles.filterChipActive),
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                isDark && styles.filterChipTextDark,
                filterCompleted === true && styles.filterChipTextActive,
              ]}
            >
              {language === 'en' ? 'Done ✅' : 'Concluídas ✅'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.typeFiltersRow}>
          {(['IRRIGATION', 'FERTILIZATION', 'PEST_CONTROL', 'HARVEST', 'PLANTING'] as ActivityType[]).map((type) => {
            const isSelected = selectedType === type;
            return (
              <TouchableOpacity
                key={type}
                onPress={() => setSelectedType(isSelected ? undefined : type)}
                style={[
                  styles.typeChip,
                  isDark && styles.typeChipDark,
                  isSelected && (isDark ? styles.typeChipActiveDark : styles.typeChipActive),
                ]}
              >
                <Text
                  style={[
                    styles.typeChipText,
                    isDark && styles.typeChipTextDark,
                    isSelected && (isDark ? styles.typeChipTextActiveDark : styles.typeChipTextActive),
                  ]}
                >
                  {activityTypeLabels[type]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {isLoading ? (
        <LoadingState message={language === 'en' ? 'Loading farm tasks...' : 'Carregando tarefas do campo...'} />
      ) : isError ? (
        <ErrorState message={error?.message || 'Falha ao buscar atividades.'} onRetry={refetch} />
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListEmptyComponent={
            <EmptyState
              title={language === 'en' ? 'No activities found' : 'Nenhuma atividade encontrada'}
              description={language === 'en' ? 'Tap + to register a new crop management task.' : 'Toque no botão + acima para cadastrar um manejo.'}
              actionTitle={language === 'en' ? 'New Activity' : 'Nova Atividade'}
              onActionPress={() => navigation.navigate('ActivityForm', {})}
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
    backgroundColor: colors.background,
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
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnDark: {
    backgroundColor: '#182C23',
    borderColor: '#2C493A',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDark: {
    backgroundColor: '#22C55E',
  },
  statusFiltersRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs + 2,
  },
  filterChipDark: {
    backgroundColor: '#182C23',
    borderColor: '#2C493A',
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipActiveDark: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  filterChipText: {
    ...typography.micro,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterChipTextDark: {
    color: '#CBD5E1',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  typeFiltersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: spacing.xs,
  },
  typeChip: {
    backgroundColor: colors.surfaceInput,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  typeChipDark: {
    backgroundColor: '#14251D',
    borderColor: '#233A2E',
  },
  typeChipActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  typeChipActiveDark: {
    borderColor: '#22C55E',
    backgroundColor: '#1E3D2A',
  },
  typeChipText: {
    ...typography.micro,
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  typeChipTextDark: {
    color: '#E2E8F0',
  },
  typeChipTextActive: {
    color: colors.primaryLight,
    fontWeight: '700',
  },
  typeChipTextActiveDark: {
    color: '#4ADE80',
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl + 40,
  },
});
