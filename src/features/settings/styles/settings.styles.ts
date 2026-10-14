import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../../theme';

export const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  headerDark: {
    backgroundColor: '#0B1410',
  },
  headerTopRow: {
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
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  titleDark: {
    color: '#F0FDF4',
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  subtitleDark: {
    color: '#94A3B8',
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: 60,
  },
  profileCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.xl,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.md,
  },
  profileCardDark: {
    backgroundColor: '#182A22',
    borderColor: '#23382E',
  },
  profileTextWrapper: {
    flex: 1,
  },
  profileName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  profileNameDark: {
    color: '#F0FDF4',
  },
  profileEmail: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  profileEmailDark: {
    color: '#94A3B8',
  },
  demoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.sm,
    marginTop: spacing.xs,
  },
  demoBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryLight,
  },
  sectionCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  sectionCardDark: {
    backgroundColor: '#182A22',
    borderColor: '#23382E',
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  sectionTitleDark: {
    color: '#F0FDF4',
  },
  farmsList: {
    gap: spacing.xs,
  },
  farmItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceInput,
    gap: spacing.sm,
  },
  farmItemActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
  },
  farmItemActiveDark: {
    backgroundColor: '#13351F',
  },
  farmItemText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  farmItemTextDark: {
    color: '#94A3B8',
  },
  farmItemTextActive: {
    fontWeight: '700',
    color: colors.primary,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  settingRowDark: {
    borderBottomColor: '#23382E',
  },
  settingTextWrapper: {
    flex: 1,
    paddingRight: spacing.md,
  },
  settingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingLabel: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  settingLabelDark: {
    color: '#F0FDF4',
  },
  settingDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  settingDescDark: {
    color: '#94A3B8',
  },
  langSegment: {
    flexDirection: 'row',
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceInput,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  langSegmentDark: {
    backgroundColor: '#13211B',
    borderColor: '#23382E',
  },
  langSegmentBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  langSegmentBtnActive: {
    backgroundColor: colors.primary,
  },
  langSegmentBtnActiveDark: {
    backgroundColor: '#22C55E',
  },
  langSegmentText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  langSegmentTextDark: {
    color: '#94A3B8',
  },
  langSegmentTextActive: {
    color: '#FFFFFF',
  },
  networkStatusRow: {
    paddingVertical: spacing.xs,
  },
  networkIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  networkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  networkStatusText: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  networkStatusTextDark: {
    color: '#F0FDF4',
  },
  networkSubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.md,
    marginTop: 2,
  },
  networkSubtextDark: {
    color: '#94A3B8',
  },
  actionSection: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  actionButton: {
    width: '100%',
  },
  versionText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  versionTextDark: {
    color: '#64748B',
  },
});
