import { StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../../../theme';

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
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  backBtnDark: {
    backgroundColor: '#1E293B',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  subtitleDark: {
    color: '#94A3B8',
  },
  kpiContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: radii.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  kpiCardDark: {
    backgroundColor: '#16221C',
    borderColor: '#243A2E',
  },
  kpiNumber: {
    fontSize: 20,
    fontWeight: '800',
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginTop: 2,
  },
  kpiLabelDark: {
    color: '#E2E8F0',
  },
  kpiSub: {
    fontSize: 9,
    color: '#64748B',
  },
  filterTabs: {
    gap: 8,
    paddingVertical: 4,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillDark: {
    backgroundColor: '#16221C',
    borderColor: '#243A2E',
  },
  filterPillActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterPillTextDark: {
    color: '#94A3B8',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: spacing.base,
    paddingBottom: spacing.xxl + 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardDark: {
    backgroundColor: '#16221C',
    borderColor: '#243A2E',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  categoryIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  machineName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  machineNameDark: {
    color: '#FFFFFF',
  },
  machineCode: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  machineCodeDark: {
    color: '#94A3B8',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  operatingBadge: {
    backgroundColor: '#ECFDF5',
  },
  operatingBadgeDark: {
    backgroundColor: '#064E3B44',
  },
  idleBadge: {
    backgroundColor: '#F1F5F9',
  },
  idleBadgeDark: {
    backgroundColor: '#1E293B',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.sm,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: radii.sm,
    padding: 8,
    alignItems: 'center',
  },
  metricBoxDark: {
    backgroundColor: '#121F17',
  },
  metricLabel: {
    fontSize: 9,
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  metricValDark: {
    color: '#E2E8F0',
  },
  fuelSection: {
    marginBottom: spacing.sm,
  },
  fuelLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  gaugeLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  gaugeLabelDark: {
    color: '#94A3B8',
  },
  gaugeVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  gaugeValDark: {
    color: '#E2E8F0',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarBgDark: {
    backgroundColor: '#1E293B',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  maintBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.sm,
    marginBottom: spacing.sm,
  },
  maintOk: {
    backgroundColor: '#ECFDF5',
  },
  maintOkDark: {
    backgroundColor: '#064E3B33',
  },
  maintUrgent: {
    backgroundColor: '#FEF2F2',
  },
  maintUrgentDark: {
    backgroundColor: '#450A0A44',
  },
  maintText: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  operatorText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  operatorTextDark: {
    color: '#94A3B8',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.sm,
  },
  actionBtnStart: {
    backgroundColor: '#059669',
  },
  actionBtnStop: {
    backgroundColor: '#475569',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
