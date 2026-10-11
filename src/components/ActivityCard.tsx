import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FarmActivity, ActivityType } from '../types/activity.types';
import { colors, radii, spacing, typography } from '../theme';
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.25)',
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
  completedCard: {
    opacity: 0.72,
    borderColor: 'rgba(74, 138, 98, 0.15)',
  },
  completedCardDark: {
    opacity: 0.65,
    borderColor: 'rgba(74, 138, 98, 0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  checkboxBtn: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  titleWrapper: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.bodyBold,
    color: '#172B23',
    marginBottom: 2,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  description: {
    ...typography.caption,
    color: '#4A5E54',
    lineHeight: 18,
  },
  descriptionDark: {
    color: '#E2E8F0',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  completedTextDark: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  typeIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.3)',
  },
  typeIconBadgeDark: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderColor: 'rgba(74, 138, 98, 0.5)',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E7DB',
    paddingTop: spacing.xs + 2,
    marginTop: spacing.xs,
  },
  metaRowDark: {
    borderTopColor: '#2C493A',
  },
  metaBadge: {
    backgroundColor: 'rgba(27, 77, 62, 0.08)',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.25)',
  },
  metaBadgeDark: {
    backgroundColor: 'rgba(34, 197, 94, 0.18)',
    borderColor: 'rgba(74, 138, 98, 0.4)',
  },
  metaBadgeText: {
    ...typography.micro,
    color: '#1B4D3E',
    fontWeight: '700',
  },
  metaBadgeTextDark: {
    color: '#86EFAC',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  timeText: {
    ...typography.micro,
    color: '#64748B',
    marginLeft: 3,
  },
  timeTextDark: {
    color: '#CBD5E1',
  },
  farmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  farmText: {
    ...typography.micro,
    color: '#64748B',
    marginLeft: 3,
  },
  farmTextDark: {
    color: '#CBD5E1',
  },

  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  checkboxContainer: {
    marginRight: spacing.sm,
  },
  compactContent: {
    flex: 1,
  },
  compactTitle: {
    ...typography.captionMedium,
    color: '#172B23',
  },
  compactTitleDark: {
    color: '#FFFFFF',
  },
});
