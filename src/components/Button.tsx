import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { colors, radii, spacing, typography } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...rest
}) => {
  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radii.pill,
    };

    switch (size) {
      case 'sm':
        base.paddingVertical = spacing.xs + 2;
        base.paddingHorizontal = spacing.md;
        break;
      case 'lg':
        base.paddingVertical = spacing.md + 2;
        base.paddingHorizontal = spacing.xl;
        break;
      case 'md':
      default:
        base.paddingVertical = spacing.sm + 4;
        base.paddingHorizontal = spacing.base;
        break;
    }

    switch (variant) {
      case 'secondary':
        base.backgroundColor = colors.surfaceCardSolid;
        base.borderWidth = 1;
        base.borderColor = colors.border;
        break;
      case 'outline':
        base.backgroundColor = 'transparent';
        base.borderWidth = 1.5;
        base.borderColor = colors.borderActive;
        break;
      case 'ghost':
        base.backgroundColor = 'transparent';
        break;
      case 'danger':
        base.backgroundColor = colors.danger;
        break;
      case 'primary':
      default:
        base.backgroundColor = colors.primary;
        break;
    }

    if (disabled || loading) {
      base.opacity = 0.55;
    }

    return base;
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      textAlign: 'center',
    };

    switch (size) {
      case 'sm':
        Object.assign(base, typography.captionMedium);
        break;
      case 'lg':
        Object.assign(base, typography.bodyBold);
        break;
      case 'md':
      default:
        Object.assign(base, typography.bodyMedium);
        break;
    }

    switch (variant) {
      case 'primary':
        base.color = colors.textInverse;
        base.fontWeight = '700';
        break;
      case 'outline':
        base.color = colors.primaryLight;
        base.fontWeight = '600';
        break;
      case 'ghost':
        base.color = colors.textPrimary;
        break;
      case 'danger':
      case 'secondary':
      default:
        base.color = colors.textPrimary;
        base.fontWeight = '600';
        break;
    }

    return base;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.textInverse : colors.primaryLight}
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={[getTextStyle(), leftIcon ? styles.textWithLeftIcon : undefined, rightIcon ? styles.textWithRightIcon : undefined, textStyle]}>
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textWithLeftIcon: {
    marginLeft: spacing.sm,
  },
  textWithRightIcon: {
    marginRight: spacing.sm,
  },
});
