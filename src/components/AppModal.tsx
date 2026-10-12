import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';
import { usePreferences } from '../contexts/PreferencesContext';
import { styles } from './styles/appModal.styles';

export interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const AppModal: React.FC<AppModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
}) => {
  const insets = useSafeAreaInsets();
  const { isDark } = usePreferences();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardContainer}
        >
          <View
            style={[
              styles.contentContainer,
              isDark && { backgroundColor: '#122018', borderColor: 'rgba(74, 138, 98, 0.4)' },
              {
                paddingBottom: insets.bottom > 0 ? insets.bottom + spacing.sm : spacing.lg,
              },
            ]}
          >
            <View style={[styles.header, isDark && { borderBottomColor: 'rgba(74, 138, 98, 0.3)' }]}>
              <View style={styles.titleWrapper}>
                <Text style={[styles.title, isDark && { color: '#FFFFFF' }]}>{title}</Text>
                {subtitle && <Text style={[styles.subtitle, isDark && { color: '#CBD5E1' }]}>{subtitle}</Text>}
              </View>
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.7}
                style={[
                  styles.closeButton,
                  isDark && { backgroundColor: '#1A2E24', borderColor: 'rgba(74, 138, 98, 0.4)' },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Fechar modal"
              >
                <MaterialCommunityIcons name="close" size={22} color={isDark ? '#FFFFFF' : colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.bodyContent}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

