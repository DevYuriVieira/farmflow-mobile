import { z } from 'zod';

export const activityTypeValues = [
  'IRRIGATION',
  'FERTILIZATION',
  'PEST_CONTROL',
  'PLANTING',
  'HARVEST',
  'SOIL_ANALYSIS',
  'PRUNING',
  'OTHER',
] as const;

export const activitySchema = z.object({
  farmId: z.string().min(1, 'Selecione uma fazenda.'),
  plantationId: z.string().optional(),
  title: z
    .string()
    .min(1, 'O título da atividade é obrigatório.')
    .min(3, 'O título deve ter no mínimo 3 caracteres.')
    .max(100, 'O título deve ter no máximo 100 caracteres.'),
  description: z
    .string()
    .min(1, 'A descrição da atividade é obrigatória.')
    .min(3, 'A descrição deve ter no mínimo 3 caracteres.')
    .max(500, 'A descrição deve ter no máximo 500 caracteres.'),
  type: z.enum(activityTypeValues, {
    message: 'Selecione um tipo de atividade válido.',
  }),
  scheduledAt: z.string().min(1, 'A data agendada é obrigatória.'),
});

export type ActivityFormData = z.infer<typeof activitySchema>;
