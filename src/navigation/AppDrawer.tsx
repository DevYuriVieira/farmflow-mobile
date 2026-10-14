import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AppDrawerParamList } from './types';
import { MainTabs } from './MainTabs';
import { FarmListScreen } from '../features/farms/screens/FarmListScreen';
import { FarmDetailScreen } from '../features/farms/screens/FarmDetailScreen';
import { FarmFormScreen } from '../features/farms/screens/FarmFormScreen';
import { PlantationListScreen } from '../features/plantations/screens/PlantationListScreen';
import { PlantationDetailScreen } from '../features/plantations/screens/PlantationDetailScreen';
import { ActivityListScreen } from '../features/activities/screens/ActivityListScreen';
import { ActivityDetailScreen } from '../features/activities/screens/ActivityDetailScreen';
import { ActivityFormScreen } from '../features/activities/screens/ActivityFormScreen';
import { ReportsScreen } from '../features/reports/screens/ReportsScreen';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';
import { QrScannerScreen } from '../features/qr/screens/QrScannerScreen';
import { QrGeneratorScreen } from '../features/qr/screens/QrGeneratorScreen';
import { WeatherConditionsScreen } from '../features/weather/screens/WeatherConditionsScreen';
import { CalculatorsScreen } from '../features/calculators/screens/CalculatorsScreen';
import { AlertsListScreen } from '../features/alerts/screens/AlertsListScreen';
import { PestScoutingScreen } from '../features/scouting/screens/PestScoutingScreen';
import { PestDiagnosisScreen } from '../features/scouting/screens/PestDiagnosisScreen';
import { FarmFinancesScreen } from '../features/finances/screens/FarmFinancesScreen';
import { MarketCommoditiesScreen } from '../features/market/screens/MarketCommoditiesScreen';
import { IrrigationSilosScreen } from '../features/telemetry/screens/IrrigationSilosScreen';
import { SprayDiaryScreen } from '../features/spraying/screens/SprayDiaryScreen';
import { MachineryFleetScreen } from '../features/machinery/screens/MachineryFleetScreen';
import { InventoryWarehouseScreen } from '../features/inventory/screens/InventoryWarehouseScreen';

import { useAuth } from '../contexts/AuthContext';
import { usePreferences } from '../contexts/PreferencesContext';
import { UserAvatar } from '../components/UserAvatar';
import { colors, spacing } from '../theme';
import { styles } from './styles/appDrawer.styles';



const Drawer = createDrawerNavigator<AppDrawerParamList>();

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = ({ navigation, state }) => {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { language, highContrastFieldMode, toggleHighContrastFieldMode, touchTargetMinHeight } =
    usePreferences();

  const currentRoute = state.routes[state.index].name;

  const menuItems: {
    name: keyof AppDrawerParamList;
    label: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
  }[] = [
    { name: 'MainTabs', label: language === 'en' ? 'Dashboard & Fields' : 'Painel & Talhões', icon: 'view-dashboard-outline' },
    { name: 'SprayDiary', label: language === 'en' ? 'Spray Diary & MAPA' : 'Caderno de Pulverização', icon: 'spray' },
    { name: 'MachineryFleet', label: language === 'en' ? 'Fleet & Machinery' : 'Máquinas & Frota Agrícola', icon: 'tractor' },
    { name: 'InventoryWarehouse', label: language === 'en' ? 'Supplies & Grain Sales' : 'Insumos & Comercialização', icon: 'warehouse' },
    { name: 'MarketCommodities', label: language === 'en' ? 'Live Commodity Markets' : 'Cotações Agro ao Vivo', icon: 'trending-up' },
    { name: 'FarmFinances', label: language === 'en' ? 'Crop Financials & ROI' : 'Finanças & Lucro da Safra', icon: 'cash-multiple' },
    { name: 'PestScouting', label: language === 'en' ? 'Pest Scouting & Health' : 'Monitoramento de Pragas', icon: 'bug-outline' },
    { name: 'PestDiagnosis', label: language === 'en' ? 'AI Pest Diagnosis' : 'Diagnóstico IA & Prescrição', icon: 'bug-check-outline' },
    { name: 'IrrigationSilos', label: language === 'en' ? 'Pivots & Silos IoT' : 'Telemetria de Pivôs & Silos', icon: 'water-pump' },
    { name: 'Alerts', label: language === 'en' ? 'Field Alerts & Risks' : 'Alertas & Riscos', icon: 'bell-alert-outline' },
    { name: 'Calculators', label: language === 'en' ? 'Calculators & Spray' : 'Calculadoras Agrícolas', icon: 'calculator-variant-outline' },
    { name: 'Farms', label: language === 'en' ? 'Rural Properties' : 'Propriedades Rurais', icon: 'home-city-outline' },
    { name: 'Plantations', label: language === 'en' ? 'Crops & Fields' : 'Lavouras & Talhões', icon: 'sprout-outline' },
    { name: 'Activities', label: language === 'en' ? 'Management & Tasks' : 'Manejos & Atividades', icon: 'calendar-check-outline' },
    { name: 'Reports', label: language === 'en' ? 'Reports & Metrics' : 'Relatórios & Métricas', icon: 'chart-bar' },
    { name: 'QrScanner', label: language === 'en' ? 'Scan QR Code' : 'Escanear QR Code', icon: 'qrcode-scan' },
    { name: 'Settings', label: language === 'en' ? 'Settings' : 'Configurações', icon: 'cog-outline' },
  ];

  const baseTop = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0);
  const safeTop = baseTop > 0 ? baseTop + spacing.md : (Platform.OS === 'android' ? 48 : 24);

  return (
    <View
      style={[
        styles.drawerContainer,
        { paddingTop: safeTop, paddingBottom: insets.bottom + spacing.md },
      ]}
    >
      <View style={styles.drawerHeader}>
        <View style={styles.brandBadge}>
          <MaterialCommunityIcons name="sprout" size={28} color={colors.primary} />
        </View>
        <Text style={styles.brandTitle}>FarmFlow</Text>
        <Text style={styles.brandSubtitle}>Agroprodutividade Digital</Text>
      </View>

      <View style={styles.userCapsule}>
        <UserAvatar size={36} showBorder={false} />
        <View style={styles.userTextCol}>
          <Text style={styles.userName} numberOfLines={1}>
            {user?.name || (language === 'en' ? 'Guest Farmer' : 'Produtor Rural')}
          </Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {user?.email || 'demo@farmflow.ag'}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.menuScroll}>
        {menuItems.map((item) => {
          const isActive = currentRoute === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              activeOpacity={0.75}
              onPress={() => navigation.navigate(item.name as never)}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={22}
                color={isActive ? colors.primary : colors.textSecondary}
              />
              <Text style={[styles.menuItemText, isActive && styles.menuItemTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => void toggleHighContrastFieldMode()}
        style={[
          styles.fieldModeButton,
          {
            backgroundColor: highContrastFieldMode ? '#FACC15' : 'rgba(250, 204, 21, 0.12)',
            minHeight: touchTargetMinHeight,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="tractor"
          size={20}
          color={highContrastFieldMode ? '#000000' : '#FACC15'}
        />
        <Text
          style={[
            styles.fieldModeText,
            { color: highContrastFieldMode ? '#000000' : '#FACC15' },
          ]}
        >
          {highContrastFieldMode ? 'Modo Cabine Ativo (Anti-Reflexo)' : 'Modo Cabine / Sol Forte'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => signOut()}
        style={styles.logoutRow}
      >
        <MaterialCommunityIcons name="logout" size={20} color={colors.danger} />
        <Text style={styles.logoutText}>Encerrar Sessão</Text>
      </TouchableOpacity>
    </View>
  );
};

export const AppDrawer: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#07150E',
          width: 300,
          borderRightWidth: 1,
          borderRightColor: 'rgba(74, 138, 98, 0.3)',
        },
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Drawer.Screen name="MainTabs" component={MainTabs} />
      <Drawer.Screen name="SprayDiary" component={SprayDiaryScreen} />
      <Drawer.Screen name="MachineryFleet" component={MachineryFleetScreen} />
      <Drawer.Screen name="InventoryWarehouse" component={InventoryWarehouseScreen} />
      <Drawer.Screen name="MarketCommodities" component={MarketCommoditiesScreen} />
      <Drawer.Screen name="FarmFinances" component={FarmFinancesScreen} />
      <Drawer.Screen name="PestScouting" component={PestScoutingScreen} />
      <Drawer.Screen name="PestDiagnosis" component={PestDiagnosisScreen} />
      <Drawer.Screen name="IrrigationSilos" component={IrrigationSilosScreen} />
      <Drawer.Screen name="Alerts" component={AlertsListScreen} />
      <Drawer.Screen name="Calculators" component={CalculatorsScreen} />
      <Drawer.Screen name="Farms" component={FarmListScreen} />
      <Drawer.Screen name="Plantations" component={PlantationListScreen} />
      <Drawer.Screen name="Activities" component={ActivityListScreen} />
      <Drawer.Screen name="Reports" component={ReportsScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="WeatherScreen" component={WeatherConditionsScreen} />

      <Drawer.Screen name="FarmDetail" component={FarmDetailScreen} />
      <Drawer.Screen name="FarmForm" component={FarmFormScreen} />
      <Drawer.Screen name="PlantationDetail" component={PlantationDetailScreen} />
      <Drawer.Screen name="ActivityDetail" component={ActivityDetailScreen} />
      <Drawer.Screen name="ActivityForm" component={ActivityFormScreen} />
      <Drawer.Screen name="QrScanner" component={QrScannerScreen} />
      <Drawer.Screen name="QrGenerator" component={QrGeneratorScreen} />
    </Drawer.Navigator>
  );
};

