import React, { useState } from 'react';
import {
  View,
  Text,
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
import { getActivityTypeLabel, getFarmDisplayName } from '../../../utils/formatters';
import { styles } from '../styles/activityList.styles';

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
    const f = farms?.find((farm) => farm.id === farmId);
    return f ? getFarmDisplayName(f, language) : (language === 'en' ? 'Farm' : 'Fazenda');
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
                  {getActivityTypeLabel(type, language)}
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

