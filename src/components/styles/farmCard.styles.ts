import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.25)',
    padding: spacing.base,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: '#182C23',
    borderColor: 'rgba(74, 138, 98, 0.45)',
    shadowOpacity: 0.35,
  },
  selectedCard: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  selectedCardDark: {
    borderColor: '#4ADE80',
    backgroundColor: '#1B382B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  titleWrapper: {
    flex: 1,
    marginRight: spacing.sm,
  },
  name: {
    ...typography.h3,
    color: '#172B23',
    marginBottom: 2,
  },
  nameDark: {
    color: '#FFFFFF',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    ...typography.caption,
    color: '#4A5E54',
    marginLeft: 3,
  },
  locationTextDark: {
    color: '#CBD5E1',
  },
  selectedBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  selectedBadgeText: {
    ...typography.micro,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  selectButton: {
    borderWidth: 1,
    borderColor: '#22C55E',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  selectButtonDark: {
    borderColor: '#4ADE80',
  },
  selectButtonText: {
    ...typography.micro,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  selectButtonTextDark: {
    color: '#4ADE80',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F6F0',
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E7DB',
  },
  statsRowDark: {
    backgroundColor: '#14251D',
    borderColor: '#233A2E',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E7DB',
  },
  statDividerDark: {
    backgroundColor: '#2C493A',
  },
  statLabel: {
    ...typography.micro,
    color: '#64748B',
    marginBottom: 2,
  },
  statLabelDark: {
    color: '#94A3B8',
  },
  statValue: {
    ...typography.captionMedium,
    color: '#172B23',
    fontWeight: '700',
  },
  statValueDark: {
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E2E7DB',
    paddingTop: spacing.sm,
  },
  footerDark: {
    borderTopColor: '#2C493A',
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    ...typography.captionMedium,
    color: colors.primaryLight,
    marginRight: 4,
    fontWeight: '600',
  },
  viewDetailsTextDark: {
    color: '#86EFAC',
  },
  shareBtn: {
    padding: spacing.xs,
  },
});
