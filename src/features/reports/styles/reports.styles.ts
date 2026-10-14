import { StyleSheet } from 'react-native';
import { radii, spacing, typography } from '../../../theme';

export const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    backgroundColor: '#F6F7F2',
  },
  headerDark: {
    backgroundColor: '#0B1410',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerExportBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerExportBtnDark: {
    backgroundColor: '#182C23',
    borderColor: '#2C493A',
  },
  bottomExportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: radii.xl,
    paddingVertical: 14,
    gap: 8,
    marginTop: spacing.sm,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  bottomExportBtnDark: {
    backgroundColor: '#10B981',
  },
  bottomExportText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  backBtnDark: {
    backgroundColor: '#182C23',
    borderColor: '#2C493A',
  },
  titleTextWrapper: {
    flex: 1,
  },
  title: {
    ...typography.h2,
    color: '#172B23',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    ...typography.caption,
    color: '#4A5E54',
    marginTop: 2,
  },
  subtitleDark: {
    color: '#CBD5E1',
  },
  content: {
    padding: spacing.base,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  summaryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.25)',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  summaryCardDark: {
    backgroundColor: '#182C23',
    borderColor: 'rgba(74, 138, 98, 0.45)',
  },
  summaryLabel: {
    ...typography.micro,
    color: '#64748B',
    marginTop: spacing.xs,
    marginBottom: 2,
  },
  summaryLabelDark: {
    color: '#CBD5E1',
  },
  summaryValue: {
    ...typography.h3,
    color: '#172B23',
  },
  summaryValueDark: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xxl,
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.25)',
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  cardDark: {
    backgroundColor: '#182C23',
    borderColor: 'rgba(74, 138, 98, 0.45)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.bodyBold,
    color: '#172B23',
    marginLeft: spacing.sm,
  },
  cardTitleDark: {
    color: '#FFFFFF',
  },
  cropRow: {
    marginBottom: spacing.md,
  },
  cropRowLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cropName: {
    ...typography.captionMedium,
    color: '#172B23',
  },
  cropNameDark: {
    color: '#FFFFFF',
  },
  cropHa: {
    ...typography.caption,
    color: '#4A5E54',
  },
  cropHaDark: {
    color: '#CBD5E1',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#F4F6F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarTrackDark: {
    backgroundColor: '#14251D',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 4,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E7DB',
  },
  metricItemDark: {
    borderBottomColor: '#2C493A',
  },
  metricLabel: {
    ...typography.caption,
    color: '#4A5E54',
  },
  metricLabelDark: {
    color: '#CBD5E1',
  },
  metricVal: {
    ...typography.captionMedium,
    color: '#172B23',
    fontWeight: '700',
  },
  metricValDark: {
    color: '#FFFFFF',
  },
  precisionExportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: '#E2E8DB',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  precisionExportCardDark: {
    backgroundColor: '#182C23',
    borderColor: '#2C493A',
  },
  precisionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  precisionCardTitle: {
    ...typography.bodyBold,
    fontWeight: '700',
    color: '#172B23',
  },
  precisionCardTitleDark: {
    color: '#FFFFFF',
  },
  precisionCardDesc: {
    ...typography.micro,
    color: '#4A5E54',
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  precisionCardDescDark: {
    color: '#94A3B8',
  },
  precisionBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  precisionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radii.md,
    gap: 6,
  },
  geoBtn: {
    backgroundColor: '#0284C7',
  },
  kmlBtn: {
    backgroundColor: '#16A34A',
  },
  csvBtn: {
    backgroundColor: '#D97706',
  },
  precisionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
