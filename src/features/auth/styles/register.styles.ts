import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceCardSolid,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.xxl,
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.35)',
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  submitBtn: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  footerLink: {
    ...typography.captionMedium,
    color: colors.primaryLight,
    fontWeight: '700',
  },
});
