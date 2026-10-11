export const colors = {
  background: '#F6F7F2',
  backgroundElevated: '#FFFFFF',
  backgroundWarm: '#FAFAF7',
  surface: '#FFFFFF',
  surfaceCard: '#FFFFFF',
  surfaceCardSolid: '#FFFFFF',
  surfaceCardSubtle: '#F0F3EB',
  surfaceHighlight: '#E8ECE2',
  surfaceInput: '#F4F6F0',
  
  border: '#E2E7DB',
  borderLight: '#EDF1E8',
  borderActive: '#22C55E',
  borderGlass: 'rgba(27, 77, 62, 0.08)',

  primary: '#1B4D3E',
  primaryLight: '#2E7D32',
  primaryVibrant: '#22C55E',
  primaryDark: '#0E2E24',
  primaryMuted: 'rgba(27, 77, 62, 0.08)',

  barnRed: '#D32F2F',
  barnRedLight: '#FEE2E2',
  sunGold: '#F59E0B',
  sunGoldLight: '#FEF3C7',
  skyBlue: '#38BDF8',
  skyBlueLight: '#E0F2FE',
  soilBrown: '#8D6E63',
  soilBrownLight: '#EFEBE9',
  cropGreen: '#4CAF50',
  cropGreenLight: '#E8F5E9',

  badgeCrops: '#E8F5E9',
  badgeCropsText: '#2E7D32',
  badgeAnimals: '#FFEDD5',
  badgeAnimalsText: '#C2410C',
  badgeMoisture: '#E0F2FE',
  badgeMoistureText: '#0284C7',
  badgeHarvest: '#FEF3C7',
  badgeHarvestText: '#B45309',

  accentLime: '#84CC16',
  accentSprout: '#22C55E',
  accentGold: '#EAB308',
  accentOrange: '#F97316',
  accentBlue: '#0284C7',

  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#0284C7',

  textPrimary: '#172B23',
  textSecondary: '#4A5E54',
  textMuted: '#7E9489',
  textDisabled: '#A8B8AF',
  textInverse: '#FFFFFF',

  navBarBackground: '#FFFFFF',
  navBarBorder: '#E5EADF',
  modalOverlay: 'rgba(15, 33, 25, 0.5)',
  
  skySunny: '#7DD3FC',
  skySunnyTop: '#38BDF8',
  skyCloudy: '#94A3B8',
  skyRainy: '#475569',
  skyNight: '#0F172A',
  fogMist: 'rgba(255, 255, 255, 0.4)',
  sunGlow: '#FDE047',
} as const;

export type ColorToken = keyof typeof colors;
export type ColorPalette = Record<ColorToken, string>;

export const darkColors: ColorPalette = {
  background: '#0B1410',
  backgroundElevated: '#13221B',
  backgroundWarm: '#0F1C16',
  surface: '#13221B',
  surfaceCard: '#182C23',
  surfaceCardSolid: '#182C23',
  surfaceCardSubtle: '#14251D',
  surfaceHighlight: '#223D30',
  surfaceInput: '#16281F',
  
  border: '#2C493A',
  borderLight: '#233A2E',
  borderActive: '#22C55E',
  borderGlass: 'rgba(255, 255, 255, 0.12)',

  primary: '#22C55E',
  primaryLight: '#4ADE80',
  primaryVibrant: '#22C55E',
  primaryDark: '#16A34A',
  primaryMuted: 'rgba(34, 197, 94, 0.2)',

  barnRed: '#EF4444',
  barnRedLight: '#451A1A',
  sunGold: '#FBBF24',
  sunGoldLight: '#3D2806',
  skyBlue: '#38BDF8',
  skyBlueLight: '#0C2D48',
  soilBrown: '#D7CCC8',
  soilBrownLight: '#3E2723',
  cropGreen: '#4ADE80',
  cropGreenLight: '#143D22',

  badgeCrops: '#143D22',
  badgeCropsText: '#86EFAC',
  badgeAnimals: '#3E2412',
  badgeAnimalsText: '#FED7AA',
  badgeMoisture: '#0F3045',
  badgeMoistureText: '#BAE6FD',
  badgeHarvest: '#3B2907',
  badgeHarvestText: '#FEF08A',

  accentLime: '#A3E635',
  accentSprout: '#4ADE80',
  accentGold: '#FDE047',
  accentOrange: '#FB923C',
  accentBlue: '#38BDF8',

  success: '#4ADE80',
  warning: '#FBBF24',
  danger: '#F87171',
  info: '#38BDF8',

  textPrimary: '#FFFFFF',
  textSecondary: '#E2E8F0',
  textMuted: '#CBD5E1',
  textDisabled: '#94A3B8',
  textInverse: '#0B1410',

  navBarBackground: '#0F1A15',
  navBarBorder: '#23382E',
  modalOverlay: 'rgba(4, 9, 7, 0.85)',
  
  skySunny: '#1E293B',
  skySunnyTop: '#0F172A',
  skyCloudy: '#1E293B',
  skyRainy: '#0B1320',
  skyNight: '#050D1A',
  fogMist: 'rgba(255, 255, 255, 0.08)',
  sunGlow: '#FDE047',
};

export function getThemeColors(isDark: boolean): ColorPalette {
  return isDark ? darkColors : (colors as unknown as ColorPalette);
}
