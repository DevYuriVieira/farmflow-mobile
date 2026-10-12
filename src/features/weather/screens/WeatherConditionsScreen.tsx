import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path, Circle, Line } from 'react-native-svg';

import { InteractiveFarmHero, WeatherMode } from '../../../components/InteractiveFarmHero';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { styles } from '../styles/weatherConditions.styles';

export const WeatherConditionsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDark, language, t } = usePreferences();
  const [activeWeather, setActiveWeather] = useState<WeatherMode>(isDark ? 'night' : 'sunny');

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

  const weatherData = {
    sunny: {
      temp: 28,
      feels: 30,
      title: 'Ensolarado',
      description: 'Céu aberto com brisa leve sobre os campos e lavouras.',
      humidity: 72,
      dewPoint: 22,
      windSpeed: 12,
      windDir: 'NE',
      windGusts: 18,
      rainChance: 10,
      rainExpected: '0.0 mm',
      soilMoisture: 88,
      soilStatus: 'Bem irrigado',
      waterTank: 92,
      waterVolume: '9.200 L',
      uvIndex: 5,
      uvLabel: 'Moderado (FPS 30+)',
    },
    cloudy: {
      temp: 25,
      feels: 26,
      title: 'Parcialmente Nublado',
      description: 'Nuvens esparsas bloqueando radiação solar direta.',
      humidity: 78,
      dewPoint: 21,
      windSpeed: 16,
      windDir: 'E',
      windGusts: 24,
      rainChance: 35,
      rainExpected: '0.5 mm',
      soilMoisture: 84,
      soilStatus: 'Adequado',
      waterTank: 90,
      waterVolume: '9.000 L',
      uvIndex: 3,
      uvLabel: 'Baixo (FPS 15+)',
    },
    windy: {
      temp: 27,
      feels: 26,
      title: 'Ventania',
      description: 'Rajadas moderadas a fortes, atenção para pulverizações aéreas.',
      humidity: 65,
      dewPoint: 19,
      windSpeed: 34,
      windDir: 'NW',
      windGusts: 48,
      rainChance: 20,
      rainExpected: '0.0 mm',
      soilMoisture: 80,
      soilStatus: 'Adequado',
      waterTank: 89,
      waterVolume: '8.900 L',
      uvIndex: 4,
      uvLabel: 'Moderado',
    },
    rain: {
      temp: 21,
      feels: 20,
      title: 'Pancadas de Chuva',
      description: 'Chuva sobre a fazenda. O solo e os reservatórios estão enchendo.',
      humidity: 94,
      dewPoint: 20,
      windSpeed: 22,
      windDir: 'SW',
      windGusts: 32,
      rainChance: 95,
      rainExpected: '18.4 mm',
      soilMoisture: 98,
      soilStatus: 'Saturado',
      waterTank: 99,
      waterVolume: '9.900 L',
      uvIndex: 1,
      uvLabel: 'Mínimo',
    },
    rainbow: {
      temp: 24,
      feels: 25,
      title: 'Pós-Chuva / Arco-íris',
      description: 'A chuva passou. O solo está úmido e o arco-íris se abriu no horizonte.',
      humidity: 82,
      dewPoint: 21,
      windSpeed: 10,
      windDir: 'N',
      windGusts: 15,
      rainChance: 15,
      rainExpected: '0.1 mm',
      soilMoisture: 92,
      soilStatus: 'Ótimo',
      waterTank: 96,
      waterVolume: '9.600 L',
      uvIndex: 4,
      uvLabel: 'Moderado',
    },
    night: {
      temp: 20,
      feels: 19,
      title: language === 'en' ? 'Clear Night' : 'Noite Limpa',
      description: language === 'en' ? 'Starry night and cool temperature over the farm.' : 'Céu estrelado e temperatura amena sobre os talhões.',
      humidity: 88,
      dewPoint: 18,
      windSpeed: 6,
      windDir: 'N',
      windGusts: 10,
      rainChance: 5,
      rainExpected: '0.0 mm',
      soilMoisture: 90,
      soilStatus: language === 'en' ? 'Optimal rest' : 'Descanso Noturno',
      waterTank: 94,
      waterVolume: '9.400 L',
      uvIndex: 0,
      uvLabel: language === 'en' ? 'None' : 'Nenhum',
    },
  }[activeWeather];

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate('MainTabs');
    }
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]} showsVerticalScrollIndicator={false}>
      <View style={styles.topBar}>
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
            const modes: WeatherMode[] = ['sunny', 'cloudy', 'windy', 'rain', 'rainbow', 'night'];
            const next = modes[(modes.indexOf(activeWeather) + 1) % modes.length];
            setActiveWeather(next);
          }}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="refresh" size={20} color={isDark ? '#FFFFFF' : '#1E293B'} />
        </TouchableOpacity>
      </View>

      <InteractiveFarmHero
        currentMode={activeWeather}
        onModeChange={(mode) => setActiveWeather(mode)}
        temperature={weatherData.temp}
      />

      <View style={styles.sheetContainer}>
        <View style={styles.sheetHandle} />
        <View style={styles.sheetHeader}>
          <View style={styles.sheetHeaderLeft}>
            <Text style={styles.sheetTitle}>
              {language === 'en' ? "Today's conditions" : 'Condições de Hoje'}
            </Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>
                {language === 'en' ? 'Live' : 'Ao Vivo'}
              </Text>
            </View>
          </View>
          <Text style={styles.sheetSubtitle}>{weatherData.description}</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hourlyContainer}
        >
          {[
            { hour: language === 'en' ? 'Now' : 'Agora', temp: 28, active: true },
            { hour: '11:00', temp: 29 },
            { hour: '12:00', temp: 30 },
            { hour: '13:00', temp: 31 },
            { hour: '14:00', temp: 31 },
            { hour: '15:00', temp: 30 },
            { hour: '16:00', temp: 29 },
            { hour: '17:00', temp: 27 },
          ].map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.hourlyPill,
                item.active && styles.hourlyPillActive,
              ]}
            >
              <Text style={[styles.hourlyTemp, item.active && styles.hourlyTempActive]}>
                {item.temp}°
              </Text>
              <Text style={[styles.hourlyTime, item.active && styles.hourlyTimeActive]}>
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
          <Text style={styles.recSectionTitle}>Recomendações da Fazenda</Text>
          <Text style={styles.recSectionSubtitle}>
            Baseado em suas culturas e na previsão do tempo
          </Text>

          <View style={styles.recCard}>
            <View style={styles.recTopRow}>
              <View style={[styles.recIconWrap, { backgroundColor: '#E0F2FE' }]}>
                <MaterialCommunityIcons name="water-outline" size={22} color="#0284C7" />
              </View>
              <View style={styles.recBadge}>
                <Text style={styles.recBadgeText}>Amanhã · 06h às 08h</Text>
              </View>
            </View>

            <Text style={styles.recTitle}>Irrigação recomendada amanhã cedo</Text>
            <Text style={styles.recDesc}>
              Dois dias secos e ensolarados pela frente. Irrigar cedo reduz a evaporação em até 30%.
            </Text>

            <TouchableOpacity
              style={styles.recBtnPrimary}
              onPress={() => navigation.navigate('Activities' as never)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="calendar-clock" size={18} color="#FFFFFF" />
              <Text style={styles.recBtnPrimaryText}>Agendar Irrigação</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recCard}>
            <View style={styles.recTopRow}>
              <View style={[styles.recIconWrap, { backgroundColor: '#E0F2FE' }]}>
                <MaterialCommunityIcons name="weather-pouring" size={22} color="#0284C7" />
              </View>
              <View style={[styles.recBadge, { backgroundColor: '#E0F2FE' }]}>
                <Text style={[styles.recBadgeText, { color: '#0369A1' }]}>Sexta · 80% chance</Text>
              </View>
            </View>

            <Text style={styles.recTitle}>Chuva volumosa prevista na sexta</Text>
            <Text style={styles.recDesc}>
              Previsão de até 18 mm. Pule a irrigação programada e deixe a chuva trabalhar por você.
            </Text>

            <TouchableOpacity
              style={styles.recBtnOutline}
              onPress={() => Alert.alert('Irrigação Pausada', 'Irrigação suspensa para sexta-feira economizando 1.200 L de água.')}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="water-off-outline" size={18} color="#1E293B" />
              <Text style={styles.recBtnOutlineText}>Pular Irrigação</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recCard}>
            <View style={styles.recTopRow}>
              <View style={[styles.recIconWrap, { backgroundColor: '#DCFCE7' }]}>
                <MaterialCommunityIcons name="sprout" size={22} color="#16A34A" />
              </View>
              <View style={[styles.recBadge, { backgroundColor: '#DCFCE7' }]}>
                <Text style={[styles.recBadgeText, { color: '#15803D' }]}>Esta semana</Text>
              </View>
            </View>

            <Text style={styles.recTitle}>Boas condições para novo plantio</Text>
            <Text style={styles.recDesc}>
              Solo aquecido e umidade constante — momento ideal para semeadura de alface e cenoura.
            </Text>

            <TouchableOpacity
              style={styles.recBtnSoft}
              onPress={() => navigation.navigate('Plantations' as never)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="plus" size={18} color="#166534" />
              <Text style={styles.recBtnSoftText}>Cadastrar Plantio</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

