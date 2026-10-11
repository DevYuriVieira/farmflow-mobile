import { formatDatePtBr, formatDateTimePtBr, formatTimePtBr } from '../src/utils/dates';
import { formatHectares, cropTypeLabels, plantationStatusLabels } from '../src/utils/formatters';
import { normalizeError, AppError } from '../src/services/apiError';

describe('Utility & Integration Tests', () => {
  describe('Date Formatters', () => {
    it('should format ISO date string to pt-BR date format', () => {
      const result = formatDatePtBr('2026-10-10T08:00:00Z');
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('should format ISO date string to pt-BR time format', () => {
      const result = formatTimePtBr('2026-10-10T08:30:00Z');
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it('should return fallback dash for invalid or empty dates', () => {
      expect(formatDatePtBr('')).toBe('-');
      expect(formatDateTimePtBr(undefined)).toBe('-');
      expect(formatDatePtBr('invalid-date')).toBe('-');
    });
  });

  describe('Agricultural Formatters', () => {
    it('should format hectares with unit suffix', () => {
      expect(formatHectares(120)).toContain('120');
      expect(formatHectares(120)).toContain('ha');
    });

    it('should provide localized labels for crops and statuses', () => {
      expect(cropTypeLabels.SOY).toBe('Soja');
      expect(cropTypeLabels.CORN).toBe('Milho');
      expect(cropTypeLabels.COFFEE).toBe('Café');
      expect(cropTypeLabels.APPLE).toBe('Maçã');

      expect(plantationStatusLabels.GROWING).toBe('Em Desenvolvimento');
      expect(plantationStatusLabels.HARVEST_READY).toBe('Pronto p/ Colheita');
    });
  });

  describe('Error Normalization', () => {
    it('should preserve existing AppError', () => {
      const original = new AppError('CUSTOM_CODE', 'Mensagem customizada', 400);
      const normalized = normalizeError(original);
      expect(normalized).toBe(original);
      expect(normalized.code).toBe('CUSTOM_CODE');
      expect(normalized.userMessage).toBe('Mensagem customizada');
    });

    it('should normalize standard JS Error', () => {
      const err = new Error('Falha no disco');
      const normalized = normalizeError(err);
      expect(normalized.code).toBe('GENERIC_ERROR');
      expect(normalized.userMessage).toBe('Falha no disco');
    });

    it('should normalize unknown non-Error objects', () => {
      const normalized = normalizeError('string error');
      expect(normalized.code).toBe('UNKNOWN_ERROR');
      expect(normalized.userMessage).toContain('erro inesperado');
    });
  });
});
