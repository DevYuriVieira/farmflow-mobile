import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FarmIllustration } from '../components/FarmIllustration';

import { AppNavigationProp } from '../../../navigation/types';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { triggerHaptic } from '../../../utils/haptics';
import { styles } from '../styles/interactiveFarmMap.styles';

export type MapLayerMode = 'standard' | 'ndvi' | 'moisture';

export type CropTypeKey =
  | 'soybeans'
  | 'corn'
  | 'cotton'
  | 'coffee'
  | 'wheat'
  | 'sugarcane'
  | 'tomatoes'
  | 'vegetables'
  | 'citrus'
  | 'pasture'
  | 'headquarters'
  | 'storage_silos'
  | 'reservoir_pivot';

export interface CropCatalogItem {
  key: CropTypeKey;
  namePt: string;
  nameEn: string;
  categoryPt: string;
  categoryEn: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  defaultNdvi: number;
  defaultMoisture: number;
  defaultHealth: number;
  defaultStagePt: string;
  defaultStageEn: string;
  telemetryNotePt: string;
  telemetryNoteEn: string;
  renderVisual: 'rows' | 'pivots' | 'orchard' | 'water' | 'building' | 'pasture' | 'silos' | 'tomatoes';
}

export const CROP_CATALOG: Record<CropTypeKey, CropCatalogItem> = {
  soybeans: {
    key: 'soybeans',
    namePt: 'Soja Safra',
    nameEn: 'Soybeans',
    categoryPt: 'Grãos & Oleaginosas',
    categoryEn: 'Grains & Oilseeds',
    icon: 'sprout',
    color: '#10B981',
    defaultNdvi: 0.88,
    defaultMoisture: 78,
    defaultHealth: 94,
    defaultStagePt: 'Enchimento de Grãos (R5.2)',
    defaultStageEn: 'Grain Filling (R5.2)',
    telemetryNotePt: 'Soja transgênica IPRO. Monitoramento de percevejo-marrom e ferrugem asiática em dia.',
    telemetryNoteEn: 'IPRO Biotech Soybeans. Brown stink bug and Asian rust scouting up to date.',
    renderVisual: 'rows',
  },
  corn: {
    key: 'corn',
    namePt: 'Milho Safrinha',
    nameEn: 'Off-Season Corn',
    categoryPt: 'Grãos & Cereais',
    categoryEn: 'Grains & Cereals',
    icon: 'corn',
    color: '#F59E0B',
    defaultNdvi: 0.81,
    defaultMoisture: 72,
    defaultHealth: 91,
    defaultStagePt: 'Pendoamento / Espigamento',
    defaultStageEn: 'Tasseling / Silking',
    telemetryNotePt: 'Milho híbrido safrinha. Aplicação foliar de fungicida realizada há 4 dias.',
    telemetryNoteEn: 'Hybrid off-season corn. Foliar fungicide application completed 4 days ago.',
    renderVisual: 'rows',
  },
  cotton: {
    key: 'cotton',
    namePt: 'Algodão em Pluma',
    nameEn: 'Cotton Crop',
    categoryPt: 'Fibras Naturais',
    categoryEn: 'Natural Fibers',
    icon: 'cloud-outline',
    color: '#8B5CF6',
    defaultNdvi: 0.79,
    defaultMoisture: 68,
    defaultHealth: 93,
    defaultStagePt: 'Abertura de Capulhos',
    defaultStageEn: 'Boll Opening Stage',
    telemetryNotePt: 'Bicudo sob armadilhas e controle integrado. Maturação de fibra excelente.',
    telemetryNoteEn: 'Boll weevil pheromone traps active. Fiber quality index rated high.',
    renderVisual: 'rows',
  },
  coffee: {
    key: 'coffee',
    namePt: 'Café Arábica',
    nameEn: 'Arabica Coffee',
    categoryPt: 'Culturas Perenes',
    categoryEn: 'Perennial Crops',
    icon: 'coffee-outline',
    color: '#78350F',
    defaultNdvi: 0.84,
    defaultMoisture: 75,
    defaultHealth: 96,
    defaultStagePt: 'Chumbinho / Granação',
    defaultStageEn: 'Berry Development',
    telemetryNotePt: 'Lavoura irrigada por gotejo. Manejo focado na maturação homogênea de cerejas.',
    telemetryNoteEn: 'Drip irrigated orchard. Management focused on uniform cherry maturation.',
    renderVisual: 'orchard',
  },
  wheat: {
    key: 'wheat',
    namePt: 'Trigo Grão',
    nameEn: 'Winter Wheat',
    categoryPt: 'Cereais de Inverno',
    categoryEn: 'Winter Cereals',
    icon: 'barley',
    color: '#D97706',
    defaultNdvi: 0.86,
    defaultMoisture: 70,
    defaultHealth: 92,
    defaultStagePt: 'Enchimento de Espiga',
    defaultStageEn: 'Grain Maturation',
    telemetryNotePt: 'Safra de inverno com excelente sanidade foliar e temperatura amena.',
    telemetryNoteEn: 'Winter wheat crop with optimal foliar health and mild temperatures.',
    renderVisual: 'rows',
  },
  sugarcane: {
    key: 'sugarcane',
    namePt: 'Cana-de-Açúcar',
    nameEn: 'Sugarcane',
    categoryPt: 'Biomassa & Agroindústria',
    categoryEn: 'Biomass & Agro-Industry',
    icon: 'grass',
    color: '#059669',
    defaultNdvi: 0.91,
    defaultMoisture: 80,
    defaultHealth: 95,
    defaultStagePt: 'Desenvolvimento Vegetativo',
    defaultStageEn: 'Vegetative Growth',
    telemetryNotePt: 'Cana-soca de 2º corte. Adubação de soqueira com vinhaça concentrada.',
    telemetryNoteEn: 'Second-cut ratoon cane. Concentrated vinasse application completed.',
    renderVisual: 'rows',
  },
  tomatoes: {
    key: 'tomatoes',
    namePt: 'Tomates de Mesa',
    nameEn: 'Table Tomatoes',
    categoryPt: 'Hortifrúti / Olericultura',
    categoryEn: 'Horticulture / Fruit Crops',
    icon: 'food-apple',
    color: '#EF4444',
    defaultNdvi: 0.88,
    defaultMoisture: 82,
    defaultHealth: 92,
    defaultStagePt: 'Frutificação / Colheita',
    defaultStageEn: 'Fruiting & Harvest',
    telemetryNotePt: 'Cultivo tutorado com fertirrigação por gotejo. Colheita seletiva diária.',
    telemetryNoteEn: 'Staked cultivation with drip fertigation. Daily selective harvesting.',
    renderVisual: 'tomatoes',
  },
  vegetables: {
    key: 'vegetables',
    namePt: 'Horta & Folhosas',
    nameEn: 'Vegetable Beds',
    categoryPt: 'Olericultura Folhosa',
    categoryEn: 'Leafy Vegetables',
    icon: 'sprout',
    color: '#22C55E',
    defaultNdvi: 0.94,
    defaultMoisture: 88,
    defaultHealth: 95,
    defaultStagePt: 'Colheita Contínua',
    defaultStageEn: 'Continuous Harvest',
    telemetryNotePt: 'Canteiros com microaspersão e mulching ecológico. Destino: cooperativa local.',
    telemetryNoteEn: 'Raised beds with micro-sprinklers and organic mulching for local co-op.',
    renderVisual: 'rows',
  },
  citrus: {
    key: 'citrus',
    namePt: 'Citros / Pomar',
    nameEn: 'Citrus Orchard',
    categoryPt: 'Fruticultura Comercial',
    categoryEn: 'Commercial Fruit Orchard',
    icon: 'fruit-citrus',
    color: '#F97316',
    defaultNdvi: 0.85,
    defaultMoisture: 76,
    defaultHealth: 94,
    defaultStagePt: 'Crescimento de Frutos',
    defaultStageEn: 'Fruit Sizing Stage',
    telemetryNotePt: 'Pomar de laranjeiras Pêra-Rio com controle biológico de psilídeo.',
    telemetryNoteEn: 'Pera-Rio sweet orange orchard with active psyllid biocontrol.',
    renderVisual: 'orchard',
  },
  pasture: {
    key: 'pasture',
    namePt: 'Pasto & Bovinos',
    nameEn: 'Pasture & Livestock',
    categoryPt: 'Bovinocultura & ILPF',
    categoryEn: 'Livestock & Agroforestry',
    icon: 'cow',
    color: '#14B8A6',
    defaultNdvi: 0.65,
    defaultMoisture: 70,
    defaultHealth: 97,
    defaultStagePt: 'Pastejo Rotacionado',
    defaultStageEn: 'Rotational Grazing',
    telemetryNotePt: 'Piquetes de capim Mombaça com bebedouros solares e cerca elétrica ativa.',
    telemetryNoteEn: 'Mombasa grass paddocks with solar water troughs and rotational grazing.',
    renderVisual: 'pasture',
  },
  headquarters: {
    key: 'headquarters',
    namePt: 'Sede & Oficina',
    nameEn: 'Headquarters & Depot',
    categoryPt: 'Infraestrutura & Gestão',
    categoryEn: 'Infrastructure & Admin',
    icon: 'home',
    color: '#3B82F6',
    defaultNdvi: 0.15,
    defaultMoisture: 65,
    defaultHealth: 99,
    defaultStagePt: 'Centro de Operações (CCO)',
    defaultStageEn: 'Operations Center (NOC)',
    telemetryNotePt: 'Hangar de máquinas agrícolas, oficina técnica mecânica e usina solar.',
    telemetryNoteEn: 'Agricultural machinery hangar, technical workshop, and solar farm.',
    renderVisual: 'building',
  },
  storage_silos: {
    key: 'storage_silos',
    namePt: 'Silos Graneleiros',
    nameEn: 'Grain Silos',
    categoryPt: 'Armazenagem & Secagem',
    categoryEn: 'Grain Storage & Drying',
    icon: 'silo',
    color: '#64748B',
    defaultNdvi: 0.12,
    defaultMoisture: 60,
    defaultHealth: 98,
    defaultStagePt: 'Armazenamento em 85%',
    defaultStageEn: 'Capacity at 85%',
    telemetryNotePt: '2 silos metálicos de 1.500t com termometria e aeração automatizada.',
    telemetryNoteEn: '2 metal grain silos (1,500t) with automated thermometry cables.',
    renderVisual: 'silos',
  },
  reservoir_pivot: {
    key: 'reservoir_pivot',
    namePt: 'Represa & Pivô',
    nameEn: 'Dam & Center Pivot',
    categoryPt: 'Recursos Hídricos & Irrigação',
    categoryEn: 'Water Resources & Irrigation',
    icon: 'water-pump',
    color: '#06B6D4',
    defaultNdvi: -0.22,
    defaultMoisture: 96,
    defaultHealth: 98,
    defaultStagePt: 'Lâmina d\'Água 12mm',
    defaultStageEn: '12mm Water Depth',
    telemetryNotePt: 'Espelho d\'água de 18.000m³ alimentando adutora do pivô central de 40 ha.',
    telemetryNoteEn: '18,000 m³ reservoir feeding the central pivot pipeline for 40 hectares.',
    renderVisual: 'pivots',
  },
};

export interface SectorZone {
  id: string; // 'sector_1' .. 'sector_6'
  cropKey: CropTypeKey;
  customName?: string;
  customArea?: string;
  customStage?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const DEFAULT_SECTORS: SectorZone[] = [
  { id: 'sector_1', cropKey: 'headquarters', customArea: '0.8 ha', x: 12, y: 12, width: 100, height: 95 },
  { id: 'sector_2', cropKey: 'tomatoes', customArea: '4.2 ha', x: 128, y: 12, width: 220, height: 95 },
  { id: 'sector_3', cropKey: 'vegetables', customArea: '2.0 ha', x: 12, y: 123, width: 100, height: 90 },
  { id: 'sector_4', cropKey: 'corn', customArea: '3.5 ha', x: 128, y: 123, width: 220, height: 90 },
  { id: 'sector_5', cropKey: 'pasture', customArea: '1.8 ha', x: 12, y: 229, width: 199, height: 99 },
  { id: 'sector_6', cropKey: 'reservoir_pivot', customArea: '0.2 ha', x: 227, y: 229, width: 121, height: 46 },
  { id: 'sector_7', cropKey: 'storage_silos', customArea: '0.1 ha', x: 227, y: 282, width: 121, height: 46 },
];

export interface FarmPreset {
  id: string;
  titlePt: string;
  titleEn: string;
  descPt: string;
  descEn: string;
  sectors: CropTypeKey[];
}

const FARM_PRESETS: FarmPreset[] = [
  {
    id: 'grains_cerrado',
    titlePt: 'Grãos & Commodities (Cerrado)',
    titleEn: 'Grains & Commodities (Cerrado)',
    descPt: 'Ideal para produção em larga escala de Soja Safra, Milho Safrinha, Algodão e Silos.',
    descEn: 'Optimized for high-yield Soybeans, Corn, Cotton, and Commercial Grain Silos.',
    sectors: ['headquarters', 'soybeans', 'wheat', 'corn', 'cotton', 'storage_silos'],
  },
  {
    id: 'hortifruti_green',
    titlePt: 'Hortifrúti & Fruticultura',
    titleEn: 'Horticulture & Fruit Belt',
    descPt: 'Vocacionada para Tomates de mesa, Horta folhosa comercial, Pomar de Citros e Represa.',
    descEn: 'Engineered for Table Tomatoes, Leafy Greens, Citrus Orchards, and Reservoir.',
    sectors: ['headquarters', 'tomatoes', 'vegetables', 'citrus', 'pasture', 'reservoir_pivot'],
  },
  {
    id: 'coffee_special',
    titlePt: 'Café & Culturas Especiais',
    titleEn: 'Specialty Coffee & Grains',
    descPt: 'Focada em Cafezais Arábica, Lavoura de Milho, Trigo de Inverno e Silos de armazenagem.',
    descEn: 'Dedicated to Arabica Coffee, Corn, Winter Wheat, and On-Farm Grain Silos.',
    sectors: ['headquarters', 'coffee', 'wheat', 'corn', 'pasture', 'storage_silos'],
  },
  {
    id: 'ilpf_livestock',
    titlePt: 'Integração Lavoura-Pecuária (ILPF)',
    titleEn: 'Integrated Crop-Livestock (ILPF)',
    descPt: 'Manejo sinérgico entre Soja, Milho silagem, Pecuária rotacionada e Represa.',
    descEn: 'Synergistic rotation between Soybeans, Silage Corn, Pasture Cattle, and Dam.',
    sectors: ['headquarters', 'pasture', 'corn', 'soybeans', 'pasture', 'reservoir_pivot'],
  },
];

const STORAGE_KEY = '@farmflow_custom_farm_map_v2';

export const InteractiveFarmMapScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const { isDark, language, t } = usePreferences();

  const [sectors, setSectors] = useState<SectorZone[]>(DEFAULT_SECTORS);
  const [selectedSectorId, setSelectedSectorId] = useState<string>('sector_2');
  const [mapLayer, setMapLayer] = useState<MapLayerMode>('standard');

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [presetsModalVisible, setPresetsModalVisible] = useState(false);

  // Form states for zone customization
  const [editingSector, setEditingSector] = useState<SectorZone | null>(null);
  const [formCropKey, setFormCropKey] = useState<CropTypeKey>('soybeans');
  const [formName, setFormName] = useState('');
  const [formArea, setFormArea] = useState('');
  const [formStage, setFormStage] = useState('');

  // Load custom map configuration from persistent storage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as SectorZone[];
          if (Array.isArray(parsed) && parsed.length === DEFAULT_SECTORS.length) {
            setSectors(parsed);
          }
        }
      } catch {
        // Fallback to default
      }
    })();
  }, []);

  const saveCustomSectors = async (updated: SectorZone[]) => {
    setSectors(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate('Home');
    }
  };

  const currentSector = sectors.find((s) => s.id === selectedSectorId) || sectors[1];
  const currentCrop = CROP_CATALOG[currentSector.cropKey] || CROP_CATALOG.soybeans;

  const currentName = currentSector.customName || (language === 'en' ? currentCrop.nameEn : currentCrop.namePt);
  const currentArea = currentSector.customArea || '3.5 ha';
  const currentStage = currentSector.customStage || (language === 'en' ? currentCrop.defaultStageEn : currentCrop.defaultStagePt);
  const currentCategory = language === 'en' ? currentCrop.categoryEn : currentCrop.categoryPt;
  const currentNote = language === 'en' ? currentCrop.telemetryNoteEn : currentCrop.telemetryNotePt;

  const openEditModal = (sector?: SectorZone) => {
    const target = sector || currentSector;
    setEditingSector(target);
    setFormCropKey(target.cropKey);
    const cropItem = CROP_CATALOG[target.cropKey];
    setFormName(target.customName || (language === 'en' ? cropItem.nameEn : cropItem.namePt));
    setFormArea(target.customArea || '3.5 ha');
    setFormStage(target.customStage || (language === 'en' ? cropItem.defaultStageEn : cropItem.defaultStagePt));
    triggerHaptic('selection');
    setEditModalVisible(true);
  };

  const saveEditedSector = () => {
    if (!editingSector) return;
    const updated = sectors.map((sec) => {
      if (sec.id === editingSector.id) {
        return {
          ...sec,
          cropKey: formCropKey,
          customName: formName.trim() || undefined,
          customArea: formArea.trim() || undefined,
          customStage: formStage.trim() || undefined,
        };
      }
      return sec;
    });

    saveCustomSectors(updated);
    triggerHaptic('success');
    setEditModalVisible(false);
  };

  const applyPreset = (preset: FarmPreset) => {
    const updated = sectors.map((sec, idx) => ({
      ...sec,
      cropKey: preset.sectors[idx] || sec.cropKey,
      customName: undefined,
      customStage: undefined,
    }));

    saveCustomSectors(updated);
    triggerHaptic('medium');
    setPresetsModalVisible(false);
  };

  const resetToDefault = () => {
    saveCustomSectors(DEFAULT_SECTORS);
    triggerHaptic('warning');
    setEditModalVisible(false);
  };


  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]} showsVerticalScrollIndicator={false}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={[styles.backButton, isDark && styles.backButtonDark]}
            onPress={handleBack}
            activeOpacity={0.7}
            accessibilityLabel="Voltar"
          >
            <MaterialCommunityIcons name="arrow-left" size={20} color={isDark ? '#FFFFFF' : '#1E293B'} />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
              {t('myFarm')}
            </Text>
            <View style={styles.locationRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={13} color="#059669" />
              <Text style={[styles.locationText, isDark && styles.locationTextDark]}>
                {language === 'en' ? 'Santa Fé Estate · 12.5 ha' : 'Fazenda Santa Fé · 12.5 ha'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.headerIconBtn, isDark && styles.headerIconBtnDark]}
            onPress={() => navigation.navigate('WeatherScreen' as never)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="weather-partly-cloudy" size={18} color={isDark ? '#FFFFFF' : '#1E293B'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Toolbar: Farmer Customization Shortcuts */}
      <View style={styles.toolbarRow}>
        <TouchableOpacity
          style={[styles.toolbarBtn, isDark && styles.toolbarBtnDark]}
          onPress={() => openEditModal()}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="tune-variant" size={16} color={isDark ? '#4ADE80' : '#047857'} />
          <Text style={[styles.toolbarBtnText, isDark && styles.toolbarBtnTextDark]}>
            {language === 'en' ? 'Customize Plot' : 'Personalizar Talhão'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolbarSecondaryBtn, isDark && styles.toolbarSecondaryBtnDark]}
          onPress={() => {
            triggerHaptic('selection');
            setPresetsModalVisible(true);
          }}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="view-grid-plus-outline" size={16} color={isDark ? '#E2E8F0' : '#334155'} />
          <Text style={[styles.toolbarSecondaryBtnText, isDark && styles.toolbarSecondaryBtnTextDark]}>
            {language === 'en' ? 'Farm Presets' : 'Modelos de Fazenda'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Sector Selector Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {sectors.map((sec) => {
          const crop = CROP_CATALOG[sec.cropKey] || CROP_CATALOG.soybeans;
          const isSelected = selectedSectorId === sec.id;
          const label = sec.customName || (language === 'en' ? crop.nameEn : crop.namePt);
          return (
            <TouchableOpacity
              key={sec.id}
              style={[
                styles.tabPill,
                isDark && styles.tabPillDark,
                isSelected && (isDark ? styles.tabPillActiveDark : styles.tabPillActive),
              ]}
              onPress={() => {
                setSelectedSectorId(sec.id);
                triggerHaptic('light');
              }}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={crop.icon}
                size={15}
                color={isSelected ? (isDark ? '#07150E' : '#FFFFFF') : isDark ? '#94A3B8' : '#475569'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isDark && styles.tabLabelDark,
                  isSelected && (isDark ? styles.tabLabelActiveDark : styles.tabLabelActive),
                ]}
              >
                {label.length > 12 ? label.slice(0, 10) + '...' : label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Map Layer Selector Bar (Standard, NDVI, Moisture) */}
      <View style={[styles.layerSelectorBar, isDark && styles.layerSelectorBarDark]}>
        <TouchableOpacity
          style={[styles.layerBtn, mapLayer === 'standard' && styles.layerBtnActive]}
          onPress={() => {
            setMapLayer('standard');
            triggerHaptic('selection');
          }}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="layers-outline"
            size={14}
            color={mapLayer === 'standard' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
          />
          <Text style={[styles.layerBtnText, isDark && styles.layerBtnTextDark, mapLayer === 'standard' && styles.layerBtnTextActive]}>
            {language === 'en' ? 'Precision GIS' : 'Padrão GIS'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.layerBtn, mapLayer === 'ndvi' && styles.layerBtnActive]}
          onPress={() => {
            setMapLayer('ndvi');
            triggerHaptic('selection');
          }}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="satellite-variant"
            size={14}
            color={mapLayer === 'ndvi' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
          />
          <Text style={[styles.layerBtnText, isDark && styles.layerBtnTextDark, mapLayer === 'ndvi' && styles.layerBtnTextActive]}>
            {language === 'en' ? 'NDVI Satellite' : 'Satélite NDVI'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.layerBtn, mapLayer === 'moisture' && styles.layerBtnActive]}
          onPress={() => {
            setMapLayer('moisture');
            triggerHaptic('selection');
          }}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="water-percent"
            size={14}
            color={mapLayer === 'moisture' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
          />
          <Text style={[styles.layerBtnText, isDark && styles.layerBtnTextDark, mapLayer === 'moisture' && styles.layerBtnTextActive]}>
            {language === 'en' ? 'Soil Moisture' : 'Umidade Solo'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main High-Tech Farm Map Card */}
      <View style={[styles.mapCard, isDark && styles.mapCardDark]}>
        {/* HUD Top Bar */}
        <View style={styles.mapHudTop}>
          <View style={[styles.mapHudBadge, isDark && styles.mapHudBadgeDark]}>
            <MaterialCommunityIcons name="crosshairs-gps" size={13} color={isDark ? '#4ADE80' : '#059669'} />
            <Text style={[styles.mapHudBadgeText, isDark && styles.mapHudBadgeTextDark]}>
              GPS RTK · 23°14&apos;S 51°12&apos;W
            </Text>
          </View>
          <View style={[styles.mapHudBadge, isDark && styles.mapHudBadgeDark]}>
            <MaterialCommunityIcons name="quadcopter" size={13} color={isDark ? '#4ADE80' : '#059669'} />
            <Text style={[styles.mapHudBadgeText, isDark && styles.mapHudBadgeTextDark]}>
              {language === 'en' ? 'Flight Alt: 120m' : 'Altitude Voo: 120m'}
            </Text>
          </View>
        </View>

        <FarmIllustration
          sectors={sectors}
          selectedId={selectedSectorId}
          mapLayer={mapLayer}
          language={language}
          catalog={CROP_CATALOG}
          onSelect={(id) => {
            setSelectedSectorId(id);
            triggerHaptic('light');
          }}
        />

        {/* Explore Help Pill */}
        <View style={[styles.explorePill, isDark && styles.explorePillDark]}>
          <MaterialCommunityIcons
            name={mapLayer === 'ndvi' ? 'satellite-variant' : mapLayer === 'moisture' ? 'water-percent' : 'gesture-tap'}
            size={15}
            color={isDark ? '#4ADE80' : '#059669'}
          />
          <Text style={[styles.exploreText, isDark && styles.exploreTextDark]}>
            {mapLayer === 'ndvi'
              ? (language === 'en'
                  ? 'Sentinel-2 Satellite · NDVI Biomass Index (0.0 to 1.0)'
                  : 'Satélite Sentinel-2 · Índice de Biomassa NDVI (0.0 a 1.0)')
              : mapLayer === 'moisture'
              ? (language === 'en'
                  ? 'FDR Telemetry Sensors · Soil Moisture Capacity (%)'
                  : 'Sensores FDR Telemetria · Umidade do Solo (%)')
              : (language === 'en'
                  ? 'Tap any parcel to inspect or tap "Customize" to change crop'
                  : 'Toque em qualquer talhão para inspecionar ou personalizar')}
          </Text>
        </View>

        {/* Map Legend */}
        <View style={styles.legendBar}>
          <Text style={[styles.legendText, isDark && styles.legendTextDark]}>
            {mapLayer === 'ndvi'
              ? (language === 'en' ? 'NDVI: 0.15 (Bare Soil) ── 0.65 (Medium) ── 0.94 (Max Biomass)' : 'NDVI: 0.15 (Solo/Sede) ── 0.65 (Médio) ── 0.94 (Biomassa Máxima)')
              : mapLayer === 'moisture'
              ? (language === 'en' ? 'Moisture: <65% (Irrigate) ── 70-85% (Optimal) ── >90% (Field Capacity)' : 'Solo: <65% (Irrigar) ── 70-85% (Ideal) ── >90% (Capacidade de Campo)')
              : (language === 'en' ? 'Active Farm: 6 Managed Sectors · GPS RTK Guided Lines' : 'Fazenda Ativa: 6 Setores Produtivos · Linhas Guiadas por GPS RTK')}
          </Text>
        </View>
      </View>

      {/* Selected Sector Telemetry & Management Card */}
      <View style={[styles.zoneCard, isDark && styles.zoneCardDark]}>
        <View style={styles.zoneHeaderRow}>
          <View style={styles.zoneTitleLeft}>
            <View style={[styles.zoneIconWrap, { backgroundColor: currentCrop.color + '20' }]}>
              <MaterialCommunityIcons name={currentCrop.icon} size={22} color={currentCrop.color} />
            </View>
            <View style={styles.zoneTextContainer}>
              <Text style={[styles.zoneTitle, isDark && styles.zoneTitleDark]}>{currentName}</Text>
              <Text style={[styles.zoneCategory, isDark && styles.zoneCategoryDark]}>{currentCategory}</Text>
            </View>
          </View>

          <View style={[styles.healthBadge, { backgroundColor: currentCrop.color + '20' }]}>
            <Text style={[styles.healthBadgeText, { color: currentCrop.color }]}>
              {currentCrop.defaultHealth}% {language === 'en' ? 'Vigor' : 'Vigor'}
            </Text>
          </View>
        </View>

        {/* Big Action Button to Customize This Specific Zone */}
        <TouchableOpacity
          style={styles.customizeZoneButton}
          onPress={() => openEditModal(currentSector)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="pencil-outline" size={16} color="#FFFFFF" />
          <Text style={styles.customizeZoneButtonText}>
            {language === 'en' ? 'Change Crop / Edit Parcel' : 'Trocar Cultura / Editar Este Talhão'}
          </Text>
        </TouchableOpacity>

        {/* Metrics Grid */}
        <View style={[styles.metricsRow, isDark && styles.metricsRowDark]}>
          <View style={[styles.metricItem, isDark && styles.metricItemDark]}>
            <Text style={[styles.metricLabel, isDark && styles.metricLabelDark]}>{language === 'en' ? 'Parcel Area' : 'Área do Talhão'}</Text>
            <Text style={[styles.metricVal, isDark && styles.metricValDark]}>{currentArea}</Text>
          </View>
          <View style={[styles.metricItem, isDark && styles.metricItemDark]}>
            <Text style={[styles.metricLabel, isDark && styles.metricLabelDark]}>{language === 'en' ? 'Soil Moisture' : 'Umidade Solo'}</Text>
            <Text style={[styles.metricVal, isDark && styles.metricValDark]}>{currentCrop.defaultMoisture}%</Text>
          </View>
          <View style={[styles.metricItem, isDark && styles.metricItemDark]}>
            <Text style={[styles.metricLabel, isDark && styles.metricLabelDark]}>{language === 'en' ? 'NDVI Index' : 'Índice NDVI'}</Text>
            <Text style={[styles.metricVal, isDark && styles.metricValDark]}>{currentCrop.defaultNdvi.toFixed(2)}</Text>
          </View>
        </View>

        {/* Stage and Agronomic Note */}
        <Text style={[styles.zoneNote, isDark && styles.zoneNoteDark]}>
          <Text style={styles.zoneNoteBold}>{language === 'en' ? 'Stage: ' : 'Estágio: '}</Text>
          {currentStage}
          {'\n'}
          {currentNote}
        </Text>

        {/* Quick Management Shortcuts */}
        <View style={styles.actionButtonsGrid}>
          <TouchableOpacity
            style={[styles.actionBtn, isDark && styles.actionBtnDark]}
            onPress={() => navigation.navigate('IrrigationSilos' as never)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="water-pump" size={16} color="#059669" />
            <Text style={[styles.actionBtnText, isDark && styles.actionBtnTextDark]}>
              {language === 'en' ? 'Irrigation' : 'Irrigação'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, isDark && styles.actionBtnDark]}
            onPress={() => navigation.navigate('PestScouting' as never)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="bug-outline" size={16} color="#EF4444" />
            <Text style={[styles.actionBtnText, isDark && styles.actionBtnTextDark]}>
              {language === 'en' ? 'Scouting' : 'Pragas'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, isDark && styles.actionBtnDark]}
            onPress={() => navigation.navigate('SprayDiary' as never)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="spray" size={16} color="#3B82F6" />
            <Text style={[styles.actionBtnText, isDark && styles.actionBtnTextDark]}>
              {language === 'en' ? 'Spraying' : 'Pulverização'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, isDark && styles.actionBtnDark]}
            onPress={() => navigation.navigate('FarmFinances' as never)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="cash-multiple" size={16} color="#F59E0B" />
            <Text style={[styles.actionBtnText, isDark && styles.actionBtnTextDark]}>
              {language === 'en' ? 'Financials' : 'Financeiro'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MODAL 1: Customize Selected Plot / Change Crop */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
            <View style={[styles.modalHeader, isDark && styles.modalHeaderDark]}>
              <View>
                <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
                  {language === 'en' ? 'Customize Agricultural Plot' : 'Personalizar Talhão Agrícola'}
                </Text>
                <Text style={[styles.modalSubtitle, isDark && styles.modalSubtitleDark]}>
                  {language === 'en' ? 'Select the crop type or infrastructure for this parcel' : 'Escolha a cultura ou uso do solo deste setor'}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.modalCloseBtn, isDark && styles.modalCloseBtnDark]}
                onPress={() => setEditModalVisible(false)}
              >
                <MaterialCommunityIcons name="close" size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollArea} showsVerticalScrollIndicator={false}>
              {/* Plot Name and Area Fields */}
              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, styles.flex1]}>
                  <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
                    {language === 'en' ? 'Plot Label / Name' : 'Nome / Identificação'}
                  </Text>
                  <TextInput
                    style={[styles.textInput, isDark && styles.textInputDark]}
                    value={formName}
                    onChangeText={setFormName}
                    placeholder="Ex: Talhão 02 - Soja"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
                    {language === 'en' ? 'Area (ha)' : 'Área (ha)'}
                  </Text>
                  <TextInput
                    style={[styles.textInput, isDark && styles.textInputDark, { width: 90 }]}
                    value={formArea}
                    onChangeText={setFormArea}
                    placeholder="3.5 ha"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              {/* Crop Catalog Grid */}
              <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
                {language === 'en' ? 'Select Crop / Infrastructure' : 'Selecione a Cultura ou Infraestrutura'}
              </Text>
              <View style={styles.cropCatalogGrid}>
                {Object.values(CROP_CATALOG).map((cropItem) => {
                  const isSelected = formCropKey === cropItem.key;
                  return (
                    <TouchableOpacity
                      key={cropItem.key}
                      style={[
                        styles.cropCard,
                        isDark && styles.cropCardDark,
                        isSelected && (isDark ? styles.cropCardActiveDark : styles.cropCardActive),
                      ]}
                      onPress={() => {
                        setFormCropKey(cropItem.key);
                        setFormName(language === 'en' ? cropItem.nameEn : cropItem.namePt);
                        setFormStage(language === 'en' ? cropItem.defaultStageEn : cropItem.defaultStagePt);
                        triggerHaptic('selection');
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.cropIconBadge, { backgroundColor: cropItem.color + '20' }]}>
                        <MaterialCommunityIcons name={cropItem.icon} size={18} color={cropItem.color} />
                      </View>
                      <Text style={[styles.cropCardName, isDark && styles.cropCardNameDark]}>
                        {language === 'en' ? cropItem.nameEn : cropItem.namePt}
                      </Text>
                      <Text style={[styles.cropCardCategory, isDark && styles.cropCardCategoryDark]}>
                        {language === 'en' ? cropItem.categoryEn : cropItem.categoryPt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Phenological Stage Quick Chips */}
              <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
                {language === 'en' ? 'Phenological Growth Stage' : 'Estágio Fenológico'}
              </Text>
              <View style={styles.stageChipsRow}>
                {[
                  language === 'en' ? 'Vegetative (V4)' : 'Vegetativo (V4)',
                  language === 'en' ? 'Flowering (R2)' : 'Floração (R2)',
                  language === 'en' ? 'Grain Filling (R5)' : 'Enchimento de Grãos (R5)',
                  language === 'en' ? 'Ready for Harvest' : 'Pronto p/ Colheita',
                  language === 'en' ? 'Continuous Harvest' : 'Colheita Contínua',
                  language === 'en' ? 'Soil Preparation' : 'Preparo de Solo',
                ].map((stg) => {
                  const isStgActive = formStage === stg;
                  return (
                    <TouchableOpacity
                      key={stg}
                      style={[
                        styles.stageChip,
                        isDark && styles.stageChipDark,
                        isStgActive && styles.stageChipActive,
                      ]}
                      onPress={() => {
                        setFormStage(stg);
                        triggerHaptic('light');
                      }}
                    >
                      <Text
                        style={[
                          styles.stageChipText,
                          isDark && styles.stageChipTextDark,
                          isStgActive && styles.stageChipTextActive,
                        ]}
                      >
                        {stg}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalResetBtn, isDark && styles.modalResetBtnDark]}
                onPress={resetToDefault}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalResetBtnText, isDark && styles.modalResetBtnTextDark]}>
                  {language === 'en' ? 'Reset' : 'Restaurar'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={saveEditedSector}
                activeOpacity={0.8}
              >
                <Text style={styles.modalPrimaryBtnText}>
                  {language === 'en' ? 'Save Changes' : 'Salvar no Mapa'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: Farm Presets (Quick Templates) */}
      <Modal
        visible={presetsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPresetsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
            <View style={[styles.modalHeader, isDark && styles.modalHeaderDark]}>
              <View>
                <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
                  {language === 'en' ? 'Farm Layout Templates' : 'Modelos de Fazenda Prontos'}
                </Text>
                <Text style={[styles.modalSubtitle, isDark && styles.modalSubtitleDark]}>
                  {language === 'en' ? 'Apply an entire agronomic configuration with one tap' : 'Configure a fazenda inteira com um único toque'}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.modalCloseBtn, isDark && styles.modalCloseBtnDark]}
                onPress={() => setPresetsModalVisible(false)}
              >
                <MaterialCommunityIcons name="close" size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.presetList} showsVerticalScrollIndicator={false}>
              {FARM_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset.id}
                  style={[styles.presetCard, isDark && styles.presetCardDark]}
                  onPress={() => applyPreset(preset)}
                  activeOpacity={0.8}
                >
                  <View style={styles.presetHeaderRow}>
                    <Text style={[styles.presetTitle, isDark && styles.presetTitleDark]}>
                      {language === 'en' ? preset.titleEn : preset.titlePt}
                    </Text>
                    <MaterialCommunityIcons name="arrow-right-circle" size={20} color="#059669" />
                  </View>

                  <Text style={[styles.presetDesc, isDark && styles.presetDescDark]}>
                    {language === 'en' ? preset.descEn : preset.descPt}
                  </Text>

                  <View style={styles.presetTagsRow}>
                    {preset.sectors.map((cropKey, cIdx) => {
                      const cItem = CROP_CATALOG[cropKey];
                      return (
                        <View key={cIdx} style={[styles.presetTag, isDark && styles.presetTagDark]}>
                          <Text style={[styles.presetTagText, isDark && styles.presetTagTextDark]}>
                            {language === 'en' ? cItem.nameEn : cItem.namePt}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
