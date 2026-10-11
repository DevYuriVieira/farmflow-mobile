import {
  SprayCalculationInput,
  SprayCalculationResult,
  NpkCalculationInput,
  NpkCalculationResult,
  YieldEstimationInput,
  YieldEstimationResult,
} from './types';

/**
 * Cálculo de Pulverização Agrícola (Calda por Hectare e Vazão de Bicos)
 * Fórmula padrão da engenharia agronômica:
 * Vazão por bico (L/min) = (Q * V * e) / 600
 * Onde:
 * Q = Volume de aplicação (L/ha)
 * V = Velocidade de deslocamento (km/h)
 * e = Espaçamento entre bicos (m)
 */
export function calculateSpray(input: SprayCalculationInput): SprayCalculationResult {
  const {
    targetRateLPerHa,
    tankCapacityL,
    boomWidthMeters,
    tractorSpeedKmH,
    nozzleSpacingMeters,
  } = input;

  const validTarget = Math.max(1, targetRateLPerHa);
  const validSpeed = Math.max(0.1, tractorSpeedKmH);
  const validSpacing = Math.max(0.1, nozzleSpacingMeters);
  const validBoom = Math.max(validSpacing, boomWidthMeters);

  const hectaresPerTank = tankCapacityL / validTarget;
  const nozzleFlowRateLPerMin = (validTarget * validSpeed * validSpacing) / 600;
  const numberOfNozzles = Math.round(validBoom / validSpacing);
  const totalFlowRateLPerMin = nozzleFlowRateLPerMin * numberOfNozzles;

  return {
    hectaresPerTank: Number(hectaresPerTank.toFixed(2)),
    nozzleFlowRateLPerMin: Number(nozzleFlowRateLPerMin.toFixed(2)),
    totalFlowRateLPerMin: Number(totalFlowRateLPerMin.toFixed(1)),
    numberOfNozzles,
  };
}

/**
 * Cálculo de Adubação NPK e Correção Nutricional por Cultura
 */
export function calculateNpk(input: NpkCalculationInput): NpkCalculationResult {
  const { crop, targetYieldTonPerHa, soilP_mgDm3, soilK_cmolcDm3 } = input;
  const yieldTarget = Math.max(1, targetYieldTonPerHa);

  let n = 0;
  let p2o5 = 0;
  let k2o = 0;
  let formula = '04-14-08 (350 kg/ha)';
  let liming = 1.5;

  switch (crop) {
    case 'SOY': // Soja fixa N biologicamente (FBN), precisa pouco ou nenhum N mineral
      n = 0; // Fixação biológica
      p2o5 = soilP_mgDm3 < 15 ? yieldTarget * 22 : yieldTarget * 16;
      k2o = soilK_cmolcDm3 < 0.15 ? yieldTarget * 28 : yieldTarget * 20;
      formula = '00-20-20 (300 kg/ha)';
      liming = soilP_mgDm3 < 10 ? 2.0 : 1.0;
      break;

    case 'CORN': // Milho é altamente responsivo ao Nitrogênio
      n = yieldTarget * 20;
      p2o5 = soilP_mgDm3 < 15 ? yieldTarget * 14 : yieldTarget * 9;
      k2o = soilK_cmolcDm3 < 0.15 ? yieldTarget * 18 : yieldTarget * 12;
      formula = '08-28-16 (380 kg/ha) + Cobertura Ureia';
      liming = 2.2;
      break;

    case 'COFFEE': // Café perene
      n = yieldTarget * 45;
      p2o5 = soilP_mgDm3 < 12 ? yieldTarget * 18 : yieldTarget * 12;
      k2o = soilK_cmolcDm3 < 0.2 ? yieldTarget * 50 : yieldTarget * 35;
      formula = '20-00-20 fracionado em 3x';
      liming = 1.8;
      break;

    case 'COTTON': // Algodão
      n = yieldTarget * 32;
      p2o5 = soilP_mgDm3 < 15 ? yieldTarget * 20 : yieldTarget * 14;
      k2o = soilK_cmolcDm3 < 0.15 ? yieldTarget * 30 : yieldTarget * 22;
      formula = '06-24-12 (420 kg/ha)';
      liming = 2.5;
      break;

    case 'WHEAT': // Trigo
    default:
      n = yieldTarget * 25;
      p2o5 = soilP_mgDm3 < 15 ? yieldTarget * 18 : yieldTarget * 12;
      k2o = soilK_cmolcDm3 < 0.15 ? yieldTarget * 20 : yieldTarget * 15;
      formula = '05-25-15 (320 kg/ha)';
      liming = 1.6;
      break;
  }

  return {
    nitrogenKgPerHa: Math.round(n),
    phosphorusKgPerHa: Math.round(p2o5),
    potassiumKgPerHa: Math.round(k2o),
    commercialFormulaSuggested: formula,
    limingRecommendedTonHa: Number(liming.toFixed(1)),
  };
}

/**
 * Estimativa Pré-Colheita de Produtividade (Sacas/ha)
 * Fórmula padrão Embrapa / Pioneer:
 * População (pl/ha) = (10.000 / Espaçamento entre linhas) * Plantas por metro
 * Grãos por hectare = População * Espigas por planta * Grãos por espiga
 * Peso total (kg/ha) = (Grãos por hectare / 1000) * (PMG / 1000)
 * Sacas/ha = Peso total / 60
 */
export function estimateYield(input: YieldEstimationInput): YieldEstimationResult {
  const {
    crop,
    rowSpacingMeters,
    plantsPerLinearMeter,
    earsOrPodsPerPlant,
    grainsPerEarOrPod,
    thousandGrainWeightGrams,
  } = input;

  const validSpacing = Math.max(0.1, rowSpacingMeters);
  const validPlantsPerMeter = Math.max(0.5, plantsPerLinearMeter);
  const plantPopulationPerHa = Math.round((10000 / validSpacing) * validPlantsPerMeter);

  const grainsPerPlant = earsOrPodsPerPlant * grainsPerEarOrPod;
  const grainWeightPerPlantGrams = (grainsPerPlant * thousandGrainWeightGrams) / 1000;
  const estimatedKgPerHa = (plantPopulationPerHa * grainWeightPerPlantGrams) / 1000;
  const estimatedBagsPerHa = Number((estimatedKgPerHa / 60).toFixed(1));

  let benchmarkRating: 'Baixa' | 'Média' | 'Alta' | 'Recorde' = 'Média';
  if (crop === 'SOY') {
    if (estimatedBagsPerHa < 45) benchmarkRating = 'Baixa';
    else if (estimatedBagsPerHa < 65) benchmarkRating = 'Média';
    else if (estimatedBagsPerHa < 80) benchmarkRating = 'Alta';
    else benchmarkRating = 'Recorde';
  } else {
    // Milho
    if (estimatedBagsPerHa < 90) benchmarkRating = 'Baixa';
    else if (estimatedBagsPerHa < 140) benchmarkRating = 'Média';
    else if (estimatedBagsPerHa < 180) benchmarkRating = 'Alta';
    else benchmarkRating = 'Recorde';
  }

  return {
    plantPopulationPerHa,
    estimatedKgPerHa: Math.round(estimatedKgPerHa),
    estimatedBagsPerHa,
    benchmarkRating,
  };
}
