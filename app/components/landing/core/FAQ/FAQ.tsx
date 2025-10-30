"use client";

import React from "react";
import { MessageCircle, Phone, Mail } from "lucide-react";
import Link from "next/link";
import "./FAQ.module.scss";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";

const faqs = [
  {
    question: "¿Cuáles son los requisitos para solicitar un préstamo?",
    answer:
      "Necesitas ser mayor de 18 años, tener un ingreso comprobable, identificación oficial vigente y comprobante de domicilio. El proceso es 100% digital y no requiere aval.",
  },
  {
    question: "¿Cuánto tiempo tarda la aprobación?",
    answer:
      "La mayoría de las solicitudes son aprobadas en menos de 10 minutos. En casos excepcionales, el proceso puede tomar hasta 24 horas.",
  },
  {
    question: "¿Cuál es el monto máximo que puedo solicitar?",
    answer:
      "Puedes solicitar desde $1,000 hasta $50,000 pesos mexicanos, dependiendo de tu perfil crediticio y capacidad de pago.",
  },
  {
    question: "¿Qué tasa de interés manejan?",
    answer:
      "Nuestras tasas van del 12% al 24% anual, dependiendo del perfil del cliente. Siempre mostramos la tasa exacta antes de que firmes el contrato.",
  },
  {
    question: "¿Puedo pagar anticipadamente sin penalización?",
    answer:
      "Sí, puedes pagar anticipadamente sin ningún costo adicional. Incluso puedes ahorrar en intereses al hacerlo.",
  },
  {
    question: "¿Cómo funciona el proceso de desembolso?",
    answer:
      "Una vez aprobado tu préstamo, el dinero se transfiere directamente a tu cuenta bancaria en menos de 24 horas hábiles.",
  },
  {
    question: "¿Qué pasa si no puedo pagar a tiempo?",
    answer:
      "Te contactamos para encontrar una solución. Ofrecemos opciones de reestructuración y planes de pago flexibles para ayudarte.",
  },
  {
    question: "¿Mis datos están seguros?",
    answer:
      "Absolutamente. Utilizamos encriptación bancaria de nivel militar y cumplimos con todas las regulaciones de protección de datos financieros.",
  },
];

export const FAQ: React.FC = () => {
  const handleLlamarAhora = () => {
    console.log("Llamar ahora");
  };

  return (
    <section id="faq" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-section-title text-[hsl(var(--color-zaga-black))] mb-4">
            Preguntas{" "}
            <span className="text-[hsl(var(--color-zaga-green-gray))]">
              frecuentes
            </span>
          </h2>
          <p className="text-hero-subtitle text-[hsl(var(--color-zaga-silver))] max-w-2xl mx-auto">
            Resolvemos las dudas más comunes sobre nuestros préstamos
            personales.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white border border-[hsl(var(--color-border))] rounded-lg hover:border-[hsl(var(--color-zaga-green-gray))] transition-colors duration-200"
              >
                <AccordionTrigger className="text-[hsl(var(--color-zaga-black))] hover:text-[hsl(var(--color-zaga-green-gray))] px-6 py-4 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[hsl(var(--color-zaga-silver))] px-6 pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Card */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-[hsl(var(--color-zaga-gray-50))] to-white border-[hsl(var(--color-zaga-green-gray))]/20">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[hsl(var(--color-zaga-green-gray))]/10 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-[hsl(var(--color-zaga-green-gray))]" />
              </div>

              <h3 className="text-2xl font-bold text-[hsl(var(--color-zaga-black))] mb-4">
                ¿Aún tienes dudas?
              </h3>

              <p className="text-body text-[hsl(var(--color-zaga-silver))] mb-8 max-w-2xl mx-auto">
                Nuestro equipo de atención al cliente está disponible 24/7 para
                resolver cualquier pregunta que tengas.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="cursor-pointer bg-[hsl(var(--color-zaga-green-gray))] hover:bg-[hsl(var(--color-zaga-green-hover))] text-white group"
                  onClick={handleLlamarAhora}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Llamar ahora
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[hsl(var(--color-zaga-green-gray))] text-[hsl(var(--color-zaga-green-gray))] hover:bg-[hsl(var(--color-zaga-green-gray))] hover:text-white"
                  asChild
                >
                  <Link href="mailto:soporte@zaga.com">
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar email
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
