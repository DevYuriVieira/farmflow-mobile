import React from 'react';
import { View, Image, StyleSheet, ViewStyle, StyleProp, ImageSourcePropType } from 'react-native';

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

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    backgroundColor: '#E8F5E9',
  },
  badge: {
    position: 'absolute',
    backgroundColor: '#22C55E',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});
