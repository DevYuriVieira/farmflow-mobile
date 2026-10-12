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
    marginBottom: spacing.md,
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
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: radii.xl,
    padding: 4,
    gap: 4,
  },
  tabsRowDark: {
    backgroundColor: '#122018',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: radii.lg,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#10B981',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    padding: spacing.base,
  },
  tabContent: {
    gap: spacing.base,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xxl,
    padding: spacing.base,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  cardDark: {
    backgroundColor: '#14231B',
    borderColor: 'rgba(74, 138, 98, 0.35)',
  },
  sectionTitle: {
    ...typography.captionMedium,
    color: '#0F172A',
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.md,
  },
  cropChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cropChipDark: {
    backgroundColor: '#1A2E24',
    borderColor: 'rgba(74, 138, 98, 0.3)',
  },
  cropChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  cropChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  cropChipTextActive: {
    color: '#FFFFFF',
  },
  inputGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputCol: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  inputLabelDark: {
    color: '#CBD5E1',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: radii.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  inputDark: {
    backgroundColor: '#1A2E24',
    borderColor: 'rgba(74, 138, 98, 0.4)',
    color: '#FFFFFF',
  },
  resultCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: radii.xxl,
    padding: spacing.base,
    borderWidth: 1.5,
    borderColor: '#86EFAC',
  },
  resultCardDark: {
    backgroundColor: '#0F261A',
    borderColor: 'rgba(74, 138, 98, 0.5)',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.md,
  },
  resultHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#065F46',
  },
  resultGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  resultItem: {
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: radii.lg,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.2)',
  },
  resultItemLabel: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  resultItemValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#064E3B',
    marginTop: 2,
  },
  formulaBox: {
    marginTop: spacing.md,
    padding: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: radii.md,
  },
  formulaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
    textTransform: 'uppercase',
  },
  formulaValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#064E3B',
    marginTop: 2,
  },
  highlightYield: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  highlightYieldNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: '#059669',
  },
  highlightYieldUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: '#047857',
  },
  benchmarkPill: {
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.pill,
    backgroundColor: '#DCFCE7',
  },
  benchmarkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
});
