import { AuthSession, AuthUser } from '../types/auth.types';
import { LoginFormData, RegisterFormData } from '../features/auth/schemas/auth.schemas';

export interface IAuthRepository {
  login(credentials: LoginFormData): Promise<AuthSession>;
  register(data: RegisterFormData): Promise<AuthSession>;
  getCurrentUser(): Promise<AuthUser | null>;
  logout(): Promise<void>;
}
