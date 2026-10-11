import { AppError } from '../services/apiError';

export function getFriendlyErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.userMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ocorreu um erro inesperado. Tente novamente.';
}
