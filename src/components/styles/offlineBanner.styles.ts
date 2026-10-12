import { StyleSheet } from 'react-native';
import { radii, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#854D0E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    marginHorizontal: spacing.base,
    marginVertical: spacing.xs,
    gap: 6,
  },
  icon: {
    marginRight: 2,
  },
  text: {
    ...typography.micro,
    color: '#FEF08A',
    fontWeight: '600',
    flexShrink: 1,
  },
  syncBtn: {
    backgroundColor: '#FEF08A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
    marginLeft: 6,
  },
  syncBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#713F12',
  },
});
