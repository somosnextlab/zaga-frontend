"use client";

import React from "react";
import { MessageCircle, Phone, Mail } from "lucide-react";
import Link from "next/link";
import styles from "./FAQ.module.scss";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { Button } from "@/app/components/ui/Button/Button";
import { Card, CardContent } from "@/app/components/ui/Card/card";

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
    <section id="faq" className={styles.faq}>
      <div className={styles.faq__container}>
        <div className={styles.faq__header}>
          <h2 className={styles.faq__title}>
            Preguntas{" "}
            <span className={styles.faq__titleHighlight}>frecuentes</span>
          </h2>
          <p className={styles.faq__subtitle}>
            Resolvemos las dudas más comunes sobre nuestros préstamos
            personales.
          </p>
        </div>

        <div className={styles.faq__accordionContainer}>
          <Accordion
            type="single"
            collapsible
            className={styles.faq__accordion}
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className={styles.faq__accordionItem}
              >
                <AccordionTrigger className={styles.faq__accordionTrigger}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent
                  className={`${styles.faq__accordionContent} ${
                    index === faqs.length - 1
                      ? styles.faq__accordionContentLast
                      : ""
                  }`}
                >
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Card */}
        <div className={styles.faq__contactContainer}>
          <Card className={styles.faq__contactCard}>
            <CardContent className={styles.faq__contactContent}>
              <div className={styles.faq__contactIconWrapper}>
                <MessageCircle className={styles.faq__contactIcon} />
              </div>

              <h3 className={styles.faq__contactTitle}>¿Aún tienes dudas?</h3>

              <p className={styles.faq__contactDescription}>
                Nuestro equipo de atención al cliente está disponible 24/7 para
                resolver cualquier pregunta que tengas.
              </p>

              <div className={styles.faq__contactButtons}>
                <Button
                  size="lg"
                  className={styles.faq__contactButtonPrimary}
                  onClick={handleLlamarAhora}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Llamar ahora
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={styles.faq__contactButtonSecondary}
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
