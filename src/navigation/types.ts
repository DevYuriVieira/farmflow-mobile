import { NavigatorScreenParams } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Farm } from '../types/farm.types';
import { FarmActivity } from '../types/activity.types';

export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppDrawerParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  Farm: undefined;
  Weather: undefined;
  Crops: undefined;
  Settings: undefined;
};

export type AppDrawerParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList> | undefined;
  Farms: undefined;
  Plantations: undefined;
  Activities: undefined;
  Reports: undefined;
  Calculators: undefined;
  Alerts: undefined;
  PestScouting: undefined;
  PestDiagnosis: undefined;
  FarmFinances: undefined;
  MarketCommodities: undefined;
  IrrigationSilos: undefined;
  SprayDiary: undefined;
  MachineryFleet: undefined;
  InventoryWarehouse: undefined;
  Settings: undefined;
  WeatherScreen: undefined;
  FarmDetail: { farmId: string };
  FarmForm: { farm?: Farm };
  PlantationDetail: { plantationId: string };
  ActivityDetail: { activityId: string };
  ActivityForm: { activity?: Partial<FarmActivity> };
  QrScanner: undefined;
  QrGenerator: { entityType: 'farm' | 'plantation'; id: string; name: string };
};

export type AppNavigationProp = DrawerNavigationProp<AppDrawerParamList>;
