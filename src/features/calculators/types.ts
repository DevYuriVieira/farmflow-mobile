export interface SprayCalculationInput {
  targetRateLPerHa: number;     // Taxa desejada (ex: 150 L/ha)
  tankCapacityL: number;        // Tanque do pulverizador (ex: 2000 L)
  boomWidthMeters: number;      // Largura da barra (ex: 24 m)
  tractorSpeedKmH: number;      // Velocidade do trator (ex: 18 km/h)
  nozzleSpacingMeters: number;  // Espaçamento entre bicos (ex: 0.5 m)
}

export interface SprayCalculationResult {
  hectaresPerTank: number;      // Área coberta por tanque (ha)
  nozzleFlowRateLPerMin: number; // Vazão necessária por bico (L/min)
  totalFlowRateLPerMin: number;  // Vazão total da barra (L/min)
  numberOfNozzles: number;      // Quantidade total de bicos
}

export interface NpkCalculationInput {
  crop: 'SOY' | 'CORN' | 'COFFEE' | 'COTTON' | 'WHEAT';
  targetYieldTonPerHa: number;  // Meta de produtividade (ton/ha)
  soilP_mgDm3: number;          // Fósforo no solo (mg/dm³)
  soilK_cmolcDm3: number;       // Potássio no solo (cmolc/dm³)
}

export interface NpkCalculationResult {
  nitrogenKgPerHa: number;      // Recomendação de N (kg/ha)
  phosphorusKgPerHa: number;    // Recomendação de P2O5 (kg/ha)
  potassiumKgPerHa: number;     // Recomendação de K2O (kg/ha)
  commercialFormulaSuggested: string; // Ex: "04-14-08 (400 kg/ha)"
  limingRecommendedTonHa: number;     // Sugestão de calagem estimada (t/ha)
}

export interface YieldEstimationInput {
  crop: 'CORN' | 'SOY';
  rowSpacingMeters: number;      // Espaçamento entre linhas (ex: 0.5 m)
  plantsPerLinearMeter: number;  // Plantas por metro linear (ex: 6 plantas)
  earsOrPodsPerPlant: number;    // Espigas ou vagens por planta (ex: 1 espiga ou 35 vagens)
  grainsPerEarOrPod: number;     // Grãos por espiga ou grãos por vagem (ex: 550 grãos ou 2.5)
  thousandGrainWeightGrams: number; // Peso de mil grãos em gramas (ex: 320g milho, 160g soja)
}

export interface YieldEstimationResult {
  plantPopulationPerHa: number;  // População total de plantas/ha
  estimatedKgPerHa: number;      // Produção estimada (kg/ha)
  estimatedBagsPerHa: number;    // Sacas de 60kg por hectare
  benchmarkRating: 'Baixa' | 'Média' | 'Alta' | 'Recorde';
}
