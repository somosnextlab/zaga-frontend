'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthActions } from '@/app/lib/auth/hooks/useAuthActions';
import {
  initializeAutofillFix,
  applyAutofillFix,
} from '@/app/lib/utils/autofillFix';
import { RegisterFormData, registerSchema } from '@/app/lib/auth/schemas/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface RegisterFormErrors {
  general?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthActions();
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializar solución de autofill
  useEffect(() => {
    initializeAutofillFix();
  }, []);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setErrors({});
    setIsSubmitting(true);

    try {
      const result = await register(data);

      if (result.success) {
        if (result.error) {
          // Mostrar mensaje de verificación de email
          setErrors({
            general: result.error,
          });
        } else {
          // Redirigir al login
          router.push('/auth/login');
        }
      } else {
        setErrors({
          general: result.error || 'Error durante el registro',
        });
      }
    } catch {
      setErrors({
        general: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Regístrate en Zaga para comenzar
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información de Registro</CardTitle>
            <CardDescription>
              Completa los datos para crear tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {errors.general && (
                  <div
                    className={`px-4 py-3 rounded-md ${
                      errors.general.includes('verifica tu email')
                        ? 'bg-blue-50 border border-blue-200 text-blue-700'
                        : 'bg-red-50 border border-red-200 text-red-700'
                    }`}
                  >
                    {errors.general}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          ref={el => {
                            if (el) applyAutofillFix(el, true); // Permitir autofill básico
                          }}
                          type="email"
                          autoComplete="email"
                          placeholder="tu@email.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          ref={el => {
                            if (el) applyAutofillFix(el, true); // Permitir autofill básico
                          }}
                          type="password"
                          autoComplete="new-password"
                          placeholder="••••••••"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          ref={el => {
                            if (el) applyAutofillFix(el, true); // Permitir autofill básico
                          }}
                          type="password"
                          autoComplete="new-password"
                          placeholder="••••••••"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[hsl(var(--color-zaga-green-gray))] hover:bg-[hsl(var(--color-zaga-green-hover))] text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <a
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
