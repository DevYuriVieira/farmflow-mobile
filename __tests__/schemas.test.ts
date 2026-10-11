import { loginSchema, registerSchema } from '../src/features/auth/schemas/auth.schemas';
import { farmSchema } from '../src/features/farms/schemas/farm.schemas';
import { plantationSchema } from '../src/features/plantations/schemas/plantation.schemas';
import { activitySchema } from '../src/features/activities/schemas/activity.schemas';

describe('Zod Schemas Validation Tests', () => {
  describe('loginSchema', () => {
    it('should validate valid login credentials', () => {
      const valid = { email: 'demo@farmflow.ag', password: 'password123' };
      const result = loginSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalid = { email: 'not-an-email', password: 'password123' };
      const result = loginSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('e-mail válido');
      }
    });

    it('should reject short passwords', () => {
      const invalid = { email: 'demo@farmflow.ag', password: '123' };
      const result = loginSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('6 caracteres');
      }
    });
  });

  describe('registerSchema', () => {
    it('should validate matching password confirmation', () => {
      const valid = {
        name: 'Carlos Produtor',
        email: 'carlos@agro.com',
        password: 'secret123',
        confirmPassword: 'secret123',
      };
      const result = registerSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject mismatched passwords', () => {
      const invalid = {
        name: 'Carlos Produtor',
        email: 'carlos@agro.com',
        password: 'secret123',
        confirmPassword: 'differentPassword',
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('não coincidem');
      }
    });
  });

  describe('farmSchema', () => {
    it('should validate complete farm input', () => {
      const valid = {
        name: 'Fazenda Santa Fé',
        location: 'Ribeirão Preto, SP',
        totalAreaHectares: 450,
        latitude: -21.1767,
        longitude: -47.8208,
      };
      const result = farmSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject non-positive totalAreaHectares', () => {
      const invalid = {
        name: 'Fazenda Santa Fé',
        location: 'Ribeirão Preto, SP',
        totalAreaHectares: -10,
        latitude: -21.1767,
        longitude: -47.8208,
      };
      const result = farmSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('maior que zero');
      }
    });
  });

  describe('plantationSchema', () => {
    it('should validate valid plantation input', () => {
      const valid = {
        farmId: 'farm-001',
        name: 'Talhão 01 - Soja RR',
        cropType: 'SOY',
        areaHectares: 120,
        status: 'GROWING',
        plantedAt: '2026-09-15',
        expectedHarvestAt: '2027-02-15',
      };
      const result = plantationSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject expected harvest date earlier than planting date', () => {
      const invalid = {
        farmId: 'farm-001',
        name: 'Talhão 01 - Soja RR',
        cropType: 'SOY',
        areaHectares: 120,
        status: 'GROWING',
        plantedAt: '2026-09-15',
        expectedHarvestAt: '2026-08-10',
      };
      const result = plantationSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('não pode ser anterior ao plantio');
      }
    });
  });

  describe('activitySchema', () => {
    it('should validate agricultural activity input', () => {
      const valid = {
        farmId: 'farm-001',
        title: 'Irrigação matinal',
        description: 'Aplicar lâmina de 8mm no setor norte',
        type: 'IRRIGATION',
        scheduledAt: '2026-10-10T08:00:00Z',
      };
      const result = activitySchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject missing required title or description', () => {
      const invalid = {
        farmId: 'farm-001',
        title: '',
        description: 'ab',
        type: 'IRRIGATION',
        scheduledAt: '2026-10-10T08:00:00Z',
      };
      const result = activitySchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
