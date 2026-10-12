import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../../theme';

export const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl + 8,
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
  farmName: {
    ...typography.h1,
    color: '#172B23',
    marginBottom: spacing.xs,
  },
  farmNameDark: {
    color: '#FFFFFF',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  locationText: {
    ...typography.captionMedium,
    color: '#4A5E54',
    marginLeft: 4,
  },
  locationTextDark: {
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
  plantationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: '#172B23',
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  seeAllBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  seeAllBtnText: {
    ...typography.captionMedium,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.caption,
    color: '#64748B',
  },
});
