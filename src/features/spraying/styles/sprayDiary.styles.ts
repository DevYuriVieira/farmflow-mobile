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
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
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
  sprayWindowBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  sprayWindowBannerDark: {
    backgroundColor: '#064E3B33',
    borderColor: '#065F46',
  },
  sprayWindowText: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '600',
    flex: 1,
  },
  sprayWindowTextDark: {
    color: '#34D399',
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardTitleDark: {
    color: '#FFFFFF',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  cardSubtitleDark: {
    color: '#94A3B8',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  graceBadge: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  graceBadgeDark: {
    backgroundColor: '#450A0A55',
    borderColor: '#EF4444',
  },
  safeBadge: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  safeBadgeDark: {
    backgroundColor: '#064E3B55',
    borderColor: '#10B981',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: 6,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 1,
  },
  infoValDark: {
    color: '#E2E8F0',
  },
  notesText: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 4,
    paddingLeft: 6,
    borderLeftWidth: 2,
    borderLeftColor: '#059669',
  },
  notesTextDark: {
    color: '#94A3B8',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  dateText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  dateTextDark: {
    color: '#64748B',
  },
  deleteBtn: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing.base,
    maxHeight: '90%',
  },
  modalCardDark: {
    backgroundColor: '#121F17',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalTitleDark: {
    color: '#FFFFFF',
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginTop: spacing.xs,
    marginBottom: 4,
  },
  formLabelDark: {
    color: '#CBD5E1',
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    fontSize: 13,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  inputDark: {
    borderColor: '#334155',
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
  },
  inputGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  inputCol: {
    flex: 1,
  },
  saveBtn: {
    backgroundColor: '#059669',
    height: 46,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
