'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth/hooks/useAuth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface BackendRegistrationHandlerProps {
  onComplete?: () => void;
  onError?: (error: string) => void;
}

export const BackendRegistrationHandler: React.FC<BackendRegistrationHandlerProps> = ({
  onComplete,
  onError,
}) => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [registrationStatus, setRegistrationStatus] = useState<
    'processing' | 'success' | 'error'
  >('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleBackendRegistration = async () => {
      if (!user || !isAuthenticated || isLoading) {
        return;
      }

      try {
        // Importar el servicio de autenticación
        const { authService } = await import('@/app/lib/auth/services/authService');
        
        // Ejecutar registro en backend
        const result = await authService.registerInBackend(user);
        
        if (result.success) {
          setRegistrationStatus('success');
          
          // Redirigir al dashboard después de un breve delay
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            } else {
              router.push('/userDashboard');
            }
          }, 1500);
        } else {
          setRegistrationStatus('error');
          setErrorMessage(result.error || 'Error al configurar la cuenta');
          
          if (onError) {
            onError(result.error || 'Error al configurar la cuenta');
          }
        }
      } catch (error) {
        console.error('Error en registro backend:', error);
        setRegistrationStatus('error');
        const errorMsg = 'Error inesperado al configurar la cuenta';
        setErrorMessage(errorMsg);
        
        if (onError) {
          onError(errorMsg);
        }
      }
    };

    handleBackendRegistration();
  }, [user, isAuthenticated, isLoading, router, onComplete, onError]);

  if (registrationStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-600">
              ¡Cuenta Configurada!
            </CardTitle>
            <CardDescription>
              Tu cuenta ha sido configurada exitosamente
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-gray-600">
              Redirigiendo al dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (registrationStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">
              Error de Configuración
            </CardTitle>
            <CardDescription>
              Hubo un problema al configurar tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">
              {errorMessage}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Intentar de Nuevo
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Estado de procesamiento
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Configurando tu cuenta...
          </CardTitle>
          <CardDescription>
            Estamos configurando tu cuenta en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-600">
            Por favor espera mientras configuramos tu cuenta...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};