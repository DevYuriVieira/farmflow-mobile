import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../../theme';

export const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.xl + 6,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: spacing.sm,
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarStrip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
  },
  dayCard: {
    width: 62,
    height: 84,
    borderRadius: radii.xl,
    backgroundColor: 'rgba(17, 41, 29, 0.75)',
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  dayCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayName: {
    ...typography.micro,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  dayNameActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  dayNumber: {
    ...typography.h2,
    color: colors.textPrimary,
    marginVertical: 2,
  },
  dayNumberActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  monthName: {
    ...typography.micro,
    color: colors.textMuted,
    fontSize: 10,
    textTransform: 'capitalize',
  },
  monthNameActive: {
    color: colors.textInverse,
  },
  content: {
    padding: spacing.base,
  },
  selectedDayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  selectedDayTitle: {
    ...typography.captionMedium,
    color: colors.primaryLight,
    marginLeft: 6,
    textTransform: 'capitalize',
  },
});
