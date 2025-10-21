/**
 * Sistema de validación centralizado
 * Consolida todas las validaciones del proyecto
 */

export * from '../auth/schemas/auth';
export * from '../auth/utils/validation';

// Re-exportar funciones de validación con nombres más específicos
export {
  validateEmail as validateEmailBasic,
  validatePassword as validatePasswordBasic,
  validateName as validateNameBasic,
  validatePhone as validatePhoneBasic,
  sanitizeInput as sanitizeInputBasic,
} from '../utils/validation';
