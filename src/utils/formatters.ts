import { CropType, PlantationStatus } from '../types/plantation.types';
import { ActivityType } from '../types/activity.types';
import { Language } from '../i18n/translations';

export const cropTypeLabelsPt: Record<CropType, string> = {
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

export const cropTypeLabelsEn: Record<CropType, string> = {
  SOY: 'Soybeans',
  CORN: 'Corn',
  COFFEE: 'Coffee',
  WHEAT: 'Wheat',
  RICE: 'Rice',
  POTATO: 'Potato',
  APPLE: 'Apple',
  COTTON: 'Cotton',
  SUGARCANE: 'Sugarcane',
  OTHER: 'Other Crop',
};

export function getCropLabel(crop: CropType, lang: Language = 'pt'): string {
  return lang === 'en' ? cropTypeLabelsEn[crop] : cropTypeLabelsPt[crop];
}

export const cropTypeLabels = cropTypeLabelsPt;

export const plantationStatusLabelsPt: Record<PlantationStatus, string> = {
  PLANNED: 'Planejado',
  SOWING: 'Semeadura / Plantio',
  GROWING: 'Em Desenvolvimento',
  HARVEST_READY: 'Pronto p/ Colheita',
  HARVESTED: 'Colhido',
};

export const plantationStatusLabelsEn: Record<PlantationStatus, string> = {
  PLANNED: 'Planned',
  SOWING: 'Sowing / Planting',
  GROWING: 'Growing',
  HARVEST_READY: 'Ready to Harvest',
  HARVESTED: 'Harvested',
};

export function getPlantationStatusLabel(status: PlantationStatus, lang: Language = 'pt'): string {
  return lang === 'en' ? plantationStatusLabelsEn[status] : plantationStatusLabelsPt[status];
}

export const plantationStatusLabels = plantationStatusLabelsPt;

export const activityTypeLabelsPt: Record<ActivityType, string> = {
  IRRIGATION: 'Irrigação',
  FERTILIZATION: 'Adubação / Nutrição',
  PEST_CONTROL: 'Controle de Pragas',
  PLANTING: 'Plantio / Semeadura',
  HARVEST: 'Colheita',
  SOIL_ANALYSIS: 'Análise de Solo',
  PRUNING: 'Poda e Manejo',
  OTHER: 'Outra Atividade',
};

export const activityTypeLabelsEn: Record<ActivityType, string> = {
  IRRIGATION: 'Irrigation',
  FERTILIZATION: 'Fertilization',
  PEST_CONTROL: 'Pest Control',
  PLANTING: 'Planting / Sowing',
  HARVEST: 'Harvest',
  SOIL_ANALYSIS: 'Soil Analysis',
  PRUNING: 'Pruning & Care',
  OTHER: 'Other Activity',
};

export function getActivityTypeLabel(activity: ActivityType, lang: Language = 'pt'): string {
  return lang === 'en' ? activityTypeLabelsEn[activity] : activityTypeLabelsPt[activity];
}

export const activityTypeLabels = activityTypeLabelsPt;

export function formatHectares(ha: number, lang: Language = 'pt'): string {
  const locale = lang === 'en' ? 'en-US' : 'pt-BR';
  return `${ha.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 2 })} ha`;
}

export function formatPercentage(val: number): string {
  return `${Math.round(val)}%`;
}

export const seedActivitiesEn: Record<string, { title: string; description: string }> = {
  'act-001': {
    title: 'Morning drip irrigation',
    description: 'Apply 8mm water depth in sector 2 to maintain soil moisture.',
  },
  'act-002': {
    title: 'Foliar spraying with Neem oil',
    description: 'Preventive phytosanitary application with 0.5% dosage at 10:00.',
  },
  'act-003': {
    title: 'Soil moisture tensiometer reading',
    description: 'Reading sensors installed at 20cm and 40cm depths.',
  },
  'act-004': {
    title: 'Fertigation with balanced NPK-19',
    description: 'Nutrient injection recommended by agronomist in central pivot.',
  },
  'act-005': {
    title: 'North sector hand harvest - Fuji Apple',
    description: 'Selective picking with experienced harvesters and padded crates.',
  },
  'act-006': {
    title: 'Biological trap inspection',
    description: 'Sample insect count for integrated pest monitoring.',
  },
};

export const activityTitleMapEn: Record<string, string> = {
  'Irrigação matinal por gotejamento': 'Morning drip irrigation',
  'Pulverização foliar com óleo de Neem': 'Foliar spraying with Neem oil',
  'Medição de umidade do solo com tensiômetro': 'Soil moisture tensiometer reading',
  'Fertirrigação com NPK-19 balanceado': 'Fertigation with balanced NPK-19',
  'Colheita manual setor norte - Maçã Fuji': 'North sector hand harvest - Fuji Apple',
  'Inspeção de armadilhas biológicas': 'Biological trap inspection',
};

export const plantationNameMapEn: Record<string, string> = {
  'Talhão 01 - Soja RR Safra Principal': 'Field 01 - Main Season RR Soybeans',
  'Pomar de Maçãs Fuji - Setor Norte': 'Fuji Apple Orchard - North Sector',
  'Lavoura de Batata BRS - Zona Leste': 'BRS Potato Crop - East Zone',
  'Talhão Sul - Milho Safrinha': 'South Field - Second-crop Corn',
  'Talhão Especial - Café Arábica Catuaí': 'Special Field - Catuaí Arabica Coffee',
  'Paddy Seeding Plot - Arroz Irrigado': 'Paddy Seeding Plot - Flooded Rice',
};

export const plantationNotesMapEn: Record<string, string> = {
  'Excelente taxa de germinação no pivô central. Stand uniforme de 280 mil plantas/ha.':
    'Excellent germination rate in central pivot. Uniform stand of 280k plants/ha.',
  'Coloração ideal e brix médio de 13.5. Colheita iniciada com equipe principal.':
    'Ideal color and average brix of 13.5. Harvest started with main team.',
  'Irrigação por gotejamento programada para manter umidade em 75% da capacidade de campo.':
    'Drip irrigation scheduled to maintain moisture at 75% field capacity.',
  'Controle biológico preventivo contra lagarta-do-cartucho realizado com sucesso.':
    'Preventive biological control against fall armyworm completed successfully.',
  'Florada uniforme. Micronutrientes via foliar aplicados após primeira chuva de outono.':
    'Uniform flowering. Foliar micronutrients applied after first autumn rain.',
  'Nivelamento a laser das taipas concluído. Aguardando período ideal de semeadura.':
    'Laser leveling of levees completed. Awaiting optimal sowing window.',
};

export const farmNameMapEn: Record<string, string> = {
  'Fazenda Santa Fé': 'Santa Fé Farm',
  'Fazenda Sol Nascente': 'Rising Sun Farm',
  'Fazenda Vale Verde': 'Green Valley Farm',
};

export function getActivityTitle(activity: { id?: string; title: string }, lang: Language = 'pt'): string {
  if (lang !== 'en') return activity.title;
  if (activity.id && seedActivitiesEn[activity.id]) {
    return seedActivitiesEn[activity.id].title;
  }
  return activityTitleMapEn[activity.title] || activity.title;
}

export function getActivityDescription(
  activity: { id?: string; description?: string },
  lang: Language = 'pt'
): string {
  if (!activity.description) return '';
  if (lang !== 'en') return activity.description;
  if (activity.id && seedActivitiesEn[activity.id]) {
    return seedActivitiesEn[activity.id].description;
  }
  return activity.description;
}

export function getPlantationName(plantation: { name: string }, lang: Language = 'pt'): string {
  if (lang !== 'en') return plantation.name;
  return plantationNameMapEn[plantation.name] || plantation.name;
}

export function getPlantationNotes(plantation: { notes?: string }, lang: Language = 'pt'): string {
  if (!plantation.notes) return '';
  if (lang !== 'en') return plantation.notes;
  return plantationNotesMapEn[plantation.notes] || plantation.notes;
}

export function getFarmDisplayName(farm: { name: string }, lang: Language = 'pt'): string {
  if (lang !== 'en') return farm.name;
  return farmNameMapEn[farm.name] || farm.name;
}
