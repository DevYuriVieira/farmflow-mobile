import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../../theme';

export const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl + 6,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F6F7F2',
  },
  headerDark: {
    backgroundColor: '#0B1410',
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginLeft: spacing.xs + 2,
  },
  circleBtnDark: {
    backgroundColor: '#182C23',
    borderColor: '#2C493A',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    padding: spacing.base,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(27, 77, 62, 0.08)',
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.25)',
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  statusBannerDark: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: 'rgba(74, 138, 98, 0.4)',
  },
  statusBannerDone: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  statusBannerText: {
    ...typography.captionMedium,
    color: '#1B4D3E',
    fontWeight: '700',
    marginLeft: spacing.sm,
    flex: 1,
  },
  statusBannerTextDark: {
    color: '#86EFAC',
  },
  statusBannerTextDone: {
    color: '#FFFFFF',
  },
  title: {
    ...typography.h1,
    color: '#172B23',
    marginBottom: spacing.xs,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  description: {
    ...typography.body,
    color: '#4A5E54',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  descriptionDark: {
    color: '#CBD5E1',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.25)',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  gridCardDark: {
    backgroundColor: '#182C23',
    borderColor: 'rgba(74, 138, 98, 0.45)',
  },
  gridLabel: {
    ...typography.micro,
    color: '#64748B',
    marginTop: spacing.xs,
    marginBottom: 2,
  },
  gridLabelDark: {
    color: '#94A3B8',
  },
  gridValue: {
    ...typography.captionMedium,
    color: '#172B23',
    fontWeight: '700',
  },
  gridValueDark: {
    color: '#FFFFFF',
  },
  calendarSyncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radii.pill,
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.35)',
    paddingVertical: spacing.md,
  },
  calendarSyncBtnDark: {
    backgroundColor: '#182C23',
    borderColor: 'rgba(74, 138, 98, 0.5)',
  },
  calendarSyncBtnText: {
    ...typography.captionMedium,
    color: colors.primaryLight,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  calendarSyncBtnTextDark: {
    color: '#4ADE80',
  },
});
