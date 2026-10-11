import React, { useMemo } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ToastProvider } from '../contexts/ToastContext';
import { PreferencesProvider } from '../contexts/PreferencesContext';
import { AuthProvider } from '../contexts/AuthContext';

export interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 2,
            gcTime: 1000 * 60 * 10,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
    []
  );

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <PreferencesProvider>
            <AuthProvider>{children}</AuthProvider>
          </PreferencesProvider>
        </ToastProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};
