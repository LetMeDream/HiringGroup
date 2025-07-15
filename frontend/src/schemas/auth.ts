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
  lastname: z.string()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres" })
    .max(20, 'El nombre de usuario no puede tener más de 20 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'El nombre de usuario solo puede contener letras, números y guiones bajos'),
  telefono: z.string()
    .min(7, { message: "El teléfono debe tener al menos 7 dígitos" })
    .max(15, { message: "El teléfono no puede tener más de 15 dígitos" })
    .regex(/^\d+$/, 'El teléfono solo puede contener números'),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    //.regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
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