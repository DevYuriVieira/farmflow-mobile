import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../i18n/translations';

export interface UserPreferences {
  selectedFarmId?: string;
  reducedMotion: boolean;
  notificationsEnabled: boolean;
  offlineSyncEnabled: boolean;
  themeMode: 'light' | 'dark';
  language: Language;
}

const PREFERENCES_KEY = 'farmflow_user_preferences';

const defaultPreferences: UserPreferences = {
  reducedMotion: false,
  notificationsEnabled: true,
  offlineSyncEnabled: true,
  themeMode: 'light',
  language: 'pt',
};

export const preferencesStorage = {
  async getPreferences(): Promise<UserPreferences> {
    try {
      const raw = await AsyncStorage.getItem(PREFERENCES_KEY);
      if (!raw) return defaultPreferences;
      const parsed = JSON.parse(raw) as Partial<UserPreferences>;
      return { ...defaultPreferences, ...parsed };
    } catch {
      return defaultPreferences;
    }
  },

  async setPreferences(prefs: Partial<UserPreferences>): Promise<UserPreferences> {
    try {
      const current = await this.getPreferences();
      const updated = { ...current, ...prefs };
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return defaultPreferences;
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PREFERENCES_KEY);
    } catch {
    }
  },
};
