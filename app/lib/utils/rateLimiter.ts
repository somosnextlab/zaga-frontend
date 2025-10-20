/**
 * Rate Limiter para Zaga Frontend
 * Previene ataques de fuerza bruta y abuso de la API
 */

interface RateLimitInfo {
  attempts: number;
  lastAttempt: number;
  blockedUntil?: number;
}

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutos
  blockDurationMs: 30 * 60 * 1000, // 30 minutos
};

// Almacenamiento en memoria (en producción usar Redis)
const rateLimitStore = new Map<string, RateLimitInfo>();

/**
 * Verifica si una IP está bloqueada por rate limiting
 */
export const checkLoginRateLimit = (identifier: string): boolean => {
  const now = Date.now();
  const info = rateLimitStore.get(identifier);

  if (!info) {
    return true; // No hay intentos previos, permitir
  }

  // Si está bloqueado, verificar si ya expiró
  if (info.blockedUntil && now < info.blockedUntil) {
    return false; // Aún bloqueado
  }

  // Si el bloqueo expiró, limpiar
  if (info.blockedUntil && now >= info.blockedUntil) {
    rateLimitStore.delete(identifier);
    return true;
  }

  // Verificar si los intentos están dentro del límite
  const windowStart = now - DEFAULT_CONFIG.windowMs;
  if (info.lastAttempt < windowStart) {
    // La ventana de tiempo expiró, resetear
    rateLimitStore.delete(identifier);
    return true;
  }

  return info.attempts < DEFAULT_CONFIG.maxAttempts;
};

/**
 * Registra un intento de login
 */
export const recordLoginAttempt = (identifier: string, success: boolean): void => {
  const now = Date.now();
  const info = rateLimitStore.get(identifier) || {
    attempts: 0,
    lastAttempt: 0,
  };

  if (success) {
    // Si el login fue exitoso, limpiar el historial
    rateLimitStore.delete(identifier);
    return;
  }

  // Incrementar intentos fallidos
  info.attempts += 1;
  info.lastAttempt = now;

  // Si excede el límite, bloquear
  if (info.attempts >= DEFAULT_CONFIG.maxAttempts) {
    info.blockedUntil = now + DEFAULT_CONFIG.blockDurationMs;
  }

  rateLimitStore.set(identifier, info);
};

/**
 * Obtiene información del rate limiting para una IP
 */
export const getRateLimitInfo = (identifier: string): RateLimitInfo | null => {
  return rateLimitStore.get(identifier) || null;
};

/**
 * Limpia el almacenamiento de rate limiting (para testing)
 */
export const clearRateLimitStore = (): void => {
  rateLimitStore.clear();
};

/**
 * Resetea el rate limiting para un identificador específico
 */
export const reset = (identifier: string): void => {
  rateLimitStore.delete(identifier);
};
