"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle, Clock, Users } from "lucide-react";
import "./heroSection.module.scss";
import { LoanSimulator } from "../LoanSimulator/LoanSimulator";
import { Button } from "@/app/components/ui/Button/Button";
import { Badge } from "@/app/components/ui/badge";
import { WhatsAppCta } from "@/src/components/WhatsAppCta";
import { WHATSAPP_MESSAGE } from "@/app/mocks/messageMocks";

export const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-[hsl(var(--color-zaga-gray-50))] to-white py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <Badge
              variant="secondary"
              className="bg-[hsl(var(--color-zaga-green-gray))]/10 text-[hsl(var(--color-zaga-green-gray))] border-[hsl(var(--color-zaga-green-gray))]/20 hover:bg-[hsl(var(--color-zaga-green-gray))]/20"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              100% en línea y seguro
            </Badge>

            {/* Title */}
            <h1 className="text-hero-title text-[hsl(var(--color-zaga-black))]">
              Préstamos personales{" "}
              <span className="text-[hsl(var(--color-zaga-green-gray))]">
                rápidos
              </span>{" "}
              y seguros
            </h1>

            {/* Subtitle */}
            <p className="text-hero-subtitle text-[hsl(var(--color-zaga-silver))] max-w-lg">
              Con Zaga obtén el financiamiento que necesitas en minutos. Proceso
              100% digital, transparente y con las mejores tasas del mercado.
            </p>

            <span className=" text-body-sm text-[hsl(var(--color-zaga-green-gray))] max-w-lg">
              Zaga opera unicamente con personas mayores de 18 años y residentes en la provincia de Cordoba, Argentina.
            </span>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="default" asChild>
                <WhatsAppCta
                  label="Solicitar prestamo"
                  message={WHATSAPP_MESSAGE}
                />
              </Button>
              <Button variant={"outline"} size="lg" asChild>
                <Link href="#beneficios">Conocer más</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <Users className="w-5 h-5 text-[hsl(var(--color-zaga-green-gray))]" />
                  <span className="text-2xl font-bold text-[hsl(var(--color-zaga-black))]">
                    +50,000
                  </span>
                </div>
                <p className="text-body-sm text-[hsl(var(--color-zaga-silver))]">
                  Clientes satisfechos
                </p>
              </div>

              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <Clock className="w-5 h-5 text-[hsl(var(--color-zaga-green-gray))]" />
                  <span className="text-2xl font-bold text-[hsl(var(--color-zaga-black))]">
                    24/7
                  </span>
                </div>
                <p className="text-body-sm text-[hsl(var(--color-zaga-silver))]">
                  Disponibilidad
                </p>
              </div>

              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <CheckCircle className="w-5 h-5 text-[hsl(var(--color-zaga-green-gray))]" />
                  <span className="text-2xl font-bold text-[hsl(var(--color-zaga-black))]">
                    98%
                  </span>
                </div>
                <p className="text-body-sm text-[hsl(var(--color-zaga-silver))]">
                  Satisfacción
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Loan Simulator */}
          <div className="relative flex justify-center lg:justify-end">
            <LoanSimulator />
          </div>
        </div>
      </div>
    </section>
  );
};
