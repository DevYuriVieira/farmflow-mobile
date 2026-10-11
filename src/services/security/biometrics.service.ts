export interface BiometricStatus {
  hasHardware: boolean;
  isEnrolled: boolean;
  supportedTypes: string[];
}

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

export async function checkBiometricSupport(): Promise<BiometricStatus> {
  try {
    const LocalAuth = await import('expo-local-authentication');
    const hasHardware = await LocalAuth.hasHardwareAsync();
    const isEnrolled = await LocalAuth.isEnrolledAsync();
    const types = await LocalAuth.supportedAuthenticationTypesAsync();

    const supportedTypes: string[] = types.map((type) => {
      switch (type) {
        case LocalAuth.AuthenticationType.FACIAL_RECOGNITION:
          return 'FACIAL_RECOGNITION';
        case LocalAuth.AuthenticationType.FINGERPRINT:
          return 'FINGERPRINT';
        case LocalAuth.AuthenticationType.IRIS:
          return 'IRIS';
        default:
          return 'UNKNOWN';
      }
    });

    return {
      hasHardware,
      isEnrolled,
      supportedTypes,
    };
  } catch {
    return {
      hasHardware: false,
      isEnrolled: false,
      supportedTypes: [],
    };
  }
}

export async function authenticateWithBiometrics(
  promptMessage = 'Autentique para acessar o FarmFlow'
): Promise<BiometricAuthResult> {
  try {
    const LocalAuth = await import('expo-local-authentication');
    const hasHardware = await LocalAuth.hasHardwareAsync();
    const isEnrolled = await LocalAuth.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      return {
        success: false,
        error: 'Biometria não disponível ou não configurada neste dispositivo.',
      };
    }

    const result = await LocalAuth.authenticateAsync({
      promptMessage,
      cancelLabel: 'Cancelar',
      fallbackLabel: 'Usar Senha',
      disableDeviceFallback: false,
    });

    if (result.success) {
      return { success: true };
    }

    return {
      success: false,
      error: 'error' in result ? result.error : 'Autenticação biométrica não concluída.',
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Falha na autenticação biométrica.',
    };
  }
}

export async function storeSecureToken(key: string, value: string): Promise<boolean> {
  try {
    const SecureStore = await import('expo-secure-store');
    if (await SecureStore.isAvailableAsync()) {
      await SecureStore.setItemAsync(key, value);
      return true;
    }
  } catch {
    // Fallback in web or environments where SecureStore is unavailable
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(`ff_sec_${key}`, value);
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

export async function getSecureToken(key: string): Promise<string | null> {
  try {
    const SecureStore = await import('expo-secure-store');
    if (await SecureStore.isAvailableAsync()) {
      return await SecureStore.getItemAsync(key);
    }
  } catch {
    // Fallback
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return window.localStorage.getItem(`ff_sec_${key}`);
    } catch {
      return null;
    }
  }

  return null;
}

export async function removeSecureToken(key: string): Promise<boolean> {
  try {
    const SecureStore = await import('expo-secure-store');
    if (await SecureStore.isAvailableAsync()) {
      await SecureStore.deleteItemAsync(key);
      return true;
    }
  } catch {
    // Fallback
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(`ff_sec_${key}`);
      return true;
    } catch {
      return false;
    }
  }

  return false;
}
