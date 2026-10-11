import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Farm } from '../types/farm.types';
import { colors, radii, spacing, typography } from '../theme';
import { formatHectares, getFarmDisplayName } from '../utils/formatters';
import { usePreferences } from '../contexts/PreferencesContext';

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

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.25)',
    padding: spacing.base,
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
  selectedCard: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  selectedCardDark: {
    borderColor: '#4ADE80',
    backgroundColor: '#1B382B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  titleWrapper: {
    flex: 1,
    marginRight: spacing.sm,
  },
  name: {
    ...typography.h3,
    color: '#172B23',
    marginBottom: 2,
  },
  nameDark: {
    color: '#FFFFFF',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    ...typography.caption,
    color: '#4A5E54',
    marginLeft: 3,
  },
  locationTextDark: {
    color: '#CBD5E1',
  },
  selectedBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  selectedBadgeText: {
    ...typography.micro,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  selectButton: {
    borderWidth: 1,
    borderColor: '#22C55E',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  selectButtonDark: {
    borderColor: '#4ADE80',
  },
  selectButtonText: {
    ...typography.micro,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  selectButtonTextDark: {
    color: '#4ADE80',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F6F0',
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E7DB',
  },
  statsRowDark: {
    backgroundColor: '#14251D',
    borderColor: '#233A2E',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E7DB',
  },
  statDividerDark: {
    backgroundColor: '#2C493A',
  },
  statLabel: {
    ...typography.micro,
    color: '#64748B',
    marginBottom: 2,
  },
  statLabelDark: {
    color: '#94A3B8',
  },
  statValue: {
    ...typography.captionMedium,
    color: '#172B23',
    fontWeight: '700',
  },
  statValueDark: {
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E2E7DB',
    paddingTop: spacing.sm,
  },
  footerDark: {
    borderTopColor: '#2C493A',
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    ...typography.captionMedium,
    color: colors.primaryLight,
    marginRight: 4,
    fontWeight: '600',
  },
  viewDetailsTextDark: {
    color: '#86EFAC',
  },
  shareBtn: {
    padding: spacing.xs,
  },
});
