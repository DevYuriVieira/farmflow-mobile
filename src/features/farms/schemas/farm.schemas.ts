import { z } from 'zod';

export const farmSchema = z.object({
  name: z
    .string()
    .min(1, 'O nome da fazenda é obrigatório.')
    .min(3, 'O nome deve ter no mínimo 3 caracteres.')
    .max(100, 'O nome deve ter no máximo 100 caracteres.'),
  location: z
    .string()
    .min(1, 'A localização/município é obrigatória.')
    .min(3, 'A localização deve ter no mínimo 3 caracteres.'),
  totalAreaHectares: z
    .number({ message: 'Informe a área total em hectares.' })
    .positive('A área total deve ser maior que zero.'),
  latitude: z
    .number({ message: 'Latitude inválida.' })
    .min(-90, 'Latitude deve estar entre -90 e 90.')
    .max(90, 'Latitude deve estar entre -90 e 90.'),
  longitude: z
    .number({ message: 'Longitude inválida.' })
    .min(-180, 'Longitude deve estar entre -180 e 180.')
    .max(180, 'Longitude deve estar entre -180 e 180.'),
});

export type FarmFormData = z.infer<typeof farmSchema>;
