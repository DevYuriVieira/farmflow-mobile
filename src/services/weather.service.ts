import * as Location from 'expo-location';

export interface FarmWeatherData {
  locationName: string;
  temperatureCelsius: number;
  conditionDescription: string;
  rainProbabilityPercent: number;
  tempHighCelsius: number;
  tempLowCelsius: number;
  humidityPercent: number;
  windSpeedKmh: number;
  soilMoisturePercent: number;
  isDemoData: boolean;
  latitude?: number;
  longitude?: number;
  updatedAt: string;
}

// WMO Weather interpretation codes
function decodeWmoWeather(code: number): { description: string; rainChance: number } {
  if (code === 0) return { description: 'Céu Limpo', rainChance: 0 };
  if (code === 1 || code === 2) return { description: 'Parcialmente Nublado', rainChance: 10 };
  if (code === 3) return { description: 'Nublado', rainChance: 25 };
  if (code >= 45 && code <= 48) return { description: 'Nevoeiro Matinal', rainChance: 15 };
  if (code >= 51 && code <= 55) return { description: 'Garoa Leve', rainChance: 60 };
  if (code >= 61 && code <= 65) return { description: 'Chuva Moderada', rainChance: 80 };
  if (code >= 80 && code <= 82) return { description: 'Pancadas de Chuva', rainChance: 85 };
  if (code >= 95) return { description: 'Tempestade com Trovões', rainChance: 95 };
  return { description: 'Estável no Campo', rainChance: 15 };
}

export const weatherService = {
  /**
   * Fetch current GPS location coordinates using expo-location with browser fallback
   */
  async getCurrentGpsLocation(): Promise<{ latitude: number; longitude: number; name: string } | null> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return null;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocoding to obtain city/region
      let locationName = `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;
      try {
        const [geocode] = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geocode) {
          const city = geocode.subregion || geocode.city || geocode.district;
          const state = geocode.region;
          if (city && state) {
            locationName = `${city}, ${state}`;
          } else if (city) {
            locationName = city;
          }
        }
      } catch {
      }

      return { latitude, longitude, name: locationName };
    } catch {
      return null;
    }
  },

  /**
   * Fetch live weather from Open-Meteo API (100% free, no API key required)
   */
  async getWeatherForCoordinates(
    latitude: number,
    longitude: number,
    locationName = 'Fazenda Local'
  ): Promise<FarmWeatherData> {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

      const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!response.ok) throw new Error('Open-Meteo request failed');

      const data = await response.json();
      const current = data.current;
      const daily = data.daily;

      const weatherInfo = decodeWmoWeather(current.weather_code ?? 1);
      const rainChance = daily?.precipitation_probability_max?.[0] ?? weatherInfo.rainChance;
      const tempMax = Math.round(daily?.temperature_2m_max?.[0] ?? current.temperature_2m + 3);
      const tempMin = Math.round(daily?.temperature_2m_min?.[0] ?? current.temperature_2m - 5);

      // Estimated soil moisture from recent rain and humidity
      const humidity = Math.round(current.relative_humidity_2m ?? 65);
      const estimatedSoilMoisture = Math.min(95, Math.max(40, Math.round(humidity * 0.95 + (current.precipitation > 0 ? 15 : 0))));

      return {
        locationName,
        temperatureCelsius: Math.round(current.temperature_2m),
        conditionDescription: weatherInfo.description,
        rainProbabilityPercent: rainChance,
        tempHighCelsius: tempMax,
        tempLowCelsius: tempMin,
        humidityPercent: humidity,
        windSpeedKmh: Math.round(current.wind_speed_10m ?? 12),
        soilMoisturePercent: estimatedSoilMoisture,
        isDemoData: false,
        latitude,
        longitude,
        updatedAt: new Date().toISOString(),
      };
    } catch {
      return this.getFallbackWeather(locationName, latitude, longitude);
    }
  },

  /**
   * Fetch weather for a named location (defaults to Ribeirão Preto, SP coordinates)
   */
  async getWeatherForLocation(locationName: string): Promise<FarmWeatherData> {
    // Default coordinates for agricultural hub Ribeirão Preto / Franca, SP
    const defaultLat = -21.1767;
    const defaultLon = -47.8208;

    try {
      return await this.getWeatherForCoordinates(defaultLat, defaultLon, locationName || 'Ribeirão Preto, SP');
    } catch {
      return this.getFallbackWeather(locationName, defaultLat, defaultLon);
    }
  },

  getFallbackWeather(locationName: string, lat = -21.1767, lon = -47.8208): FarmWeatherData {
    return {
      locationName: locationName || 'Ribeirão Preto, SP',
      temperatureCelsius: 28,
      conditionDescription: 'Ensolarado com Brisa Leve',
      rainProbabilityPercent: 15,
      tempHighCelsius: 31,
      tempLowCelsius: 20,
      humidityPercent: 68,
      windSpeedKmh: 14,
      soilMoisturePercent: 74,
      isDemoData: true,
      latitude: lat,
      longitude: lon,
      updatedAt: new Date().toISOString(),
    };
  },
};
