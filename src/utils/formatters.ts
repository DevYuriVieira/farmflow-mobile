import { CropType, PlantationStatus } from '../types/plantation.types';
import { ActivityType } from '../types/activity.types';

export const cropTypeLabels: Record<CropType, string> = {
  SOY: 'Soja',
  CORN: 'Milho',
  COFFEE: 'Café',
  WHEAT: 'Trigo',
  RICE: 'Arroz',
  POTATO: 'Batata',
  APPLE: 'Maçã',
  COTTON: 'Algodão',
  SUGARCANE: 'Cana-de-Açúcar',
  OTHER: 'Outro Cultivo',
};

export const plantationStatusLabels: Record<PlantationStatus, string> = {
  PLANNED: 'Planejado',
  SOWING: 'Semeadura / Plantio',
  GROWING: 'Em Desenvolvimento',
  HARVEST_READY: 'Pronto p/ Colheita',
  HARVESTED: 'Colhido',
};

export const activityTypeLabels: Record<ActivityType, string> = {
  IRRIGATION: 'Irrigação',
  FERTILIZATION: 'Adubação / Nutrição',
  PEST_CONTROL: 'Controle de Pragas',
  PLANTING: 'Plantio / Semeadura',
  HARVEST: 'Colheita',
  SOIL_ANALYSIS: 'Análise de Solo',
  PRUNING: 'Poda e Manejo',
  OTHER: 'Outra Atividade',
};

export function formatHectares(ha: number): string {
  return `${ha.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} ha`;
}

export function formatPercentage(val: number): string {
  return `${Math.round(val)}%`;
}
