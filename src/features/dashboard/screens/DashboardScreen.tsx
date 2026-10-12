import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAuth } from '../../../contexts/AuthContext';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { useAlerts } from '../../alerts/hooks/useAlerts';
import { triggerHaptic } from '../../../utils/haptics';
import { useFarms } from '../../farms/hooks/useFarms';
import { usePlantations } from '../../plantations/hooks/usePlantations';
import { useActivities, useToggleActivityComplete } from '../../activities/hooks/useActivities';
import { weatherService, FarmWeatherData } from '../../../services/weather.service';

import { Screen } from '../../../components/Screen';
import { UserAvatar } from '../../../components/UserAvatar';
import { InteractiveFarmHero } from '../../../components/InteractiveFarmHero';
import { QuickStatsGrid } from '../components/QuickStatsGrid';
import { SuggestionCard } from '../components/SuggestionCard';
import { ActivityCard } from '../../../components/ActivityCard';
import { LoadingState } from '../../../components/LoadingState';
import { PlantationFormModal } from '../../plantations/screens/PlantationFormModal';
import { AppNavigationProp } from '../../../navigation/types';
import { styles } from '../styles/dashboard.styles';
import { getFarmDisplayName } from '../../../utils/formatters';

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const { user } = useAuth();
  const {
    selectedFarmId,
    isDark,
    language,
    toggleTheme,
    toggleLanguage,
    t,
  } = usePreferences();

  const { data: farms, isLoading: loadingFarms } = useFarms();
  const { data: plantations, isLoading: loadingPlantations, refetch: refetchPlantations } = usePlantations();
  const { data: activities, isLoading: loadingActivities, refetch: refetchActivities } = useActivities();
  const toggleCompleteMutation = useToggleActivityComplete();
  const { unreadCount } = useAlerts();

  const [modalVisible, setModalVisible] = useState(false);
  const [weatherData, setWeatherData] = useState<FarmWeatherData | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const activeFarm = farms?.find((f) => f.id === selectedFarmId) || farms?.[0];

  React.useEffect(() => {
    void (async () => {
      const data = await weatherService.getWeatherForLocation(activeFarm?.location || 'Ribeirão Preto, SP');
      setWeatherData(data);
    })();
  }, [activeFarm]);

  const handleGpsUpdate = async () => {
    try {
      setIsLocating(true);
      await triggerHaptic('medium');
      const gps = await weatherService.getCurrentGpsLocation();
      if (gps) {
        const live = await weatherService.getWeatherForCoordinates(gps.latitude, gps.longitude, gps.name);
        setWeatherData(live);
        await triggerHaptic('success');
      } else {
        await triggerHaptic('warning');
      }
    } catch {
    } finally {
      setIsLocating(false);
    }
  };

  const onRefresh = async () => {
    await triggerHaptic('light');
    await Promise.all([refetchPlantations(), refetchActivities()]);
  };

  if (loadingFarms || loadingPlantations || loadingActivities) {
    return <LoadingState message={language === 'en' ? 'Syncing farm data...' : 'Sincronizando dados da fazenda...'} />;
  }

  const totalCropsCount = plantations?.length || 12;
  const todayActivities = activities?.slice(0, 4) || [];

  const suggestions = [
    {
      id: 'sug-1',
      title: language === 'en' ? 'Plant Seeds' : 'Plantio de Sementes',
      subtitle: language === 'en' ? 'Optimal moisture conditions for sowing' : 'Condições ótimas de umidade para semeadura',
      icon: 'sprout-outline' as const,
      onPress: () => {
        void triggerHaptic('light');
        navigation.navigate('Plantations' as never);
      },
    },
    {
      id: 'sug-2',
      title: language === 'en' ? 'Calculators & Spray' : 'Calculadora de Calda & NPK',
      subtitle: language === 'en' ? 'Calibrate nozzles, dosage & bags/ha' : 'Calibre bicos, dosagem e estimativa de sacas/ha',
      icon: 'calculator-variant-outline' as const,
      onPress: () => {
        void triggerHaptic('light');
        navigation.navigate('Calculators' as never);
      },
    },
    {
      id: 'sug-3',
      title: language === 'en' ? 'Fertilize Plant' : 'Fertirrigação de Precisão',
      subtitle: language === 'en' ? 'NPK-19 balanced blend recommended for Plot 01' : 'NPK-19 balanceado recomendado no Talhão 01',
      icon: 'water-outline' as const,
      onPress: () => {
        void triggerHaptic('light');
        navigation.navigate('Activities' as never);
      },
    },
    {
      id: 'sug-4',
      title: language === 'en' ? 'Pest Scouting & Health' : 'Monitoramento de Pragas',
      subtitle: language === 'en' ? 'Field diagnostic & infestation catalog' : 'Diagnóstico fitossanitário e catálogo de pragas',
      icon: 'bug-outline' as const,
      onPress: () => {
        void triggerHaptic('light');
        navigation.navigate('PestScouting' as never);
      },
    },
    {
      id: 'sug-5',
      title: language === 'en' ? 'Commodity Markets' : 'Cotações Agro ao Vivo',
      subtitle: language === 'en' ? 'Track Soy, Corn, Coffee & Dollar rates' : 'Preços spot de Soja, Milho, Café e Dólar',
      icon: 'trending-up' as const,
      onPress: () => {
        void triggerHaptic('light');
        navigation.navigate('MarketCommodities' as never);
      },
    },
    {
      id: 'sug-6',
      title: language === 'en' ? 'Crop Financials & ROI' : 'Finanças & Lucro da Safra',
      subtitle: language === 'en' ? 'Cost per ha, break-even and margins' : 'Custo por ha, ponto de equilíbrio e lucro',
      icon: 'cash-multiple' as const,
      onPress: () => {
        void triggerHaptic('light');
        navigation.navigate('FarmFinances' as never);
      },
    },
    {
      id: 'sug-7',
      title: language === 'en' ? 'Pivots & Silos IoT' : 'Telemetria de Pivôs & Silos',
      subtitle: language === 'en' ? 'Smart irrigation & grain aeration telemetry' : 'Controle remoto de pivôs e aeração de silos',
      icon: 'water-pump' as const,
      onPress: () => {
        void triggerHaptic('light');
        navigation.navigate('IrrigationSilos' as never);
      },
    },
    {
      id: 'sug-8',
      title: language === 'en' ? 'Spray Diary & MAPA' : 'Caderno de Pulverização',
      subtitle: language === 'en' ? 'Track grace periods & drift safety' : 'Intervalo de segurança e compliance MAPA',
      icon: 'spray' as const,
      onPress: () => {
        void triggerHaptic('light');
        navigation.navigate('SprayDiary' as never);
      },
    },
    {
      id: 'sug-9',
      title: language === 'en' ? 'Fleet & Farm Machinery' : 'Máquinas & Frota Agrícola',
      subtitle: language === 'en' ? 'Hours, fuel telemetry & maintenance' : 'Telemetria, horímetro e manutenção preventiva',
      icon: 'tractor' as const,
      onPress: () => {
        void triggerHaptic('light');
        navigation.navigate('MachineryFleet' as never);
      },
    },
    {
      id: 'sug-10',
      title: language === 'en' ? 'Warehouse & Grain Sales' : 'Armazém de Insumos & Barter',
      subtitle: language === 'en' ? 'Stock alerts, chemicals & grain contracts' : 'Estoque de defensivos, adubos e contratos de grãos',
      icon: 'warehouse' as const,
      onPress: () => {
        void triggerHaptic('light');
        navigation.navigate('InventoryWarehouse' as never);
      },
    },
  ];

  return (
    <Screen scrollable refreshing={false} onRefresh={onRefresh} withTopInset={false}>
      <View style={[styles.content, isDark && styles.contentDark]}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={() => {
              void triggerHaptic('light');
              navigation.navigate('Settings' as never);
            }}
            activeOpacity={0.8}
            accessibilityLabel="Perfil e Configurações"
          >
            <UserAvatar size={42} showBadge />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              void triggerHaptic('light');
              navigation.dispatch(DrawerActions.openDrawer());
            }}
            style={styles.farmSelectorCenter}
          >
            <Text style={[styles.greetingText, isDark && styles.greetingTextDark]}>
              {t('greeting')}, {language === 'en' ? 'Guest' : (user?.name?.split(' ')[0] || 'Produtor')} 👋
            </Text>
            <View style={styles.farmNameRow}>
              <Text style={[styles.farmNameText, isDark && styles.farmNameTextDark]} numberOfLines={1}>
                {weatherData?.locationName || (activeFarm ? getFarmDisplayName(activeFarm, language) : (language === 'en' ? 'Santa Fé Farm' : 'Fazenda Santa Fé'))}
              </Text>
              <MaterialCommunityIcons name="chevron-down" size={18} color={isDark ? '#F1F5F9' : '#1E293B'} />
            </View>
          </TouchableOpacity>

          <View style={styles.headerActionsRight}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleGpsUpdate}
              style={[styles.quickIconButton, isDark && styles.quickIconButtonDark]}
              accessibilityLabel="Obter Clima por GPS"
            >
              <MaterialCommunityIcons
                name="crosshairs-gps"
                size={18}
                color={isLocating ? '#10B981' : isDark ? '#38BDF8' : '#0284C7'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                void triggerHaptic('light');
                toggleLanguage();
              }}
              style={[styles.quickPillButton, isDark && styles.quickPillButtonDark]}
              accessibilityLabel="Mudar idioma"
            >
              <Text style={[styles.quickPillText, isDark && styles.quickPillTextDark]}>
                {language === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                void triggerHaptic('medium');
                toggleTheme();
              }}
              style={[styles.quickIconButton, isDark && styles.quickIconButtonDark]}
              accessibilityLabel="Modo Noturno / Diurno"
            >
              <MaterialCommunityIcons
                name={isDark ? 'weather-sunny' : 'weather-night'}
                size={20}
                color={isDark ? '#FACC15' : '#1E293B'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                void triggerHaptic('light');
                navigation.navigate('Alerts' as never);
              }}
              style={[styles.notificationButton, isDark && styles.notificationButtonDark]}
              accessibilityLabel="Alertas e riscos"
            >
              <MaterialCommunityIcons name="bell-outline" size={20} color={isDark ? '#F1F5F9' : '#1E293B'} />
              {unreadCount > 0 && <View style={styles.bellDot} />}
            </TouchableOpacity>
          </View>
        </View>

        <InteractiveFarmHero
          farmHealthPercentage={92}
          temperature={weatherData?.temperatureCelsius || 28}
          onWeatherCardPress={() => navigation.navigate('WeatherScreen')}
          onHealthCardPress={() => navigation.navigate('Reports' as never)}
        />

        <QuickStatsGrid
          cropsCount={totalCropsCount}
          animalsCount={48}
          soilMoisture={weatherData?.humidityPercent || 72}
          harvestKg={1280}
          onCropsPress={() => navigation.navigate('Plantations' as never)}
          onAnimalsPress={() => navigation.navigate('Farm' as never)}
          onMoisturePress={() => navigation.navigate('WeatherScreen')}
          onHarvestPress={() => navigation.navigate('Reports' as never)}
        />

        <View style={styles.sectionWrap}>
          <SuggestionCard suggestions={suggestions} />
        </View>

        <View style={[styles.activitiesCard, isDark && styles.activitiesCardDark]}>
          <View style={styles.activitiesHeader}>
            <View style={styles.activitiesHeaderLeft}>
              <Text style={[styles.activitiesTitle, isDark && styles.activitiesTitleDark]}>
                {t('todayActivities')}
              </Text>
              <View style={[styles.countBadge, isDark && styles.countBadgeDark]}>
                <Text style={[styles.countBadgeText, isDark && styles.countBadgeTextDark]}>
                  {todayActivities.length}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Activities' as never)}
              activeOpacity={0.7}
            >
              <Text style={[styles.seeAllText, isDark && styles.seeAllTextDark]}>{t('seeAll')}</Text>
            </TouchableOpacity>
          </View>

          {todayActivities.length === 0 ? (
            <Text style={[styles.emptyActivitiesText, isDark && styles.emptyActivitiesTextDark]}>
              {language === 'en' ? 'No pending activities for today.' : 'Nenhuma atividade pendente para hoje.'}
            </Text>
          ) : (
            todayActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isCompact
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

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}
          style={[styles.addHubButton, isDark && styles.addHubButtonDark]}
        >
          <MaterialCommunityIcons name="plus-circle" size={20} color="#FFFFFF" />
          <Text style={styles.addHubButtonText}>{t('newPlantation')}</Text>
        </TouchableOpacity>
      </View>

      <PlantationFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        defaultFarmId={activeFarm?.id}
      />
    </Screen>
  );
};

