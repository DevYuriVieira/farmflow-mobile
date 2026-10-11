import { calculateSpray, calculateNpk, estimateYield } from '../src/features/calculators/agronomyFormulas';

describe('Agronomy Formulas', () => {
  test('calculateSpray calculates nozzle flow and tank coverage accurately', () => {
    const result = calculateSpray({
      targetRateLPerHa: 150,
      tankCapacityL: 2000,
      boomWidthMeters: 24,
      tractorSpeedKmH: 18,
      nozzleSpacingMeters: 0.5,
    });

    // 2000 L / 150 L/ha = 13.33 ha
    expect(result.hectaresPerTank).toBe(13.33);
    // (150 * 18 * 0.5) / 600 = 1350 / 600 = 2.25 L/min
    expect(result.nozzleFlowRateLPerMin).toBe(2.25);
    // 24 / 0.5 = 48 nozzles
    expect(result.numberOfNozzles).toBe(48);
    // 2.25 * 48 = 108 L/min
    expect(result.totalFlowRateLPerMin).toBe(108);
  });

  test('calculateNpk calculates crop nutritional needs', () => {
    const soyResult = calculateNpk({
      crop: 'SOY',
      targetYieldTonPerHa: 4,
      soilP_mgDm3: 8,
      soilK_cmolcDm3: 0.1,
    });

    expect(soyResult.nitrogenKgPerHa).toBe(0); // Biological fixation
    expect(soyResult.phosphorusKgPerHa).toBeGreaterThan(0);
    expect(soyResult.potassiumKgPerHa).toBeGreaterThan(0);
    expect(soyResult.commercialFormulaSuggested).toContain('00-20-20');

    const cornResult = calculateNpk({
      crop: 'CORN',
      targetYieldTonPerHa: 10,
      soilP_mgDm3: 20,
      soilK_cmolcDm3: 0.2,
    });

    expect(cornResult.nitrogenKgPerHa).toBe(200);
    expect(cornResult.commercialFormulaSuggested).toContain('08-28-16');
  });

  test('estimateYield estimates plants per ha and bags per ha', () => {
    const cornYield = estimateYield({
      crop: 'CORN',
      rowSpacingMeters: 0.5,
      plantsPerLinearMeter: 3.5,
      earsOrPodsPerPlant: 1,
      grainsPerEarOrPod: 550,
      thousandGrainWeightGrams: 320,
    });

    // 10000 / 0.5 * 3.5 = 70,000 plants/ha
    expect(cornYield.plantPopulationPerHa).toBe(70000);
    expect(cornYield.estimatedBagsPerHa).toBeGreaterThan(100);
    expect(['Baixa', 'Média', 'Alta', 'Recorde']).toContain(cornYield.benchmarkRating);
  });
});
