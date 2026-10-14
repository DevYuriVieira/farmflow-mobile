import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../../theme';

export const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xs,
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnDark: {
    backgroundColor: '#182C23',
    borderColor: '#2C493A',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDark: {
    backgroundColor: '#22C55E',
  },
  statusFiltersRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs + 2,
  },
  filterChipDark: {
    backgroundColor: '#182C23',
    borderColor: '#2C493A',
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipActiveDark: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  filterChipText: {
    ...typography.micro,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterChipTextDark: {
    color: '#CBD5E1',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  typeFiltersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: spacing.xs,
  },
  typeChip: {
    backgroundColor: colors.surfaceInput,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  typeChipDark: {
    backgroundColor: '#14251D',
    borderColor: '#233A2E',
  },
  typeChipActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  typeChipActiveDark: {
    borderColor: '#22C55E',
    backgroundColor: '#1E3D2A',
  },
  typeChipText: {
    ...typography.micro,
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  typeChipTextDark: {
    color: '#E2E8F0',
  },
  typeChipTextActive: {
    color: colors.primaryLight,
    fontWeight: '700',
  },
  typeChipTextActiveDark: {
    color: '#4ADE80',
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl + 40,
  },
});
