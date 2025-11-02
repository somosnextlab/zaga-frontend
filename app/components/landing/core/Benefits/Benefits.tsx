'use client';

import React from 'react';
import {
  Clock,
  Zap,
  Shield,
  TrendingDown,
  CreditCard,
  HeadphonesIcon,
} from 'lucide-react';
import './benefits.module.scss';
import { Card, CardContent } from '@/app/components/ui/Card/card';

const benefits = [
  {
    icon: Clock,
    title: 'Aprobación inmediata',
    description:
      'Recibe respuesta en minutos, no días. Nuestro sistema evalúa tu solicitud al instante.',
  },
  {
    icon: Zap,
    title: 'Dinero en tu cuenta',
    description:
      'Una vez aprobado, el dinero llega a tu cuenta en menos de 24 horas.',
  },
  {
    icon: Shield,
    title: '100% seguro',
    description:
      'Tus datos están protegidos con encriptación bancaria de nivel militar.',
  },
  {
    icon: TrendingDown,
    title: 'Tasas competitivas',
    description:
      'Ofrecemos las mejores tasas del mercado, sin letra chica ni sorpresas.',
  },
  {
    icon: CreditCard,
    title: 'Sin comisiones ocultas',
    description:
      'Transparencia total. Solo pagas lo que ves, sin costos adicionales.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Soporte 24/7',
    description:
      'Nuestro equipo está disponible las 24 horas para resolver tus dudas.',
  },
];

export const Benefits: React.FC = () => {
  return (
    <section id="beneficios" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-section-title text-[hsl(var(--color-zaga-black))] mb-4">
            ¿Por qué elegir{' '}
            <span className="text-[hsl(var(--color-zaga-green-gray))]">
              Zaga
            </span>
            ?
          </h2>
          <p className="text-hero-subtitle text-[hsl(var(--color-zaga-silver))] max-w-2xl mx-auto">
            Somos la opción más confiable para obtener tu préstamo personal de
            forma rápida y segura.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card
                key={index}
                className="group bg-white border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-zaga-green-gray))] hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[hsl(var(--color-zaga-green-gray))]/10 group-hover:bg-[hsl(var(--color-zaga-green-gray))] transition-colors duration-300 flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-[hsl(var(--color-zaga-green-gray))] group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>

                  <h3 className="text-card-title text-[hsl(var(--color-zaga-black))] mb-4">
                    {benefit.title}
                  </h3>

                  <p className="text-body text-[hsl(var(--color-zaga-silver))] leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
