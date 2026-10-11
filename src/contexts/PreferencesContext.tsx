import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { preferencesStorage, UserPreferences } from '../storage/preferences.storage';
import { Language, TranslationKey, getTranslation } from '../i18n/translations';
import { ColorPalette, getThemeColors } from '../theme/colors';

interface PreferencesContextData {
  preferences: UserPreferences;
  selectedFarmId: string | null;
  themeMode: 'light' | 'dark';
  isDark: boolean;
  highContrastFieldMode: boolean;
  touchTargetMinHeight: number;
  language: Language;
  themeColors: ColorPalette;
  setSelectedFarmId: (farmId: string) => Promise<void>;
  toggleReducedMotion: () => Promise<void>;
  toggleNotifications: () => Promise<void>;
  toggleTheme: () => Promise<void>;
  setThemeMode: (mode: 'light' | 'dark') => Promise<void>;
  toggleHighContrastFieldMode: () => Promise<void>;
  toggleLanguage: () => Promise<void>;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: TranslationKey) => string;
}

const PreferencesContext = createContext<PreferencesContextData | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferencesState] = useState<UserPreferences>({
    reducedMotion: false,
    notificationsEnabled: true,
    offlineSyncEnabled: true,
    themeMode: 'light',
    highContrastFieldMode: false,
    language: 'pt',
  });

  useEffect(() => {
    void (async () => {
      const saved = await preferencesStorage.getPreferences();
      setPreferencesState(saved);
    })();
  }, []);

  const setSelectedFarmId = useCallback(async (farmId: string) => {
    const updated = await preferencesStorage.setPreferences({ selectedFarmId: farmId });
    setPreferencesState(updated);
  }, []);

  const toggleReducedMotion = useCallback(async () => {
    const updated = await preferencesStorage.setPreferences({
      reducedMotion: !preferences.reducedMotion,
    });
    setPreferencesState(updated);
  }, [preferences.reducedMotion]);

  const toggleNotifications = useCallback(async () => {
    const updated = await preferencesStorage.setPreferences({
      notificationsEnabled: !preferences.notificationsEnabled,
    });
    setPreferencesState(updated);
  }, [preferences.notificationsEnabled]);

  const toggleTheme = useCallback(async () => {
    const nextMode: 'light' | 'dark' = preferences.themeMode === 'dark' ? 'light' : 'dark';
    const updated = await preferencesStorage.setPreferences({ themeMode: nextMode });
    setPreferencesState(updated);
  }, [preferences.themeMode]);

  const setThemeMode = useCallback(async (mode: 'light' | 'dark') => {
    const updated = await preferencesStorage.setPreferences({ themeMode: mode });
    setPreferencesState(updated);
  }, []);

  const toggleHighContrastFieldMode = useCallback(async () => {
    const nextVal = !preferences.highContrastFieldMode;
    const updated = await preferencesStorage.setPreferences({ highContrastFieldMode: nextVal });
    setPreferencesState(updated);

    try {
      const Haptics = await import('expo-haptics');
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {
      // Haptics fallback
    }
  }, [preferences.highContrastFieldMode]);

  const toggleLanguage = useCallback(async () => {
    const nextLang: Language = preferences.language === 'pt' ? 'en' : 'pt';
    const updated = await preferencesStorage.setPreferences({ language: nextLang });
    setPreferencesState(updated);
  }, [preferences.language]);

  const setLanguage = useCallback(async (lang: Language) => {
    const updated = await preferencesStorage.setPreferences({ language: lang });
    setPreferencesState(updated);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => {
      return getTranslation(key, preferences.language || 'pt');
    },
    [preferences.language]
  );

  const isDark = preferences.themeMode === 'dark';
  const highContrastFieldMode = preferences.highContrastFieldMode || false;
  const themeColors = getThemeColors(isDark, highContrastFieldMode);
  const touchTargetMinHeight = highContrastFieldMode ? 56 : 44;

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        selectedFarmId: preferences.selectedFarmId || null,
        themeMode: preferences.themeMode || 'light',
        isDark,
        highContrastFieldMode,
        touchTargetMinHeight,
        language: preferences.language || 'pt',
        themeColors,
        setSelectedFarmId,
        toggleReducedMotion,
        toggleNotifications,
        toggleTheme,
        setThemeMode,
        toggleHighContrastFieldMode,
        toggleLanguage,
        setLanguage,
        t,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export function usePreferences(): PreferencesContextData {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences deve ser usado dentro de um PreferencesProvider');
  }
  return context;
}
