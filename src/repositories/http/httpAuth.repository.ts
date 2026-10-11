import { IAuthRepository } from '../auth.repository';
import { AuthSession, AuthUser } from '../../types/auth.types';
import { LoginFormData, RegisterFormData } from '../../features/auth/schemas/auth.schemas';
import { apiClient } from '../../services/api';

export class HttpAuthRepository implements IAuthRepository {
  async login(credentials: LoginFormData): Promise<AuthSession> {
    const response = await apiClient.post<AuthSession>('/auth/login', credentials);
    return response.data;
  }

  async register(data: RegisterFormData): Promise<AuthSession> {
    const response = await apiClient.post<AuthSession>('/auth/register', data);
    return response.data;
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const response = await apiClient.get<AuthUser>('/auth/me');
    return response.data;
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }
}
