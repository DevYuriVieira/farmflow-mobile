import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { plantationService } from '../../../services/plantation.service';
import {
  CreatePlantationInput,
  UpdatePlantationInput,
  PlantationFilter,
} from '../../../types/plantation.types';
import { useToast } from '../../../contexts/ToastContext';
import { getFriendlyErrorMessage } from '../../../utils/errorMessages';

export const PLANTATION_KEYS = {
  all: ['plantations'] as const,
  list: (filter?: PlantationFilter) => ['plantations', 'list', filter] as const,
  detail: (id: string) => ['plantations', 'detail', id] as const,
};

export function usePlantations(filter?: PlantationFilter) {
  return useQuery({
    queryKey: PLANTATION_KEYS.list(filter),
    queryFn: () => plantationService.getPlantations(filter),
  });
}

export function usePlantation(id: string) {
  return useQuery({
    queryKey: PLANTATION_KEYS.detail(id),
    queryFn: () => plantationService.getPlantationById(id),
    enabled: Boolean(id),
  });
}

export function useCreatePlantation() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (input: CreatePlantationInput) => plantationService.createPlantation(input),
    onSuccess: (newPlt) => {
      void queryClient.invalidateQueries({ queryKey: PLANTATION_KEYS.all });
      showSuccess(`Talhão "${newPlt.name}" cadastrado com sucesso!`);
    },
    onError: (err) => {
      showError(getFriendlyErrorMessage(err));
    },
  });
}

export function useUpdatePlantation() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (input: UpdatePlantationInput) => plantationService.updatePlantation(input),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: PLANTATION_KEYS.all });
      void queryClient.invalidateQueries({ queryKey: PLANTATION_KEYS.detail(updated.id) });
      showSuccess(`Talhão "${updated.name}" atualizado!`);
    },
    onError: (err) => {
      showError(getFriendlyErrorMessage(err));
    },
  });
}

export function useDeletePlantation() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => plantationService.deletePlantation(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PLANTATION_KEYS.all });
      void queryClient.invalidateQueries({ queryKey: ['activities'] });
      showSuccess('Talhão removido com sucesso.');
    },
    onError: (err) => {
      showError(getFriendlyErrorMessage(err));
    },
  });
}
