'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../../lib/auth/hooks/useAuth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import './BackendRegistrationHandler.module.scss';

interface BackendRegistrationHandlerProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 segundo
  maxDelay: 10000, // 10 segundos
  backoffMultiplier: 2,
};

export const BackendRegistrationHandler: React.FC<
  BackendRegistrationHandlerProps
> = ({ onSuccess, onError }) => {
  const { needsBackendRegistration, registerInBackend, isLoading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const hasAttemptedRegistration = useRef(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Calcula el delay para el próximo reintento usando backoff exponencial
   */
  const calculateRetryDelay = useCallback((attempt: number): number => {
    const delay =
      DEFAULT_RETRY_CONFIG.baseDelay *
      Math.pow(DEFAULT_RETRY_CONFIG.backoffMultiplier, attempt);
    return Math.min(delay, DEFAULT_RETRY_CONFIG.maxDelay);
  }, []);

  /**
   * Limpia el timeout de reintento
   */
  const clearRetryTimeout = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  /**
   * Maneja el registro en el backend con reintentos automáticos
   */
  const handleBackendRegistration = useCallback(
    async (isRetry = false) => {
      if (hasAttemptedRegistration.current && !isRetry) {
        return; // Evitar múltiples intentos simultáneos
      }

      try {
        if (!isRetry) {
          hasAttemptedRegistration.current = true;
          setRetryCount(0);
        }

        setIsRegistering(true);
        setError('');
        setIsRetrying(false);

        const result = await registerInBackend();

        if (result.success) {
          clearRetryTimeout();
          onSuccess?.();
        } else {
          // Si es un error 500 o de red, intentar reintento automático
          const shouldRetry =
            retryCount < DEFAULT_RETRY_CONFIG.maxRetries &&
            (result.error?.includes('Error del servidor') ||
              result.error?.includes('Error inesperado') ||
              result.error?.includes('500'));

          if (shouldRetry) {
            const nextRetryCount = retryCount + 1;
            setRetryCount(nextRetryCount);
            setIsRetrying(true);

            const delay = calculateRetryDelay(nextRetryCount - 1);

            retryTimeoutRef.current = setTimeout(() => {
              handleBackendRegistration(true);
            }, delay);

            return;
          } else {
            // No más reintentos, mostrar error
            clearRetryTimeout();
            setError(result.error || 'Error al registrar en el sistema');
            onError?.(result.error || 'Error al registrar en el sistema');
          }
        }
      } catch (error) {
        console.error('Backend registration error:', error);

        // Si es un error de red o timeout, intentar reintento automático
        const shouldRetry = retryCount < DEFAULT_RETRY_CONFIG.maxRetries;

        if (shouldRetry) {
          const nextRetryCount = retryCount + 1;
          setRetryCount(nextRetryCount);
          setIsRetrying(true);

          const delay = calculateRetryDelay(nextRetryCount - 1);

          retryTimeoutRef.current = setTimeout(() => {
            handleBackendRegistration(true);
          }, delay);

          return;
        } else {
          // No más reintentos, mostrar error
          clearRetryTimeout();
          const errorMessage = 'Error inesperado al registrar en el sistema';
          setError(errorMessage);
          onError?.(errorMessage);
        }
      } finally {
        if (!isRetrying) {
          setIsRegistering(false);
        }
      }
    },
    [
      registerInBackend,
      onSuccess,
      onError,
      retryCount,
      isRetrying,
      calculateRetryDelay,
      clearRetryTimeout,
    ]
  );

  /**
   * Maneja el reintento manual
   */
  const handleManualRetry = useCallback(() => {
    clearRetryTimeout();
    hasAttemptedRegistration.current = false;
    setRetryCount(0);
    setError('');
    handleBackendRegistration();
  }, [handleBackendRegistration, clearRetryTimeout]);

  /**
   * Efecto para iniciar el registro automático
   */
  useEffect(() => {
    if (
      needsBackendRegistration &&
      !isRegistering &&
      !hasAttemptedRegistration.current
    ) {
      handleBackendRegistration();
    }
  }, [needsBackendRegistration, isRegistering, handleBackendRegistration]);

  /**
   * Limpiar timeout al desmontar el componente
   */
  useEffect(() => {
    return () => {
      clearRetryTimeout();
    };
  }, [clearRetryTimeout]);

  if (!needsBackendRegistration) {
    return null;
  }

  const getStatusMessage = () => {
    if (isRetrying) {
      return `Reintentando... (${retryCount}/${DEFAULT_RETRY_CONFIG.maxRetries})`;
    }
    if (isRegistering) {
      return 'Configurando tu cuenta...';
    }
    return 'Error de Configuración';
  };

  const getDescriptionMessage = () => {
    if (isRetrying) {
      return 'Estamos reintentando configurar tu cuenta automáticamente';
    }
    if (isRegistering) {
      return 'Estamos configurando tu cuenta en el sistema';
    }
    return 'Hubo un problema al configurar tu cuenta';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{getStatusMessage()}</CardTitle>
            <CardDescription>{getDescriptionMessage()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isRegistering || isRetrying ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">
                  {isRetrying
                    ? `Reintentando en unos segundos... (${retryCount}/${DEFAULT_RETRY_CONFIG.maxRetries})`
                    : 'Por favor espera mientras configuramos tu cuenta...'}
                </p>
                {isRetrying && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (retryCount / DEFAULT_RETRY_CONFIG.maxRetries) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <p className="mt-4 text-gray-600">
                  {error || 'No se pudo configurar tu cuenta'}
                </p>
                <Button
                  onClick={handleManualRetry}
                  className="mt-4"
                  disabled={isLoading}
                >
                  Reintentar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
