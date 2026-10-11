import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { farmService } from '../../../services/farm.service';
import { CreateFarmInput, UpdateFarmInput } from '../../../types/farm.types';
import { useToast } from '../../../contexts/ToastContext';
import { getFriendlyErrorMessage } from '../../../utils/errorMessages';

export const FARM_KEYS = {
  all: ['farms'] as const,
  detail: (id: string) => ['farms', id] as const,
};

export function useFarms() {
  return useQuery({
    queryKey: FARM_KEYS.all,
    queryFn: () => farmService.getFarms(),
  });
}

export function useFarm(id: string) {
  return useQuery({
    queryKey: FARM_KEYS.detail(id),
    queryFn: () => farmService.getFarmById(id),
    enabled: Boolean(id),
  });
}

export function useCreateFarm() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (input: CreateFarmInput) => farmService.createFarm(input),
    onSuccess: (newFarm) => {
      void queryClient.invalidateQueries({ queryKey: FARM_KEYS.all });
      showSuccess(`Fazenda "${newFarm.name}" cadastrada com sucesso!`);
    },
    onError: (err) => {
      showError(getFriendlyErrorMessage(err));
    },
  });
}

export function useUpdateFarm() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (input: UpdateFarmInput) => farmService.updateFarm(input),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: FARM_KEYS.all });
      void queryClient.invalidateQueries({ queryKey: FARM_KEYS.detail(updated.id) });
      showSuccess(`Fazenda "${updated.name}" atualizada!`);
    },
    onError: (err) => {
      showError(getFriendlyErrorMessage(err));
    },
  });
}

export function useDeleteFarm() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => farmService.deleteFarm(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: FARM_KEYS.all });
      void queryClient.invalidateQueries({ queryKey: ['plantations'] });
      void queryClient.invalidateQueries({ queryKey: ['activities'] });
      showSuccess('Fazenda removida com sucesso.');
    },
    onError: (err) => {
      showError(getFriendlyErrorMessage(err));
    },
  });
}
