import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../../theme';

export const styles = StyleSheet.create({
  formContainer: {
    paddingBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.captionMedium,
    color: colors.textSecondary,
    marginBottom: spacing.xs + 2,
    marginTop: spacing.xs,
  },
  fieldError: {
    ...typography.micro,
    color: colors.danger,
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceInput,
    borderRadius: radii.pill,
    borderWidth: 1.2,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    marginRight: spacing.xs + 2,
    marginBottom: spacing.xs + 2,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.micro,
    color: colors.textSecondary,
    marginLeft: 3,
  },
  chipTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  rowTwoCols: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    flex: 0.48,
  },
  imagePickerWrapper: {
    backgroundColor: colors.surfaceInput,
    borderRadius: radii.lg,
    borderWidth: 1.2,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  imagePreviewContainer: {
    height: 140,
    borderRadius: radii.md,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: spacing.md,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImagePlaceholder: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
  },
  noImageText: {
    ...typography.micro,
    color: colors.textMuted,
    marginTop: 4,
  },
  imageActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  imageActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceCardSolid,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageActionBtnText: {
    ...typography.captionMedium,
    color: colors.primaryLight,
    marginLeft: 4,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.md,
  },
  cancelBtn: {
    marginRight: spacing.sm,
    minWidth: 100,
  },
  saveBtn: {
    minWidth: 150,
  },
});
