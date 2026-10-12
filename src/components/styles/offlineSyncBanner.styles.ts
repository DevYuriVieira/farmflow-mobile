import { StyleSheet } from 'react-native';
import { radii, spacing } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  containerDark: {
    backgroundColor: '#1E1B0E',
    borderBottomColor: '#453509',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  textCol: {
    flex: 1,
  },
  mainText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  mainTextDark: {
    color: '#FDE68A',
  },
  subText: {
    fontSize: 11,
    color: '#B45309',
  },
  subTextDark: {
    color: '#D97706',
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  syncBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
