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
    justifyContent: 'space-between',
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
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: radii.xl,
    padding: 3,
  },
  tabBarDark: {
    backgroundColor: '#14231B',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: radii.lg,
  },
  tabActive: {
    backgroundColor: '#10B981',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: spacing.base,
    gap: spacing.md,
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs + 2,
  },
  cardTitle: {
    ...typography.bodyBold,
    color: '#0F172A',
  },
  cardTitleDark: {
    color: '#FFFFFF',
  },
  cardSubtitle: {
    ...typography.micro,
    color: '#64748B',
    marginTop: 2,
  },
  cardSubtitleDark: {
    color: '#94A3B8',
  },
  scientificName: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#059669',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: spacing.xs + 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  metaTextDark: {
    color: '#CBD5E1',
  },
  notesText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    backgroundColor: 'rgba(148, 163, 184, 0.08)',
    padding: 8,
    borderRadius: radii.md,
    marginVertical: spacing.xs,
  },
  notesTextDark: {
    color: '#E2E8F0',
    backgroundColor: 'rgba(74, 138, 98, 0.15)',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs + 2,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
    paddingTop: spacing.xs + 2,
  },
  dateText: {
    fontSize: 11,
    color: '#64748B',
  },
  dateTextDark: {
    color: '#94A3B8',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: '#10B981',
    backgroundColor: 'transparent',
  },
  actionBtnDark: {
    borderColor: '#4ADE80',
  },
  actionBtnDone: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  actionBtnTextDone: {
    color: '#FFFFFF',
  },
  catalogBlock: {
    marginTop: spacing.xs + 2,
  },
  catalogLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    textTransform: 'uppercase',
  },
  catalogValue: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    marginTop: 2,
  },
  catalogValueDark: {
    color: '#CBD5E1',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: radii.xxl,
    borderTopRightRadius: radii.xxl,
    padding: spacing.xl,
    maxHeight: '90%',
  },
  modalCardDark: {
    backgroundColor: '#122018',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.h3,
    color: '#0F172A',
  },
  modalTitleDark: {
    color: '#FFFFFF',
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginTop: spacing.sm,
    marginBottom: 4,
  },
  formLabelDark: {
    color: '#CBD5E1',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.xs,
  },
  formChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  formChipDark: {
    backgroundColor: '#1A2E24',
    borderColor: 'rgba(74, 138, 98, 0.3)',
  },
  formChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  formChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  formChipTextActive: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: radii.lg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0F172A',
  },
  inputDark: {
    backgroundColor: '#1A2E24',
    borderColor: 'rgba(74, 138, 98, 0.4)',
    color: '#FFFFFF',
  },
  textArea: {
    minHeight: 64,
  },
  inputGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  inputCol: {
    flex: 1,
  },
  sevPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: radii.md,
    backgroundColor: '#F1F5F9',
  },
  sevPillActive: {
    backgroundColor: '#10B981',
  },
  sevPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  sevPillTextActive: {
    color: '#FFFFFF',
  },
  saveBtn: {
    backgroundColor: '#059669',
    borderRadius: radii.xl,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  imageCardContainer: {
    position: 'relative',
    height: 160,
    borderRadius: radii.md,
    overflow: 'hidden',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  recordImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E2E8F0',
  },
  aiOverlayBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(5, 150, 105, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  aiOverlayText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  photoActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  photoActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingVertical: 8,
    borderRadius: radii.sm,
  },
  photoActionBtnAi: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  photoActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  analyzingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: radii.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 8,
  },
  analyzingText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  previewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: radii.sm,
    padding: 8,
    marginBottom: 8,
  },
  previewThumb: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: '#CBD5E1',
  },
  previewAiTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  previewAiSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  removePhotoBtn: {
    padding: 6,
  },
});
