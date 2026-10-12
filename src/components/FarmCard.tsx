import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Farm } from '../types/farm.types';
import { colors } from '../theme';
import { formatHectares, getFarmDisplayName } from '../utils/formatters';
import { usePreferences } from '../contexts/PreferencesContext';
import { styles } from './styles/farmCard.styles';

export interface FarmCardProps {
  farm: Farm;
  isSelected?: boolean;
  plantationCount?: number;
  onPress: () => void;
  onSelect?: () => void;
  onShare?: () => void;
}

export const FarmCard: React.FC<FarmCardProps> = ({
  farm,
  isSelected = false,
  plantationCount = 0,
  onPress,
  onSelect,
  onShare,
}) => {
  const { isDark, language } = usePreferences();

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      style={[
        styles.card,
        isDark && styles.cardDark,
        isSelected && (isDark ? styles.selectedCardDark : styles.selectedCard),
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleWrapper}>
          <Text style={[styles.name, isDark && styles.nameDark]} numberOfLines={1}>
            {getFarmDisplayName(farm, language)}
          </Text>
          <View style={styles.locationRow}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={14}
              color={isDark ? '#4ADE80' : colors.primaryLight}
            />
            <Text
              style={[styles.locationText, isDark && styles.locationTextDark]}
              numberOfLines={1}
            >
              {farm.location}
            </Text>
          </View>
        </View>

        {isSelected ? (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedBadgeText}>
              {language === 'en' ? 'Active' : 'Ativa'}
            </Text>
          </View>
        ) : onSelect ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onSelect}
            style={[styles.selectButton, isDark && styles.selectButtonDark]}
          >
            <Text style={[styles.selectButtonText, isDark && styles.selectButtonTextDark]}>
              {language === 'en' ? 'Select' : 'Selecionar'}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={[styles.statsRow, isDark && styles.statsRowDark]}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
            {language === 'en' ? 'Total Area' : 'Área Total'}
          </Text>
          <Text style={[styles.statValue, isDark && styles.statValueDark]}>
            {formatHectares(farm.totalAreaHectares, language)}
          </Text>
        </View>
        <View style={[styles.statDivider, isDark && styles.statDividerDark]} />
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
            {language === 'en' ? 'Fields' : 'Talhões'}
          </Text>
          <Text style={[styles.statValue, isDark && styles.statValueDark]}>
            {plantationCount}
          </Text>
        </View>
        <View style={[styles.statDivider, isDark && styles.statDividerDark]} />
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
            {language === 'en' ? 'Coords' : 'Coordenadas'}
          </Text>
          <Text style={[styles.statValue, isDark && styles.statValueDark]}>
            {farm.coordinates.latitude.toFixed(2)}, {farm.coordinates.longitude.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={[styles.footer, isDark && styles.footerDark]}>
        <View style={styles.viewDetailsRow}>
          <Text style={[styles.viewDetailsText, isDark && styles.viewDetailsTextDark]}>
            {language === 'en' ? 'View Details' : 'Ver Detalhes'}
          </Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={16}
            color={isDark ? '#4ADE80' : colors.primaryLight}
          />
        </View>
        {onShare && (
          <TouchableOpacity
            onPress={onShare}
            style={styles.shareBtn}
            accessibilityLabel="Compartilhar fazenda"
          >
            <MaterialCommunityIcons
              name="share-variant-outline"
              size={18}
              color={isDark ? '#CBD5E1' : colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

