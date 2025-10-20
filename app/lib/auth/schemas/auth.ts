/**
 * Esquemas de validación con Zod para autenticación
 * Reemplaza las validaciones manuales con esquemas más robustos y tipados
 */

import { z } from 'zod';

/**
 * Dominios de email permitidos
 */
const ALLOWED_EMAIL_DOMAINS = [
  'gmail.com',
  'hotmail.com',
  'yahoo.com',
  'outlook.com',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'aol.com',
  'protonmail.com',
  'yandex.com',
  'mail.com',
  'gmx.com',
  'zoho.com',
  'fastmail.com',
  'tutanota.com',
  'hey.com',
  'pm.me',
  'proton.me',
  'zaga.com',
  'zaga.com.ar',
];

/**
 * Caracteres especiales permitidos para contraseñas
 */
const SPECIAL_CHARS = '@$!%*?&';

/**
 * Esquema de validación para email
 */
export const emailSchema = z
  .string()
  .min(1, 'El email es requerido')
  .email('El formato del email no es válido')
  .transform(email => email.trim().toLowerCase())
  .refine(
    email => {
      const domain = email.split('@')[1];
      return domain && ALLOWED_EMAIL_DOMAINS.includes(domain);
    },
    {
      message: `Solo se permiten emails de los siguientes proveedores: ${ALLOWED_EMAIL_DOMAINS.slice(0, 5).join(', ')} y otros`,
    }
  );

/**
 * Esquema de validación para contraseña
 */
export const passwordSchema = z
  .string()
  .min(1, 'La contraseña es requerida')
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    `La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial (${SPECIAL_CHARS})`
  );

/**
 * Esquema de validación para nombre
 */
export const nameSchema = z
  .string()
  .min(1, 'El nombre es requerido')
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(50, 'El nombre no puede tener más de 50 caracteres')
  .regex(
    /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-']+$/,
    'El nombre solo puede contener letras, espacios, guiones y apostrofes'
  )
  .transform(name => name.trim());

/**
 * Esquema de validación para teléfono
 */
export const phoneSchema = z
  .string()
  .min(1, 'El teléfono es requerido')
  .refine(
    phone => {
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
      return /^\+?[0-9]{10,15}$/.test(cleanPhone);
    },
    {
      message: 'El teléfono debe contener entre 10 y 15 dígitos',
    }
  )
  .transform(phone => phone.replace(/[\s\-\(\)]/g, ''));

/**
 * Esquema de validación para formulario de login
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/**
 * Esquema de validación para formulario de registro
 */
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine(
    data => data.password === data.confirmPassword,
    {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword'],
    }
  );

/**
 * Esquema de validación para perfil de usuario
 */
export const profileSchema = z.object({
  name: nameSchema,
  phone: phoneSchema.optional(),
  email: emailSchema,
});

/**
 * Esquema de validación para cambio de contraseña
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirma tu nueva contraseña'),
  })
  .refine(
    data => data.newPassword === data.confirmPassword,
    {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword'],
    }
  );

/**
 * Tipos inferidos de los esquemas
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

/**
 * Utilidad para sanitizar input (mantenida para compatibilidad)
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, '') // Remover event handlers
    .substring(0, 1000); // Limitar longitud
};
