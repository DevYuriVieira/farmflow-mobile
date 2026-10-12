import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, {
  Path,
  Rect,
  Circle,
  G,
  Defs,
  LinearGradient,
  Stop,
  Line,
  Polygon,
  Text as SvgText,
} from 'react-native-svg';

import { AppNavigationProp } from '../../../navigation/types';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { spacing } from '../../../theme';
import { styles } from '../styles/interactiveFarmMap.styles';


export type FarmZoneId =
  | 'overview'
  | 'house'
  | 'tomatoes'
  | 'vegetables'
  | 'corn'
  | 'animals'
  | 'storage';

export type MapLayerMode = 'standard' | 'ndvi' | 'moisture';

interface FarmZoneDetail {
  id: FarmZoneId;
  name: string;
  category: string;
  area: string;
  health: number;
  moisture: number;
  ndviIndex: number;
  ndviStatus: string;
  stage: string;
  telemetryNote: string;
  statusColor: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

export const InteractiveFarmMapScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const { isDark, language, t } = usePreferences();
  const [selectedZone, setSelectedZone] = useState<FarmZoneId>('overview');
  const [mapLayer, setMapLayer] = useState<MapLayerMode>('standard');

  const zoneDetails: Record<FarmZoneId, FarmZoneDetail> = {
    overview: {
      id: 'overview',
      name: language === 'en' ? 'Farm Overview' : 'Visão Geral da Fazenda',
      category: language === 'en' ? 'Whole Property' : 'Toda a Propriedade',
      area: '12.5 ha',
      health: 94,
      moisture: 78,
      ndviIndex: 0.82,
      ndviStatus: language === 'en' ? 'Healthy Overall Vigour' : 'Vigor Geral Saudável',
      stage: language === 'en' ? 'Active Operation' : 'Operação Ativa',
      telemetryNote:
        language === 'en'
          ? 'All 6 rural zones operating with optimal soil and irrigation indices.'
          : 'Todos os 6 setores rurais operando com índices ideais de solo e irrigação.',
      statusColor: '#10B981',
      icon: 'map-marker-radius',
    },
    house: {
      id: 'house',
      name: language === 'en' ? 'Farm Headquarters' : 'Sede da Fazenda',
      category: language === 'en' ? 'Infrastructure & Management' : 'Infraestrutura & Gestão',
      area: '0.8 ha',
      health: 99,
      moisture: 65,
      ndviIndex: 0.15,
      ndviStatus: language === 'en' ? 'Built Area / Soil' : 'Área Construída / Solo',
      stage: language === 'en' ? 'Main Headquarters' : 'Sede Principal',
      telemetryNote:
        language === 'en'
          ? 'Residence, tractor garage, technical workshop, and central management office.'
          : 'Residência, garagem de tratores, oficina técnica e escritório central.',
      statusColor: '#3B82F6',
      icon: 'home',
    },
    tomatoes: {
      id: 'tomatoes',
      name: language === 'en' ? 'Tomato Plot' : 'Talhão de Tomates',
      category: language === 'en' ? 'Horticulture / Fruit Crops' : 'Hortifrúti / Olericultura',
      area: '4.2 ha',
      health: 92,
      moisture: 82,
      ndviIndex: 0.88,
      ndviStatus: language === 'en' ? 'High Canopy Density' : 'Alta Densidade Foliar',
      stage: language === 'en' ? 'Fruiting / Maturation' : 'Frutificação / Maturação',
      telemetryNote:
        language === 'en'
          ? 'Drip irrigation scheduled for 16:00. Harvest estimated in 12 days.'
          : 'Irrigação por gotejamento programada para 16:00. Estimativa de colheita em 12 dias.',
      statusColor: '#EF4444',
      icon: 'food-apple',
    },
    vegetables: {
      id: 'vegetables',
      name: language === 'en' ? 'Vegetable Garden' : 'Horta & Legumes',
      category: language === 'en' ? 'Leafy Vegetable Crops' : 'Olericultura Folhosa',
      area: '2.0 ha',
      health: 95,
      moisture: 88,
      ndviIndex: 0.94,
      ndviStatus: language === 'en' ? 'Peak Vegetative Vigour' : 'Vigor Vegetativo Máximo',
      stage: language === 'en' ? 'Continuous Harvest' : 'Colheita Contínua',
      telemetryNote:
        language === 'en'
          ? 'Lettuce, carrot, and broccoli beds. Daily harvest for local cooperative.'
          : 'Canteiros de alface, cenoura e brócolis. Colheita diária para cooperativa.',
      statusColor: '#10B981',
      icon: 'sprout',
    },
    corn: {
      id: 'corn',
      name: language === 'en' ? 'Corn Field' : 'Lavoura de Milho',
      category: language === 'en' ? 'Grains & Cereals' : 'Grãos & Cereais',
      area: '3.5 ha',
      health: 89,
      moisture: 74,
      ndviIndex: 0.74,
      ndviStatus: language === 'en' ? 'Flowering in Progress' : 'Floração em Desenvolvimento',
      stage: language === 'en' ? 'Active Flowering' : 'Floração Ativa',
      telemetryNote:
        language === 'en'
          ? 'Off-season hybrid corn. Foliar spraying against fall armyworm scheduled.'
          : 'Milho safrinha híbrido. Pulverização foliar contra lagarta do cartucho agendada.',
      statusColor: '#F59E0B',
      icon: 'corn',
    },
    animals: {
      id: 'animals',
      name: language === 'en' ? 'Pasture & Livestock' : 'Pasto & Pecuária',
      category: language === 'en' ? 'Dairy Cattle Farming' : 'Bovinocultura de Leite',
      area: '1.8 ha',
      health: 97,
      moisture: 70,
      ndviIndex: 0.62,
      ndviStatus: language === 'en' ? 'Stable Brachiaria Pasture' : 'Pastagem Brachiaria Estável',
      stage: language === 'en' ? 'Rotational Grazing' : 'Pastejo Rotacionado',
      telemetryNote:
        language === 'en'
          ? '48 heads of Holstein dairy cattle. Clean troughs and active electric fencing.'
          : '48 cabeças de gado holandês. Bebedouros limpos e cerca elétrica ativa.',
      statusColor: '#F97316',
      icon: 'cow',
    },
    storage: {
      id: 'storage',
      name: language === 'en' ? 'Dam & Grain Silos' : 'Represa & Armazenamento',
      category: language === 'en' ? 'Water Resources & Storage' : 'Recursos Hídricos & Silos',
      area: '0.2 ha',
      health: 98,
      moisture: 96,
      ndviIndex: -0.25,
      ndviStatus: language === 'en' ? "Water Surface / Silos" : "Espelho d'Água / Silos",
      stage: language === 'en' ? 'Storage at 92%' : 'Nível em 92%',
      telemetryNote:
        language === 'en'
          ? 'Reservoir holding 9,200 L of fresh water and 2 vertical grain silos.'
          : 'Reservatório com 9.200 L de água e 2 silos verticais de grãos.',
      statusColor: '#06B6D4',
      icon: 'water-pump',
    },
  };

  const activeDetail = zoneDetails[selectedZone];

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate('Home');
    }
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity
            style={[styles.backButton, isDark && styles.backButtonDark]}
            onPress={handleBack}
            activeOpacity={0.7}
            accessibilityLabel="Voltar"
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color={isDark ? '#FFFFFF' : '#1E293B'} />
          </TouchableOpacity>
          <View style={{ marginLeft: spacing.sm, flex: 1 }}>
            <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
              {t('myFarm')}
            </Text>
            <View style={styles.locationRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={14} color="#059669" />
              <Text style={[styles.locationText, isDark && styles.locationTextDark]}>
                {language === 'en' ? 'Green Valley Farm · 12.5 ha' : 'Fazenda Santa Fé · 12.5 ha'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.weatherButton, isDark && styles.weatherButtonDark]}
          onPress={() => navigation.navigate('WeatherScreen' as never)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="weather-partly-cloudy" size={20} color={isDark ? '#FFFFFF' : '#1E293B'} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {[
          { id: 'overview', label: language === 'en' ? 'Overview' : 'Geral', icon: 'view-dashboard-outline' },
          { id: 'house', label: language === 'en' ? 'House' : 'Sede', icon: 'home-outline' },
          { id: 'tomatoes', label: language === 'en' ? 'Tomatoes' : 'Tomates', icon: 'food-apple-outline' },
          { id: 'vegetables', label: language === 'en' ? 'Vegetables' : 'Horta', icon: 'sprout-outline' },
          { id: 'corn', label: language === 'en' ? 'Corn' : 'Milho', icon: 'corn' },
          { id: 'animals', label: language === 'en' ? 'Animals' : 'Animais', icon: 'cow' },
          { id: 'storage', label: language === 'en' ? 'Water/Store' : 'Represa', icon: 'water-outline' },
        ].map((tab) => {
          const isSelected = selectedZone === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabPill,
                isDark && styles.tabPillDark,
                isSelected && (isDark ? styles.tabPillActiveDark : styles.tabPillActive),
              ]}
              onPress={() => setSelectedZone(tab.id as FarmZoneId)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={tab.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                size={16}
                color={isSelected ? '#FFFFFF' : isDark ? '#94A3B8' : '#475569'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isDark && styles.tabLabelDark,
                  isSelected && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={[styles.layerSelectorBar, isDark && styles.layerSelectorBarDark]}>
        <TouchableOpacity
          style={[styles.layerBtn, mapLayer === 'standard' && styles.layerBtnActive]}
          onPress={() => setMapLayer('standard')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="layers-outline"
            size={15}
            color={mapLayer === 'standard' ? '#FFFFFF' : isDark ? '#94A3B8' : '#475569'}
          />
          <Text
            style={[
              styles.layerBtnText,
              mapLayer === 'standard' && styles.layerBtnTextActive,
              isDark && mapLayer !== 'standard' && { color: '#94A3B8' },
            ]}
          >
            {language === 'en' ? 'Standard' : 'Padrão'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.layerBtn, mapLayer === 'ndvi' && styles.layerBtnActive]}
          onPress={() => setMapLayer('ndvi')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="satellite-variant"
            size={15}
            color={mapLayer === 'ndvi' ? '#FFFFFF' : isDark ? '#94A3B8' : '#475569'}
          />
          <Text
            style={[
              styles.layerBtnText,
              mapLayer === 'ndvi' && styles.layerBtnTextActive,
              isDark && mapLayer !== 'ndvi' && { color: '#94A3B8' },
            ]}
          >
            {language === 'en' ? 'NDVI Satellite' : 'Satélite NDVI'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.layerBtn, mapLayer === 'moisture' && styles.layerBtnActive]}
          onPress={() => setMapLayer('moisture')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="water-percent"
            size={15}
            color={mapLayer === 'moisture' ? '#FFFFFF' : isDark ? '#94A3B8' : '#475569'}
          />
          <Text
            style={[
              styles.layerBtnText,
              mapLayer === 'moisture' && styles.layerBtnTextActive,
              isDark && mapLayer !== 'moisture' && { color: '#94A3B8' },
            ]}
          >
            {language === 'en' ? 'Soil Moisture' : 'Umidade Solo'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapCard}>
        <Svg width="100%" height="340" viewBox="0 0 360 340">
          <Defs>
            <LinearGradient id="grassBg" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={mapLayer === 'ndvi' ? '#A7F3D0' : mapLayer === 'moisture' ? '#BAE6FD' : '#D9F99D'} />
              <Stop offset="1" stopColor={mapLayer === 'ndvi' ? '#6EE7B7' : mapLayer === 'moisture' ? '#93C5FD' : '#BBF7D0'} />
            </LinearGradient>
            <LinearGradient id="soilTomatoes" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#9A7B56" />
              <Stop offset="1" stopColor="#785E3E" />
            </LinearGradient>
            <LinearGradient id="soilVeg" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#854D0E" />
              <Stop offset="1" stopColor="#713F12" />
            </LinearGradient>
          </Defs>

          <Rect x="0" y="0" width="360" height="340" rx="20" fill="url(#grassBg)" />

          <Path
            d="M 125 10 L 125 330 M 10 120 L 350 120 M 10 230 L 350 230"
            stroke="#FEF3C7"
            strokeWidth="12"
            strokeLinecap="round"
          />

          <G
            onPress={() => setSelectedZone('house')}
            transform="translate(14, 14)"
          >
            <Rect
              x="0"
              y="0"
              width="100"
              height="96"
              rx="12"
              fill={mapLayer === 'ndvi' ? '#94A3B8' : mapLayer === 'moisture' ? '#BAE6FD' : '#A7F3D0'}
              stroke={selectedZone === 'house' ? '#059669' : '#86EFAC'}
              strokeWidth={selectedZone === 'house' ? 3 : 1}
            />
            <Circle cx="80" cy="22" r="10" fill="#15803D" />
            <Circle cx="84" cy="40" r="8" fill="#16A34A" />
            <Rect x="16" y="32" width="48" height="36" fill="#F8FAFC" />
            <Polygon points="12,32 40,14 68,32" fill="#DC2626" />
            <Polygon points="40,14 68,32 64,48 36,32" fill="#B91C1C" />
            <Rect x="72" y="65" width="20" height="12" rx="3" fill="#2563EB" />
            <Circle cx="76" cy="78" r="3" fill="#1E293B" />
            <Circle cx="88" cy="78" r="3" fill="#1E293B" />
            <Rect x="14" y="6" width="72" height="18" rx="9" fill="#FFFFFF" opacity="0.95" />
            <SvgText x="20" y="19" fill="#1E293B" fontSize="9" fontWeight="bold">
              {mapLayer === 'ndvi' ? '0.15 NDVI' : mapLayer === 'moisture' ? (language === 'en' ? '65% Soil' : '65% Solo') : (language === 'en' ? 'HQ' : 'Sede')}
            </SvgText>
          </G>

          <G
            onPress={() => setSelectedZone('tomatoes')}
            transform="translate(136, 14)"
          >
            <Rect
              x="0"
              y="0"
              width="210"
              height="96"
              rx="12"
              fill={mapLayer === 'ndvi' ? '#059669' : mapLayer === 'moisture' ? '#0284C7' : 'url(#soilTomatoes)'}
              stroke={selectedZone === 'tomatoes' ? '#EF4444' : '#B45309'}
              strokeWidth={selectedZone === 'tomatoes' ? 3 : 1}
            />
            {[26, 44, 62, 80].map((y, rowIdx) => (
              <G key={rowIdx}>
                <Line x1="10" y1={y} x2="200" y2={y} stroke={mapLayer === 'standard' ? '#5C452B' : '#047857'} strokeWidth="2" />
                {[20, 42, 64, 86, 108, 130, 152, 174, 194].map((x, colIdx) => (
                  <G key={colIdx}>
                    <Circle cx={x} cy={y} r="4.5" fill="#22C55E" />
                    <Circle cx={x + 1.5} cy={y + 1} r="2" fill="#EF4444" />
                  </G>
                ))}
              </G>
            ))}
            <Rect x="60" y="6" width="90" height="18" rx="9" fill="#FFFFFF" opacity="0.95" />
            <SvgText x="68" y="19" fill="#1E293B" fontSize="9" fontWeight="bold">
              {mapLayer === 'ndvi'
                ? (language === 'en' ? 'Tomatoes · 0.88' : 'Tomates · 0.88')
                : mapLayer === 'moisture'
                ? (language === 'en' ? 'Tomatoes · 82%' : 'Tomates · 82%')
                : (language === 'en' ? 'Tomatoes' : 'Tomates')}
            </SvgText>
          </G>

          <G
            onPress={() => setSelectedZone('vegetables')}
            transform="translate(14, 126)"
          >
            <Rect
              x="0"
              y="0"
              width="100"
              height="94"
              rx="12"
              fill={mapLayer === 'ndvi' ? '#047857' : mapLayer === 'moisture' ? '#0369A1' : 'url(#soilVeg)'}
              stroke={selectedZone === 'vegetables' ? '#10B981' : '#A16207'}
              strokeWidth={selectedZone === 'vegetables' ? 3 : 1}
            />
            {[26, 46, 66, 82].map((y, rowIdx) => (
              <G key={rowIdx}>
                {[18, 38, 58, 78].map((x, colIdx) => (
                  <Circle key={colIdx} cx={x} cy={y} r="5" fill="#4ADE80" />
                ))}
              </G>
            ))}
            <Rect x="12" y="6" width="76" height="18" rx="9" fill="#FFFFFF" opacity="0.95" />
            <SvgText x="18" y="19" fill="#1E293B" fontSize="9" fontWeight="bold">
              {mapLayer === 'ndvi'
                ? (language === 'en' ? 'Garden · 0.94' : 'Horta · 0.94')
                : mapLayer === 'moisture'
                ? (language === 'en' ? 'Garden · 88%' : 'Horta · 88%')
                : (language === 'en' ? 'Garden' : 'Horta')}
            </SvgText>
          </G>

          <G
            onPress={() => setSelectedZone('corn')}
            transform="translate(136, 126)"
          >
            <Rect
              x="0"
              y="0"
              width="210"
              height="94"
              rx="12"
              fill={mapLayer === 'ndvi' ? '#65A30D' : mapLayer === 'moisture' ? '#38BDF8' : '#FEF08A'}
              stroke={selectedZone === 'corn' ? '#F59E0B' : '#EAB308'}
              strokeWidth={selectedZone === 'corn' ? 3 : 1}
            />
            {[20, 36, 52, 68, 84].map((x, colIdx) => (
              <G key={colIdx}>
                <Line x1={x} y1="20" x2={x} y2="88" stroke="#15803D" strokeWidth="3" />
                {[26, 42, 58, 74].map((y, leafIdx) => (
                  <Path
                    key={leafIdx}
                    d={`M ${x} ${y} Q ${x - 5} ${y - 4} ${x - 8} ${y} M ${x} ${y} Q ${x + 5} ${y - 4} ${x + 8} ${y}`}
                    stroke="#16A34A"
                    strokeWidth="2"
                    fill="none"
                  />
                ))}
              </G>
            ))}
            <Rect x="175" y="45" width="22" height="16" rx="4" fill="#DC2626" />
            <Circle cx="180" cy="62" r="4.5" fill="#1E293B" />
            <Circle cx="194" cy="62" r="3.5" fill="#1E293B" />
            <Rect x="70" y="6" width="76" height="18" rx="9" fill="#FFFFFF" opacity="0.95" />
            <SvgText x="78" y="19" fill="#1E293B" fontSize="9" fontWeight="bold">
              {mapLayer === 'ndvi'
                ? (language === 'en' ? 'Corn · 0.74' : 'Milho · 0.74')
                : mapLayer === 'moisture'
                ? (language === 'en' ? 'Corn · 74%' : 'Milho · 74%')
                : (language === 'en' ? 'Corn' : 'Milho')}
            </SvgText>
          </G>

          <G
            onPress={() => setSelectedZone('animals')}
            transform="translate(14, 236)"
          >
            <Rect
              x="0"
              y="0"
              width="170"
              height="90"
              rx="12"
              fill={mapLayer === 'ndvi' ? '#CA8A04' : mapLayer === 'moisture' ? '#7DD3FC' : '#BBF7D0'}
              stroke={selectedZone === 'animals' ? '#F97316' : '#86EFAC'}
              strokeWidth={selectedZone === 'animals' ? 3 : 1}
            />
            <Rect x="12" y="24" width="34" height="28" fill="#DC2626" />
            <Polygon points="10,24 29,12 48,24" fill="#B91C1C" />
            <Rect x="22" y="34" width="14" height="18" fill="#FFFFFF" />
            <G transform="translate(68, 30)">
              <Rect x="0" y="2" width="14" height="9" rx="2" fill="#FFFFFF" />
              <Circle cx="4" cy="5" r="2.5" fill="#1E293B" />
              <Circle cx="9" cy="4" r="2" fill="#1E293B" />
              <Rect x="12" y="1" width="5" height="6" rx="1.5" fill="#FFFFFF" />
            </G>
            <G transform="translate(110, 42)">
              <Rect x="0" y="2" width="14" height="9" rx="2" fill="#FFFFFF" />
              <Circle cx="5" cy="6" r="2.5" fill="#1E293B" />
              <Rect x="12" y="1" width="5" height="6" rx="1.5" fill="#FFFFFF" />
            </G>
            <Rect x="85" y="65" width="22" height="10" rx="3" fill="#38BDF8" />
            <Rect x="44" y="6" width="80" height="18" rx="9" fill="#FFFFFF" opacity="0.95" />
            <SvgText x="50" y="19" fill="#1E293B" fontSize="9" fontWeight="bold">
              {mapLayer === 'ndvi'
                ? (language === 'en' ? 'Pasture · 0.62' : 'Pasto · 0.62')
                : mapLayer === 'moisture'
                ? (language === 'en' ? 'Pasture · 70%' : 'Pasto · 70%')
                : (language === 'en' ? 'Livestock' : 'Animais')}
            </SvgText>
          </G>

          <G
            onPress={() => setSelectedZone('storage')}
            transform="translate(194, 236)"
          >
            <Rect
              x="0"
              y="0"
              width="152"
              height="90"
              rx="12"
              fill={mapLayer === 'ndvi' ? '#1E3A8A' : mapLayer === 'moisture' ? '#0C4A6E' : '#E0F2FE'}
              stroke={selectedZone === 'storage' ? '#06B6D4' : '#BAE6FD'}
              strokeWidth={selectedZone === 'storage' ? 3 : 1}
            />
            <Circle cx="110" cy="46" r="24" fill="#38BDF8" />
            <Circle cx="110" cy="46" r="16" fill="#0284C7" opacity="0.4" />
            <Rect x="16" y="20" width="18" height="40" rx="6" fill="#CBD5E1" />
            <Path d="M 16 24 Q 25 12 34 24 Z" fill="#94A3B8" />
            <Rect x="40" y="26" width="18" height="34" rx="6" fill="#CBD5E1" />
            <Rect x="64" y="32" width="30" height="28" rx="3" fill="#64748B" />
            <Rect x="36" y="6" width="82" height="18" rx="9" fill="#FFFFFF" opacity="0.95" />
            <SvgText x="42" y="19" fill="#1E293B" fontSize="9" fontWeight="bold">
              {mapLayer === 'ndvi'
                ? (language === 'en' ? 'Dam / Silos' : 'Represa / Silos')
                : mapLayer === 'moisture'
                ? (language === 'en' ? 'Dam · 96%' : 'Represa · 96%')
                : (language === 'en' ? 'Storage' : 'Armazém')}
            </SvgText>
          </G>
        </Svg>

        <View style={styles.explorePill}>
          <MaterialCommunityIcons
            name={mapLayer === 'ndvi' ? 'satellite-variant' : mapLayer === 'moisture' ? 'water-percent' : 'gesture-tap'}
            size={16}
            color="#059669"
          />
          <Text style={styles.exploreText}>
            {mapLayer === 'ndvi'
              ? (language === 'en'
                  ? 'Sentinel-2 Satellite · NDVI Vegetative Vigour (0.0 to 1.0)'
                  : 'Satélite Sentinel-2 · Vigor Vegetativo NDVI (0.0 a 1.0)')
              : mapLayer === 'moisture'
              ? (language === 'en'
                  ? 'LoRaWAN FDR Telemetry · Soil Moisture (%)'
                  : 'Telemetria FDR LoRaWAN · Umidade do Solo (%)')
              : (language === 'en'
                  ? 'Tap an area to explore · 6 farm zones · 4 crops'
                  : 'Toque em uma área para explorar · 6 zonas rurais · 4 culturas')}
          </Text>
        </View>

        <View style={styles.legendBar}>
          {mapLayer === 'ndvi' ? (
            <Text style={styles.legendText}>
              {language === 'en'
                ? 'NDVI Legend: 0.15 (Soil/Building) ── 0.62 (Pasture) ── 0.94 (Max Biomass)'
                : 'Legenda NDVI: 0.15 (Solo/Construção) ── 0.62 (Pastagem) ── 0.94 (Biomassa Máxima)'}
            </Text>
          ) : mapLayer === 'moisture' ? (
            <Text style={styles.legendText}>
              {language === 'en'
                ? 'Soil Legend: 50% (Water Deficit) ── 75% (Optimal) ── 95% (Field Capacity)'
                : 'Legenda Solo: 50% (Déficit Hídrico) ── 75% (Ideal) ── 95% (Capacidade de Campo)'}
            </Text>
          ) : (
            <Text style={styles.legendText}>
              {language === 'en'
                ? 'Zones: Green (Crops) · Brown (Prepared Soil) · Blue (Dam) · Orange (Livestock)'
                : 'Zonas: Verde (Lavoura) · Marrom (Solo Preparado) · Azul (Represa) · Laranja (Pecuária)'}
            </Text>
          )}
        </View>
      </View>

      <View style={[styles.zoneCard, isDark && styles.zoneCardDark]}>
        <View style={styles.zoneHeaderRow}>
          <View style={styles.zoneTitleLeft}>
            <View style={[styles.zoneIconWrap, { backgroundColor: activeDetail.statusColor + '20' }]}>
              <MaterialCommunityIcons name={activeDetail.icon} size={22} color={activeDetail.statusColor} />
            </View>
            <View>
              <Text style={[styles.zoneTitle, isDark && styles.zoneTitleDark]}>{activeDetail.name}</Text>
              <Text style={[styles.zoneCategory, isDark && styles.zoneCategoryDark]}>{activeDetail.category}</Text>
            </View>
          </View>

          <View style={[styles.healthBadge, { backgroundColor: activeDetail.statusColor + '15' }]}>
            <Text style={[styles.healthBadgeText, { color: activeDetail.statusColor }]}>
              {activeDetail.health}% {language === 'en' ? 'Health' : 'Saúde'}
            </Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={[styles.metricItem, isDark && styles.metricItemDark]}>
            <Text style={styles.metricLabel}>{language === 'en' ? 'Total Area' : 'Área Total'}</Text>
            <Text style={[styles.metricVal, isDark && styles.metricValDark]}>{activeDetail.area}</Text>
          </View>
          <View style={[styles.metricItem, isDark && styles.metricItemDark]}>
            <Text style={styles.metricLabel}>{language === 'en' ? 'Soil Moisture' : 'Umidade Solo'}</Text>
            <Text style={[styles.metricVal, isDark && styles.metricValDark]}>{activeDetail.moisture}%</Text>
          </View>
          <View style={[styles.metricItem, isDark && styles.metricItemDark]}>
            <Text style={styles.metricLabel}>{language === 'en' ? 'NDVI Vigour' : 'Vigor NDVI'}</Text>
            <Text style={[styles.metricVal, isDark && styles.metricValDark]}>{activeDetail.ndviIndex.toFixed(2)}</Text>
          </View>
        </View>

        <Text style={[styles.zoneNote, isDark && styles.zoneNoteDark]}>{activeDetail.telemetryNote}</Text>

        <View style={styles.actionButtonsGrid}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('IrrigationSilos' as never)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="water-pump" size={16} color="#059669" />
            <Text style={styles.actionBtnText}>{language === 'en' ? 'Start Pivot' : 'Ligar Pivô'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('PestScouting' as never)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="bug-outline" size={16} color="#EF4444" />
            <Text style={styles.actionBtnText}>{language === 'en' ? 'Scouting' : 'Amostragem'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('SprayDiary' as never)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="spray" size={16} color="#3B82F6" />
            <Text style={styles.actionBtnText}>{language === 'en' ? 'Spraying' : 'Pulverização'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('FarmFinances' as never)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="cash-multiple" size={16} color="#F59E0B" />
            <Text style={styles.actionBtnText}>{language === 'en' ? 'Crop P&L' : 'DRE Safra'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

