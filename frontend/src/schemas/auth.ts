import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .min(1, 'El correo electrónico es requerido')
    .email('Debe ser un correo electrónico válido'),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
});

export const registerSchema = z.object({
  email: z.string()
    .min(1, 'El correo electrónico es requerido')
    .email('Debe ser un correo electrónico válido'),
  username: z.string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(20, 'El nombre de usuario no puede tener más de 20 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'El nombre de usuario solo puede contener letras, números y guiones bajos'),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, 'El correo electrónico es requerido')
    .email('Debe ser un correo electrónico válido')
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;