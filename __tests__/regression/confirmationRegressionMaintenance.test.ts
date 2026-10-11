import { calculateSpray, calculateNpk } from '../../src/features/calculators/agronomyFormulas';
import { farmSchema } from '../../src/features/farms/schemas/farm.schemas';
import { activitySchema } from '../../src/features/activities/schemas/activity.schemas';

describe('5. Testes de Confirmação, Regressão e Manutenção (Confirmation, Regression & Maintenance)', () => {
  describe('Testes de Confirmação (Reteste de Casos Críticos)', () => {
    test('BUG-FIX #01: Evitar divisão por zero e geração de NaN quando velocidade ou espaçamento for zero', () => {
      const result = calculateSpray({
        targetRateLPerHa: 0,
        tankCapacityL: 2000,
        boomWidthMeters: 0,
        tractorSpeedKmH: 0,
        nozzleSpacingMeters: 0,
      });

      expect(Number.isNaN(result.hectaresPerTank)).toBe(false);
      expect(Number.isNaN(result.nozzleFlowRateLPerMin)).toBe(false);
      expect(Number.isFinite(result.hectaresPerTank)).toBe(true);
      expect(Number.isFinite(result.nozzleFlowRateLPerMin)).toBe(true);
      expect(result.numberOfNozzles).toBeGreaterThanOrEqual(1);
    });

    test('BUG-FIX #02: Regra agronômica da soja nunca deve recomendar N mineral devido à simbiose com Bradyrhizobium', () => {
      const soyNpk = calculateNpk({
        crop: 'SOY',
        targetYieldTonPerHa: 6,
        soilP_mgDm3: 5,
        soilK_cmolcDm3: 0.05,
      });

      expect(soyNpk.nitrogenKgPerHa).toBe(0);
      expect(soyNpk.commercialFormulaSuggested).toBe('00-20-20 (300 kg/ha)');
    });
  });

  describe('Testes de Regressão (Não-degradação de Contratos de Entrada)', () => {
    test('Schema de Fazenda valida coordenadas negativas válidas da América do Sul', () => {
      const validPayload = {
        name: 'Fazenda Planalto Central',
        location: 'Brasília - DF',
        totalAreaHectares: 500,
        latitude: -15.7942,
        longitude: -47.8822,
      };

      const parsed = farmSchema.safeParse(validPayload);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.latitude).toBe(-15.7942);
        expect(parsed.data.longitude).toBe(-47.8822);
      }
    });

    test('Schema de Atividade mantém obrigatoriedade de campos essenciais após refatorações', () => {
      const invalidPayload = {
        farmId: '',
        title: '',
        description: '',
        type: 'INVALID_TYPE',
        scheduledAt: 'data-invalida',
      };

      const result = activitySchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe('Testes de Manutenção (Estabilidade de Tipos e Constantes)', () => {
    test('Garantir que a taxa mínima de calagem seja mantida dentro dos limites de segurança agronômica', () => {
      const npkLowSoil = calculateNpk({
        crop: 'CORN',
        targetYieldTonPerHa: 12,
        soilP_mgDm3: 3,
        soilK_cmolcDm3: 0.05,
      });

      expect(npkLowSoil.limingRecommendedTonHa).toBeGreaterThan(0);
      expect(npkLowSoil.limingRecommendedTonHa).toBeLessThanOrEqual(5.0);
    });
  });
});
