import { StyleSheet, Platform } from 'react-native';
import { radii, spacing } from '../../../theme';

export const styles = StyleSheet.create({
  content: {
    paddingTop: 4,
    paddingBottom: 90,
  },
  contentDark: {
    backgroundColor: '#0B1410',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  avatarWrapper: {
    marginRight: 2,
  },
  farmSelectorCenter: {
    flex: 1,
    paddingHorizontal: 8,
  },
  greetingText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  greetingTextDark: {
    color: '#94A3B8',
  },
  farmNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  farmNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  farmNameTextDark: {
    color: '#F0FDF4',
  },
  headerActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickPillButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radii.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickPillButtonDark: {
    backgroundColor: '#182A22',
    borderColor: '#23382E',
  },
  quickPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
  },
  quickPillTextDark: {
    color: '#F0FDF4',
  },
  quickIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickIconButtonDark: {
    backgroundColor: '#182A22',
    borderColor: '#23382E',
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  notificationButtonDark: {
    backgroundColor: '#182A22',
    borderColor: '#23382E',
  },
  bellDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  sectionWrap: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  activitiesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xxl,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E8ECE2',
    ...Platform.select({
      ios: {
        shadowColor: '#0F291E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      default: {
        shadowColor: '#0F291E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
    }),
  },
  activitiesCardDark: {
    backgroundColor: '#182A22',
    borderColor: '#23382E',
  },
  activitiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  activitiesHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activitiesTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  activitiesTitleDark: {
    color: '#F0FDF4',
  },
  countBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.pill,
  },
  countBadgeDark: {
    backgroundColor: '#13351F',
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  countBadgeTextDark: {
    color: '#86EFAC',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
  },
  seeAllTextDark: {
    color: '#86EFAC',
  },
  emptyActivitiesText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    paddingVertical: 18,
  },
  emptyActivitiesTextDark: {
    color: '#94A3B8',
  },
  addHubButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1B4D3E',
    marginHorizontal: spacing.md,
    paddingVertical: 15,
    borderRadius: radii.pill,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#1B4D3E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
      default: {
        shadowColor: '#1B4D3E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
    }),
  },
  addHubButtonDark: {
    backgroundColor: '#22C55E',
  },
  addHubButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
