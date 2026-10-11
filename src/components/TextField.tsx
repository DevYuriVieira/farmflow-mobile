import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../theme';
import { usePreferences } from '../contexts/PreferencesContext';

export interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  isPassword = false,
  containerStyle,
  style,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!isPassword);

  let isDark = false;
  try {
    const prefs = usePreferences();
    isDark = prefs.isDark;
  } catch {
    isDark = false;
  }

  const hasError = Boolean(error);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, isDark && styles.labelDark]}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          isDark && styles.inputWrapperDark,
          isFocused && (isDark ? styles.inputFocusedDark : styles.inputFocused),
          hasError && styles.inputError,
        ]}
      >
        {leftIcon && (
          <MaterialCommunityIcons
            name={leftIcon}
            size={20}
            color={
              hasError
                ? colors.danger
                : isFocused
                ? isDark ? '#4ADE80' : colors.primary
                : isDark ? '#94A3B8' : colors.textMuted
            }
            style={styles.leftIcon}
          />
        )}
        <TextInput
          placeholderTextColor={isDark ? '#94A3B8' : colors.textMuted}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[styles.input, isDark && styles.inputDark, style]}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowPassword(!showPassword)}
            style={styles.rightAction}
          >
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={isDark ? '#94A3B8' : colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
      {hasError && (
        <View style={styles.errorRow}>
          <MaterialCommunityIcons name="alert-circle-outline" size={14} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {!hasError && helperText && (
        <Text style={[styles.helperText, isDark && styles.helperTextDark]}>{helperText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  label: {
    ...typography.captionMedium,
    color: '#4A5E54',
    marginBottom: spacing.xs + 2,
  },
  labelDark: {
    color: '#E2E8F0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F6F0',
    borderRadius: radii.lg,
    borderWidth: 1.2,
    borderColor: '#E2E7DB',
    paddingHorizontal: spacing.md,
    minHeight: 50,
  },
  inputWrapperDark: {
    backgroundColor: '#16281F',
    borderColor: '#2C493A',
  },
  inputFocused: {
    borderColor: '#22C55E',
    backgroundColor: '#FFFFFF',
  },
  inputFocusedDark: {
    borderColor: '#4ADE80',
    backgroundColor: '#1E3327',
  },
  inputError: {
    borderColor: colors.danger,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: '#172B23',
    paddingVertical: spacing.sm,
  },
  inputDark: {
    color: '#FFFFFF',
  },
  rightAction: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  errorText: {
    ...typography.micro,
    color: colors.danger,
    marginLeft: spacing.xs,
  },
  helperText: {
    ...typography.micro,
    color: '#7E9489',
    marginTop: spacing.xs,
  },
  helperTextDark: {
    color: '#94A3B8',
  },
});
