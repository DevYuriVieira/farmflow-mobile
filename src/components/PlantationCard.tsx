import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Plantation } from '../types/plantation.types';
import { colors } from '../theme';
import { getCropLabel, getPlantationStatusLabel, formatHectares, getPlantationName, getPlantationNotes } from '../utils/formatters';
import { usePreferences } from '../contexts/PreferencesContext';
import { styles } from './styles/plantationCard.styles';

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
      accessibilityLabel={`${language === 'en' ? 'Field' : 'Talhão'} ${plantation.name}, ${getCropLabel(plantation.cropType, language)}`}
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
            {getPlantationStatusLabel(plantation.status, language)}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, isDark && styles.titleDark]} numberOfLines={1}>
          {getPlantationName(plantation, language)}
        </Text>
        <Text style={[styles.subtitle, isDark && styles.subtitleDark]} numberOfLines={2}>
          {plantation.notes
            ? getPlantationNotes(plantation, language)
            : `${language === 'en' ? 'Crop' : 'Cultura'}: ${getCropLabel(plantation.cropType, language)}`}
        </Text>

        <View style={styles.badgesRow}>
          <View style={[styles.badge, isDark && styles.badgeDark]}>
            <MaterialCommunityIcons
              name="vector-square"
              size={13}
              color={isDark ? '#4ADE80' : colors.primaryLight}
            />
            <Text style={[styles.badgeText, isDark && styles.badgeTextDark]}>
              {formatHectares(plantation.areaHectares, language)}
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

