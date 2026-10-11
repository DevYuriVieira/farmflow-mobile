import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export type HapticType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'selection'
  | 'success'
  | 'warning'
  | 'error';

/**
 * Trigger haptic feedback with safe fallbacks on web or unsupported platforms.
 */
export async function triggerHaptic(type: HapticType = 'light'): Promise<void> {
  if (Platform.OS === 'web') {
    // Web safe fallback (vibrate API if available on mobile browser)
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        if (type === 'light' || type === 'selection') navigator.vibrate(10);
        else if (type === 'medium') navigator.vibrate(25);
        else if (type === 'heavy' || type === 'warning') navigator.vibrate(40);
        else if (type === 'success') navigator.vibrate([15, 50, 15]);
        else if (type === 'error') navigator.vibrate([50, 50, 50]);
      }
    } catch {
    }
    return;
  }

  try {
    switch (type) {
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'selection':
        await Haptics.selectionAsync();
        break;
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  } catch {
    // Fail silently on hardware without vibration motors
  }
}
