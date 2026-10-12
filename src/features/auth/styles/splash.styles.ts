import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: radii.xxl,
    backgroundColor: 'rgba(16, 40, 27, 0.92)',
    borderWidth: 1.5,
    borderColor: 'rgba(74, 138, 98, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: spacing.base,
  },
  brandTitle: {
    ...typography.hero,
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  tagline: {
    ...typography.captionMedium,
    color: colors.primaryLight,
    letterSpacing: 0.3,
  },
  statusRow: {
    marginTop: spacing.xxl,
    backgroundColor: 'rgba(12, 30, 21, 0.7)',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.25)',
  },
  statusText: {
    ...typography.micro,
    color: colors.textSecondary,
  },
});
