'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../lib/hooks/useAuth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BackendRegistrationHandlerProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const BackendRegistrationHandler: React.FC<
  BackendRegistrationHandlerProps
> = ({ onSuccess, onError }) => {
  const { needsBackendRegistration, registerInBackend, isLoading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string>('');
  const hasAttemptedRegistration = useRef(false);

  const handleBackendRegistration = useCallback(async () => {
    if (hasAttemptedRegistration.current) {
      return; // Evitar múltiples intentos
    }

    try {
      hasAttemptedRegistration.current = true;
      setIsRegistering(true);
      setError('');

      const result = await registerInBackend();

      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error || 'Error al registrar en el sistema');
        onError?.(result.error || 'Error al registrar en el sistema');
      }
    } catch (error) {
      console.error('Backend registration error:', error);
      const errorMessage = 'Error inesperado al registrar en el sistema';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsRegistering(false);
    }
  }, [registerInBackend, onSuccess, onError]);

  useEffect(() => {
    if (
      needsBackendRegistration &&
      !isRegistering &&
      !hasAttemptedRegistration.current
    ) {
      handleBackendRegistration();
    }
  }, [needsBackendRegistration, isRegistering, handleBackendRegistration]);

  const handleRetry = () => {
    hasAttemptedRegistration.current = false;
    handleBackendRegistration();
  };

  if (!needsBackendRegistration) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isRegistering
                ? 'Configurando tu cuenta...'
                : 'Error de Configuración'}
            </CardTitle>
            <CardDescription>
              {isRegistering
                ? 'Estamos configurando tu cuenta en el sistema'
                : 'Hubo un problema al configurar tu cuenta'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isRegistering ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">
                  Por favor espera mientras configuramos tu cuenta...
                </p>
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
                  onClick={handleRetry}
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
