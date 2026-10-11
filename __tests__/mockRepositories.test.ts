import { MockAuthRepository } from '../src/mocks/mockAuth.repository';
import { MockFarmRepository } from '../src/mocks/mockFarm.repository';
import { MockPlantationRepository } from '../src/mocks/mockPlantation.repository';
import { MockActivityRepository } from '../src/mocks/mockActivity.repository';
import { mockDb } from '../src/mocks/database';
import { AppError } from '../src/services/apiError';

// Mock AsyncStorage for Jest node environment
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

describe('Mock Repositories & CRUD Tests', () => {
  beforeEach(async () => {
    await mockDb.resetToDefaults();
  });

  describe('MockAuthRepository', () => {
    const authRepo = new MockAuthRepository();

    it('should authenticate demo user successfully', async () => {
      const session = await authRepo.login({
        email: 'demo@farmflow.ag',
        password: '123456',
      });
      expect(session.user).toBeDefined();
      expect(session.user.email).toBe('demo@farmflow.ag');
      expect(session.token).toContain('mock-jwt-token');
    });

    it('should reject invalid password for demo user', async () => {
      await expect(
        authRepo.login({
          email: 'demo@farmflow.ag',
          password: 'wrongpassword',
        })
      ).rejects.toThrow(AppError);
    });

    it('should register a new user', async () => {
      const session = await authRepo.register({
        name: 'Novo Produtor',
        email: 'novo@fazenda.com.br',
        password: 'password123',
        confirmPassword: 'password123',
      });
      expect(session.user.name).toBe('Novo Produtor');
      expect(session.user.email).toBe('novo@fazenda.com.br');
    });
  });

  describe('MockFarmRepository', () => {
    const farmRepo = new MockFarmRepository();

    it('should list all initial seed farms', async () => {
      const list = await farmRepo.getFarms();
      expect(list.length).toBeGreaterThanOrEqual(3);
      expect(list.some((f) => f.name === 'Fazenda Santa Fé')).toBe(true);
    });

    it('should create and retrieve a new farm', async () => {
      const created = await farmRepo.createFarm({
        name: 'Fazenda Estrela Guia',
        location: 'Patos de Minas, MG',
        coordinates: { latitude: -18.5789, longitude: -46.5181 },
        totalAreaHectares: 500,
      });

      expect(created.id).toBeDefined();
      expect(created.name).toBe('Fazenda Estrela Guia');

      const found = await farmRepo.getFarmById(created.id);
      expect(found.totalAreaHectares).toBe(500);
    });

    it('should throw NOT_FOUND for non-existent farm ID', async () => {
      await expect(farmRepo.getFarmById('non-existent-id')).rejects.toThrow(AppError);
    });

    it('should delete an existing farm', async () => {
      const list = await farmRepo.getFarms();
      const farmToDelete = list[0];
      await farmRepo.deleteFarm(farmToDelete.id);

      await expect(farmRepo.getFarmById(farmToDelete.id)).rejects.toThrow(AppError);
    });
  });

  describe('MockPlantationRepository', () => {
    const plantationRepo = new MockPlantationRepository();

    it('should list plantations and filter by status', async () => {
      const all = await plantationRepo.getPlantations();
      expect(all.length).toBeGreaterThanOrEqual(3);

      const ready = await plantationRepo.getPlantations({ status: 'HARVEST_READY' });
      expect(ready.every((p) => p.status === 'HARVEST_READY')).toBe(true);
    });

    it('should create a plantation linked to a valid farm', async () => {
      const created = await plantationRepo.createPlantation({
        farmId: 'farm-001',
        name: 'Talhão Teste - Feijão Carioca',
        cropType: 'OTHER',
        areaHectares: 35,
        status: 'PLANNED',
        plantedAt: '2026-11-01',
        expectedHarvestAt: '2027-02-10',
      });

      expect(created.id).toBeDefined();
      expect(created.name).toBe('Talhão Teste - Feijão Carioca');
    });

    it('should reject plantation creation with invalid farmId', async () => {
      await expect(
        plantationRepo.createPlantation({
          farmId: 'invalid-farm-id',
          name: 'Talhão Inválido',
          cropType: 'SOY',
          areaHectares: 10,
          status: 'PLANNED',
          plantedAt: '2026-11-01',
          expectedHarvestAt: '2027-02-10',
        })
      ).rejects.toThrow();
    });
  });

  describe('MockActivityRepository', () => {
    const activityRepo = new MockActivityRepository();

    it('should list activities and toggle complete status', async () => {
      const activities = await activityRepo.getActivities();
      const first = activities[0];

      const toggled = await activityRepo.toggleActivityComplete(first.id, !first.completed);
      expect(toggled.completed).toBe(!first.completed);
    });

    it('should create and delete an activity', async () => {
      const created = await activityRepo.createActivity({
        farmId: 'farm-001',
        title: 'Verificação de pragas',
        description: 'Vistoria no talhão 01',
        type: 'PEST_CONTROL',
        scheduledAt: '2026-10-15T09:00:00Z',
      });

      expect(created.id).toBeDefined();
      await activityRepo.deleteActivity(created.id);
      await expect(activityRepo.getActivityById(created.id)).rejects.toThrow(AppError);
    });
  });
});
