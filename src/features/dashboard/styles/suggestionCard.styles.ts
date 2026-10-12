import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../../theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.xxl,
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.35)',
    padding: spacing.base,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardDark: {
    backgroundColor: '#182A22',
    borderColor: '#23382E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  headerTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 16,
  },
  headerTitleDark: {
    color: '#F0FDF4',
  },
  audioBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.3)',
  },
  audioBadgeDark: {
    backgroundColor: 'rgba(34, 197, 94, 0.25)',
    borderColor: '#22C55E',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(74, 138, 98, 0.18)',
  },
  itemRowDark: {
    borderBottomColor: '#23382E',
  },
  lastItemRow: {
    borderBottomWidth: 0,
    paddingBottom: spacing.xs,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  iconCircleDark: {
    backgroundColor: '#13351F',
  },
  textWrapper: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  itemTitleDark: {
    color: '#F0FDF4',
  },
  itemSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemSubtitleDark: {
    color: '#94A3B8',
  },
  chevronCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(74, 138, 98, 0.08)',
  },
  chevronCircleDark: {
    backgroundColor: '#23382E',
  },
});
