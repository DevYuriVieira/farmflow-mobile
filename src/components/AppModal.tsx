import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../theme';
import { usePreferences } from '../contexts/PreferencesContext';

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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.modalOverlay,
    justifyContent: 'flex-end',
  },
  keyboardContainer: {
    justifyContent: 'flex-end',
  },
  contentContainer: {
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: radii.xxl,
    borderTopRightRadius: radii.xxl,
    borderTopWidth: 1.5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(74, 138, 98, 0.4)',
    maxHeight: '92%',
    paddingTop: spacing.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleWrapper: {
    flex: 1,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceCardSolid,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  bodyContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
