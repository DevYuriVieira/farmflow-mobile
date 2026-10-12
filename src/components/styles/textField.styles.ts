import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  label: {
    ...typography.captionMedium,
    color: '#4A5E54',
    marginBottom: spacing.xs + 2,
  },
  labelDark: {
    color: '#E2E8F0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F6F0',
    borderRadius: radii.lg,
    borderWidth: 1.2,
    borderColor: '#E2E7DB',
    paddingHorizontal: spacing.md,
    minHeight: 50,
  },
  inputWrapperDark: {
    backgroundColor: '#16281F',
    borderColor: '#2C493A',
  },
  inputFocused: {
    borderColor: '#22C55E',
    backgroundColor: '#FFFFFF',
  },
  inputFocusedDark: {
    borderColor: '#4ADE80',
    backgroundColor: '#1E3327',
  },
  inputError: {
    borderColor: colors.danger,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: '#172B23',
    paddingVertical: spacing.sm,
  },
  inputDark: {
    color: '#FFFFFF',
  },
  rightAction: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  errorText: {
    ...typography.micro,
    color: colors.danger,
    marginLeft: spacing.xs,
  },
  helperText: {
    ...typography.micro,
    color: '#7E9489',
    marginTop: spacing.xs,
  },
  helperTextDark: {
    color: '#94A3B8',
  },
});
