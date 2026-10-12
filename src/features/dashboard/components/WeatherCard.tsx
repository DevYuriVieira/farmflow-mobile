import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FarmWeatherData } from '../../../services/weather.service';
import { colors } from '../../../theme';
import { formatDashboardDate } from '../../../utils/dates';
import { styles } from '../styles/weatherCard.styles';

export interface WeatherCardProps {
  weather: FarmWeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{formatDashboardDate()}</Text>

      <View style={styles.mainRow}>
        <Text style={styles.temperatureText}>
          {weather.temperatureCelsius}°<Text style={styles.celsiusText}>c</Text>
        </Text>

        <View style={styles.conditionPill}>
          <View style={styles.conditionHeader}>
            <MaterialCommunityIcons name="weather-rainy" size={20} color={colors.primaryLight} />
            <Text style={styles.conditionText}>
              {weather.conditionDescription} {weather.rainProbabilityPercent}%
            </Text>
          </View>
          <View style={styles.highLowRow}>
            <Text style={styles.highLowText}>↑ {weather.tempHighCelsius}°</Text>
            <Text style={styles.highLowText}>↓ {weather.tempLowCelsius}°</Text>
          </View>
        </View>
      </View>

      {weather.isDemoData && (
        <View style={styles.demoTag}>
          <Text style={styles.demoTagText}>Previsão Agro Demo</Text>
        </View>
      )}
    </View>
  );
};

