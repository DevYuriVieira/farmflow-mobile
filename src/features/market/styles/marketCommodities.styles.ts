import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../../theme';

export const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl + 6,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  headerDark: {
    backgroundColor: '#0B1410',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: radii.pill,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  backBtnDark: {
    backgroundColor: '#1A2E24',
    borderColor: 'rgba(74, 138, 98, 0.4)',
  },
  title: {
    ...typography.h2,
    color: '#0F172A',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    ...typography.micro,
    color: '#64748B',
    marginTop: 2,
  },
  subtitleDark: {
    color: '#94A3B8',
  },
  dollarPill: {
    backgroundColor: '#F1F5F9',
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  dollarPillDark: {
    backgroundColor: '#1A2E24',
    borderColor: 'rgba(74, 138, 98, 0.3)',
  },
  dollarLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '700',
  },
  dollarVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  content: {
    padding: spacing.base,
    gap: spacing.base,
  },
  simCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: radii.xxl,
    padding: spacing.base,
    borderWidth: 1.5,
    borderColor: '#6EE7B7',
  },
  simCardDark: {
    backgroundColor: '#0F261A',
    borderColor: 'rgba(74, 138, 98, 0.4)',
  },
  simHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
  },
  simTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
  },
  simInputsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.sm,
  },
  simInputLabel: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '600',
    marginBottom: 3,
  },
  simInputLabelDark: {
    color: '#86EFAC',
  },
  simInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: radii.lg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    fontWeight: '700',
    color: '#064E3B',
  },
  simInputDark: {
    backgroundColor: '#1A2E24',
    borderColor: 'rgba(74, 138, 98, 0.4)',
    color: '#FFFFFF',
  },
  simCommodityPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: radii.lg,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  simCommodityPillDark: {
    backgroundColor: '#1A2E24',
    borderColor: 'rgba(74, 138, 98, 0.4)',
  },
  simCommodityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  simCommodityTextDark: {
    color: '#86EFAC',
  },
  simResultBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: radii.lg,
    padding: 10,
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  simResultLabel: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
  },
  simResultValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#059669',
  },
  sectionTitle: {
    ...typography.captionMedium,
    color: '#0F172A',
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  quoteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    padding: spacing.base,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  quoteCardDark: {
    backgroundColor: '#14231B',
    borderColor: 'rgba(74, 138, 98, 0.35)',
  },
  quoteCardSelected: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  quoteCardSelectedDark: {
    borderColor: '#10B981',
    backgroundColor: '#162C21',
  },
  quoteRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quoteName: {
    ...typography.bodyBold,
    color: '#0F172A',
  },
  quoteNameDark: {
    color: '#FFFFFF',
  },
  quoteRef: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  sparklineWrap: {
    marginHorizontal: 8,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  changeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  quoteRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.12)',
    paddingTop: spacing.xs + 2,
  },
  priceBig: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  priceBigDark: {
    color: '#FFFFFF',
  },
  rangeRow: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  rangeText: {
    fontSize: 11,
    color: '#64748B',
  },
});
