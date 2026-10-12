import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme';
import { usePreferences } from '../contexts/PreferencesContext';
import { styles } from './styles/textField.styles';

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

