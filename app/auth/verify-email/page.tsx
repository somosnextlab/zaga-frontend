'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<
    'success' | 'error' | 'pending'
  >('pending');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Obtener parámetros de la URL
        const verified = searchParams.get('verified');
        const error = searchParams.get('error');
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        const token_hash = searchParams.get('token_hash');
        const access_token = searchParams.get('access_token');
        const refresh_token = searchParams.get('refresh_token');

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
            setVerificationStatus('success');
            setIsVerifying(false);

            // Redirigir automáticamente al dashboard después de un breve delay
            setTimeout(() => {
              router.push('/userDashboard');
            }, 1500);
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
          setVerificationStatus('success');
          setIsVerifying(false);

          // Redirigir automáticamente al dashboard después de un breve delay
          setTimeout(() => {
            router.push('/userDashboard');
          }, 1500);
          return;
        }

        // Si hay access_token y refresh_token, es una verificación exitosa
        if (access_token && refresh_token) {
          // Establecer la sesión
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            console.error('Session error:', error);
            setVerificationStatus('error');
            setErrorMessage(error.message);
          } else {
            setVerificationStatus('success');
          }
        } else if (type === 'signup' && (token || token_hash)) {
          // Verificar el email usando OTP
          const { error } = await supabase.auth.verifyOtp({
            token_hash: (token_hash || token) as string,
            type: 'email',
          });

          if (error) {
            console.error('Verification error:', error);
            setVerificationStatus('error');
            setErrorMessage(error.message);
          } else {
            setVerificationStatus('success');
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
  }, [searchParams, router]);

  const handleContinue = async () => {
    if (verificationStatus === 'success') {
      // Verificar si el usuario ya está autenticado
      const { supabaseClient } = await import('@/app/lib/supabase/client');
      const supabase = supabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && user.email_confirmed_at) {
        // Si ya está autenticado, redirigir al dashboard
        router.push('/userDashboard');
      } else {
        // Si no está autenticado, redirigir al login
        router.push('/auth/login');
      }
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

            <Button onClick={handleContinue} className="w-full">
              {verificationStatus === 'success'
                ? 'Continuar al Login'
                : 'Intentar de Nuevo'}
            </Button>
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
