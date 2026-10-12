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
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: radii.xl,
    backgroundColor: 'rgba(16, 40, 27, 0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(74, 138, 98, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    ...typography.hero,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
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
  cardTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  submitBtn: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(163, 230, 53, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(163, 230, 53, 0.3)',
    borderRadius: radii.pill,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  demoBadgeText: {
    ...typography.micro,
    color: colors.accentLime,
    fontWeight: '600',
    marginLeft: 6,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.micro,
    color: colors.textMuted,
    marginHorizontal: spacing.md,
  },
  googleBtn: {
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
