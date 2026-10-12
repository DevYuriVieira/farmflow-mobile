import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../theme';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { styles } from '../styles/suggestionCard.styles';

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

