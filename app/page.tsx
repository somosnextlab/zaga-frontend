import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants/routes';

// Forzar renderizado dinámico para evitar problemas de build
export const dynamic = 'force-dynamic';

export default function LandingPage() {
  return (
    <section className="grid gap-6">
      <h1 className="text-3xl font-bold">Préstamos online rápidos y simples — Zaga</h1>
      <p className="max-w-prose text-muted-foreground">
        Financiación ágil, 100% digital. Con tu DNI y CBU en minutos.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href={ROUTES.LOGIN}>Iniciar sesión</Link>
        </Button>
        <Button variant="outline" disabled title="Próximamente">
          Registrarme
        </Button>
      </div>
    </section>
  );
}
