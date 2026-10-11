jest.mock('react-native', () => ({
  Platform: { OS: 'web' },
}));

jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map<string, string>();
  return {
    getItem: jest.fn(async (key: string) => store.get(key) || null),
    setItem: jest.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: jest.fn(async (key: string) => {
      store.delete(key);
    }),
    clear: jest.fn(async () => {
      store.clear();
    }),
  };
});

jest.mock('expo-secure-store', () => {
  const store = new Map<string, string>();
  return {
    getItemAsync: jest.fn(async (key: string) => store.get(key) || null),
    setItemAsync: jest.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key: string) => {
      store.delete(key);
    }),
  };
});

import { MockFarmRepository } from '../../src/mocks/mockFarm.repository';
import { MockPlantationRepository } from '../../src/mocks/mockPlantation.repository';
import { MockActivityRepository } from '../../src/mocks/mockActivity.repository';
import { MockAuthRepository } from '../../src/mocks/mockAuth.repository';
import { calculateSpray } from '../../src/features/calculators/agronomyFormulas';
import { calculateDriftRisk, calculateTotalSprayVolumeLiters } from '../../src/features/spraying/sprayFormulas';
import { sessionStorage } from '../../src/storage/session.storage';

describe('2. Testes de Integração (Integration Tests)', () => {
  let farmRepo: MockFarmRepository;
  let plantationRepo: MockPlantationRepository;
  let activityRepo: MockActivityRepository;
  let authRepo: MockAuthRepository;

  beforeEach(() => {
    farmRepo = new MockFarmRepository();
    plantationRepo = new MockPlantationRepository();
    activityRepo = new MockActivityRepository();
    authRepo = new MockAuthRepository();
  });

  describe('Integração: Fazendas -> Talhões -> Atividades', () => {
    test('criação de fazenda permite vincular talhões e associar atividades agrícolas', async () => {
      const newFarm = await farmRepo.createFarm({
        name: 'Fazenda Santa Maria — Integração',
        location: 'Rio Verde - GO',
        totalAreaHectares: 850,
        coordinates: { latitude: -17.79, longitude: -50.92 },
      });
      expect(newFarm.id).toBeDefined();

      const newPlantation = await plantationRepo.createPlantation({
        farmId: newFarm.id,
        name: 'Talhão 01 - Soja Safra',
        cropType: 'SOY',
        areaHectares: 250,
        status: 'GROWING',
        plantedAt: '2026-10-01T00:00:00.000Z',
        expectedHarvestAt: '2027-02-15T00:00:00.000Z',
        notes: 'Semeadura com inoculação turfosa',
      });
      expect(newPlantation.farmId).toBe(newFarm.id);

      const activity = await activityRepo.createActivity({
        farmId: newFarm.id,
        plantationId: newPlantation.id,
        title: 'Aplicação de Fungicida',
        description: 'Preventivo ferrugem asiática',
        type: 'PEST_CONTROL',
        scheduledAt: '2026-11-10T08:00:00.000Z',
      });
      expect(activity.plantationId).toBe(newPlantation.id);

      const activitiesForFarm = await activityRepo.getActivities({ farmId: newFarm.id });
      expect(activitiesForFarm.length).toBeGreaterThanOrEqual(1);
      expect(activitiesForFarm.find((a) => a.id === activity.id)).toBeDefined();
    });
  });

  describe('Integração: Autenticação -> Sessão Persistida', () => {
    test('login bem-sucedido gera token válido persistível na camada de armazenamento', async () => {
      const session = await authRepo.login({
        email: 'produtor@farmflow.com',
        password: 'password123',
      });

      expect(session.token).toBeDefined();
      expect(session.user.email).toBe('produtor@farmflow.com');

      await sessionStorage.setToken(session.token);
      await sessionStorage.setUserJson(JSON.stringify(session.user));

      const storedToken = await sessionStorage.getToken();
      const storedUserJson = await sessionStorage.getUserJson();

      expect(storedToken).toBe(session.token);
      expect(storedUserJson).toContain('produtor@farmflow.com');

      await sessionStorage.clear();
      expect(await sessionStorage.getToken()).toBeNull();
    });
  });

  describe('Integração: Cálculo Agronômico com Análise Meteorológica de Pulverização', () => {
    test('calcula volume de calda e valida concomitantemente viabilidade climática da aplicação', () => {
      const sprayParams = {
        targetRateLPerHa: 100,
        tankCapacityL: 3000,
        boomWidthMeters: 30,
        tractorSpeedKmH: 15,
        nozzleSpacingMeters: 0.5,
      };

      const sprayPlan = calculateSpray(sprayParams);
      expect(sprayPlan.hectaresPerTank).toBe(30);

      const totalLiters = calculateTotalSprayVolumeLiters(sprayParams.targetRateLPerHa, 250);
      expect(totalLiters).toBe(25000);

      const idealDrift = calculateDriftRisk(6, 65, 24);
      expect(idealDrift).toBe('LOW');

      const highDrift = calculateDriftRisk(14, 40, 32);
      expect(highDrift).toBe('HIGH');
    });
  });
});
