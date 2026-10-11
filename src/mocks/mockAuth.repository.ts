import { IAuthRepository } from '../repositories/auth.repository';
import { AuthSession, AuthUser } from '../types/auth.types';
import { LoginFormData, RegisterFormData } from '../features/auth/schemas/auth.schemas';
import { seedUser } from './seed';
import { AppError } from '../services/apiError';

export class MockAuthRepository implements IAuthRepository {
  private currentUser: AuthUser | null = null;

  async login(credentials: LoginFormData): Promise<AuthSession> {
    await new Promise((resolve) => setTimeout(resolve, 350));

    // Simulated check: accepts demo@farmflow.ag or any valid email with password "123456" or similar
    if (credentials.email.toLowerCase() === 'demo@farmflow.ag' && credentials.password !== '123456') {
      throw new AppError('INVALID_CREDENTIALS', 'Credenciais inválidas. Use demo@farmflow.ag e senha 123456.');
    }

    const user: AuthUser = {
      ...seedUser,
      email: credentials.email.toLowerCase(),
    };
    this.currentUser = user;

    return {
      user,
      token: `mock-jwt-token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      refreshToken: `mock-refresh-token-${Date.now()}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    };
  }

  async register(data: RegisterFormData): Promise<AuthSession> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const user: AuthUser = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email.toLowerCase(),
      avatarUri: seedUser.avatarUri,
    };
    this.currentUser = user;

    return {
      user,
      token: `mock-jwt-token-${Date.now()}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    };
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return this.currentUser;
  }

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    this.currentUser = null;
  }
}
