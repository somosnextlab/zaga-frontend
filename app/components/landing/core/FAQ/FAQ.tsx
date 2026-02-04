"use client";

import React from "react";
import styles from "./FAQ.module.scss";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";

const faqs = [
  {
    question: "¿Cuáles son los requisitos para solicitar un préstamo?",
    answer:
      "Necesitas ser mayor de 18 años, tener un ingreso comprobable, identificación oficial vigente y recidir en la provincia de Cordoba, Argentina. El proceso es 100% digital y no requiere aval.",
  },
  {
    question: "¿Cuánto tiempo tarda la aprobación?",
    answer:
      "La mayoría de las solicitudes son aprobadas en minutos. En casos excepcionales, el proceso puede tomar hasta 24 horas.",
  },
  {
    question: "¿Cuál es el monto máximo que puedo solicitar?",
    answer:
      "Puedes solicitar desde $100.000 hasta $500,000 pesos Argentinos, dependiendo de tu perfil crediticio y capacidad de pago.",
  },
  {
    question: "¿Qué tasa de interés manejan?",
    answer:
      "Nuestras tasas van del .... al .... anual, dependiendo del perfil del cliente. Siempre mostramos la tasa exacta antes de que firmes el contrato.",
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
      "Puedes contactarnos via whatsApp o email para encontrar una solución. Ofrecemos opciones de reestructuración y planes de pago flexibles para ayudarte.",
  },
  {
    question: "¿Mis datos están seguros?",
    answer:
      "Absolutamente. Utilizamos encriptación bancaria de nivel militar y cumplimos con todas las regulaciones de protección de datos financieros.",
  },
];

export const FAQ: React.FC = () => {
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
      </div>
    </section>
  );
};
