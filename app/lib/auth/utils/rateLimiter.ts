/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Sistema de Rate Limiting para prevenir ataques de fuerza bruta
 * Implementa límites por IP y por usuario
 */

/**
 * Configuración de rate limiting
 */
interface RateLimitConfig {
  windowMs: number; // Ventana de tiempo en ms
  maxAttempts: number; // Máximo número de intentos
  blockDurationMs: number; // Duración del bloqueo en ms
  cleanupIntervalMs: number; // Intervalo de limpieza en ms
}

/**
 * Configuraciones predefinidas para diferentes tipos de operaciones
 */
export const RATE_LIMIT_CONFIGS = {
  LOGIN: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxAttempts: 5, // 5 intentos por ventana
    blockDurationMs: 30 * 60 * 1000, // 30 minutos de bloqueo
    cleanupIntervalMs: 5 * 60 * 1000, // Limpiar cada 5 minutos
  },
  REGISTER: {
    windowMs: 60 * 60 * 1000, // 1 hora
    maxAttempts: 3, // 3 registros por hora
    blockDurationMs: 60 * 60 * 1000, // 1 hora de bloqueo
    cleanupIntervalMs: 10 * 60 * 1000, // Limpiar cada 10 minutos
  },
  PASSWORD_RESET: {
    windowMs: 60 * 60 * 1000, // 1 hora
    maxAttempts: 3, // 3 intentos por hora
    blockDurationMs: 60 * 60 * 1000, // 1 hora de bloqueo
    cleanupIntervalMs: 10 * 60 * 1000, // Limpiar cada 10 minutos
  },
  API_CALLS: {
    windowMs: 60 * 1000, // 1 minuto
    maxAttempts: 100, // 100 llamadas por minuto
    blockDurationMs: 5 * 60 * 1000, // 5 minutos de bloqueo
    cleanupIntervalMs: 60 * 1000, // Limpiar cada minuto
  },
} as const;

/**
 * Información de un intento
 */
interface AttemptInfo {
  timestamp: number;
  success: boolean;
  userAgent?: string;
  ip?: string;
}

/**
 * Información de rate limiting para una clave
 */
interface RateLimitInfo {
  attempts: AttemptInfo[];
  blockedUntil?: number;
  lastCleanup: number;
}

/**
 * Clase para manejo de rate limiting
 */
export class RateLimiter {
  private store: Map<string, RateLimitInfo> = new Map();
  private cleanupTimer?: NodeJS.Timeout;

  constructor() {
    this.startCleanupTimer();
  }

  /**
   * Verifica si una operación está permitida
   * @param key - Clave única (IP, email, etc.)
   * @param config - Configuración de rate limiting
   * @param userAgent - User agent del cliente (opcional)
   * @param ip - IP del cliente (opcional)
   * @returns true si está permitido, false si está bloqueado
   */
  isAllowed(
    key: string,
    config: RateLimitConfig,
    _userAgent?: string,
    _ip?: string
  ): boolean {
    const now = Date.now();
    const rateLimitInfo = this.getOrCreateRateLimitInfo(key);

    // Verificar si está bloqueado
    if (rateLimitInfo.blockedUntil && now < rateLimitInfo.blockedUntil) {
      return false;
    }

    // Limpiar intentos antiguos
    this.cleanupOldAttempts(rateLimitInfo, config.windowMs);

    // Verificar límite de intentos
    if (rateLimitInfo.attempts.length >= config.maxAttempts) {
      // Bloquear por el tiempo configurado
      rateLimitInfo.blockedUntil = now + config.blockDurationMs;
      return false;
    }

    return true;
  }

  /**
   * Registra un intento
   * @param key - Clave única
   * @param config - Configuración de rate limiting
   * @param success - Si el intento fue exitoso
   * @param userAgent - User agent del cliente (opcional)
   * @param ip - IP del cliente (opcional)
   */
  recordAttempt(
    key: string,
    config: RateLimitConfig,
    success: boolean,
    userAgent?: string,
    ip?: string
  ): void {
    const now = Date.now();
    const rateLimitInfo = this.getOrCreateRateLimitInfo(key);

    // Limpiar intentos antiguos
    this.cleanupOldAttempts(rateLimitInfo, config.windowMs);

    // Agregar nuevo intento
    rateLimitInfo.attempts.push({
      timestamp: now,
      success,
      userAgent: this.sanitizeUserAgent(userAgent),
      ip: this.sanitizeIP(ip),
    });

    // Si fue exitoso, limpiar intentos fallidos
    if (success) {
      rateLimitInfo.attempts = rateLimitInfo.attempts.filter(
        attempt => attempt.success
      );
      rateLimitInfo.blockedUntil = undefined;
    }
  }

  /**
   * Obtiene información de rate limiting para una clave
   * @param key - Clave única
   * @returns Información de rate limiting
   */
  getRateLimitInfo(key: string): {
    attempts: number;
    remaining: number;
    resetTime: number;
    isBlocked: boolean;
    blockedUntil?: number;
  } {
    const rateLimitInfo = this.getOrCreateRateLimitInfo(key);
    const now = Date.now();

    // Limpiar intentos antiguos
    this.cleanupOldAttempts(rateLimitInfo, RATE_LIMIT_CONFIGS.LOGIN.windowMs);

    const isBlocked = rateLimitInfo.blockedUntil
      ? now < rateLimitInfo.blockedUntil
      : false;
    const attempts = rateLimitInfo.attempts.length;
    const remaining = Math.max(
      0,
      RATE_LIMIT_CONFIGS.LOGIN.maxAttempts - attempts
    );
    const resetTime =
      attempts > 0
        ? rateLimitInfo.attempts[0].timestamp +
          RATE_LIMIT_CONFIGS.LOGIN.windowMs
        : now;

    return {
      attempts,
      remaining,
      resetTime,
      isBlocked,
      blockedUntil: rateLimitInfo.blockedUntil,
    };
  }

  /**
   * Resetea el rate limiting para una clave
   * @param key - Clave única
   */
  reset(key: string): void {
    this.store.delete(key);
  }

  /**
   * Obtiene estadísticas del rate limiter
   */
  getStats(): {
    totalKeys: number;
    blockedKeys: number;
    totalAttempts: number;
  } {
    const now = Date.now();
    let blockedKeys = 0;
    let totalAttempts = 0;

    for (const [, info] of this.store) {
      if (info.blockedUntil && now < info.blockedUntil) {
        blockedKeys++;
      }
      totalAttempts += info.attempts.length;
    }

    return {
      totalKeys: this.store.size,
      blockedKeys,
      totalAttempts,
    };
  }

  /**
   * Obtiene o crea información de rate limiting
   */
  private getOrCreateRateLimitInfo(key: string): RateLimitInfo {
    if (!this.store.has(key)) {
      this.store.set(key, {
        attempts: [],
        lastCleanup: Date.now(),
      });
    }
    return this.store.get(key)!;
  }

  /**
   * Limpia intentos antiguos
   */
  private cleanupOldAttempts(
    rateLimitInfo: RateLimitInfo,
    windowMs: number
  ): void {
    const now = Date.now();
    const cutoff = now - windowMs;

    rateLimitInfo.attempts = rateLimitInfo.attempts.filter(
      attempt => attempt.timestamp > cutoff
    );

    rateLimitInfo.lastCleanup = now;
  }

  /**
   * Inicia el timer de limpieza
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, RATE_LIMIT_CONFIGS.LOGIN.cleanupIntervalMs);
  }

  /**
   * Limpia entradas antiguas
   */
  private cleanup(): void {
    const now = Date.now();
    const maxAge = Math.max(
      RATE_LIMIT_CONFIGS.LOGIN.windowMs,
      RATE_LIMIT_CONFIGS.LOGIN.blockDurationMs
    );

    for (const [key, info] of this.store) {
      // Si no hay intentos recientes y no está bloqueado, eliminar
      const hasRecentAttempts = info.attempts.some(
        attempt => now - attempt.timestamp < maxAge
      );
      const isBlocked = info.blockedUntil && now < info.blockedUntil;

      if (!hasRecentAttempts && !isBlocked) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Sanitiza el user agent
   */
  private sanitizeUserAgent(userAgent?: string): string | undefined {
    if (!userAgent) return undefined;

    // Truncar y limpiar user agent
    return userAgent.substring(0, 200).replace(/[<>]/g, '');
  }

  /**
   * Sanitiza la IP
   */
  private sanitizeIP(ip?: string): string | undefined {
    if (!ip) return undefined;

    // Validar formato de IP básico
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (ipRegex.test(ip)) {
      return ip;
    }

    // Para IPv6, truncar
    return ip.substring(0, 45);
  }

  /**
   * Destruye el rate limiter y limpia recursos
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.store.clear();
  }
}

// Instancia singleton del rate limiter
export const rateLimiter = new RateLimiter();

/**
 * Función helper para verificar rate limiting de login
 */
export const checkLoginRateLimit = (
  email: string,
  ip?: string,
  userAgent?: string
): boolean => {
  const key = `login:${email}:${ip || 'unknown'}`;
  return rateLimiter.isAllowed(key, RATE_LIMIT_CONFIGS.LOGIN, userAgent, ip);
};

/**
 * Función helper para registrar intento de login
 */
export const recordLoginAttempt = (
  email: string,
  success: boolean,
  ip?: string,
  userAgent?: string
): void => {
  const key = `login:${email}:${ip || 'unknown'}`;
  rateLimiter.recordAttempt(
    key,
    RATE_LIMIT_CONFIGS.LOGIN,
    success,
    userAgent,
    ip
  );
};

/**
 * Función helper para verificar rate limiting de registro
 */
export const checkRegisterRateLimit = (
  email: string,
  ip?: string,
  userAgent?: string
): boolean => {
  const key = `register:${email}:${ip || 'unknown'}`;
  return rateLimiter.isAllowed(key, RATE_LIMIT_CONFIGS.REGISTER, userAgent, ip);
};

/**
 * Función helper para registrar intento de registro
 */
export const recordRegisterAttempt = (
  email: string,
  success: boolean,
  ip?: string,
  userAgent?: string
): void => {
  const key = `register:${email}:${ip || 'unknown'}`;
  rateLimiter.recordAttempt(
    key,
    RATE_LIMIT_CONFIGS.REGISTER,
    success,
    userAgent,
    ip
  );
};

/**
 * Función helper para obtener información de rate limiting
 */
export const getRateLimitInfo = (email: string, ip?: string) => {
  const key = `login:${email}:${ip || 'unknown'}`;
  return rateLimiter.getRateLimitInfo(key);
};
