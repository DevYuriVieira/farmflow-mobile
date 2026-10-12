import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 54,
    left: spacing.base,
    right: spacing.base,
    backgroundColor: '#0F271B',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.35)',
    borderLeftWidth: 4,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
  },
  toastIcon: {
    marginRight: spacing.sm,
  },
  toastText: {
    ...typography.captionMedium,
    color: colors.textPrimary,
    flex: 1,
  },
});
