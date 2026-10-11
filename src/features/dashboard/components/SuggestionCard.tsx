import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../../../theme';
import { usePreferences } from '../../../contexts/PreferencesContext';

export interface SuggestionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
}

export interface SuggestionCardProps {
  suggestions: SuggestionItem[];
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestions }) => {
  const { isDark, language } = usePreferences();

  return (
    <View style={[styles.card, isDark && styles.cardDark]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
          {language === 'en' ? "Today's AI Suggestion" : 'Sugestões do Dia'}
        </Text>
        <View style={[styles.audioBadge, isDark && styles.audioBadgeDark]}>
          <MaterialCommunityIcons
            name="waveform"
            size={16}
            color={isDark ? '#4ADE80' : colors.primaryLight}
          />
        </View>
      </View>

      {/* Suggestion Items */}
      {suggestions.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.78}
          onPress={item.onPress}
          style={[
            styles.itemRow,
            index === suggestions.length - 1 && styles.lastItemRow,
            isDark && styles.itemRowDark,
          ]}
        >
          <View style={[styles.iconCircle, isDark && styles.iconCircleDark]}>
            <MaterialCommunityIcons
              name={item.icon}
              size={20}
              color={isDark ? '#4ADE80' : colors.primaryLight}
            />
          </View>

          <View style={styles.textWrapper}>
            <Text style={[styles.itemTitle, isDark && styles.itemTitleDark]}>{item.title}</Text>
            <Text style={[styles.itemSubtitle, isDark && styles.itemSubtitleDark]}>
              {item.subtitle}
            </Text>
          </View>

          <View style={[styles.chevronCircle, isDark && styles.chevronCircleDark]}>
            <MaterialCommunityIcons
              name="chevron-right"
              size={18}
              color={isDark ? '#86EFAC' : colors.textSecondary}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.xxl,
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.35)',
    padding: spacing.base,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardDark: {
    backgroundColor: '#182A22',
    borderColor: '#23382E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  headerTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 16,
  },
  headerTitleDark: {
    color: '#F0FDF4',
  },
  audioBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.3)',
  },
  audioBadgeDark: {
    backgroundColor: 'rgba(34, 197, 94, 0.25)',
    borderColor: '#22C55E',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(74, 138, 98, 0.18)',
  },
  itemRowDark: {
    borderBottomColor: '#23382E',
  },
  lastItemRow: {
    borderBottomWidth: 0,
    paddingBottom: spacing.xs,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  iconCircleDark: {
    backgroundColor: '#13351F',
  },
  textWrapper: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  itemTitleDark: {
    color: '#F0FDF4',
  },
  itemSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemSubtitleDark: {
    color: '#94A3B8',
  },
  chevronCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(74, 138, 98, 0.08)',
  },
  chevronCircleDark: {
    backgroundColor: '#23382E',
  },
});
