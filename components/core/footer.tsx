import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="container mx-auto py-8 grid gap-6 md:grid-cols-3">
        <div>
          <div className="font-semibold">Zaga</div>
          <p className="text-sm opacity-70 mt-2">Préstamos simples, 100% online.</p>
        </div>
        <div className="text-sm grid gap-2">
          <Link href="#beneficios" className="opacity-80 hover:opacity-100">¿Por qué elegir Zaga?</Link>
          <Link href="#como-funciona" className="opacity-80 hover:opacity-100">Cómo funciona</Link>
          <Link href="#faq" className="opacity-80 hover:opacity-100">Preguntas frecuentes</Link>
        </div>
        <div className="text-sm opacity-70">
          © {new Date().getFullYear()} Zaga — NextLab. Todos los derechos reservados.
        </div>
      </div>
      <Separator />
      <div className="container mx-auto py-4 text-xs opacity-60">
        Demo informativo. Los resultados del simulador son estimaciones y no constituyen oferta.
      </div>
    </footer>
  );
}
