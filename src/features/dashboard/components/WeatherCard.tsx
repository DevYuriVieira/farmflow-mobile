import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FarmWeatherData } from '../../../services/weather.service';
import { colors, radii, spacing, typography } from '../../../theme';
import { formatDashboardDate } from '../../../utils/dates';

export interface WeatherCardProps {
  weather: FarmWeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{formatDashboardDate()}</Text>

      <View style={styles.mainRow}>
        {/* Large temperature */}
        <Text style={styles.temperatureText}>
          {weather.temperatureCelsius}°<Text style={styles.celsiusText}>c</Text>
        </Text>

        {/* Weather condition badge */}
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

      {/* Demo data badge */}
      {weather.isDemoData && (
        <View style={styles.demoTag}>
          <Text style={styles.demoTagText}>Previsão Agro Demo</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  dateText: {
    ...typography.captionMedium,
    color: colors.textSecondary,
    marginBottom: spacing.xxs,
    textTransform: 'capitalize',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  temperatureText: {
    ...typography.hero,
    fontSize: 54,
    lineHeight: 60,
    color: colors.textPrimary,
    fontWeight: '300',
  },
  celsiusText: {
    fontSize: 34,
    color: colors.textSecondary,
  },
  conditionPill: {
    backgroundColor: 'rgba(16, 40, 27, 0.85)',
    borderRadius: radii.xl,
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.35)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'flex-start',
  },
  conditionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  conditionText: {
    ...typography.captionMedium,
    color: colors.textPrimary,
    marginLeft: 6,
  },
  highLowRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highLowText: {
    ...typography.micro,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  demoTag: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    backgroundColor: 'rgba(12, 30, 21, 0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.xs,
  },
  demoTagText: {
    ...typography.micro,
    fontSize: 10,
    color: colors.textMuted,
  },
});
