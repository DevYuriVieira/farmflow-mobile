import { z } from 'zod';

export const cropTypeValues = [
  'SOY',
  'CORN',
  'COFFEE',
  'WHEAT',
  'RICE',
  'POTATO',
  'APPLE',
  'COTTON',
  'SUGARCANE',
  'OTHER',
] as const;

export const plantationStatusValues = [
  'PLANNED',
  'SOWING',
  'GROWING',
  'HARVEST_READY',
  'HARVESTED',
] as const;

export const plantationSchema = z
  .object({
    farmId: z.string().min(1, 'Selecione uma fazenda.'),
    name: z
      .string()
      .min(1, 'O nome do talhão é obrigatório.')
      .min(3, 'O nome deve ter no mínimo 3 caracteres.')
      .max(100, 'O nome deve ter no máximo 100 caracteres.'),
    cropType: z.enum(cropTypeValues, {
      message: 'Selecione uma cultura válida.',
    }),
    areaHectares: z
      .number({ message: 'Informe a área em hectares.' })
      .positive('A área do talhão deve ser maior que zero.'),
    status: z.enum(plantationStatusValues, {
      message: 'Selecione o estágio da plantação.',
    }),
    plantedAt: z.string().min(1, 'A data de plantio é obrigatória.'),
    expectedHarvestAt: z
      .string()
      .min(1, 'A data prevista de colheita é obrigatória.'),
    imageUri: z.string().optional(),
    notes: z.string().max(500, 'As observações devem ter no máximo 500 caracteres.').optional(),
  })
  .refine(
    (data) => {
      const planted = new Date(data.plantedAt).getTime();
      const harvest = new Date(data.expectedHarvestAt).getTime();
      if (isNaN(planted) || isNaN(harvest)) return true;
      return harvest >= planted;
    },
    {
      message: 'A data prevista de colheita não pode ser anterior ao plantio.',
      path: ['expectedHarvestAt'],
    }
  );

export type PlantationFormData = z.infer<typeof plantationSchema>;
