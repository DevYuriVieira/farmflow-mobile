import { Platform } from 'react-native';
import { ENV } from '../../config/env';
import { AppError } from '../apiError';
import { AuthUser } from '../../types/auth.types';

export interface GoogleAuthResult {
  success: boolean;
  user?: AuthUser;
  idToken?: string;
  error?: string;
}

export const googleAuthService = {
  isConfigured(): boolean {
    if (Platform.OS === 'ios') return Boolean(ENV.googleClientIdIos);
    if (Platform.OS === 'android') return Boolean(ENV.googleClientIdAndroid);
    return Boolean(ENV.googleClientIdWeb);
  },

  async promptSignIn(): Promise<GoogleAuthResult> {
    if (!this.isConfigured()) {
      throw new AppError(
        'GOOGLE_AUTH_NOT_CONFIGURED',
        'A autenticação com Google não está configurada no ambiente. Configure as chaves de cliente no arquivo .env.'
      );
    }

    // In a configured production environment with OAuth Client IDs,
    // this integrates with expo-auth-session or Google Sign-In native SDK.
    throw new AppError(
      'GOOGLE_AUTH_CREDENTIALS_REQUIRED',
      'Configuração do Google Client ID detectada, mas aguardando credenciais válidas do Google Cloud Console para o bundle com.farmflow.app.'
    );
  },
};
