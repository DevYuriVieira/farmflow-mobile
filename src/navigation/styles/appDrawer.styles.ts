import { StyleSheet } from 'react-native';
import { radii, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingHorizontal: spacing.base,
    backgroundColor: '#07150E',
  },
  drawerHeader: {
    paddingBottom: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(74, 138, 98, 0.3)',
    marginBottom: spacing.md,
  },
  brandBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 40, 27, 0.95)',
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs + 2,
  },
  brandTitle: {
    ...typography.h2,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  brandSubtitle: {
    ...typography.micro,
    color: '#86EFAC',
  },
  userCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 38, 26, 0.9)',
    borderRadius: radii.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.35)',
    marginBottom: spacing.base,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A2E24',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.4)',
  },
  avatarMiniImg: {
    width: '100%',
    height: '100%',
  },
  userTextCol: {
    flex: 1,
  },
  userName: {
    ...typography.captionMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  userEmail: {
    ...typography.micro,
    color: '#94A3B8',
  },
  menuScroll: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    marginBottom: spacing.xs,
  },
  menuItemActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.5)',
  },
  menuItemText: {
    ...typography.bodyMedium,
    color: '#E2E8F0',
    marginLeft: spacing.md,
  },
  menuItemTextActive: {
    color: '#4ADE80',
    fontWeight: '700',
  },
  fieldModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    marginHorizontal: spacing.sm,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: '#FACC15',
    gap: spacing.sm,
  },
  fieldModeText: {
    ...typography.captionMedium,
    fontWeight: '700',
    fontSize: 12,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(74, 138, 98, 0.3)',
  },
  logoutText: {
    ...typography.captionMedium,
    color: '#EF4444',
    marginLeft: spacing.sm,
    fontWeight: '600',
  },
});
