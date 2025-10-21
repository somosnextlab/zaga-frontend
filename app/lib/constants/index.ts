/**
 * Constantes globales del proyecto
 * Centraliza todas las constantes para evitar duplicación
 */

export * from './routes';

// Constantes de configuración
export const CONFIG = {
  API_TIMEOUT: 10000,
  SESSION_REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutos
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutos
  RATE_LIMIT_MAX_ATTEMPTS: 5,
  RATE_LIMIT_BLOCK_DURATION: 30 * 60 * 1000, // 30 minutos
} as const;

// Constantes de validación
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 15,
  EMAIL_MAX_LENGTH: 254,
} as const;

// Constantes de roles
export const ROLES = {
  ADMIN: 'admin',
  CLIENTE: 'cliente',
  USUARIO: 'usuario',
} as const;

// Constantes de tipos de documento
export const DOCUMENT_TYPES = {
  DNI: 'DNI',
  PASAPORTE: 'PASAPORTE',
  CEDULA: 'CEDULA',
} as const;
