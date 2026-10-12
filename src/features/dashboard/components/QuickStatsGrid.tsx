import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { styles } from '../styles/quickStatsGrid.styles';

export interface QuickStatsGridProps {
  cropsCount?: number;
  animalsCount?: number;
  soilMoisture?: number;
  harvestKg?: number;
  onCropsPress?: () => void;
  onAnimalsPress?: () => void;
  onMoisturePress?: () => void;
  onHarvestPress?: () => void;
}

export const QuickStatsGrid: React.FC<QuickStatsGridProps> = ({
  cropsCount = 12,
  animalsCount = 48,
  soilMoisture = 72,
  harvestKg = 1280,
  onCropsPress,
  onAnimalsPress,
  onMoisturePress,
  onHarvestPress,
}) => {
  const { isDark, language, t } = usePreferences();

  const stats = [
    {
      id: 'crops',
      title: t('crops'),
      value: String(cropsCount),
      icon: 'sprout' as const,
      iconBg: isDark ? '#143820' : '#E8F5E9',
      iconColor: isDark ? '#86EFAC' : '#2E7D32',
      onPress: onCropsPress,
    },
    {
      id: 'animals',
      title: t('animals'),
      value: String(animalsCount),
      icon: 'cow' as const,
      iconBg: isDark ? '#3A1F10' : '#FFEDD5',
      iconColor: isDark ? '#FDBA74' : '#C2410C',
      onPress: onAnimalsPress,
    },
    {
      id: 'moisture',
      title: t('soilMoisture'),
      value: `${soilMoisture}%`,
      icon: 'water-percent' as const,
      iconBg: isDark ? '#0F2B3D' : '#E0F2FE',
      iconColor: isDark ? '#7DD3FC' : '#0284C7',
      onPress: onMoisturePress,
    },
    {
      id: 'harvest',
      title: t('harvest'),
      value: `${harvestKg.toLocaleString(language === 'en' ? 'en-US' : 'pt-BR')} kg`,
      icon: 'basket-outline' as const,
      iconBg: isDark ? '#362407' : '#FEF3C7',
      iconColor: isDark ? '#FDE047' : '#B45309',
      onPress: onHarvestPress,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          {t('quickStats')}
        </Text>
        <Text style={[styles.subtitleBadge, isDark && styles.subtitleBadgeDark]}>
          {t('realTime')}
        </Text>
      </View>

      <View style={styles.grid}>
        {stats.map((stat) => (
          <TouchableOpacity
            key={stat.id}
            style={[styles.card, isDark && styles.cardDark]}
            onPress={stat.onPress}
            activeOpacity={0.75}
          >
            <View style={styles.cardTopRow}>
              <View style={[styles.iconCircle, { backgroundColor: stat.iconBg }]}>
                <MaterialCommunityIcons name={stat.icon} size={20} color={stat.iconColor} />
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={isDark ? '#4B6355' : '#94A3B8'}
              />
            </View>

            <View style={styles.cardBottom}>
              <Text style={[styles.statValue, isDark && styles.statValueDark]}>{stat.value}</Text>
              <Text style={[styles.statTitle, isDark && styles.statTitleDark]}>{stat.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

