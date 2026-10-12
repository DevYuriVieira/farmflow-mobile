import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FarmActivity, ActivityType } from '../types/activity.types';
import { colors } from '../theme';
import { styles } from './styles/activityCard.styles';
import { getActivityTypeLabel, getActivityTitle, getActivityDescription } from '../utils/formatters';
import { formatTimePtBr, formatDatePtBr } from '../utils/dates';
import { usePreferences } from '../contexts/PreferencesContext';
import { triggerHaptic } from '../utils/haptics';

export interface ActivityCardProps {
  activity: FarmActivity;
  onToggleComplete?: (completed: boolean) => void;
  onPress: () => void;
  farmName?: string;
  isCompact?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onToggleComplete,
  onPress,
  farmName,
  isCompact = false,
}) => {
  const { isDark, language } = usePreferences();

  const handleToggle = () => {
    void triggerHaptic(activity.completed ? 'light' : 'success');
    onToggleComplete?.(!activity.completed);
  };

  const getActivityIcon = (type: ActivityType): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (type) {
      case 'IRRIGATION':
        return 'water-outline';
      case 'FERTILIZATION':
        return 'leaf-circle-outline';
      case 'PEST_CONTROL':
        return 'bug-outline';
      case 'PLANTING':
        return 'sprout-outline';
      case 'HARVEST':
        return 'basket-outline';
      case 'SOIL_ANALYSIS':
        return 'flask-outline';
      case 'PRUNING':
        return 'content-cut';
      case 'OTHER':
      default:
        return 'clipboard-text-outline';
    }
  };

  if (isCompact) {
    return (
      <View style={styles.compactRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleToggle}
          style={styles.checkboxContainer}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: activity.completed }}
        >
          <MaterialCommunityIcons
            name={activity.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
            size={22}
            color={activity.completed ? (isDark ? '#4ADE80' : colors.primary) : (isDark ? '#94A3B8' : colors.textMuted)}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPress}
          style={styles.compactContent}
        >
          <Text
            style={[
              styles.compactTitle,
              isDark && styles.compactTitleDark,
              activity.completed && (isDark ? styles.completedTextDark : styles.completedText),
            ]}
            numberOfLines={1}
          >
            {getActivityTitle(activity, language)} {language === 'en' ? 'at' : 'às'} {formatTimePtBr(activity.scheduledAt)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      style={[
        styles.card,
        isDark && styles.cardDark,
        activity.completed && (isDark ? styles.completedCardDark : styles.completedCard),
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleToggle}
          style={styles.checkboxBtn}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: activity.completed }}
        >
          <MaterialCommunityIcons
            name={activity.completed ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
            size={24}
            color={activity.completed ? (isDark ? '#4ADE80' : colors.primary) : (isDark ? '#94A3B8' : colors.textMuted)}
          />
        </TouchableOpacity>

        <View style={styles.titleWrapper}>
          <Text
            style={[
              styles.title,
              isDark && styles.titleDark,
              activity.completed && (isDark ? styles.completedTextDark : styles.completedText),
            ]}
            numberOfLines={1}
          >
            {getActivityTitle(activity, language)}
          </Text>
          <Text
            style={[styles.description, isDark && styles.descriptionDark]}
            numberOfLines={2}
          >
            {getActivityDescription(activity, language)}
          </Text>
        </View>

        <View style={[styles.typeIconBadge, isDark && styles.typeIconBadgeDark]}>
          <MaterialCommunityIcons
            name={getActivityIcon(activity.type)}
            size={20}
            color={isDark ? '#4ADE80' : colors.primaryLight}
          />
        </View>
      </View>

      <View style={[styles.metaRow, isDark && styles.metaRowDark]}>
        <View style={[styles.metaBadge, isDark && styles.metaBadgeDark]}>
          <Text style={[styles.metaBadgeText, isDark && styles.metaBadgeTextDark]}>
            {getActivityTypeLabel(activity.type, language)}
          </Text>
        </View>

        <View style={styles.timeRow}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={13}
            color={isDark ? '#CBD5E1' : colors.textMuted}
          />
          <Text style={[styles.timeText, isDark && styles.timeTextDark]}>
            {formatDatePtBr(activity.scheduledAt)} {language === 'en' ? 'at' : 'às'} {formatTimePtBr(activity.scheduledAt)}
          </Text>
        </View>

        {farmName && (
          <View style={styles.farmRow}>
            <MaterialCommunityIcons
              name="home-outline"
              size={13}
              color={isDark ? '#CBD5E1' : colors.textMuted}
            />
            <Text style={[styles.farmText, isDark && styles.farmTextDark]} numberOfLines={1}>
              {farmName}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

