import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../../theme';

export const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl + 6,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7F2',
  },
  headerDark: {
    backgroundColor: '#0B1410',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: spacing.md,
  },
  backBtnDark: {
    backgroundColor: '#182C23',
    borderColor: '#2C493A',
  },
  title: {
    ...typography.h2,
    color: '#172B23',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: spacing.base,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xxl,
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.25)',
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  qrCardDark: {
    backgroundColor: '#182C23',
    borderColor: 'rgba(74, 138, 98, 0.45)',
  },
  entityTypeBadge: {
    ...typography.micro,
    color: colors.accentLime,
    letterSpacing: 1.2,
    marginBottom: spacing.xs,
    fontWeight: '700',
  },
  entityName: {
    ...typography.h3,
    color: '#172B23',
    textAlign: 'center',
    marginBottom: 2,
  },
  entityNameDark: {
    color: '#FFFFFF',
  },
  entityIdText: {
    ...typography.micro,
    color: '#64748B',
    marginBottom: spacing.lg,
  },
  entityIdTextDark: {
    color: '#CBD5E1',
  },
  qrWrapper: {
    backgroundColor: '#FFFFFF',
    padding: spacing.base,
    borderRadius: radii.xl,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  qrInstructions: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
  shareBtn: {
    width: '100%',
  },
});
