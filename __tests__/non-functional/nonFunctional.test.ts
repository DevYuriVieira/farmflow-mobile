import { calculateSpray } from '../../src/features/calculators/agronomyFormulas';
import { calculateCropFinances } from '../../src/features/finances/cropFinanceFormulas';
import { getThemeColors } from '../../src/theme/colors';

describe('7. Testes Não-Funcionais (Performance, Accessibility & Reliability Tests)', () => {
  describe('Desempenho e Eficiência Computacional (Performance Benchmark)', () => {
    test('5.000 cálculos de dimensionamento de calda executam em menos de 500ms', () => {
      const startTime = performance.now();

      for (let i = 0; i < 5000; i++) {
        calculateSpray({
          targetRateLPerHa: 100 + (i % 50),
          tankCapacityL: 3000,
          boomWidthMeters: 24,
          tractorSpeedKmH: 14 + (i % 10),
          nozzleSpacingMeters: 0.5,
        });
      }

      const elapsed = performance.now() - startTime;
      expect(elapsed).toBeLessThan(500);
    });

    test('2.000 análises financeiras executam em menos de 300ms', () => {
      const startTime = performance.now();

      for (let i = 0; i < 2000; i++) {
        calculateCropFinances({
          crop: 'SOY',
          hectares: 150,
          expectedYieldBagsPerHa: 68,
          bagMarketPrice: 132,
          seedsCostPerHa: 420,
          fertilizersCostPerHa: 1100,
          chemicalsCostPerHa: 800,
          fuelAndMachineryCostPerHa: 550,
          laborAndOperationsCostPerHa: 150,
        });
      }

      const elapsed = performance.now() - startTime;
      expect(elapsed).toBeLessThan(300);
    });
  });

  describe('Acessibilidade e Conformidade de Tokens de Cores', () => {
    test('Paleta do Dark Mode possui alto contraste com texto primário #FFFFFF sobre fundo escuro', () => {
      const darkTheme = getThemeColors(true);
      expect(darkTheme.textPrimary).toBe('#FFFFFF');
      expect(darkTheme.background).toBe('#0B1410');
      expect(darkTheme.surfaceCard).toBeDefined();
    });

    test('Paleta do Light Mode mantém legibilidade com texto #172B23', () => {
      const lightTheme = getThemeColors(false);
      expect(lightTheme.textPrimary).toBe('#172B23');
      expect(lightTheme.background).toBe('#F6F7F2');
    });
  });

  describe('Robustez e Imutabilidade', () => {
    test('Cálculo financeiro não sofre mutação lateral ao reutilizar objeto de entrada', () => {
      const input = {
        crop: 'CORN' as const,
        hectares: 200,
        expectedYieldBagsPerHa: 120,
        bagMarketPrice: 65,
        seedsCostPerHa: 500,
        fertilizersCostPerHa: 1300,
        chemicalsCostPerHa: 600,
        fuelAndMachineryCostPerHa: 700,
        laborAndOperationsCostPerHa: 200,
      };

      const originalArea = input.hectares;
      const res1 = calculateCropFinances(input);
      const res2 = calculateCropFinances(input);

      expect(input.hectares).toBe(originalArea);
      expect(res1.totalNetProfit).toBe(res2.totalNetProfit);
    });
  });
});
