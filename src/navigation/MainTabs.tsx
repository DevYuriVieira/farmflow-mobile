import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MainTabsParamList } from './types';
import { DashboardScreen } from '../features/dashboard/screens/DashboardScreen';
import { InteractiveFarmMapScreen } from '../features/maps/screens/InteractiveFarmMapScreen';
import { WeatherConditionsScreen } from '../features/weather/screens/WeatherConditionsScreen';
import { PlantationListScreen } from '../features/plantations/screens/PlantationListScreen';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';
import { radii } from '../theme';
import { usePreferences } from '../contexts/PreferencesContext';

const Tab = createBottomTabNavigator<MainTabsParamList>();

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const { isDark, t } = usePreferences();

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.dockWrapper,
        { bottom: insets.bottom > 0 ? insets.bottom + 6 : 14 },
      ]}
    >
      <View style={[styles.dockContainer, isDark && styles.dockContainerDark]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'home';
          let label = 'Home';

          if (route.name === 'Home') {
            iconName = isFocused ? 'home' : 'home-outline';
            label = t('navHome');
          } else if (route.name === 'Farm') {
            iconName = isFocused ? 'tree' : 'tree-outline';
            label = t('navFarm');
          } else if (route.name === 'Weather') {
            iconName = isFocused ? 'chart-box' : 'chart-box-outline';
            label = t('navWeather');
          } else if (route.name === 'Crops') {
            iconName = isFocused ? 'package-variant-closed' : 'package-variant';
            label = t('navHarvest');
          } else if (route.name === 'Settings') {
            iconName = isFocused ? 'account' : 'account-outline';
            label = t('navProfile');
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel || label}
              onPress={onPress}
              style={styles.dockButton}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconWrap,
                  isFocused && (isDark ? styles.iconWrapActiveDark : styles.iconWrapActive),
                ]}
              >
                <MaterialCommunityIcons
                  name={iconName}
                  size={22}
                  color={
                    isFocused
                      ? isDark ? '#4ADE80' : '#1B4D3E'
                      : isDark ? '#94A3B8' : '#64748B'
                  }
                />
              </View>
              <Text
                style={[
                  styles.dockLabel,
                  isDark && styles.dockLabelDark,
                  isFocused && (isDark ? styles.dockLabelActiveDark : styles.dockLabelActive),
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Farm" component={InteractiveFarmMapScreen} />
      <Tab.Screen name="Weather" component={WeatherConditionsScreen} />
      <Tab.Screen name="Crops" component={PlantationListScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  dockWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 99,
  },
  dockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xxl,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: '92%',
    maxWidth: 440,
    borderWidth: 1,
    borderColor: '#E8ECE2',
    ...Platform.select({
      ios: {
        shadowColor: '#0F291E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
      default: {
        shadowColor: '#0F291E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
    }),
  },
  dockContainerDark: {
    backgroundColor: '#13211B',
    borderColor: '#23382E',
  },
  dockButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#E8F5E9',
  },
  iconWrapActiveDark: {
    backgroundColor: '#1E382B',
  },
  dockLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  dockLabelDark: {
    color: '#687E72',
  },
  dockLabelActive: {
    color: '#1B4D3E',
    fontWeight: '800',
  },
  dockLabelActiveDark: {
    color: '#4ADE80',
    fontWeight: '800',
  },
});
