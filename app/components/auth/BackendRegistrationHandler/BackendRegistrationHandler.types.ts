/**
 * Props del componente BackendRegistrationHandler
 */
export interface BackendRegistrationHandlerProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Configuración de reintentos
 */
export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}
