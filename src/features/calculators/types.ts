export interface SprayCalculationInput {
  targetRateLPerHa: number;
  tankCapacityL: number;
  boomWidthMeters: number;
  tractorSpeedKmH: number;
  nozzleSpacingMeters: number;
}

export interface SprayCalculationResult {
  hectaresPerTank: number;
  nozzleFlowRateLPerMin: number;
  totalFlowRateLPerMin: number;
  numberOfNozzles: number;
}

export interface NpkCalculationInput {
  crop: 'SOY' | 'CORN' | 'COFFEE' | 'COTTON' | 'WHEAT';
  targetYieldTonPerHa: number;
  soilP_mgDm3: number;
  soilK_cmolcDm3: number;
}

export interface NpkCalculationResult {
  nitrogenKgPerHa: number;
  phosphorusKgPerHa: number;
  potassiumKgPerHa: number;
  commercialFormulaSuggested: string;
  limingRecommendedTonHa: number;
}

export interface YieldEstimationInput {
  crop: 'CORN' | 'SOY';
  rowSpacingMeters: number;
  plantsPerLinearMeter: number;
  earsOrPodsPerPlant: number;
  grainsPerEarOrPod: number;
  thousandGrainWeightGrams: number;
}

export interface YieldEstimationResult {
  plantPopulationPerHa: number;
  estimatedKgPerHa: number;
  estimatedBagsPerHa: number;
  benchmarkRating: 'Baixa' | 'Média' | 'Alta' | 'Recorde';
}
