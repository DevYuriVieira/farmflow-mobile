export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUri?: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  refreshToken?: string;
  expiresAt: string;
}

export type AuthStatus = 'idle' | 'checking' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  token: string | null;
}
