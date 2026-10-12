import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useActivities, useToggleActivityComplete } from '../../activities/hooks/useActivities';
import { Screen } from '../../../components/Screen';
import { ActivityCard } from '../../../components/ActivityCard';
import { EmptyState } from '../../../components/EmptyState';
import { LoadingState } from '../../../components/LoadingState';
import { AppNavigationProp } from '../../../navigation/types';
import { colors } from '../../../theme';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { styles } from '../styles/calendar.styles';

export const CalendarScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const { isDark, language } = usePreferences();
  const { data: activities, isLoading } = useActivities();
  const toggleCompleteMutation = useToggleActivityComplete();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs');
    }
  };

  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      offset: i,
      date: d,
      dayName: d.toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', { weekday: 'short' }),
      dayNumber: d.getDate(),
      monthName: d.toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', { month: 'short' }),
      isoDate: d.toISOString().split('T')[0],
    };
  });

  const selectedDay = days[selectedDayOffset];

  const filteredActivities = activities?.filter((a) => {
    return a.scheduledAt.startsWith(selectedDay.isoDate);
  });

  if (isLoading) {
    return <LoadingState message={language === 'en' ? 'Loading agricultural agenda...' : 'Carregando agenda agrícola...'} />;
  }

  return (
    <Screen scrollable withTopInset={false}>
      <View style={[styles.header, isDark && { backgroundColor: '#0B1410' }]}>
        <View style={styles.titleRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleBack}
              style={[
                styles.backBtn,
                isDark && { backgroundColor: '#1A2E24', borderColor: 'rgba(74, 138, 98, 0.4)' },
              ]}
              accessibilityLabel={language === 'en' ? 'Back' : 'Voltar'}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={22}
                color={isDark ? '#FFFFFF' : '#1E293B'}
              />
            </TouchableOpacity>
            <Text style={[styles.title, isDark && { color: '#FFFFFF' }]}>
              {language === 'en' ? 'Farm Agenda' : 'Agenda Agrícola'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('ActivityForm', {})}
            style={styles.addBtn}
            accessibilityLabel={language === 'en' ? 'New Activity' : 'Nova Atividade'}
          >
            <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarStrip}
        >
          {days.map((day) => {
            const isSelected = day.offset === selectedDayOffset;
            return (
              <TouchableOpacity
                key={day.offset}
                activeOpacity={0.75}
                onPress={() => setSelectedDayOffset(day.offset)}
                style={[
                  styles.dayCard,
                  isDark && { backgroundColor: '#14231B', borderColor: 'rgba(74, 138, 98, 0.35)' },
                  isSelected && styles.dayCardActive,
                ]}
              >
                <Text
                  style={[
                    styles.dayName,
                    isDark && { color: '#CBD5E1' },
                    isSelected && styles.dayNameActive,
                  ]}
                >
                  {day.dayName.replace('.', '')}
                </Text>
                <Text
                  style={[
                    styles.dayNumber,
                    isDark && { color: '#FFFFFF' },
                    isSelected && styles.dayNumberActive,
                  ]}
                >
                  {day.dayNumber}
                </Text>
                <Text
                  style={[
                    styles.monthName,
                    isDark && { color: '#94A3B8' },
                    isSelected && styles.monthNameActive,
                  ]}
                >
                  {day.monthName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.content}>
        <View style={styles.selectedDayHeader}>
          <MaterialCommunityIcons name="calendar-today" size={18} color={colors.primaryLight} />
          <Text style={styles.selectedDayTitle}>
            {selectedDay.date.toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </Text>
        </View>

        {filteredActivities && filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
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
        ) : (
          <EmptyState
            icon="calendar-blank-outline"
            title="Nenhum Manejo Agendado"
            description="Não há atividades registradas para esta data. Agende uma irrigação, pulverização ou colheita."
            actionTitle="Nova Atividade"
            onActionPress={() => navigation.navigate('ActivityForm', {})}
          />
        )}
      </View>
    </Screen>
  );
};

