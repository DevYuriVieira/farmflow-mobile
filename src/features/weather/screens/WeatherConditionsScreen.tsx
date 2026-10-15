import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Alert,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path, Circle, Line } from 'react-native-svg';

import { InteractiveFarmHero } from '../../../components/InteractiveFarmHero';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { useWeather } from '../../../contexts/WeatherContext';
import { styles } from '../styles/weatherConditions.styles';

export const WeatherConditionsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { isDark, language, t } = usePreferences();
  const topPadding = Math.max(insets.top, StatusBar.currentHeight ?? 0, 20) + 8;
  const {
    currentMode: activeWeather,
    setCurrentMode: setActiveWeather,
    conditionDetails: weatherData,
    hourlyForecast,
    refreshWeather,
  } = useWeather();

  const windAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(windAnim, {
        toValue: 1,
        duration: activeWeather === 'windy' ? 1200 : 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [activeWeather, windAnim]);

  const windRotate = windAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate('MainTabs');
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View
        style={[
          styles.topBar,
          isDark ? styles.topBarDark : styles.topBarLight,
          { paddingTop: topPadding },
        ]}
      >
        <TouchableOpacity
          style={[styles.iconButton, isDark && styles.iconButtonDark]}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color={isDark ? '#FFFFFF' : '#1E293B'} />
        </TouchableOpacity>

        <View style={[styles.farmPill, isDark && styles.farmPillDark]}>
          <MaterialCommunityIcons name="map-marker" size={16} color="#059669" />
          <Text style={[styles.farmPillText, isDark && styles.farmPillTextDark]}>
            {t('farmDefaultName')}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.iconButton, isDark && styles.iconButtonDark]}
          onPress={() => {
            void refreshWeather();
          }}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="refresh" size={20} color={isDark ? '#FFFFFF' : '#1E293B'} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[styles.container, isDark && styles.containerDark]}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <InteractiveFarmHero
        variant="weather"
        currentMode={activeWeather}
        onModeChange={(mode) => setActiveWeather(mode)}
        temperature={weatherData.temp}
        humidity={weatherData.humidity}
        rainProbability={weatherData.rainChance}
      />

      <View style={[styles.sheetContainer, isDark && styles.sheetContainerDark]}>
        <View style={styles.sheetHandle} />
        <View style={styles.sheetHeader}>
          <View style={styles.sheetHeaderLeft}>
            <Text style={[styles.sheetTitle, isDark && styles.sheetTitleDark]}>
              {language === 'en' ? "Today's conditions" : 'Condições de Hoje'}
            </Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>
                {language === 'en' ? 'Live' : 'Ao Vivo'}
              </Text>
            </View>
          </View>
          <Text style={[styles.sheetSubtitle, isDark && styles.sheetSubtitleDark]}>{weatherData.description}</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hourlyContainer}
        >
          {hourlyForecast.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.hourlyPill,
                item.active && styles.hourlyPillActive,
                isDark && !item.active && styles.hourlyPillDark,
              ]}
            >
              <Text
                style={[
                  styles.hourlyTemp,
                  item.active && styles.hourlyTempActive,
                  isDark && !item.active && styles.hourlyTempDark,
                ]}
              >
                {item.temp}°
              </Text>
              <Text
                style={[
                  styles.hourlyTime,
                  item.active && styles.hourlyTimeActive,
                  isDark && !item.active && styles.hourlyTimeDark,
                ]}
              >
                {item.hour}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.bentoGrid}>
          <View style={styles.bentoCard}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.cardIconWrap, { backgroundColor: '#FEF3C7' }]}>
                <MaterialCommunityIcons name="white-balance-sunny" size={18} color="#D97706" />
              </View>
              <Svg width="54" height="24" viewBox="0 0 54 24">
                <Path
                  d="M 2 18 Q 15 4 28 8 T 52 14"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <Circle cx="52" cy="14" r="3" fill="#F59E0B" />
              </Svg>
            </View>
            <Text style={styles.cardLabel}>Temperatura</Text>
            <Text style={styles.cardValue}>{weatherData.temp}°C</Text>
            <Text style={styles.cardSubtext}>Sensação de {weatherData.feels}°C</Text>
          </View>

          <View style={styles.bentoCard}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.cardIconWrap, { backgroundColor: '#E0F2FE' }]}>
                <MaterialCommunityIcons name="water-percent" size={18} color="#0284C7" />
              </View>
              <View style={styles.verticalGauge}>
                <View
                  style={[
                    styles.verticalGaugeFill,
                    { height: `${weatherData.humidity}%` },
                  ]}
                />
              </View>
            </View>
            <Text style={styles.cardLabel}>Umidade do Ar</Text>
            <Text style={styles.cardValue}>{weatherData.humidity}%</Text>
            <Text style={styles.cardSubtext}>Ponto orvalho {weatherData.dewPoint}°C</Text>
          </View>

          <View style={styles.bentoCard}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.cardIconWrap, { backgroundColor: '#DCFCE7' }]}>
                <MaterialCommunityIcons name="weather-windy" size={18} color="#16A34A" />
              </View>
              <Animated.View style={{ transform: [{ rotate: windRotate }] }}>
                <Svg width="30" height="30" viewBox="-15 -15 30 30">
                  <Line x1="0" y1="0" x2="0" y2="-12" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
                  <Line x1="0" y1="0" x2="10" y2="6" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
                  <Line x1="0" y1="0" x2="-10" y2="6" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
                  <Circle cx="0" cy="0" r="2.5" fill="#15803D" />
                </Svg>
              </Animated.View>
            </View>
            <Text style={styles.cardLabel}>Vento</Text>
            <Text style={styles.cardValue}>{weatherData.windSpeed} km/h</Text>
            <Text style={styles.cardSubtext}>
              {weatherData.windDir} · Rajadas {weatherData.windGusts} km/h
            </Text>
          </View>

          <View style={styles.bentoCard}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.cardIconWrap, { backgroundColor: '#E0F2FE' }]}>
                <MaterialCommunityIcons name="weather-rainy" size={18} color="#0284C7" />
              </View>
            </View>
            <Text style={styles.cardLabel}>Chance de Chuva</Text>
            <Text style={styles.cardValue}>{weatherData.rainChance}%</Text>
            <View style={styles.horizontalBar}>
              <View
                style={[
                  styles.horizontalBarFill,
                  { width: `${weatherData.rainChance}%` },
                ]}
              />
            </View>
            <Text style={styles.cardSubtext}>{weatherData.rainExpected} esperado</Text>
          </View>

          <View style={styles.bentoCard}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.cardIconWrap, { backgroundColor: '#F1F5E9' }]}>
                <MaterialCommunityIcons name="sprout" size={18} color="#15803D" />
              </View>
              <View style={styles.verticalGauge}>
                <View
                  style={[
                    styles.verticalGaugeFill,
                    { height: `${weatherData.soilMoisture}%`, backgroundColor: '#10B981' },
                  ]}
                />
              </View>
            </View>
            <Text style={styles.cardLabel}>Umidade do Solo</Text>
            <Text style={styles.cardValue}>{weatherData.soilMoisture}%</Text>
            <Text style={styles.cardSubtext}>{weatherData.soilStatus}</Text>
          </View>

          <View style={styles.bentoCard}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.cardIconWrap, { backgroundColor: '#E0F2FE' }]}>
                <MaterialCommunityIcons name="water" size={18} color="#0284C7" />
              </View>
              <View style={styles.verticalGauge}>
                <View
                  style={[
                    styles.verticalGaugeFill,
                    { height: `${weatherData.waterTank}%`, backgroundColor: '#38BDF8' },
                  ]}
                />
              </View>
            </View>
            <Text style={styles.cardLabel}>Reservatório</Text>
            <Text style={styles.cardValue}>{weatherData.waterTank}%</Text>
            <Text style={styles.cardSubtext}>{weatherData.waterVolume} armazenados</Text>
          </View>
        </View>

        <View style={styles.uvBanner}>
          <View style={styles.uvLeft}>
            <View style={[styles.cardIconWrap, { backgroundColor: '#FEF3C7' }]}>
              <MaterialCommunityIcons name="weather-sunny-alert" size={18} color="#D97706" />
            </View>
            <View>
              <Text style={styles.cardLabel}>Índice Ultravioleta</Text>
              <Text style={styles.uvValueText}>
                {weatherData.uvIndex} <Text style={styles.uvLabelText}>{weatherData.uvLabel}</Text>
              </Text>
            </View>
          </View>
          <View style={styles.uvBadgePill}>
            <Text style={styles.uvBadgeText}>FPS 30+ · 11h às 15h</Text>
          </View>
        </View>

        <View style={styles.forecastCard}>
          <View style={styles.forecastHeader}>
            <Text style={styles.forecastTitle}>Previsão para 7 Dias</Text>
            <Text style={styles.forecastRangeText}>19° – 29°</Text>
          </View>

          {[
            { day: 'Hoje', rain: '15%', icon: 'white-balance-sunny', iconColor: '#F59E0B', min: 21, max: 29, curPos: 80 },
            { day: 'Terça', rain: '20%', icon: 'weather-partly-cloudy', iconColor: '#0284C7', min: 21, max: 28, curPos: 70 },
            { day: 'Quarta', rain: '35%', icon: 'weather-cloudy', iconColor: '#64748B', min: 20, max: 27, curPos: 55 },
            { day: 'Quinta', rain: '25%', icon: 'white-balance-sunny', iconColor: '#F59E0B', min: 20, max: 28, curPos: 65 },
            { day: 'Sexta', rain: '80%', icon: 'weather-pouring', iconColor: '#0284C7', min: 19, max: 25, curPos: 40 },
            { day: 'Sábado', rain: '70%', icon: 'weather-rainy', iconColor: '#0284C7', min: 19, max: 24, curPos: 35 },
            { day: 'Domingo', rain: '10%', icon: 'white-balance-sunny', iconColor: '#F59E0B', min: 21, max: 29, curPos: 75 },
          ].map((item, idx) => (
            <View key={idx} style={styles.forecastRow}>
              <View style={styles.dayCol}>
                <Text style={styles.dayText}>{item.day}</Text>
                <Text style={styles.dayRainText}>💧 {item.rain}</Text>
              </View>

              <MaterialCommunityIcons
                name={item.icon as any}
                size={22}
                color={item.iconColor}
                style={styles.forecastIcon}
              />

              <Text style={styles.tempMinText}>{item.min}°</Text>

              <View style={styles.tempBarTrack}>
                <View style={styles.tempBarFill} />
                <View style={[styles.tempBarDot, { left: `${item.curPos}%` }]} />
              </View>

              <Text style={styles.tempMaxText}>{item.max}°</Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color="#CBD5E1" />
            </View>
          ))}
        </View>

        <View style={styles.recommendationsSection}>
          <Text style={[styles.recSectionTitle, isDark && styles.recSectionTitleDark]}>
            {language === 'en' ? 'Farm Recommendations' : 'Recomendações da Fazenda'}
          </Text>
          <Text style={[styles.recSectionSubtitle, isDark && styles.recSectionSubtitleDark]}>
            {language === 'en' ? 'Based on your crops and weather forecast' : 'Baseado em suas culturas e na previsão do tempo'}
          </Text>

          <View style={[styles.recCard, isDark && styles.recCardDark]}>
            <View style={styles.recTopRow}>
              <View style={[styles.recIconWrap, { backgroundColor: isDark ? '#0C3247' : '#E0F2FE' }]}>
                <MaterialCommunityIcons name="water-outline" size={22} color="#0284C7" />
              </View>
              <View style={[styles.recBadge, isDark && { backgroundColor: '#0C3247' }]}>
                <Text style={[styles.recBadgeText, isDark && { color: '#38BDF8' }]}>
                  {language === 'en' ? 'Tomorrow · 6am to 8am' : 'Amanhã · 06h às 08h'}
                </Text>
              </View>
            </View>

            <Text style={[styles.recTitle, isDark && styles.recTitleDark]}>
              {language === 'en' ? 'Early morning irrigation recommended' : 'Irrigação recomendada amanhã cedo'}
            </Text>
            <Text style={[styles.recDesc, isDark && styles.recDescDark]}>
              {language === 'en'
                ? 'Two dry, sunny days ahead. Irrigating early reduces evaporation by up to 30%.'
                : 'Dois dias secos e ensolarados pela frente. Irrigar cedo reduz a evaporação em até 30%.'}
            </Text>

            <TouchableOpacity
              style={styles.recBtnPrimary}
              onPress={() => navigation.navigate('Activities' as never)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="calendar-clock" size={18} color="#FFFFFF" />
              <Text style={styles.recBtnPrimaryText}>
                {language === 'en' ? 'Schedule Irrigation' : 'Agendar Irrigação'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.recCard, isDark && styles.recCardDark]}>
            <View style={styles.recTopRow}>
              <View style={[styles.recIconWrap, { backgroundColor: isDark ? '#0C3247' : '#E0F2FE' }]}>
                <MaterialCommunityIcons name="weather-pouring" size={22} color="#0284C7" />
              </View>
              <View style={[styles.recBadge, isDark ? { backgroundColor: '#0C3247' } : { backgroundColor: '#E0F2FE' }]}>
                <Text style={[styles.recBadgeText, isDark ? { color: '#38BDF8' } : { color: '#0369A1' }]}>
                  {language === 'en' ? 'Friday · 80% chance' : 'Sexta · 80% chance'}
                </Text>
              </View>
            </View>

            <Text style={[styles.recTitle, isDark && styles.recTitleDark]}>
              {language === 'en' ? 'Heavy rain forecast for Friday' : 'Chuva volumosa prevista na sexta'}
            </Text>
            <Text style={[styles.recDesc, isDark && styles.recDescDark]}>
              {language === 'en'
                ? 'Up to 18 mm expected. Skip scheduled irrigation and let rain work for you.'
                : 'Previsão de até 18 mm. Pule a irrigação programada e deixe a chuva trabalhar por você.'}
            </Text>

            <TouchableOpacity
              style={[styles.recBtnOutline, isDark && styles.recBtnOutlineDark]}
              onPress={() => Alert.alert(language === 'en' ? 'Irrigation Paused' : 'Irrigação Pausada', language === 'en' ? 'Irrigation skipped for Friday saving 1,200 L.' : 'Irrigação suspensa para sexta-feira economizando 1.200 L de água.')}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="water-off-outline" size={18} color={isDark ? '#F0FDF4' : '#1E293B'} />
              <Text style={[styles.recBtnOutlineText, isDark && styles.recBtnOutlineTextDark]}>
                {language === 'en' ? 'Skip Irrigation' : 'Pular Irrigação'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.recCard, isDark && styles.recCardDark]}>
            <View style={styles.recTopRow}>
              <View style={[styles.recIconWrap, { backgroundColor: isDark ? '#14532D' : '#DCFCE7' }]}>
                <MaterialCommunityIcons name="sprout" size={22} color={isDark ? '#4ADE80' : '#16A34A'} />
              </View>
              <View style={[styles.recBadge, { backgroundColor: isDark ? '#14532D' : '#DCFCE7' }]}>
                <Text style={[styles.recBadgeText, { color: isDark ? '#86EFAC' : '#15803D' }]}>
                  {language === 'en' ? 'This week' : 'Esta semana'}
                </Text>
              </View>
            </View>

            <Text style={[styles.recTitle, isDark && styles.recTitleDark]}>
              {language === 'en' ? 'Good conditions for new planting' : 'Boas condições para novo plantio'}
            </Text>
            <Text style={[styles.recDesc, isDark && styles.recDescDark]}>
              {language === 'en'
                ? 'Warm soil and steady moisture — ideal time for sowing lettuce and carrots.'
                : 'Solo aquecido e umidade constante — momento ideal para semeadura de alface e cenoura.'}
            </Text>

            <TouchableOpacity
              style={[styles.recBtnSoft, isDark && styles.recBtnSoftDark]}
              onPress={() => navigation.navigate('Plantations' as never)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="plus" size={18} color={isDark ? '#4ADE80' : '#166534'} />
              <Text style={[styles.recBtnSoftText, isDark && styles.recBtnSoftTextDark]}>
                {language === 'en' ? 'Register Crop' : 'Cadastrar Plantio'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  </View>
);
};

