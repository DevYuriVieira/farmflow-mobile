import axios from 'axios';
import { calculateNpk } from '../../src/features/calculators/agronomyFormulas';
import { normalizeError, AppError } from '../../src/services/apiError';

describe('9. Testes Caixa Branca (White Box: Structural, Branch & Statement Coverage)', () => {
  describe('Cobertura Estrutural de Ramos (Branch Coverage) - calculateNpk Switch-Case', () => {
    test('Caminho 1: Ramo Cultura da Soja (SOY)', () => {
      const result = calculateNpk({ crop: 'SOY', targetYieldTonPerHa: 4, soilP_mgDm3: 8, soilK_cmolcDm3: 0.1 });
      expect(result.nitrogenKgPerHa).toBe(0);
      expect(result.commercialFormulaSuggested).toBe('00-20-20 (300 kg/ha)');
      expect(result.limingRecommendedTonHa).toBe(2.0);
    });

    test('Caminho 2: Ramo Cultura do Milho (CORN)', () => {
      const result = calculateNpk({ crop: 'CORN', targetYieldTonPerHa: 9, soilP_mgDm3: 15, soilK_cmolcDm3: 0.15 });
      expect(result.nitrogenKgPerHa).toBe(180);
      expect(result.commercialFormulaSuggested).toBe('08-28-16 (380 kg/ha) + Cobertura Ureia');
      expect(result.limingRecommendedTonHa).toBe(2.2);
    });

    test('Caminho 3: Ramo Cultura do Café (COFFEE)', () => {
      const result = calculateNpk({ crop: 'COFFEE', targetYieldTonPerHa: 2.5, soilP_mgDm3: 8, soilK_cmolcDm3: 0.12 });
      expect(result.nitrogenKgPerHa).toBe(113);
      expect(result.commercialFormulaSuggested).toBe('20-00-20 fracionado em 3x');
      expect(result.limingRecommendedTonHa).toBe(1.8);
    });

    test('Caminho 4: Ramo Cultura do Algodão (COTTON)', () => {
      const result = calculateNpk({ crop: 'COTTON', targetYieldTonPerHa: 4, soilP_mgDm3: 12, soilK_cmolcDm3: 0.1 });
      expect(result.nitrogenKgPerHa).toBe(128);
      expect(result.commercialFormulaSuggested).toBe('06-24-12 (420 kg/ha)');
      expect(result.limingRecommendedTonHa).toBe(2.5);
    });

    test('Caminho 5: Ramo Cultura do Trigo (WHEAT / Default)', () => {
      const result = calculateNpk({ crop: 'WHEAT', targetYieldTonPerHa: 3, soilP_mgDm3: 12, soilK_cmolcDm3: 0.2 });
      expect(result.nitrogenKgPerHa).toBe(75);
      expect(result.commercialFormulaSuggested).toBe('05-25-15 (320 kg/ha)');
      expect(result.limingRecommendedTonHa).toBe(1.6);
    });
  });

  describe('Cobertura de Todos os Ramos de Exceção em normalizeError (apiError.ts)', () => {
    test('Ramo 1: Retorna a mesma instância quando o erro já é AppError', () => {
      const initial = new AppError('ALREADY_APP_ERROR', 'Mensagem direta', 400);
      const normalized = normalizeError(initial);
      expect(normalized).toBe(initial);
    });

    test('Ramo 2: Trata timeout de requisição (ECONNABORTED)', () => {
      const axiosTimeout = new axios.AxiosError('timeout', 'ECONNABORTED');
      const normalized = normalizeError(axiosTimeout);
      expect(normalized.code).toBe('TIMEOUT_ERROR');
      expect(normalized.status).toBe(408);
    });

    test('Ramo 3: Trata erro de rede sem resposta do servidor', () => {
      const axiosNetworkErr = new axios.AxiosError('Network Error');
      const normalized = normalizeError(axiosNetworkErr);
      expect(normalized.code).toBe('NETWORK_ERROR');
      expect(normalized.status).toBe(0);
    });

    test('Ramo 4: Trata status HTTP 401 (UNAUTHORIZED)', () => {
      const err401 = new axios.AxiosError('Unauthorized', '401', undefined, undefined, {
        status: 401,
        statusText: 'Unauthorized',
        data: {},
        headers: {},
        config: {} as any,
      });
      const normalized = normalizeError(err401);
      expect(normalized.code).toBe('UNAUTHORIZED');
      expect(normalized.status).toBe(401);
    });

    test('Ramo 5: Trata status HTTP 403 (FORBIDDEN)', () => {
      const err403 = new axios.AxiosError('Forbidden', '403', undefined, undefined, {
        status: 403,
        statusText: 'Forbidden',
        data: {},
        headers: {},
        config: {} as any,
      });
      const normalized = normalizeError(err403);
      expect(normalized.code).toBe('FORBIDDEN');
    });

    test('Ramo 6: Trata status HTTP 404 (NOT_FOUND)', () => {
      const err404 = new axios.AxiosError('Not Found', '404', undefined, undefined, {
        status: 404,
        statusText: 'Not Found',
        data: { message: 'Talhão não encontrado' },
        headers: {},
        config: {} as any,
      });
      const normalized = normalizeError(err404);
      expect(normalized.code).toBe('NOT_FOUND');
      expect(normalized.userMessage).toBe('Talhão não encontrado');
    });

    test('Ramo 7: Trata status HTTP 422 (VALIDATION_ERROR com details)', () => {
      const err422 = new axios.AxiosError('Unprocessable Entity', '422', undefined, undefined, {
        status: 422,
        statusText: 'Unprocessable Entity',
        data: {
          message: 'Erro de validação',
          details: { name: ['Nome é obrigatório'] },
        },
        headers: {},
        config: {} as any,
      });
      const normalized = normalizeError(err422);
      expect(normalized.code).toBe('VALIDATION_ERROR');
      expect(normalized.details).toEqual({ name: ['Nome é obrigatório'] });
    });

    test('Ramo 8: Trata erro 500 do servidor (SERVER_ERROR)', () => {
      const err500 = new axios.AxiosError('Internal Server Error', '500', undefined, undefined, {
        status: 503,
        statusText: 'Service Unavailable',
        data: {},
        headers: {},
        config: {} as any,
      });
      const normalized = normalizeError(err500);
      expect(normalized.code).toBe('SERVER_ERROR');
      expect(normalized.status).toBe(503);
    });

    test('Ramo 9: Trata erro nativo JavaScript genérico', () => {
      const nativeErr = new Error('Erro nativo do runtime');
      const normalized = normalizeError(nativeErr);
      expect(normalized.code).toBe('GENERIC_ERROR');
      expect(normalized.userMessage).toBe('Erro nativo do runtime');
    });

    test('Ramo 10: Trata erro totalmente desconhecido (tipo primitivo ou string)', () => {
      const unknownErr = 'Erro desconhecido primitivo';
      const normalized = normalizeError(unknownErr);
      expect(normalized.code).toBe('UNKNOWN_ERROR');
    });
  });
});
