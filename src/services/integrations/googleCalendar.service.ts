import { FarmActivity } from '../../types/activity.types';
import { AppError } from '../apiError';

export interface CalendarEventPayload {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

export const googleCalendarService = {
  isConnected(): boolean {
    return false;
  },

  async syncActivityToCalendar(activity: FarmActivity): Promise<{ eventId: string }> {
    if (!this.isConnected()) {
      throw new AppError(
        'CALENDAR_NOT_CONNECTED',
        'A conta do Google Agenda não está conectada. Conecte sua conta em Configurações para habilitar a sincronização.'
      );
    }

    return { eventId: `gcal-${activity.id}` };
  },
};
