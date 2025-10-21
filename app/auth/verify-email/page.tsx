'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/lib/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BackendRegistrationHandler } from '@/app/components/auth/BackendRegistrationHandler/BackendRegistrationHandler';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<
    'success' | 'error' | 'backend-registration'
  >('success');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const error = searchParams.get('error');
        const access_token = searchParams.get('access_token');
        const refresh_token = searchParams.get('refresh_token');
        const verified = searchParams.get('verified');

        // Si hay un error en la URL, mostrar error
        if (error) {
          setVerificationStatus('error');
          setErrorMessage('Error en la verificación del email');
          setIsVerifying(false);
          return;
        }

        // Si viene del callback exitoso, verificar el estado del usuario
        if (verified === 'true') {
          const { supabaseClient } = await import('@/app/lib/supabase/client');
          const supabase = supabaseClient();

          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user && user.email_confirmed_at) {
            setVerificationStatus('backend-registration');
            setIsVerifying(false);
            return;
          } else {
            setVerificationStatus('error');
            setErrorMessage('No se pudo verificar el email');
            setIsVerifying(false);
            return;
          }
        }

        // Verificar si el usuario ya está autenticado
        const { supabaseClient } = await import('@/app/lib/supabase/client');
        const supabase = supabaseClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        // Si el usuario ya está autenticado y su email está verificado, mostrar éxito
        if (user && user.email_confirmed_at) {
          setVerificationStatus('backend-registration');
          setIsVerifying(false);
          return;
        }

        // Si hay tokens, establecer la sesión
        if (access_token && refresh_token) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (sessionError) {
            setVerificationStatus('error');
            setErrorMessage(sessionError.message);
            setIsVerifying(false);
            return;
          }

          // Verificar que el usuario esté autenticado y el email confirmado
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user && user.email_confirmed_at) {
            setVerificationStatus('backend-registration');
          } else {
            setVerificationStatus('error');
            setErrorMessage('No se pudo verificar el email');
          }
        } else {
          setVerificationStatus('error');
          setErrorMessage('Enlace de verificación inválido');
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setVerificationStatus('error');
        setErrorMessage('Error al verificar el email');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleContinue = () => {
    if (verificationStatus === 'success') {
      router.push('/userDashboard');
    } else {
      router.push('/auth/register');
    }
  };

  if (isLoading || isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando email...</p>
        </div>
      </div>
    );
  }

  // Mostrar componente de registro en backend
  if (verificationStatus === 'backend-registration') {
    return (
      <BackendRegistrationHandler
        onComplete={() => {
          setVerificationStatus('success');
          setTimeout(() => {
            router.push('/userDashboard');
          }, 1500);
        }}
        onError={error => {
          setVerificationStatus('error');
          setErrorMessage(error);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {verificationStatus === 'success'
                ? 'Email Verificado'
                : 'Error de Verificación'}
            </CardTitle>
            <CardDescription>
              {verificationStatus === 'success'
                ? 'Tu email ha sido verificado exitosamente'
                : 'Hubo un problema al verificar tu email'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {verificationStatus === 'success' ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
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
                <p className="mt-4 text-gray-600">
                  Ahora puedes iniciar sesión con tu cuenta
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <p className="mt-4 text-gray-600">
                  {errorMessage || 'No se pudo verificar tu email'}
                </p>
              </div>
            )}

            <div className="space-y-3">
              {verificationStatus === 'success' ? (
                <Button
                  onClick={handleContinue}
                  className="w-full bg-[hsl(var(--color-zaga-green-gray))] hover:bg-[hsl(var(--color-zaga-green-hover))] text-white"
                >
                  Continuar al Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleContinue}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Reintentar Verificación
                  </Button>
                  <Button
                    onClick={() => router.push('/auth/login')}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    Ir al Login
                  </Button>
                  <Button
                    onClick={() => router.push('/')}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    Volver al Inicio
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
