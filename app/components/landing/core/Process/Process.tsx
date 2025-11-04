"use client";

import React, { useState } from "react";
import { FileText, CheckCircle2, Wallet, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./Process.module.scss";
import { Card, CardContent } from "@/app/components/ui/Card/card";
import { Button } from "@/app/components/ui/Button/Button";
import { useAuth } from "@/app/hooks/useAuth";
import { useUserContext } from "@/app/context/UserContext/UserContextContext";
import { ROUTES } from "@/app/utils/constants/routes";
import { UserRoleEnum } from "@/app/types/user.types";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Completa tu solicitud",
    description:
      "Llena el formulario en línea con tus datos personales y financieros. Es rápido y seguro.",
  },
  {
    number: "02",
    icon: CheckCircle2,
    title: "Recibe aprobación",
    description:
      "Nuestro sistema evalúa tu solicitud y te notifica la decisión en minutos.",
  },
  {
    number: "03",
    icon: Wallet,
    title: "Recibe tu dinero",
    description:
      "Una vez aprobado, el dinero llega a tu cuenta en menos de 24 horas.",
  },
];

export const Process: React.FC = () => {
  const [isLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const {
    state: { role },
  } = useUserContext();

  const handleSolicitarPrestamo = async () => {
    // Si hay sesión y el rol es usuario o cliente, redirigir a userDashboard
    if (user && role) {
      if (role === UserRoleEnum.USUARIO || role === UserRoleEnum.CLIENTE) {
        router.push(ROUTES.USER_DASHBOARD);
        return;
      }
      // Si es admin, no hacer nada
      if (role === UserRoleEnum.ADMIN) {
        return;
      }
    }
    // Si no hay sesión, redirigir a login
    router.push(ROUTES.LOGIN);
  };

  return (
    <section
      id="como-funciona"
      className="bg-gradient-to-br from-[hsl(var(--color-zaga-gray-50))] to-white py-16 md:py-24"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-section-title text-[hsl(var(--color-zaga-black))] mb-4">
            Obtén tu préstamo en{" "}
            <span className="text-[hsl(var(--color-zaga-green-gray))]">
              3 simples pasos
            </span>
          </h2>
          <p className="text-hero-subtitle text-[hsl(var(--color-zaga-silver))] max-w-2xl mx-auto">
            Proceso 100% digital, transparente y diseñado para tu comodidad.
          </p>
        </div>

        {/* Desktop Process */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-[hsl(var(--color-zaga-green-gray))]/30 via-[hsl(var(--color-zaga-green-gray))] to-[hsl(var(--color-zaga-green-gray))]/30"></div>

            <div className="grid grid-cols-3 gap-8 relative z-10">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <Card
                    key={index}
                    className="bg-white/90 border-[hsl(var(--color-border))] hover:shadow-lg transition-all duration-300"
                  >
                    <CardContent className="p-8 text-center">
                      {/* Number Badge */}
                      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[hsl(var(--color-zaga-green-gray))] to-[hsl(var(--color-zaga-green-hover))] flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {step.number}
                        </span>
                      </div>

                      {/* Icon */}
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[hsl(var(--color-zaga-green-gray))]/10 flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-[hsl(var(--color-zaga-green-gray))]" />
                      </div>

                      <h3 className="text-card-title text-[hsl(var(--color-zaga-black))] mb-4">
                        {step.title}
                      </h3>

                      <p className="text-body text-[hsl(var(--color-zaga-silver))] leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Process */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="flex items-start space-x-4">
                {/* Number Badge */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--color-zaga-green-gray))] to-[hsl(var(--color-zaga-green-hover))] flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <Card className="flex-1 bg-white/90 border-[hsl(var(--color-border))]">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-[hsl(var(--color-zaga-green-gray))]/10 flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-[hsl(var(--color-zaga-green-gray))]" />
                      </div>
                      <h3 className="text-card-title text-[hsl(var(--color-zaga-black))]">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-body text-[hsl(var(--color-zaga-silver))] leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <div className="flex-shrink-0 flex justify-center mt-6">
                    <ArrowRight className="w-5 h-5 text-[hsl(var(--color-zaga-green-gray))]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Card */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-[hsl(var(--color-zaga-green-gray))] to-[hsl(var(--color-zaga-green-hover))] border-0 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">¿Listo para comenzar?</h3>
              <p className="text-lg mb-6 opacity-90">
                Únete a miles de clientes que ya confían en Zaga para sus
                necesidades financieras.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-[hsl(var(--color-zaga-green-gray))] hover:bg-gray-100"
                  onClick={handleSolicitarPrestamo}
                  disabled={isLoading}
                >
                  {isLoading ? "Procesando..." : "Solicitar préstamo ahora"}
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="#faq">Ver preguntas frecuentes</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
