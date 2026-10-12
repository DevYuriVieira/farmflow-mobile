import { StyleSheet, Platform } from 'react-native';
import { radii, spacing } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#182C22',
  },
  sectionTitleDark: {
    color: '#F0FDF4',
  },
  subtitleBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  subtitleBadgeDark: {
    color: '#86EFAC',
    backgroundColor: '#13351F',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8ECE2',
    ...Platform.select({
      ios: {
        shadowColor: '#0F291E',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      default: {
        shadowColor: '#0F291E',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
    }),
  },
  cardDark: {
    backgroundColor: '#182A22',
    borderColor: '#23382E',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBottom: {
    marginTop: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  statValueDark: {
    color: '#F8FAFC',
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  statTitleDark: {
    color: '#94A3B8',
  },
});
