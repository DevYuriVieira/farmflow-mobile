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
  content: {
    padding: spacing.base,
    gap: spacing.base,
  },
  sectionTitle: {
    ...typography.captionMedium,
    color: '#0F172A',
    fontWeight: '700',
  },
  sectionTitleSpaced: {
    ...typography.captionMedium,
    color: '#0F172A',
    fontWeight: '700',
    marginTop: spacing.md,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    padding: spacing.base,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  cardDark: {
    backgroundColor: '#14231B',
    borderColor: 'rgba(74, 138, 98, 0.35)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.bodyBold,
    color: '#0F172A',
  },
  cardTitleDark: {
    color: '#FFFFFF',
  },
  cardSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  powerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  powerBtnRunning: {
    backgroundColor: '#10B981',
  },
  powerBtnStopped: {
    backgroundColor: '#F1F5F9',
  },
  powerBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  powerBtnTextRunning: {
    color: '#FFFFFF',
  },
  powerBtnTextStopped: {
    color: '#64748B',
  },
  aerationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#6EE7B7',
  },
  aerationBtnDark: {
    backgroundColor: '#162C21',
    borderColor: 'rgba(74, 138, 98, 0.5)',
  },
  aerationBtnActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  aerationBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  aerationBtnTextActive: {
    color: '#FFFFFF',
  },
  barWrap: {
    marginVertical: spacing.xs,
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 4,
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  barText: {
    fontSize: 11,
    color: '#64748B',
  },
  barTextDark: {
    color: '#94A3B8',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.sm,
  },
  metricCol: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: radii.lg,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricColDark: {
    backgroundColor: '#1A2E24',
    borderColor: 'rgba(74, 138, 98, 0.3)',
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  metricValDark: {
    color: '#FFFFFF',
  },
});
