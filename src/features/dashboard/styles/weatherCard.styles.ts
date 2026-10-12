import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  dateText: {
    ...typography.captionMedium,
    color: colors.textSecondary,
    marginBottom: spacing.xxs,
    textTransform: 'capitalize',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  temperatureText: {
    ...typography.hero,
    fontSize: 54,
    lineHeight: 60,
    color: colors.textPrimary,
    fontWeight: '300',
  },
  celsiusText: {
    fontSize: 34,
    color: colors.textSecondary,
  },
  conditionPill: {
    backgroundColor: 'rgba(16, 40, 27, 0.85)',
    borderRadius: radii.xl,
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.35)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'flex-start',
  },
  conditionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  conditionText: {
    ...typography.captionMedium,
    color: colors.textPrimary,
    marginLeft: 6,
  },
  highLowRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highLowText: {
    ...typography.micro,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  demoTag: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    backgroundColor: 'rgba(12, 30, 21, 0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.xs,
  },
  demoTagText: {
    ...typography.micro,
    fontSize: 10,
    color: colors.textMuted,
  },
});
