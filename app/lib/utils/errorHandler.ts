/**
 * Sistema centralizado de manejo de errores
 * Proporciona logging seguro y manejo consistente de errores
 */

/**
 * Tipos de errores de la aplicación
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NETWORK = 'NETWORK',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Niveles de severidad de errores
 */
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Interfaz para errores de la aplicación
 */
export interface AppError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
  timestamp: Date;
  userId?: string;
  requestId?: string;
}

/**
 * Configuración de logging
 */
interface LogConfig {
  enableConsole: boolean;
  enableRemoteLogging: boolean;
  logLevel: ErrorSeverity;
  sanitizeData: boolean;
}

const DEFAULT_LOG_CONFIG: LogConfig = {
  enableConsole: process.env.NODE_ENV === 'development',
  enableRemoteLogging: process.env.NODE_ENV === 'production',
  logLevel: ErrorSeverity.LOW,
  sanitizeData: true,
};

/**
 * Clase para manejo centralizado de errores
 */
export class ErrorHandler {
  private config: LogConfig;

  constructor(config: Partial<LogConfig> = {}) {
    this.config = { ...DEFAULT_LOG_CONFIG, ...config };
  }

  /**
   * Crea un error de la aplicación
   */
  createError(
    type: ErrorType,
    message: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    details?: Record<string, unknown>,
    code?: string
  ): AppError {
    return {
      type,
      severity,
      message,
      code,
      details: this.sanitizeDetails(details),
      timestamp: new Date(),
    };
  }

  /**
   * Maneja un error de validación
   */
  handleValidationError(
    field: string,
    message: string,
    value?: unknown
  ): AppError {
    return this.createError(
      ErrorType.VALIDATION,
      `Error de validación en ${field}: ${message}`,
      ErrorSeverity.LOW,
      { field, value: this.sanitizeValue(value) }
    );
  }

  /**
   * Maneja un error de autenticación
   */
  handleAuthError(
    message: string,
    details?: Record<string, unknown>
  ): AppError {
    return this.createError(
      ErrorType.AUTHENTICATION,
      message,
      ErrorSeverity.HIGH,
      this.sanitizeDetails(details)
    );
  }

  /**
   * Maneja un error de red
   */
  handleNetworkError(
    message: string,
    statusCode?: number,
    url?: string
  ): AppError {
    return this.createError(ErrorType.NETWORK, message, ErrorSeverity.MEDIUM, {
      statusCode,
      url: this.sanitizeUrl(url),
    });
  }

  /**
   * Maneja un error del servidor
   */
  handleServerError(
    message: string,
    statusCode?: number,
    details?: Record<string, unknown>
  ): AppError {
    return this.createError(ErrorType.SERVER, message, ErrorSeverity.HIGH, {
      statusCode,
      ...this.sanitizeDetails(details),
    });
  }

  /**
   * Registra un error de forma segura
   */
  logError(error: AppError, context?: string): void {
    if (this.shouldLog(error)) {
      const logData = this.prepareLogData(error, context);

      if (this.config.enableConsole) {
        this.logToConsole(error, logData);
      }

      if (this.config.enableRemoteLogging) {
        this.logToRemote(error, logData);
      }
    }
  }

  /**
   * Convierte un error de JavaScript a AppError
   */
  fromJSError(error: Error, type: ErrorType = ErrorType.UNKNOWN): AppError {
    return this.createError(type, error.message, ErrorSeverity.MEDIUM, {
      stack: error.stack,
      name: error.name,
    });
  }

  /**
   * Obtiene un mensaje de error seguro para el usuario
   */
  getUserMessage(error: AppError): string {
    const userMessages: Record<ErrorType, string> = {
      [ErrorType.VALIDATION]: 'Por favor, revisa los datos ingresados',
      [ErrorType.AUTHENTICATION]:
        'Error de autenticación. Verifica tus credenciales',
      [ErrorType.AUTHORIZATION]: 'No tienes permisos para realizar esta acción',
      [ErrorType.NETWORK]: 'Error de conexión. Inténtalo más tarde',
      [ErrorType.SERVER]: 'Error del servidor. Inténtalo más tarde',
      [ErrorType.UNKNOWN]: 'Ocurrió un error inesperado',
    };

    return userMessages[error.type] || userMessages[ErrorType.UNKNOWN];
  }

  /**
   * Determina si un error debe ser registrado
   */
  private shouldLog(error: AppError): boolean {
    const severityLevels = {
      [ErrorSeverity.LOW]: 1,
      [ErrorSeverity.MEDIUM]: 2,
      [ErrorSeverity.HIGH]: 3,
      [ErrorSeverity.CRITICAL]: 4,
    };

    return (
      severityLevels[error.severity] >= severityLevels[this.config.logLevel]
    );
  }

  /**
   * Prepara los datos para logging
   */
  private prepareLogData(
    error: AppError,
    context?: string
  ): Record<string, unknown> {
    return {
      type: error.type,
      severity: error.severity,
      message: error.message,
      code: error.code,
      timestamp: error.timestamp.toISOString(),
      context,
      ...(error.details && { details: error.details }),
    };
  }

  /**
   * Registra en consola de forma segura
   */
  private logToConsole(
    error: AppError,
    logData: Record<string, unknown>
  ): void {
    const logMethod = this.getConsoleMethod(error.severity);

    if (error.severity === ErrorSeverity.CRITICAL) {
      logMethod('🚨 CRITICAL ERROR:', logData);
    } else {
      logMethod(`[${error.type}] ${error.message}`, logData);
    }
  }

  /**
   * Obtiene el método de consola apropiado según la severidad
   */
  private getConsoleMethod(severity: ErrorSeverity): typeof console.log {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        return console.error;
      case ErrorSeverity.MEDIUM:
        return console.warn;
      case ErrorSeverity.LOW:
        return console.info;
      default:
        return console.log;
    }
  }

  /**
   * Registra en servicio remoto (implementar según necesidades)
   */
  private logToRemote(error: AppError, logData: Record<string, unknown>): void {
    // TODO: Implementar logging remoto (Sentry, LogRocket, etc.)
    // Por ahora solo simulamos el envío
    if (process.env.NODE_ENV === 'production') {
      // Simular envío a servicio de logging
      console.log('📤 Remote logging:', {
        errorId: error.timestamp.getTime(),
        ...logData,
      });
    }
  }

  /**
   * Sanitiza detalles para evitar información sensible
   */
  private sanitizeDetails(
    details?: Record<string, unknown>
  ): Record<string, unknown> | undefined {
    if (!details || !this.config.sanitizeData) {
      return details;
    }

    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(details)) {
      // No incluir información sensible
      if (this.isSensitiveKey(key)) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = this.sanitizeValue(value);
      }
    }

    return sanitized;
  }

  /**
   * Determina si una clave contiene información sensible
   */
  private isSensitiveKey(key: string): boolean {
    const sensitiveKeys = [
      'password',
      'pass',
      'pwd',
      'token',
      'secret',
      'key',
      'auth',
      'credential',
      'email',
      'phone',
      'ssn',
      'credit',
      'card',
      'bank',
    ];

    return sensitiveKeys.some(sensitive =>
      key.toLowerCase().includes(sensitive)
    );
  }

  /**
   * Sanitiza un valor individual
   */
  private sanitizeValue(value: unknown): unknown {
    if (typeof value === 'string') {
      // Truncar strings largos
      return value.length > 100 ? value.substring(0, 100) + '...' : value;
    }

    if (Array.isArray(value)) {
      return value.slice(0, 10); // Limitar arrays grandes
    }

    if (typeof value === 'object' && value !== null) {
      return '[Object]'; // Simplificar objetos complejos
    }

    return value;
  }

  /**
   * Sanitiza URLs para logging
   */
  private sanitizeUrl(url?: string): string | undefined {
    if (!url) return url;

    try {
      const urlObj = new URL(url);
      // Remover parámetros de query sensibles
      const sensitiveParams = ['token', 'key', 'secret', 'password'];
      sensitiveParams.forEach(param => {
        urlObj.searchParams.delete(param);
      });
      return urlObj.toString();
    } catch {
      return '[Invalid URL]';
    }
  }
}

// Instancia singleton del manejador de errores
export const errorHandler = new ErrorHandler();

/**
 * Función helper para manejo rápido de errores
 */
export const handleError = (
  error: Error | AppError,
  context?: string,
  type: ErrorType = ErrorType.UNKNOWN
): AppError => {
  const appError =
    error instanceof Error ? errorHandler.fromJSError(error, type) : error;

  errorHandler.logError(appError, context);
  return appError;
};

/**
 * Función helper para crear errores de validación
 */
export const createValidationError = (
  field: string,
  message: string,
  value?: unknown
): AppError => {
  return errorHandler.handleValidationError(field, message, value);
};

/**
 * Función helper para crear errores de autenticación
 */
export const createAuthError = (
  message: string,
  details?: Record<string, unknown>
): AppError => {
  return errorHandler.handleAuthError(message, details);
};
