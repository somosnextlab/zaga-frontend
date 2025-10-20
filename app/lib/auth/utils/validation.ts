/**
 * Utilidades de validación robusta para formularios
 * Implementa validaciones de seguridad siguiendo mejores prácticas
 */

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
 * Patrón de email robusto que valida estructura básica
 */
const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Patrón de contraseña robusta
 * - Mínimo 8 caracteres
 * - Al menos 1 mayúscula
 * - Al menos 1 minúscula
 * - Al menos 1 número
 * - Al menos 1 carácter especial
 */
const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Caracteres especiales permitidos para contraseñas
 */
const SPECIAL_CHARS = '@$!%*?&';

/**
 * Resultado de validación
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  suggestions?: string[];
}

/**
 * Valida un email con dominio permitido
 * @param email - Email a validar
 * @returns Resultado de la validación
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      error: 'El email es requerido',
    };
  }

  const trimmedEmail = email.trim().toLowerCase();

  // Validar estructura básica del email
  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    return {
      isValid: false,
      error: 'El formato del email no es válido',
    };
  }

  // Extraer dominio
  const domain = trimmedEmail.split('@')[1];

  if (!domain) {
    return {
      isValid: false,
      error: 'El formato del email no es válido',
    };
  }

  // Validar dominio permitido
  if (!ALLOWED_EMAIL_DOMAINS.includes(domain)) {
    return {
      isValid: false,
      error: `Solo se permiten emails de los siguientes proveedores: ${ALLOWED_EMAIL_DOMAINS.slice(
        0,
        5
      ).join(', ')} y otros`,
      suggestions: [
        'Usa un email de Gmail, Hotmail, Yahoo, Outlook o iCloud',
        'Verifica que el dominio esté escrito correctamente',
      ],
    };
  }

  return { isValid: true };
};

/**
 * Valida una contraseña robusta
 * @param password - Contraseña a validar
 * @returns Resultado de la validación
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password || password === '') {
    return {
      isValid: false,
      error: 'La contraseña es requerida',
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: 'La contraseña debe tener al menos 8 caracteres',
    };
  }

  if (!PASSWORD_PATTERN.test(password)) {
    const missingRequirements = [];

    if (!/[a-z]/.test(password)) {
      missingRequirements.push('una letra minúscula');
    }
    if (!/[A-Z]/.test(password)) {
      missingRequirements.push('una letra mayúscula');
    }
    if (!/\d/.test(password)) {
      missingRequirements.push('un número');
    }
    if (!/[@$!%*?&]/.test(password)) {
      missingRequirements.push(`un carácter especial (${SPECIAL_CHARS})`);
    }

    return {
      isValid: false,
      error: `La contraseña debe contener: ${missingRequirements.join(', ')}`,
      suggestions: [
        'Usa una combinación de letras mayúsculas, minúsculas, números y caracteres especiales',
        `Caracteres especiales permitidos: ${SPECIAL_CHARS}`,
        'Evita usar información personal como fechas de nacimiento o nombres',
      ],
    };
  }

  return { isValid: true };
};

/**
 * Valida que dos contraseñas coincidan
 * @param password - Contraseña original
 * @param confirmPassword - Confirmación de contraseña
 * @returns Resultado de la validación
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (!confirmPassword || confirmPassword === '') {
    return {
      isValid: false,
      error: 'Confirma tu contraseña',
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Las contraseñas no coinciden',
    };
  }

  return { isValid: true };
};

/**
 * Sanitiza un string para prevenir XSS
 * @param input - String a sanitizar
 * @returns String sanitizado
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

/**
 * Valida un nombre (para perfiles)
 * @param name - Nombre a validar
 * @returns Resultado de la validación
 */
export const validateName = (name: string): ValidationResult => {
  if (!name || name.trim() === '') {
    return {
      isValid: false,
      error: 'El nombre es requerido',
    };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return {
      isValid: false,
      error: 'El nombre debe tener al menos 2 caracteres',
    };
  }

  if (trimmedName.length > 50) {
    return {
      isValid: false,
      error: 'El nombre no puede tener más de 50 caracteres',
    };
  }

  // Solo letras, espacios, guiones y apostrofes
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-']+$/.test(trimmedName)) {
    return {
      isValid: false,
      error:
        'El nombre solo puede contener letras, espacios, guiones y apostrofes',
    };
  }

  return { isValid: true };
};

/**
 * Valida un teléfono
 * @param phone - Teléfono a validar
 * @returns Resultado de la validación
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone || phone.trim() === '') {
    return {
      isValid: false,
      error: 'El teléfono es requerido',
    };
  }

  // Remover espacios, guiones y paréntesis
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

  // Validar que solo contenga números y opcionalmente +
  if (!/^\+?[0-9]{10,15}$/.test(cleanPhone)) {
    return {
      isValid: false,
      error: 'El teléfono debe contener entre 10 y 15 dígitos',
      suggestions: [
        'Incluye el código de país si es necesario',
        'Solo se permiten números, espacios, guiones y paréntesis',
      ],
    };
  }

  return { isValid: true };
};
