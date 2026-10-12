import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.25)',
    padding: spacing.md,
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
  completedCard: {
    opacity: 0.72,
    borderColor: 'rgba(74, 138, 98, 0.15)',
  },
  completedCardDark: {
    opacity: 0.65,
    borderColor: 'rgba(74, 138, 98, 0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  checkboxBtn: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  titleWrapper: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.bodyBold,
    color: '#172B23',
    marginBottom: 2,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  description: {
    ...typography.caption,
    color: '#4A5E54',
    lineHeight: 18,
  },
  descriptionDark: {
    color: '#E2E8F0',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  completedTextDark: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  typeIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.3)',
  },
  typeIconBadgeDark: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderColor: 'rgba(74, 138, 98, 0.5)',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E7DB',
    paddingTop: spacing.xs + 2,
    marginTop: spacing.xs,
  },
  metaRowDark: {
    borderTopColor: '#2C493A',
  },
  metaBadge: {
    backgroundColor: 'rgba(27, 77, 62, 0.08)',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.25)',
  },
  metaBadgeDark: {
    backgroundColor: 'rgba(34, 197, 94, 0.18)',
    borderColor: 'rgba(74, 138, 98, 0.4)',
  },
  metaBadgeText: {
    ...typography.micro,
    color: '#1B4D3E',
    fontWeight: '700',
  },
  metaBadgeTextDark: {
    color: '#86EFAC',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  timeText: {
    ...typography.micro,
    color: '#64748B',
    marginLeft: 3,
  },
  timeTextDark: {
    color: '#CBD5E1',
  },
  farmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  farmText: {
    ...typography.micro,
    color: '#64748B',
    marginLeft: 3,
  },
  farmTextDark: {
    color: '#CBD5E1',
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  checkboxContainer: {
    marginRight: spacing.sm,
  },
  compactContent: {
    flex: 1,
  },
  compactTitle: {
    ...typography.captionMedium,
    color: '#172B23',
  },
  compactTitleDark: {
    color: '#FFFFFF',
  },
});
