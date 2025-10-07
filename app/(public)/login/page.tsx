'use client';

import { supabaseClient } from '@/app/lib/supabase/client';
import { getUserRole, getDashboardRoute } from '@/app/lib/utils/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(5, 'Mínimo 5 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();
  const search = useSearchParams();
  const redirectTo = search.get('redirectTo') || '';

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const supabase = supabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password,
      });

      if (error) {
        console.error('Error de autenticación:', error);
        alert(`Error: ${error.message}`);
        return;
      }

      const role = getUserRole(data.user);
      const dashboardRoute = getDashboardRoute(role);

      // Si venía de middleware con redirectTo, respétalo (con validación de seguridad)
      if (redirectTo && redirectTo.startsWith('/')) {
        router.replace(redirectTo);
        return;
      }

      router.replace(dashboardRoute);
    } catch (error) {
      console.error('Error inesperado:', error);
      alert('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[rgb(var(--color-foreground))] mb-2">
            Iniciar sesión
          </h1>
          <p className="text-[rgb(var(--color-foreground))] opacity-70">
            Ingresa tus credenciales para acceder a tu cuenta
          </p>
        </div>

        <div className="bg-white border border-[rgb(var(--color-border))] rounded-xl p-8 shadow-sm">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  required
                  className="outline-none border-gray-300 focus-visible:ring-0 focus-visible:border-gray-800 focus-visible:border-1"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Contraseña"
                  autoComplete="current-password"
                  className="outline-none border-gray-300 focus-visible:ring-0 focus-visible:border-gray-800 focus-visible:border-1"
                  required
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-base font-medium cursor-pointer bg-[rgb(var(--color-primary-hover))] hover:bg-[rgb(var(--color-muted)))] hover:text-[rgb(var(--color-primary-hover))] text-[rgb(var(--color-primary-foreground))]"
              aria-describedby="login-description"
            >
              {isSubmitting ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p
            id="login-description"
            className="text-sm text-[rgb(var(--color-foreground))] opacity-60"
          >
            ¿No tienes cuenta?{' '}
            <span className="text-[rgb(var(--color-primary))] font-medium">
              Próximamente
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
