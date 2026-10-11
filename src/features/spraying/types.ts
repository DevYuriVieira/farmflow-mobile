export type DriftRisk = 'LOW' | 'MODERATE' | 'HIGH';
export type GraceStatus = 'IN_GRACE_PERIOD' | 'SAFE_TO_HARVEST';

export interface SprayApplication {
  id: string;
  farmId: string;
  plantationName: string;
  targetPest: string;
  productName: string;
  activeIngredient: string;
  dosePerHectare: string;
  sprayVolumeLPerHa: number;
  totalTreatedAreaHa: number;
  nozzleType: string;
  appliedAt: string;
  withdrawalPeriodDays: number;
  harvestSafeDate: string;
  temperatureC: number;
  humidityPercent: number;
  windSpeedKmH: number;
  driftRisk: DriftRisk;
  operatorName: string;
  status: GraceStatus;
  notes?: string;
}
