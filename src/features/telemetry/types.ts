export interface IrrigationPivot {
  id: string;
  name: string;
  farmId: string;
  isRunning: boolean;
  speedPercent: number;
  waterDepthMm: number;
  pressureBar: number;
  flowRateM3H: number;
  angleDegrees: number;
  lastUpdated: string;
}

export interface GrainSilo {
  id: string;
  name: string;
  grainType: 'SOJA' | 'MILHO' | 'CAFÉ';
  capacityTons: number;
  currentTons: number;
  temperatureCelsius: number;
  moisturePercent: number;
  aerationActive: boolean;
  status: 'OPTIMAL' | 'ATTENTION' | 'CRITICAL';
}
