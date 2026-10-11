export type DriftRisk = 'LOW' | 'MODERATE' | 'HIGH';
export type GraceStatus = 'IN_GRACE_PERIOD' | 'SAFE_TO_HARVEST';

export interface SprayApplication {
  id: string;
  farmId: string;
  plantationName: string;
  targetPest: string;
  productName: string;
  activeIngredient: string;
  dosePerHectare: string; // Ex: 0.5 L/ha ou 250 g/ha
  sprayVolumeLPerHa: number; // Ex: 150 L/ha
  totalTreatedAreaHa: number; // Ex: 32 ha
  nozzleType: string; // Ex: "Ponta Indução de Ar (AIXR 11002)"
  appliedAt: string; // Data ISO
  withdrawalPeriodDays: number; // Período de carência em dias
  harvestSafeDate: string; // Data liberada para colheita segura
  temperatureC: number;
  humidityPercent: number;
  windSpeedKmH: number;
  driftRisk: DriftRisk;
  operatorName: string;
  status: GraceStatus;
  notes?: string;
}
