import React from 'react';
import {
  View,
  ScrollView,
  ViewStyle,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme';
import { usePreferences } from '../contexts/PreferencesContext';
import { OfflineBanner } from './OfflineBanner';
import { styles } from './styles/screen.styles';

export interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  refreshing?: boolean;
  onRefresh?: () => void;
  withTopInset?: boolean;
  withBottomInset?: boolean;
  backgroundColor?: string;
  showOfflineBanner?: boolean;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
  refreshing = false,
  onRefresh,
  withTopInset = true,
  withBottomInset = true,
  backgroundColor,
  showOfflineBanner = true,
}) => {
  const insets = useSafeAreaInsets();
  const { isDark, themeColors } = usePreferences();

  const resolvedBg = backgroundColor || (isDark ? '#0B1410' : colors.background);

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: resolvedBg,
    paddingTop: withTopInset ? insets.top : 0,
    paddingBottom: withBottomInset ? insets.bottom : 0,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={containerStyle}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {showOfflineBanner && <OfflineBanner />}

      {scrollable ? (
        <ScrollView
          style={[styles.scroll, style]}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={themeColors.primary}
                colors={[themeColors.primary]}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.fixed, style]}>{children}</View>
      )}
    </KeyboardAvoidingView>
  );
};

