export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 26,
  pill: 9999,
} as const;

export type RadiiToken = keyof typeof radii;
