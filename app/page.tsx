import type { Metadata } from 'next';
import { Footer } from '@/components/core/footer';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { LoanSimulator } from '@/components/core/loan-simulator';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Zaga — Préstamos online simples',
  description:
    'Solicitá tu préstamo en minutos. 100% online, transparente y sin vueltas.',
};

export default function LandingPage() {
  return (
    <>
      <section className="container mx-auto grid gap-8 md:grid-cols-2 items-start md:items-center py-12 md:py-20">
        <div className="grid gap-6">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[rgb(var(--color-foreground))]">
            Préstamos online{' '}
            <span className="text-[rgb(var(--color-primary))]">rápidos</span> y
            simples
          </h1>
          <p className="text-lg text-[rgb(var(--color-foreground))] opacity-80 leading-relaxed">
            Con Zaga accedés a financiamiento en minutos. Transparente, 100%
            digital y con acompañamiento.
          </p>
          <ul className="text-sm grid gap-3 text-[rgb(var(--color-foreground))]">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[rgb(var(--color-accent))] rounded-full"></span>
              Evaluación ágil
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[rgb(var(--color-accent))] rounded-full"></span>
              Pagos flexibles
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[rgb(var(--color-accent))] rounded-full"></span>
              Gestión desde tu panel
            </li>
          </ul>
          <div className="text-xs text-[rgb(var(--color-foreground))] opacity-60 bg-[rgb(var(--color-muted))] p-3 rounded-lg border border-[rgb(var(--color-border))]">
            * Demo informativa. Sujetos a evaluación crediticia.
          </div>
        </div>
        <div className="md:pl-8">
          <LoanSimulator />
        </div>
      </section>

      <section
        id="beneficios"
        className="bg-[rgb(var(--color-muted))] py-16 md:py-20"
      >
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-[rgb(var(--color-foreground))]">
            ¿Por qué elegir{' '}
            <span className="text-[rgb(var(--color-primary))]">Zaga</span>?
          </h2>
          <div className="grid gap-6 md:grid-cols-4">
            {[
              {
                t: 'Tecnología',
                d: 'Proceso digital de punta a punta.',
                icon: '⚡',
              },
              {
                t: 'Velocidad',
                d: 'Aprobaciones y desembolsos ágiles.',
                icon: '🚀',
              },
              {
                t: 'Transparencia',
                d: 'Términos claros y sin letra chica.',
                icon: '🔍',
              },
              {
                t: 'Soporte',
                d: 'Acompañamiento humano cuando lo necesitás.',
                icon: '🤝',
              },
            ].map((c, i) => (
              <Card
                key={i}
                className="bg-white border-[rgb(var(--color-border))] hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">{c.icon}</div>
                  <div className="font-bold text-[rgb(var(--color-primary))] mb-2">
                    {c.t}
                  </div>
                  <div className="text-sm text-[rgb(var(--color-foreground))] opacity-80">
                    {c.d}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="container mx-auto py-16 md:py-20">
        <h2 className="text-3xl font-bold mb-12 text-center text-[rgb(var(--color-foreground))]">
          Cómo{' '}
          <span className="text-[rgb(var(--color-primary))]">funciona</span>
        </h2>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            {
              n: '1',
              t: 'Simulá',
              d: 'Elegí monto y plazo en el simulador.',
              color: 'bg-[rgb(var(--color-primary))]',
            },
            {
              n: '2',
              t: 'Registrate',
              d: 'Creá tu cuenta y completá tus datos.',
              color: 'bg-[rgb(var(--color-accent))]',
            },
            {
              n: '3',
              t: 'Aprobación',
              d: 'Evaluamos tu solicitud rápidamente.',
              color: 'bg-[rgb(var(--color-primary))]',
            },
            {
              n: '4',
              t: 'Recibí el dinero',
              d: 'Desembolso y seguimiento en tu panel.',
              color: 'bg-[rgb(var(--color-accent))]',
            },
          ].map((s, i) => (
            <Card
              key={i}
              className="border-[rgb(var(--color-border))] hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`w-12 h-12 ${s.color} text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4`}
                >
                  {s.n}
                </div>
                <div className="font-bold text-[rgb(var(--color-foreground))] mb-2">
                  {s.t}
                </div>
                <div className="text-sm text-[rgb(var(--color-foreground))] opacity-80">
                  {s.d}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="faq" className="bg-[rgb(var(--color-muted))] py-16 md:py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-[rgb(var(--color-foreground))]">
            Preguntas{' '}
            <span className="text-[rgb(var(--color-primary))]">frecuentes</span>
          </h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="q1"
                className="bg-white border-[rgb(var(--color-border))] rounded-lg mb-2"
              >
                <AccordionTrigger className="text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))] px-6">
                  ¿El simulador muestra valores reales?
                </AccordionTrigger>
                <AccordionContent className="text-[rgb(var(--color-foreground))] opacity-80 px-6">
                  Son valores estimados. La oferta final puede variar según
                  evaluación y condiciones vigentes.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="q2"
                className="bg-white border-[rgb(var(--color-border))] rounded-lg mb-2"
              >
                <AccordionTrigger className="text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))] px-6">
                  ¿Cuánto tarda la aprobación?
                </AccordionTrigger>
                <AccordionContent className="text-[rgb(var(--color-foreground))] opacity-80 px-6">
                  En general, entre minutos y pocas horas si la información está
                  completa.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="q3"
                className="bg-white border-[rgb(var(--color-border))] rounded-lg mb-2"
              >
                <AccordionTrigger className="text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))] px-6">
                  ¿Puedo cancelar anticipadamente?
                </AccordionTrigger>
                <AccordionContent className="text-[rgb(var(--color-foreground))] opacity-80 px-6">
                  Sí, podrás solicitar cancelación o adelantos desde tu panel
                  (según condiciones).
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
