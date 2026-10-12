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
  cropRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cropPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cropPillDark: {
    backgroundColor: '#14231B',
    borderColor: 'rgba(74, 138, 98, 0.3)',
  },
  cropPillActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  cropPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  cropPillTextActive: {
    color: '#FFFFFF',
  },
  content: {
    padding: spacing.base,
    gap: spacing.base,
  },
  heroCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: radii.xxl,
    padding: spacing.xl,
    borderWidth: 1.5,
    borderColor: '#6EE7B7',
    alignItems: 'center',
  },
  heroCardDark: {
    backgroundColor: '#0F261A',
    borderColor: 'rgba(74, 138, 98, 0.5)',
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: '#047857',
    marginVertical: 4,
  },
  heroSubtext: {
    fontSize: 13,
    color: '#065F46',
    fontWeight: '500',
  },
  breakEvenBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.pill,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  breakEvenText: {
    fontSize: 12,
    color: '#065F46',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  kpiCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  kpiCardDark: {
    backgroundColor: '#14231B',
    borderColor: 'rgba(74, 138, 98, 0.3)',
  },
  kpiLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  kpiValueDark: {
    color: '#FFFFFF',
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
  cardTitle: {
    ...typography.captionMedium,
    color: '#0F172A',
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  cardTitleSpaced: {
    ...typography.captionMedium,
    color: '#0F172A',
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  cardTitleDark: {
    color: '#FFFFFF',
  },
  inputGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  inputCol: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 3,
  },
  inputLabelDark: {
    color: '#CBD5E1',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: radii.lg,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  inputDark: {
    backgroundColor: '#1A2E24',
    borderColor: 'rgba(74, 138, 98, 0.4)',
    color: '#FFFFFF',
  },
});
