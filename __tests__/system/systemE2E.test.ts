import { MockAuthRepository } from '../../src/mocks/mockAuth.repository';
import { MockFarmRepository } from '../../src/mocks/mockFarm.repository';
import { MockPlantationRepository } from '../../src/mocks/mockPlantation.repository';
import { MockActivityRepository } from '../../src/mocks/mockActivity.repository';
import { calculateSpray } from '../../src/features/calculators/agronomyFormulas';
import { calculateCropFinances } from '../../src/features/finances/cropFinanceFormulas';

describe('3. Testes de Sistema (System & End-to-End Flow Tests)', () => {
  test('Fluxo Completo de Manejo de Safra Agrícola: Autenticação -> Propriedade -> Talhão -> Manejo -> Finanças', async () => {
    // Step 1: Authentication
    const authRepo = new MockAuthRepository();
    const session = await authRepo.login({
      email: 'produtor@farmflow.com',
      password: 'password123',
    });
    expect(session.user.id).toBeDefined();

    // Step 2: Farm registration
    const farmRepo = new MockFarmRepository();
    const farm = await farmRepo.createFarm({
      name: 'Fazenda Terra Fértil E2E',
      location: 'Sorriso - MT',
      totalAreaHectares: 1200,
      coordinates: { latitude: -12.54, longitude: -55.72 },
    });
    expect(farm.id).toBeDefined();

    // Step 3: Production fields setup
    const plantationRepo = new MockPlantationRepository();
    const soyPlantation = await plantationRepo.createPlantation({
      farmId: farm.id,
      name: 'Talhão 05 - Soja Intacta',
      cropType: 'SOY',
      areaHectares: 400,
      status: 'SOWING',
      plantedAt: '2026-10-10T00:00:00.000Z',
      expectedHarvestAt: '2027-02-28T00:00:00.000Z',
    });
    expect(soyPlantation.areaHectares).toBe(400);

    // Step 4: Spraying operation sizing
    const sprayCalc = calculateSpray({
      targetRateLPerHa: 120,
      tankCapacityL: 4000,
      boomWidthMeters: 36,
      tractorSpeedKmH: 20,
      nozzleSpacingMeters: 0.5,
    });
    expect(sprayCalc.hectaresPerTank).toBe(33.33);

    // Step 5: Field activity scheduling and completion
    const activityRepo = new MockActivityRepository();
    const sprayActivity = await activityRepo.createActivity({
      farmId: farm.id,
      plantationId: soyPlantation.id,
      title: 'Aplicação de Inseticida Talhão 05',
      description: 'Controle de lagartas com calda de 120 L/ha',
      type: 'PEST_CONTROL',
      scheduledAt: '2026-10-20T07:00:00.000Z',
    });
    expect(sprayActivity.completed).toBe(false);

    const completedActivity = await activityRepo.toggleActivityComplete(sprayActivity.id, true);
    expect(completedActivity.completed).toBe(true);

    // Step 6: Harvest transition
    const harvestedPlantation = await plantationRepo.updatePlantation({
      id: soyPlantation.id,
      status: 'HARVESTED',
    });
    expect(harvestedPlantation.status).toBe('HARVESTED');

    // Step 7: Crop financial closing
    const finance = calculateCropFinances({
      crop: 'SOY',
      hectares: 400,
      expectedYieldBagsPerHa: 72,
      bagMarketPrice: 135,
      seedsCostPerHa: 450,
      fertilizersCostPerHa: 1200,
      chemicalsCostPerHa: 850,
      fuelAndMachineryCostPerHa: 500,
      laborAndOperationsCostPerHa: 300,
    });

    expect(finance.totalGrossRevenue).toBe(3888000);
    expect(finance.costPerHectare).toBe(3300);
    expect(finance.totalNetProfit).toBe(2568000);
    expect(finance.breakEvenBagsPerHa).toBe(24.4);
    expect(finance.roiPercent).toBeGreaterThan(150);
  });
});
