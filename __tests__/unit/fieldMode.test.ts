import { getThemeColors, highContrastColors, darkColors, colors } from '../../src/theme/colors';
import { preferencesStorage } from '../../src/storage/preferences.storage';

describe('Field Mode & High Contrast UX', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getThemeColors returns highContrastColors when highContrastFieldMode is enabled', () => {
    const theme = getThemeColors(false, true);
    expect(theme.background).toBe('#000000');
    expect(theme.border).toBe('#FACC15');
    expect(theme.textPrimary).toBe('#FFFFFF');
    expect(theme).toEqual(highContrastColors);
  });

  test('getThemeColors respects dark and light themes when field mode is disabled', () => {
    const darkTheme = getThemeColors(true, false);
    expect(darkTheme).toEqual(darkColors);

    const lightTheme = getThemeColors(false, false);
    expect(lightTheme.background).toBe(colors.background);
  });

  test('preferencesStorage manages highContrastFieldMode property', async () => {
    const initial = await preferencesStorage.getPreferences();
    expect(initial).toHaveProperty('highContrastFieldMode');

    const updated = await preferencesStorage.setPreferences({ highContrastFieldMode: true });
    expect(updated.highContrastFieldMode).toBe(true);

    const reverted = await preferencesStorage.setPreferences({ highContrastFieldMode: false });
    expect(reverted.highContrastFieldMode).toBe(false);
  });
});
