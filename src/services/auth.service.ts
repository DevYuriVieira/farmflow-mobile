import { authRepository } from '../repositories';
import { AuthSession, AuthUser } from '../types/auth.types';
import { LoginFormData, RegisterFormData } from '../features/auth/schemas/auth.schemas';
import { sessionStorage } from '../storage/session.storage';

export const authService = {
  async login(credentials: LoginFormData): Promise<AuthSession> {
    const session = await authRepository.login(credentials);
    await sessionStorage.setToken(session.token);
    await sessionStorage.setUserJson(JSON.stringify(session.user));
    return session;
  },

  async register(data: RegisterFormData): Promise<AuthSession> {
    const session = await authRepository.register(data);
    await sessionStorage.setToken(session.token);
    await sessionStorage.setUserJson(JSON.stringify(session.user));
    return session;
  },

  async restoreSession(): Promise<{ user: AuthUser; token: string } | null> {
    const token = await sessionStorage.getToken();
    const userJson = await sessionStorage.getUserJson();

    if (!token || !userJson) {
      return null;
    }

    try {
      const user = JSON.parse(userJson) as AuthUser;
      return { user, token };
    } catch {
      await sessionStorage.clear();
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await authRepository.logout();
    } finally {
      await sessionStorage.clear();
    }
  },
};
