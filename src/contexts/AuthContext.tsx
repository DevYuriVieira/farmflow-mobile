import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AuthUser, AuthStatus } from '../types/auth.types';
import { LoginFormData, RegisterFormData } from '../features/auth/schemas/auth.schemas';
import { authService } from '../services/auth.service';
import { observabilityService } from '../services/observability/observability.service';

interface AuthContextData {
  user: AuthUser | null;
  token: string | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>('checking');
  const queryClient = useQueryClient();

  const restoreSession = useCallback(async () => {
    setStatus('checking');
    try {
      const session = await authService.restoreSession();
      if (session) {
        setUser(session.user);
        setToken(session.token);
        setStatus('authenticated');
        observabilityService.setUser({
          id: session.user.id,
          email: session.user.email,
        });
      } else {
        setUser(null);
        setToken(null);
        setStatus('unauthenticated');
        observabilityService.clearUser();
      }
    } catch {
      setUser(null);
      setToken(null);
      setStatus('unauthenticated');
      observabilityService.clearUser();
    }
  }, []);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  const signIn = useCallback(async (credentials: LoginFormData) => {
    setStatus('checking');
    try {
      const session = await authService.login(credentials);
      setUser(session.user);
      setToken(session.token);
      setStatus('authenticated');
      observabilityService.setUser({
        id: session.user.id,
        email: session.user.email,
      });
    } catch (err) {
      setStatus('unauthenticated');
      throw err;
    }
  }, []);

  const register = useCallback(async (data: RegisterFormData) => {
    setStatus('checking');
    try {
      const session = await authService.register(data);
      setUser(session.user);
      setToken(session.token);
      setStatus('authenticated');
      observabilityService.setUser({
        id: session.user.id,
        email: session.user.email,
      });
    } catch (err) {
      setStatus('unauthenticated');
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      queryClient.clear();
      setUser(null);
      setToken(null);
      setStatus('unauthenticated');
      observabilityService.clearUser();
    }
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        status,
        isAuthenticated: status === 'authenticated',
        isLoading: status === 'checking',
        signIn,
        register,
        signOut,
        restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
