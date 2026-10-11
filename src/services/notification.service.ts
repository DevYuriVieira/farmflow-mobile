import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { FarmActivity } from '../types/activity.types';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') return false;

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch {
      return false;
    }
  },

  async scheduleActivityReminder(activity: FarmActivity): Promise<string | null> {
    try {
      if (Platform.OS === 'web') return null;

      const scheduledDate = new Date(activity.scheduledAt);
      const now = new Date();

      // If scheduled time has already passed, do not schedule future alert
      if (scheduledDate.getTime() <= now.getTime()) {
        return null;
      }

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const identifier = await Notifications.scheduleNotificationAsync({
        identifier: `act-rem-${activity.id}`,
        content: {
          title: `🚜 Lembrete FarmFlow: ${activity.title}`,
          body: activity.description || 'Atividade agrícola agendada para agora.',
          data: { activityId: activity.id, farmId: activity.farmId },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: scheduledDate,
        },
      });

      return identifier;
    } catch (e) {
      console.warn('Failed to schedule local notification', e);
      return null;
    }
  },

  async cancelActivityReminder(activityId: string): Promise<void> {
    try {
      if (Platform.OS === 'web') return;
      await Notifications.cancelScheduledNotificationAsync(`act-rem-${activityId}`);
    } catch {
    }
  },
};
