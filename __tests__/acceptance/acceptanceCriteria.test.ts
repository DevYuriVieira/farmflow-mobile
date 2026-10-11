import { calculateDriftRisk, calculateTotalSprayVolumeLiters } from '../../src/features/spraying/sprayFormulas';
import { estimateYield } from '../../src/features/calculators/agronomyFormulas';

describe('4. Testes de Aceitação (User Acceptance & BDD Criteria Tests)', () => {
  describe('Cenário de Aceitação 1: Janela Segura de Pulverização e Risco Biológico de Deriva', () => {
    test('Dado temperatura de 24°C, umidade de 65% e vento de 6 km/h, Quando calculo o risco de deriva, Então o resultado deve ser "LOW"', () => {
      const risk = calculateDriftRisk(6, 65, 24);
      expect(risk).toBe('LOW');
    });

    test('Dado temperatura de 32°C e umidade de 40%, Quando avalio as condições, Então o risco de deriva deve ser classificado como "HIGH"', () => {
      const risk = calculateDriftRisk(8, 40, 32);
      expect(risk).toBe('HIGH');
    });

    test('Dado taxa de aplicação de 120 L/ha sobre 150 hectares, Então o volume total de calda deve totalizar exatamente 18.000 Litros', () => {
      const totalVolume = calculateTotalSprayVolumeLiters(120, 150);
      expect(totalVolume).toBe(18000);
    });
  });

  describe('Cenário de Aceitação 2: Estimativa de População e Produtividade Esperada', () => {
    test('Dado espaçamento de 0.50m e 3.0 plantas por metro linear, Então a densidade populacional deve resultar em exatamente 60.000 plantas/ha', () => {
      const yieldEstimate = estimateYield({
        crop: 'CORN',
        rowSpacingMeters: 0.5,
        plantsPerLinearMeter: 3.0,
        earsOrPodsPerPlant: 1,
        grainsPerEarOrPod: 500,
        thousandGrainWeightGrams: 300,
      });

      expect(yieldEstimate.plantPopulationPerHa).toBe(60000);
      expect(yieldEstimate.estimatedKgPerHa).toBeGreaterThan(0);
      expect(yieldEstimate.estimatedBagsPerHa).toBe(Number((yieldEstimate.estimatedKgPerHa / 60).toFixed(1)));
    });
  });
});
