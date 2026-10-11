import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório.')
    .email('Informe um e-mail válido.'),
  password: z
    .string()
    .min(1, 'A senha é obrigatória.')
    .min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'O nome é obrigatório.')
      .min(3, 'O nome deve ter pelo menos 3 caracteres.'),
    email: z
      .string()
      .min(1, 'O e-mail é obrigatório.')
      .email('Informe um e-mail válido.'),
    password: z
      .string()
      .min(1, 'A senha é obrigatória.')
      .min(6, 'A senha deve ter pelo menos 6 caracteres.'),
    confirmPassword: z
      .string()
      .min(1, 'A confirmação de senha é obrigatória.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
