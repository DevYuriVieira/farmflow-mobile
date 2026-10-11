import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activityService } from '../../../services/activity.service';
import { notificationService } from '../../../services/notification.service';
import {
  CreateActivityInput,
  UpdateActivityInput,
  ActivityFilter,
} from '../../../types/activity.types';
import { useToast } from '../../../contexts/ToastContext';
import { getFriendlyErrorMessage } from '../../../utils/errorMessages';

export const ACTIVITY_KEYS = {
  all: ['activities'] as const,
  list: (filter?: ActivityFilter) => ['activities', 'list', filter] as const,
  detail: (id: string) => ['activities', 'detail', id] as const,
};

export function useActivities(filter?: ActivityFilter) {
  return useQuery({
    queryKey: ACTIVITY_KEYS.list(filter),
    queryFn: () => activityService.getActivities(filter),
  });
}

export function useActivity(id: string) {
  return useQuery({
    queryKey: ACTIVITY_KEYS.detail(id),
    queryFn: () => activityService.getActivityById(id),
    enabled: Boolean(id),
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async (input: CreateActivityInput) => {
      const created = await activityService.createActivity(input);
      // Attempt to schedule notification reminder
      await notificationService.scheduleActivityReminder(created);
      return created;
    },
    onSuccess: (newAct) => {
      void queryClient.invalidateQueries({ queryKey: ACTIVITY_KEYS.all });
      showSuccess(`Atividade "${newAct.title}" agendada!`);
    },
    onError: (err) => {
      showError(getFriendlyErrorMessage(err));
    },
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async (input: UpdateActivityInput) => {
      const updated = await activityService.updateActivity(input);
      await notificationService.scheduleActivityReminder(updated);
      return updated;
    },
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: ACTIVITY_KEYS.all });
      void queryClient.invalidateQueries({ queryKey: ACTIVITY_KEYS.detail(updated.id) });
      showSuccess(`Atividade atualizada!`);
    },
    onError: (err) => {
      showError(getFriendlyErrorMessage(err));
    },
  });
}

export function useToggleActivityComplete() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      activityService.toggleActivityComplete(id, completed),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: ACTIVITY_KEYS.all });
      if (updated.completed) {
        showSuccess('Atividade marcada como concluída! 🎉');
      } else {
        showSuccess('Atividade reaberta.');
      }
    },
    onError: (err) => {
      showError(getFriendlyErrorMessage(err));
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await notificationService.cancelActivityReminder(id);
      return activityService.deleteActivity(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ACTIVITY_KEYS.all });
      showSuccess('Atividade excluída.');
    },
    onError: (err) => {
      showError(getFriendlyErrorMessage(err));
    },
  });
}
