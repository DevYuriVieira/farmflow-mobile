import { DriftRisk } from './types';

/**
 * Calculates biological drift risk based on ambient meteorological conditions.
 * Ideal conditions: Wind 3 to 10 km/h, RH > 55%, Temp < 30°C.
 */
export const calculateDriftRisk = (
  windSpeedKmH: number,
  humidityPercent: number,
  tempC: number
): DriftRisk => {
  if (windSpeedKmH > 10 || humidityPercent < 50 || tempC > 30) {
    return 'HIGH';
  }
  if (windSpeedKmH > 7 || humidityPercent < 55 || tempC > 28) {
    return 'MODERATE';
  }
  return 'LOW';
};

/**
 * Calculates total spray volume for an application (L).
 */
export const calculateTotalSprayVolumeLiters = (
  sprayVolumeLPerHa: number,
  areaHa: number
): number => {
  return sprayVolumeLPerHa * areaHa;
};
