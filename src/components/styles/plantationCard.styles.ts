import { StyleSheet } from 'react-native';
import { radii, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: '#182C23',
    borderColor: 'rgba(74, 138, 98, 0.45)',
    shadowOpacity: 0.35,
  },
  imageContainer: {
    width: 82,
    height: 82,
    borderRadius: radii.lg,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F4F6F0',
  },
  imageContainerDark: {
    backgroundColor: '#14251D',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  placeholderImageDark: {
    backgroundColor: 'rgba(34, 197, 94, 0.18)',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadgeText: {
    ...typography.micro,
    color: '#07150E',
    fontWeight: '700',
    fontSize: 9,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  title: {
    ...typography.bodyBold,
    color: '#172B23',
    marginBottom: 2,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    ...typography.caption,
    color: '#4A5E54',
    marginBottom: spacing.xs + 2,
    lineHeight: 16,
  },
  subtitleDark: {
    color: '#CBD5E1',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(27, 77, 62, 0.08)',
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.25)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginRight: spacing.xs + 2,
  },
  badgeDark: {
    backgroundColor: 'rgba(34, 197, 94, 0.18)',
    borderColor: 'rgba(74, 138, 98, 0.4)',
  },
  badgeText: {
    ...typography.micro,
    color: '#172B23',
    marginLeft: 3,
    fontWeight: '600',
  },
  badgeTextDark: {
    color: '#FFFFFF',
  },
  chevronWrapper: {
    marginLeft: spacing.xs,
  },
});
