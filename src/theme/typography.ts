import { TextStyle } from 'react-native';

export const typography = {
  hero: {
    fontSize: 36,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: 28,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 34,
    letterSpacing: -0.4,
  },
  h2: {
    fontSize: 22,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 24,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 22,
  },
  bodyBold: {
    fontSize: 15,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 18,
  },
  captionMedium: {
    fontSize: 13,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 18,
  },
  micro: {
    fontSize: 11,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 14,
    letterSpacing: 0.2,
  },
} as const;

export type TypographyToken = keyof typeof typography;
