export interface IrrigationPivot {
  id: string;
  name: string;
  farmId: string;
  isRunning: boolean;
  speedPercent: number; // 0 - 100%
  waterDepthMm: number; // Lâmina de água em mm
  pressureBar: number;  // Pressão no pivô (bar)
  flowRateM3H: number;  // Vazão em m³/h
  angleDegrees: number; // Posição angular (0 - 360°)
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
