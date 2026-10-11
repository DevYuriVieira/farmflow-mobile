import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../i18n/translations';

export interface UserPreferences {
  selectedFarmId?: string;
  reducedMotion: boolean;
  notificationsEnabled: boolean;
  offlineSyncEnabled: boolean;
  themeMode: 'light' | 'dark';
  highContrastFieldMode: boolean;
  language: Language;
}

const PREFERENCES_KEY = 'farmflow_user_preferences';

const defaultPreferences: UserPreferences = {
  reducedMotion: false,
  notificationsEnabled: true,
  offlineSyncEnabled: true,
  themeMode: 'light',
  highContrastFieldMode: false,
  language: 'pt',
};

let inMemoryPreferences: UserPreferences = { ...defaultPreferences };

export const preferencesStorage = {
  async getPreferences(): Promise<UserPreferences> {
    try {
      const raw = await AsyncStorage.getItem(PREFERENCES_KEY);
      if (!raw) return inMemoryPreferences;
      const parsed = JSON.parse(raw) as Partial<UserPreferences>;
      inMemoryPreferences = { ...inMemoryPreferences, ...parsed };
      return inMemoryPreferences;
    } catch {
      return inMemoryPreferences;
    }
  },

  async setPreferences(prefs: Partial<UserPreferences>): Promise<UserPreferences> {
    const updated = { ...inMemoryPreferences, ...prefs };
    inMemoryPreferences = updated;
    try {
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
    } catch {
      // In-memory fallback for environments without storage bridge
    }
    return updated;
  },

  async clear(): Promise<void> {
    inMemoryPreferences = { ...defaultPreferences };
    try {
      await AsyncStorage.removeItem(PREFERENCES_KEY);
    } catch {
    }
  },
};
