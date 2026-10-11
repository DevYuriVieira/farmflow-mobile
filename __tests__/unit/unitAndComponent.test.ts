import { formatDatePtBr, formatDateTimePtBr, formatTimePtBr, formatDashboardDate } from '../../src/utils/dates';
import { formatHectares, formatPercentage, cropTypeLabels, plantationStatusLabels, activityTypeLabels } from '../../src/utils/formatters';
import { getFriendlyErrorMessage } from '../../src/utils/errorMessages';
import { AppError } from '../../src/services/apiError';
import { getTranslation } from '../../src/i18n/translations';
import { getThemeColors } from '../../src/theme/colors';

describe('1. Testes de Unidade e Componente (Unit & Component Tests)', () => {
  describe('Formatadores e Utilitários de Data', () => {
    test('formatDatePtBr formata data ISO para padrão DD/MM/AAAA', () => {
      expect(formatDatePtBr('2026-10-15T10:00:00.000Z')).toMatch(/\d{2}\/\d{2}\/2026/);
      expect(formatDatePtBr(undefined)).toBe('-');
      expect(formatDatePtBr('data-invalida')).toBe('-');
    });

    test('formatTimePtBr extrai hora e minuto no padrão brasileiro', () => {
      const formatted = formatTimePtBr('2026-10-15T14:30:00.000Z');
      expect(formatted).toMatch(/\d{2}:\d{2}/);
      expect(formatTimePtBr(undefined)).toBe('-');
    });

    test('formatDateTimePtBr formata data e hora conjuntamente', () => {
      const formatted = formatDateTimePtBr('2026-10-15T14:30:00.000Z');
      expect(formatted).toContain('/2026');
      expect(formatted).toMatch(/\d{2}:\d{2}/);
    });

    test('formatDashboardDate gera string descritiva da data atual', () => {
      const dateStr = formatDashboardDate();
      expect(typeof dateStr).toBe('string');
      expect(dateStr.length).toBeGreaterThan(5);
    });
  });

  describe('Formatadores Agronômicos e Rótulos', () => {
    test('formatHectares adiciona sufixo ha e formata casas decimais', () => {
      expect(formatHectares(120.5)).toContain('120,5 ha');
      expect(formatHectares(1500)).toContain('1.500');
      expect(formatHectares(1500)).toContain('ha');
    });

    test('formatPercentage arredonda e formata percentual', () => {
      expect(formatPercentage(74.6)).toBe('75%');
      expect(formatPercentage(12.1)).toBe('12%');
    });

    test('cropTypeLabels mapeia enums para nomenclatura agronômica em português', () => {
      expect(cropTypeLabels.SOY).toBe('Soja');
      expect(cropTypeLabels.CORN).toBe('Milho');
      expect(cropTypeLabels.COFFEE).toBe('Café');
      expect(cropTypeLabels.COTTON).toBe('Algodão');
      expect(cropTypeLabels.SUGARCANE).toBe('Cana-de-Açúcar');
    });

    test('plantationStatusLabels mapeia status do ciclo fenológico', () => {
      expect(plantationStatusLabels.PLANNED).toBe('Planejado');
      expect(plantationStatusLabels.SOWING).toBe('Semeadura / Plantio');
      expect(plantationStatusLabels.GROWING).toBe('Em Desenvolvimento');
      expect(plantationStatusLabels.HARVEST_READY).toBe('Pronto p/ Colheita');
      expect(plantationStatusLabels.HARVESTED).toBe('Colhido');
    });

    test('activityTypeLabels possui traduções para todas as operações agrícolas', () => {
      expect(activityTypeLabels.IRRIGATION).toBe('Irrigação');
      expect(activityTypeLabels.FERTILIZATION).toBe('Adubação / Nutrição');
      expect(activityTypeLabels.PEST_CONTROL).toBe('Controle de Pragas');
    });
  });

  describe('Unidade de Tratamento de Erros de Domínio', () => {
    test('getFriendlyErrorMessage extrai mensagem amigável de AppError', () => {
      const appErr = new AppError('AUTH_FAILED', 'Credenciais inválidas no campo.', 401);
      expect(getFriendlyErrorMessage(appErr)).toBe('Credenciais inválidas no campo.');
    });

    test('getFriendlyErrorMessage trata Error nativo', () => {
      const stdErr = new Error('Falha de I/O no disco local');
      expect(getFriendlyErrorMessage(stdErr)).toBe('Falha de I/O no disco local');
    });

    test('getFriendlyErrorMessage retorna fallback padrão para erros desconhecidos', () => {
      expect(getFriendlyErrorMessage({ complex: 'object' })).toBe('Ocorreu um erro inesperado. Tente novamente.');
    });
  });

  describe('Unidade de Internacionalização (i18n)', () => {
    test('getTranslation retorna chaves corretas em Português e Inglês', () => {
      expect(getTranslation('weather', 'pt')).toBe('Clima');
      expect(getTranslation('weather', 'en')).toBe('Weather');
      expect(getTranslation('humidity', 'pt')).toBe('Umidade do Ar');
      expect(getTranslation('humidity', 'en')).toBe('Humidity');
      expect(getTranslation('temperature', 'pt')).toBe('Temperatura');
      expect(getTranslation('temperature', 'en')).toBe('Temperature');
    });
  });

  describe('Unidade de Design Tokens e Cores de Tema', () => {
    test('getThemeColors gera paleta correta para Light e Dark Mode', () => {
      const lightTheme = getThemeColors(false);
      const darkTheme = getThemeColors(true);

      expect(lightTheme.background).toBe('#F6F7F2');
      expect(lightTheme.textPrimary).toBe('#172B23');

      expect(darkTheme.background).toBe('#0B1410');
      expect(darkTheme.textPrimary).toBe('#FFFFFF');
    });
  });
});
