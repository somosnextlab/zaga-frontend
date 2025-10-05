import Link from 'next/link';

export default function LandingPage() {
  return (
    <section className="grid gap-6">
      <h1 className="text-3xl font-bold">Préstamos online rápidos y simples — Zaga</h1>
      <p className="max-w-prose">
        Financiación ágil, 100% digital. Con tu DNI y CBU en minutos.
      </p>
      <div className="flex gap-3">
        <Link href="/login" className="px-4 py-2 border rounded">Iniciar sesión</Link>
        <button className="px-4 py-2 border rounded opacity-50 cursor-not-allowed" title="Próximamente">Registrarme</button>
      </div>
    </section>
  );
}
