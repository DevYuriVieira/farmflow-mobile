import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { weatherService, FarmWeatherData } from '../services/weather.service';
import { WeatherMode } from '../components/InteractiveFarmHero';
import { usePreferences } from './PreferencesContext';

export interface HourlyForecastItem {
  hour: string;
  temp: number;
  active?: boolean;
}

export interface WeatherConditionDetails {
  temp: number;
  feels: number;
  title: string;
  description: string;
  humidity: number;
  dewPoint: number;
  windSpeed: number;
  windDir: string;
  windGusts: number;
  rainChance: number;
  rainExpected: string;
  soilMoisture: number;
  soilStatus: string;
  waterTank: number;
  waterVolume: string;
  uvIndex: number;
  uvLabel: string;
}

export interface WeatherContextData {
  weatherData: FarmWeatherData | null;
  liveMode: WeatherMode;
  liveTemperature: number;
  liveConditionDetails: WeatherConditionDetails;
  currentMode: WeatherMode;
  setCurrentMode: (mode: WeatherMode) => void;
  temperature: number;
  conditionDetails: WeatherConditionDetails;
  hourlyForecast: HourlyForecastItem[];
  isLocating: boolean;
  refreshWeather: () => Promise<void>;
  resetToLiveWeather: () => Promise<void>;
  updateLocationGps: () => Promise<void>;
  getTimeGreeting: (lang: 'pt' | 'en') => string;
  isNightTime: boolean;
}

const WeatherContext = createContext<WeatherContextData | undefined>(undefined);

function checkIsNightTime(): boolean {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6;
}

export function getTimeGreeting(lang: 'pt' | 'en'): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return lang === 'en' ? 'Good morning' : 'Bom dia';
  }
  if (hour >= 12 && hour < 18) {
    return lang === 'en' ? 'Good afternoon' : 'Boa tarde';
  }
  return lang === 'en' ? 'Good evening' : 'Boa noite';
}

function deriveModeFromWeather(data: FarmWeatherData | null, isNight: boolean): WeatherMode {
  if (isNight) return 'night';
  if (!data) return 'sunny';
  if (data.rainProbabilityPercent >= 70) return 'rain';
  if (data.windSpeedKmh >= 30) return 'windy';
  if (data.conditionDescription.toLowerCase().includes('nublado')) return 'cloudy';
  return 'sunny';
}

const MODE_OFFSETS: Record<WeatherMode, number> = {
  sunny: 0,
  cloudy: -3,
  windy: -1,
  rain: -7,
  rainbow: -2,
  night: -8,
};

function buildConditionDetails(
  mode: WeatherMode,
  temp: number,
  baseHumidity: number,
  baseWind: number,
  baseRain: number,
  baseSoil: number,
  language: 'pt' | 'en'
): WeatherConditionDetails {
  const isEn = language === 'en';
  switch (mode) {
    case 'sunny':
      return {
        temp,
        feels: temp + 2,
        title: isEn ? 'Sunny' : 'Ensolarado',
        description: isEn ? 'Clear skies with gentle breeze across the crop fields.' : 'Céu aberto com brisa leve sobre os campos e lavouras.',
        humidity: Math.min(95, baseHumidity),
        dewPoint: Math.max(10, temp - 8),
        windSpeed: Math.max(8, baseWind),
        windDir: 'NE',
        windGusts: Math.max(12, baseWind + 6),
        rainChance: Math.min(25, baseRain),
        rainExpected: '0.0 mm',
        soilMoisture: Math.min(95, baseSoil),
        soilStatus: isEn ? 'Well Irrigated' : 'Bem irrigado',
        waterTank: 92,
        waterVolume: '9.200 L',
        uvIndex: 6,
        uvLabel: isEn ? 'Moderate (SPF 30+)' : 'Moderado (FPS 30+)',
      };
    case 'cloudy':
      return {
        temp,
        feels: temp + 1,
        title: isEn ? 'Partly Cloudy' : 'Parcialmente Nublado',
        description: isEn ? 'Scattered clouds filtering direct solar radiation.' : 'Nuvens esparsas bloqueando radiação solar direta.',
        humidity: Math.min(95, baseHumidity + 8),
        dewPoint: Math.max(10, temp - 5),
        windSpeed: Math.max(10, baseWind + 4),
        windDir: 'E',
        windGusts: Math.max(16, baseWind + 10),
        rainChance: Math.max(30, baseRain + 15),
        rainExpected: '0.5 mm',
        soilMoisture: Math.min(95, baseSoil + 4),
        soilStatus: isEn ? 'Adequate' : 'Adequado',
        waterTank: 90,
        waterVolume: '9.000 L',
        uvIndex: 3,
        uvLabel: isEn ? 'Low (SPF 15+)' : 'Baixo (FPS 15+)',
      };
    case 'windy':
      return {
        temp,
        feels: temp - 1,
        title: isEn ? 'Windy' : 'Ventania',
        description: isEn ? 'Moderate to strong wind gusts; monitor aerial spraying operations.' : 'Rajadas moderadas a fortes, atenção para pulverizações aéreas.',
        humidity: Math.max(40, baseHumidity - 6),
        dewPoint: Math.max(10, temp - 9),
        windSpeed: Math.max(32, baseWind + 18),
        windDir: 'NW',
        windGusts: Math.max(46, baseWind + 30),
        rainChance: 20,
        rainExpected: '0.0 mm',
        soilMoisture: Math.max(50, baseSoil - 4),
        soilStatus: isEn ? 'Adequate' : 'Adequado',
        waterTank: 89,
        waterVolume: '8.900 L',
        uvIndex: 4,
        uvLabel: isEn ? 'Moderate' : 'Moderado',
      };
    case 'rain':
      return {
        temp,
        feels: temp - 1,
        title: isEn ? 'Rain Showers' : 'Pancadas de Chuva',
        description: isEn ? 'Rainfall over farm fields; soil moisture and reservoirs filling up.' : 'Chuva sobre a fazenda. O solo e os reservatórios estão enchendo.',
        humidity: 94,
        dewPoint: Math.max(12, temp - 2),
        windSpeed: Math.max(20, baseWind + 8),
        windDir: 'SW',
        windGusts: Math.max(32, baseWind + 16),
        rainChance: 95,
        rainExpected: '18.4 mm',
        soilMoisture: 98,
        soilStatus: isEn ? 'Saturated' : 'Saturado',
        waterTank: 99,
        waterVolume: '9.900 L',
        uvIndex: 1,
        uvLabel: isEn ? 'Minimal' : 'Mínimo',
      };
    case 'rainbow':
      return {
        temp,
        feels: temp + 1,
        title: isEn ? 'Post-Rain Rainbow' : 'Pós-Chuva / Arco-íris',
        description: isEn ? 'The storm has passed. Moist soil and a rainbow spanning the horizon.' : 'A chuva passou. O solo está úmido e o arco-íris se abriu no horizonte.',
        humidity: 82,
        dewPoint: Math.max(12, temp - 3),
        windSpeed: 10,
        windDir: 'N',
        windGusts: 15,
        rainChance: 15,
        rainExpected: '0.1 mm',
        soilMoisture: 92,
        soilStatus: isEn ? 'Optimal' : 'Ótimo',
        waterTank: 96,
        waterVolume: '9.600 L',
        uvIndex: 4,
        uvLabel: isEn ? 'Moderate' : 'Moderado',
      };
    case 'night':
    default:
      return {
        temp,
        feels: temp - 1,
        title: isEn ? 'Clear Night' : 'Noite Limpa',
        description: isEn ? 'Starry night and cool temperature over the farm.' : 'Céu estrelado e temperatura amena sobre os talhões.',
        humidity: Math.min(95, baseHumidity + 12),
        dewPoint: Math.max(10, temp - 4),
        windSpeed: Math.max(6, Math.round(baseWind * 0.6)),
        windDir: 'N',
        windGusts: Math.max(10, Math.round(baseWind * 0.9)),
        rainChance: 5,
        rainExpected: '0.0 mm',
        soilMoisture: Math.min(95, baseSoil + 8),
        soilStatus: isEn ? 'Night Rest' : 'Descanso Noturno',
        waterTank: 94,
        waterVolume: '9.400 L',
        uvIndex: 0,
        uvLabel: isEn ? 'None' : 'Nenhum',
      };
  }
}

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = usePreferences();
  const [currentHour, setCurrentHour] = useState(() => new Date().getHours());

  useEffect(() => {
    const timer = setInterval(() => {
      const nowH = new Date().getHours();
      setCurrentHour((prev) => (prev !== nowH ? nowH : prev));
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const isNight = checkIsNightTime();

  const [weatherData, setWeatherData] = useState<FarmWeatherData | null>(null);
  const [simMode, setSimMode] = useState<WeatherMode | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const fetchWeather = useCallback(async () => {
    try {
      const data = await weatherService.getWeatherForLocation('Ribeirão Preto, SP');
      setWeatherData(data);
    } catch {
      const fallback = weatherService.getFallbackWeather('Ribeirão Preto, SP');
      setWeatherData(fallback);
    }
  }, []);

  useEffect(() => {
    void fetchWeather();
  }, [fetchWeather]);

  const updateLocationGps = useCallback(async () => {
    try {
      setIsLocating(true);
      const gps = await weatherService.getCurrentGpsLocation();
      if (gps) {
        const live = await weatherService.getWeatherForCoordinates(gps.latitude, gps.longitude, gps.name);
        setWeatherData(live);
      }
    } finally {
      setIsLocating(false);
    }
  }, []);

  const handleSetCurrentMode = useCallback((mode: WeatherMode) => {
    setSimMode(mode);
  }, []);

  const rawTemp = weatherData?.temperatureCelsius ?? (isNight ? 20 : 28);
  const dayBaseline = isNight ? rawTemp + 8 : rawTemp;
  const baseHumidity = weatherData?.humidityPercent ?? 68;
  const baseWind = weatherData?.windSpeedKmh ?? 14;
  const baseRain = weatherData?.rainProbabilityPercent ?? 15;
  const baseSoil = weatherData?.soilMoisturePercent ?? 74;

  const liveMode = deriveModeFromWeather(weatherData, isNight);
  const liveTemperature = dayBaseline + MODE_OFFSETS[liveMode];

  const currentMode = simMode ?? liveMode;
  const temperature = dayBaseline + MODE_OFFSETS[currentMode];

  const liveConditionDetails = useMemo(
    () => buildConditionDetails(liveMode, liveTemperature, baseHumidity, baseWind, baseRain, baseSoil, language),
    [liveMode, liveTemperature, baseHumidity, baseWind, baseRain, baseSoil, language]
  );

  const conditionDetails = useMemo(
    () =>
      currentMode === liveMode
        ? liveConditionDetails
        : buildConditionDetails(currentMode, temperature, baseHumidity, baseWind, baseRain, baseSoil, language),
    [currentMode, liveMode, liveConditionDetails, temperature, baseHumidity, baseWind, baseRain, baseSoil, language]
  );

  const hourlyForecast = useMemo<HourlyForecastItem[]>(() => {
    const isEn = language === 'en';
    const items: HourlyForecastItem[] = [];

    for (let i = 0; i < 8; i++) {
      const h = (currentHour + i) % 24;
      const hourLabel = i === 0 ? (isEn ? 'Now' : 'Agora') : `${h.toString().padStart(2, '0')}:00`;
      const diurnalOffset = Math.round(Math.sin(((h - 8) / 24) * 2 * Math.PI) * 4);
      const isHNight = h >= 18 || h < 6;
      const slotTemp = i === 0 ? temperature : Math.max(14, dayBaseline + diurnalOffset + (isHNight ? -6 : 0));
      items.push({
        hour: hourLabel,
        temp: slotTemp,
        active: i === 0,
      });
    }

    return items;
  }, [currentHour, dayBaseline, language, temperature]);

  const refreshWeather = useCallback(async () => {
    setSimMode(null);
    await fetchWeather();
  }, [fetchWeather]);

  const resetToLiveWeather = useCallback(async () => {
    setSimMode(null);
    await fetchWeather();
  }, [fetchWeather]);

  const value = useMemo(
    () => ({
      weatherData,
      liveMode,
      liveTemperature,
      liveConditionDetails,
      currentMode,
      setCurrentMode: handleSetCurrentMode,
      temperature,
      conditionDetails,
      hourlyForecast,
      isLocating,
      refreshWeather,
      resetToLiveWeather,
      updateLocationGps,
      getTimeGreeting,
      isNightTime: isNight,
    }),
    [
      weatherData,
      liveMode,
      liveTemperature,
      liveConditionDetails,
      currentMode,
      handleSetCurrentMode,
      temperature,
      conditionDetails,
      hourlyForecast,
      isLocating,
      refreshWeather,
      resetToLiveWeather,
      updateLocationGps,
      isNight,
    ]
  );

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
};

export const useWeather = (): WeatherContextData => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather deve ser usado dentro de um WeatherProvider');
  }
  return context;
};
