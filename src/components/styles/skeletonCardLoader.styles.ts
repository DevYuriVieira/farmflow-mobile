import { StyleSheet } from 'react-native';
import { radii, spacing } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8DB',
  },
  cardDark: {
    backgroundColor: '#182C23',
    borderColor: '#2C493A',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
    marginRight: spacing.md,
  },
  headerTexts: {
    flex: 1,
  },
  lineLarge: {
    height: 14,
    width: '75%',
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    marginBottom: 8,
  },
  lineMedium: {
    height: 10,
    width: '45%',
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: spacing.sm,
  },
  pill: {
    height: 18,
    width: 80,
    backgroundColor: '#E2E8F0',
    borderRadius: radii.pill,
  },
  pillSmall: {
    height: 18,
    width: 60,
    backgroundColor: '#E2E8F0',
    borderRadius: radii.pill,
  },
  boneDark: {
    backgroundColor: '#2A4638',
  },
});
