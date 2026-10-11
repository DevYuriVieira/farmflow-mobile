import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { radii } from './radii';
import { animationTokens } from './animations';

export const theme = {
  colors,
  spacing,
  typography,
  radii,
  animationTokens,
} as const;

export type Theme = typeof theme;

export { colors, spacing, typography, radii, animationTokens };
