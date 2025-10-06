'use client';

import { Button } from '@/app/components/Button';
import { Input } from '@/app/components/Input';
import { supabaseClient } from '@/app/lib/supabase/client';
import { getUserRole, getDashboardRoute } from '@/app/lib/utils/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(5, 'Mínimo 5 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
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
    <div className="max-w-sm">
      <h1 className="text-2xl font-semibold mb-4">Iniciar sesión</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
        <Input
          type="email"
          placeholder="Email"
          label="Email"
          error={errors.email?.message}
          autoComplete="email"
          required
          {...register('email')}
        />
        <Input
          type="password"
          placeholder="Contraseña"
          label="Contraseña"
          error={errors.password?.message}
          autoComplete="current-password"
          required
          {...register('password')}
        />
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
          className="w-full"
          aria-describedby="login-description"
        >
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </Button>
        <p id="login-description" className="text-sm text-muted-foreground">
          Ingresa tus credenciales para acceder a tu cuenta
        </p>
      </form>
    </div>
  );
}
