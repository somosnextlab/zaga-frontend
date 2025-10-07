'use client';
import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/app/lib/supabase/client';
import { getUserRole, getDashboardRoute } from '@/app/lib/utils/auth';
import { ROUTES } from '@/app/lib/constants/routes';

function formatARS(n: number) {
  return n.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  });
}

export function LoanSimulator() {
  const [monto, setMonto] = React.useState(1800000);
  const [cuotas, setCuotas] = React.useState(18);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  // Tasa fija simplificada para demo (equivalente a ~120% TNA)
  const tasaMensual = 0.1; // 10% mensual

  // Cálculo simplificado de cuota fija
  const cuotaMensual = React.useMemo(() => {
    if (cuotas === 0) return 0;
    const factor = Math.pow(1 + tasaMensual, cuotas);
    return (monto * tasaMensual * factor) / (factor - 1);
  }, [monto, cuotas, tasaMensual]);

  const handleContinuar = async () => {
    setIsLoading(true);
    
    try {
      // Verificar si hay sesión activa
      const supabase = supabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Usuario logueado - redirigir al dashboard correspondiente
        const role = getUserRole(user);
        const dashboardRoute = getDashboardRoute(role);
        router.push(dashboardRoute);
      } else {
        // Usuario no logueado - redirigir al login con parámetros del simulador
        const params = new URLSearchParams({
          monto: monto.toString(),
          cuotas: cuotas.toString(),
          cuotaMensual: Math.round(cuotaMensual).toString(),
        });
        router.push(`${ROUTES.LOGIN}?${params.toString()}`);
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      // En caso de error, redirigir al login
      router.push(ROUTES.LOGIN);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white">
      <CardContent className="p-8 space-y-8">
        {/* Importe a solicitar */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">
            Importe a solicitar
          </h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-4">
              {formatARS(monto)}
            </div>
            <div className="bg-gray-100 rounded-full p-2 mx-4">
              <Slider
                value={[monto]}
                onValueChange={v => setMonto(v[0])}
                min={10000}
                max={2000000}
                step={10000}
                className="[&_[role=slider]]:bg-[rgb(var(--color-primary))] [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-lg [&_[role=slider]]:focus:outline-none [&_[role=slider]]:focus-visible:ring-0 [&_[role=slider]]:hover:scale-100 [&_[role=slider]]:hover:border-2"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2 px-4">
              <span>{formatARS(10000)}</span>
              <span>{formatARS(2000000)}</span>
            </div>
          </div>
        </div>

        {/* Resultado del cálculo */}
        <div className="relative">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative">
            <div className="text-center">
              <div className="text-sm text-[rgb(var(--color-primary))] font-medium">
                {cuotas} cuotas de
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatARS(cuotaMensual)}
              </div>
              <div className="text-sm text-gray-600">por mes</div>
            </div>
            {/* Punta del tooltip */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-gray-200 rotate-45"></div>
          </div>
        </div>

        {/* Selector de cuotas */}
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-full p-2 mx-4">
            <Slider
              value={[cuotas]}
              onValueChange={v => setCuotas(v[0])}
              min={3}
              max={24}
              step={1}
              className="[&_[role=slider]]:bg-[rgb(var(--color-primary))] [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-lg [&_[role=slider]]:focus:outline-none [&_[role=slider]]:focus-visible:ring-0 [&_[role=slider]]:hover:scale-100 [&_[role=slider]]:hover:border-2"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500 px-4">
            <span>3 cuotas</span>
            <span>24 cuotas</span>
          </div>
        </div>

        {/* Botón CTA */}
        <button 
          onClick={handleContinuar}
          disabled={isLoading}
          className="w-full bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          {isLoading ? 'Procesando...' : 'Continuar'}
        </button>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          Sujeto a aprobación crediticia. Las condiciones pueden variar de
          acuerdo al perfil de riesgo del cliente.
        </p>
      </CardContent>
    </Card>
  );
}
