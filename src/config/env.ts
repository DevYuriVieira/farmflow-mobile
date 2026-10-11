export interface AppEnvConfig {
  apiUrl: string;
  useMockApi: boolean;
  timeoutMs: number;
  googleClientIdIos?: string;
  googleClientIdAndroid?: string;
  googleClientIdWeb?: string;
  mapsApiKey?: string;
}

export const ENV: AppEnvConfig = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.farmflow.ag/v1',
  useMockApi: process.env.EXPO_PUBLIC_USE_MOCK_API !== 'false',
  timeoutMs: Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS) || 10000,
  googleClientIdIos: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
  googleClientIdAndroid: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
  googleClientIdWeb: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
  mapsApiKey: process.env.EXPO_PUBLIC_MAPS_API_KEY,
};
