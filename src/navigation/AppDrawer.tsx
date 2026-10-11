import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
import { FarmFinancesScreen } from '../features/finances/screens/FarmFinancesScreen';
import { MarketCommoditiesScreen } from '../features/market/screens/MarketCommoditiesScreen';
import { IrrigationSilosScreen } from '../features/telemetry/screens/IrrigationSilosScreen';
import { SprayDiaryScreen } from '../features/spraying/screens/SprayDiaryScreen';
import { MachineryFleetScreen } from '../features/machinery/screens/MachineryFleetScreen';

import { useAuth } from '../contexts/AuthContext';
import { usePreferences } from '../contexts/PreferencesContext';
import { UserAvatar } from '../components/UserAvatar';
import { colors, radii, spacing, typography } from '../theme';

const Drawer = createDrawerNavigator<AppDrawerParamList>();

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = ({ navigation, state }) => {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { language } = usePreferences();

  const currentRoute = state.routes[state.index].name;

  const menuItems: {
    name: keyof AppDrawerParamList;
    label: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
  }[] = [
    { name: 'MainTabs', label: language === 'en' ? 'Dashboard & Fields' : 'Painel & Talhões', icon: 'view-dashboard-outline' },
    { name: 'SprayDiary', label: language === 'en' ? 'Spray Diary & MAPA' : 'Caderno de Pulverização', icon: 'spray' },
    { name: 'MachineryFleet', label: language === 'en' ? 'Fleet & Machinery' : 'Máquinas & Frota Agrícola', icon: 'tractor' },
    { name: 'MarketCommodities', label: language === 'en' ? 'Live Commodity Markets' : 'Cotações Agro ao Vivo', icon: 'trending-up' },
    { name: 'FarmFinances', label: language === 'en' ? 'Crop Financials & ROI' : 'Finanças & Lucro da Safra', icon: 'cash-multiple' },
    { name: 'PestScouting', label: language === 'en' ? 'Pest Scouting & Health' : 'Monitoramento de Pragas', icon: 'bug-outline' },
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

  return (
    <View
      style={[
        styles.drawerContainer,
        { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.md },
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
      <Drawer.Screen name="MarketCommodities" component={MarketCommoditiesScreen} />
      <Drawer.Screen name="FarmFinances" component={FarmFinancesScreen} />
      <Drawer.Screen name="PestScouting" component={PestScoutingScreen} />
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

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingHorizontal: spacing.base,
    backgroundColor: '#07150E',
  },
  drawerHeader: {
    paddingBottom: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(74, 138, 98, 0.3)',
    marginBottom: spacing.md,
  },
  brandBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 40, 27, 0.95)',
    borderWidth: 1.2,
    borderColor: 'rgba(74, 138, 98, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs + 2,
  },
  brandTitle: {
    ...typography.h2,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  brandSubtitle: {
    ...typography.micro,
    color: '#86EFAC',
  },
  userCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 38, 26, 0.9)',
    borderRadius: radii.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.35)',
    marginBottom: spacing.base,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A2E24',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.4)',
  },
  avatarMiniImg: {
    width: '100%',
    height: '100%',
  },
  userTextCol: {
    flex: 1,
  },
  userName: {
    ...typography.captionMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  userEmail: {
    ...typography.micro,
    color: '#94A3B8',
  },
  menuScroll: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    marginBottom: spacing.xs,
  },
  menuItemActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.5)',
  },
  menuItemText: {
    ...typography.bodyMedium,
    color: '#E2E8F0',
    marginLeft: spacing.md,
  },
  menuItemTextActive: {
    color: '#4ADE80',
    fontWeight: '700',
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(74, 138, 98, 0.3)',
  },
  logoutText: {
    ...typography.captionMedium,
    color: '#EF4444',
    marginLeft: spacing.sm,
    fontWeight: '600',
  },
});
