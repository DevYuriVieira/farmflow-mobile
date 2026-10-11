import { calculateCropFinances } from '../../src/features/finances/cropFinanceFormulas';
import { PEST_CATALOG } from '../../src/features/scouting/data/pestCatalog';
import { MockPlantationRepository } from '../../src/mocks/mockPlantation.repository';
import { MockActivityRepository } from '../../src/mocks/mockActivity.repository';

describe('6. Testes Funcionais (Functional Requirements Verification)', () => {
  describe('RF-01: Cálculo de Ponto de Equilíbrio (Break-Even) e Rentabilidade', () => {
    test('Calcula exatamente a quantidade de sacas necessárias para cobrir o custo operacional por hectare', () => {
      const finance = calculateCropFinances({
        crop: 'SOY',
        hectares: 100,
        expectedYieldBagsPerHa: 65,
        bagMarketPrice: 130,
        seedsCostPerHa: 400,
        fertilizersCostPerHa: 1000,
        chemicalsCostPerHa: 700,
        fuelAndMachineryCostPerHa: 300,
        laborAndOperationsCostPerHa: 200,
      });

      expect(finance.costPerHectare).toBe(2600);
      expect(finance.breakEvenBagsPerHa).toBe(20);
      expect(finance.netProfitPerHectare).toBe(5850);
    });
  });

  describe('RF-02: Catálogo Fitossanitário e Limiar de Dano Econômico', () => {
    test('Catálogo contém principais pragas agrícolas com limiar de dano econômico e manejo cadastrados', () => {
      expect(PEST_CATALOG.length).toBeGreaterThanOrEqual(4);

      const lagarta = PEST_CATALOG.find((p) => p.name.toLowerCase().includes('cartucho'));
      expect(lagarta).toBeDefined();
      expect(lagarta?.crop).toBe('CORN');
      expect(lagarta?.economicDamageThreshold).toBeDefined();

      const ferrugem = PEST_CATALOG.find((p) => p.name.toLowerCase().includes('ferrugem'));
      expect(ferrugem).toBeDefined();
      expect(ferrugem?.type).toBe('DISEASE');
    });
  });

  describe('RF-03: Filtragem de Talhões por Cultura e Status Fenológico', () => {
    test('Repositório filtra talhões conforme critérios informados', async () => {
      const repo = new MockPlantationRepository();
      const allPlantations = await repo.getPlantations();
      expect(allPlantations.length).toBeGreaterThan(0);

      const soyOnly = await repo.getPlantations({ cropType: 'SOY' });
      expect(soyOnly.every((p) => p.cropType === 'SOY')).toBe(true);
    });
  });

  describe('RF-04: Transição de Status Operacional de Atividade', () => {
    test('Permite alternar atividade entre pendente e concluída com persistência de estado', async () => {
      const repo = new MockActivityRepository();
      const activities = await repo.getActivities();
      const target = activities[0];

      const initialStatus = target.completed;
      const updated = await repo.toggleActivityComplete(target.id, !initialStatus);
      expect(updated.completed).toBe(!initialStatus);

      const reverted = await repo.toggleActivityComplete(target.id, initialStatus);
      expect(reverted.completed).toBe(initialStatus);
    });
  });
});
