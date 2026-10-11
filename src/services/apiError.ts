import axios, { AxiosError } from 'axios';
import { ApiErrorPayload } from '../types/api.types';

export class AppError extends Error {
  public readonly code: string;
  public readonly userMessage: string;
  public readonly status?: number;
  public readonly details?: Record<string, string[]>;

  constructor(code: string, userMessage: string, status?: number, details?: Record<string, string[]>) {
    super(userMessage);
    this.name = 'AppError';
    this.code = code;
    this.userMessage = userMessage;
    this.status = status;
    this.details = details;
  }
}

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<ApiErrorPayload>;
    if (!axiosErr.response) {
      if (axiosErr.code === 'ECONNABORTED') {
        return new AppError('TIMEOUT_ERROR', 'A requisição excedeu o tempo limite. Verifique sua conexão.', 408);
      }
      return new AppError('NETWORK_ERROR', 'Não foi possível conectar ao servidor. Verifique sua internet.', 0);
    }

    const status = axiosErr.response.status;
    const data = axiosErr.response.data;

    if (status === 401) {
      return new AppError('UNAUTHORIZED', 'Sessão expirada. Faça login novamente.', 401);
    }
    if (status === 403) {
      return new AppError('FORBIDDEN', 'Você não tem permissão para realizar esta operação.', 403);
    }
    if (status === 404) {
      return new AppError('NOT_FOUND', data?.message || 'O recurso solicitado não foi encontrado.', 404);
    }
    if (status === 422) {
      return new AppError('VALIDATION_ERROR', data?.message || 'Dados inválidos fornecidos.', 422, data?.details);
    }
    if (status >= 500) {
      return new AppError('SERVER_ERROR', 'Instabilidade no servidor agrícola. Tente novamente mais tarde.', status);
    }

    return new AppError(
      data?.code || 'HTTP_ERROR',
      data?.message || 'Ocorreu um erro ao comunicar com o servidor.',
      status,
      data?.details
    );
  }

  if (error instanceof Error) {
    return new AppError('GENERIC_ERROR', error.message || 'Ocorreu um erro inesperado.');
  }

  return new AppError('UNKNOWN_ERROR', 'Ocorreu um erro inesperado no aplicativo.');
}
