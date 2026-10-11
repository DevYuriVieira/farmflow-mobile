import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Plantation } from '../types/plantation.types';
import { colors, radii, spacing, typography } from '../theme';
import { cropTypeLabels, plantationStatusLabels, formatHectares } from '../utils/formatters';
import { usePreferences } from '../contexts/PreferencesContext';

export interface PlantationCardProps {
  plantation: Plantation;
  activityCount?: number;
  onPress: () => void;
}

export const PlantationCard: React.FC<PlantationCardProps> = ({
  plantation,
  activityCount = 0,
  onPress,
}) => {
  const { isDark, language } = usePreferences();

  const statusColor =
    plantation.status === 'HARVEST_READY'
      ? colors.success
      : plantation.status === 'GROWING'
      ? (isDark ? '#4ADE80' : colors.primaryLight)
      : plantation.status === 'SOWING'
      ? colors.accentGold
      : (isDark ? '#94A3B8' : colors.textMuted);

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      style={[styles.card, isDark && styles.cardDark]}
      accessibilityRole="button"
      accessibilityLabel={`Talhão ${plantation.name}, cultura ${cropTypeLabels[plantation.cropType]}`}
    >
      <View style={[styles.imageContainer, isDark && styles.imageContainerDark]}>
        {plantation.imageUri ? (
          <Image source={{ uri: plantation.imageUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.placeholderImage, isDark && styles.placeholderImageDark]}>
            <MaterialCommunityIcons
              name="sprout"
              size={32}
              color={isDark ? '#4ADE80' : colors.primaryLight}
            />
          </View>
        )}
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusBadgeText}>
            {plantationStatusLabels[plantation.status]}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, isDark && styles.titleDark]} numberOfLines={1}>
          {plantation.name}
        </Text>
        <Text style={[styles.subtitle, isDark && styles.subtitleDark]} numberOfLines={2}>
          {plantation.notes || `${language === 'en' ? 'Crop' : 'Cultura'}: ${cropTypeLabels[plantation.cropType]}`}
        </Text>

        <View style={styles.badgesRow}>
          <View style={[styles.badge, isDark && styles.badgeDark]}>
            <MaterialCommunityIcons
              name="vector-square"
              size={13}
              color={isDark ? '#4ADE80' : colors.primaryLight}
            />
            <Text style={[styles.badgeText, isDark && styles.badgeTextDark]}>
              {formatHectares(plantation.areaHectares)}
            </Text>
          </View>
          <View style={[styles.badge, isDark && styles.badgeDark]}>
            <MaterialCommunityIcons
              name="clipboard-check-outline"
              size={13}
              color={isDark ? '#86EFAC' : colors.accentSprout}
            />
            <Text style={[styles.badgeText, isDark && styles.badgeTextDark]}>
              {activityCount} {language === 'en' ? 'Activities' : 'Atividades'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.chevronWrapper}>
        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          color={isDark ? '#CBD5E1' : colors.textMuted}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: '#182C23',
    borderColor: 'rgba(74, 138, 98, 0.45)',
    shadowOpacity: 0.35,
  },
  imageContainer: {
    width: 82,
    height: 82,
    borderRadius: radii.lg,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F4F6F0',
  },
  imageContainerDark: {
    backgroundColor: '#14251D',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  placeholderImageDark: {
    backgroundColor: 'rgba(34, 197, 94, 0.18)',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadgeText: {
    ...typography.micro,
    color: '#07150E',
    fontWeight: '700',
    fontSize: 9,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  title: {
    ...typography.bodyBold,
    color: '#172B23',
    marginBottom: 2,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    ...typography.caption,
    color: '#4A5E54',
    marginBottom: spacing.xs + 2,
    lineHeight: 16,
  },
  subtitleDark: {
    color: '#CBD5E1',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(27, 77, 62, 0.08)',
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.25)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginRight: spacing.xs + 2,
  },
  badgeDark: {
    backgroundColor: 'rgba(34, 197, 94, 0.18)',
    borderColor: 'rgba(74, 138, 98, 0.4)',
  },
  badgeText: {
    ...typography.micro,
    color: '#172B23',
    marginLeft: 3,
    fontWeight: '600',
  },
  badgeTextDark: {
    color: '#FFFFFF',
  },
  chevronWrapper: {
    marginLeft: spacing.xs,
  },
});
