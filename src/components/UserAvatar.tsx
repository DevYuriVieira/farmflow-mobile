import React from 'react';
import { View, Image, ViewStyle, StyleProp, ImageSourcePropType } from 'react-native';
import { styles } from './styles/userAvatar.styles';

const LOCAL_AVATAR = require('../../assets/avatar.png');

export interface UserAvatarProps {
  size?: number;
  uri?: string;
  source?: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  showBorder?: boolean;
  borderColor?: string;
  showBadge?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  size = 44,
  uri,
  source,
  style,
  showBorder = true,
  borderColor = 'rgba(255, 255, 255, 0.9)',
  showBadge = false,
}) => {
  const avatarSource = source || (uri ? { uri } : LOCAL_AVATAR);
  const borderRadius = size / 2;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius,
        },
        showBorder && {
          borderWidth: 2,
          borderColor,
        },
        style,
      ]}
    >
      <Image
        source={avatarSource}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius,
          },
        ]}
        resizeMode="cover"
      />
      {showBadge && (
        <View
          style={[
            styles.badge,
            {
              width: Math.max(10, size * 0.24),
              height: Math.max(10, size * 0.24),
              borderRadius: Math.max(5, size * 0.12),
              bottom: 0,
              right: 0,
            },
          ]}
        />
      )}
    </View>
  );
};

