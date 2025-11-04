"use client";

import React from "react";
import {
  Clock,
  Zap,
  Shield,
  TrendingDown,
  CreditCard,
  HeadphonesIcon,
} from "lucide-react";
import styles from "./benefits.module.scss";
import { Card, CardContent } from "@/app/components/ui/Card/card";

const benefits = [
  {
    icon: Clock,
    title: "Aprobación inmediata",
    description:
      "Recibe respuesta en minutos, no días. Nuestro sistema evalúa tu solicitud al instante.",
  },
  {
    icon: Zap,
    title: "Dinero en tu cuenta",
    description:
      "Una vez aprobado, el dinero llega a tu cuenta en menos de 24 horas.",
  },
  {
    icon: Shield,
    title: "100% seguro",
    description:
      "Tus datos están protegidos con encriptación bancaria de nivel militar.",
  },
  {
    icon: TrendingDown,
    title: "Tasas competitivas",
    description:
      "Ofrecemos las mejores tasas del mercado, sin letra chica ni sorpresas.",
  },
  {
    icon: CreditCard,
    title: "Sin comisiones ocultas",
    description:
      "Transparencia total. Solo pagas lo que ves, sin costos adicionales.",
  },
  {
    icon: HeadphonesIcon,
    title: "Soporte 24/7",
    description:
      "Nuestro equipo está disponible las 24 horas para resolver tus dudas.",
  },
];

export const Benefits: React.FC = () => {
  return (
    <section id="beneficios" className={styles.benefits}>
      <div className={styles.benefits__container}>
        <div className={styles.benefits__header}>
          <h2 className={styles.benefits__title}>
            ¿Por qué elegir{" "}
            <span className={styles.benefits__titleHighlight}>Zaga</span>?
          </h2>
          <p className={styles.benefits__subtitle}>
            Somos la opción más confiable para obtener tu préstamo personal de
            forma rápida y segura.
          </p>
        </div>

        <div className={styles.benefits__grid}>
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card key={index} className={styles.benefits__card}>
                <CardContent className={styles.benefits__cardContent}>
                  <div className={styles.benefits__iconWrapper}>
                    <div className={styles.benefits__iconBg}>
                      <IconComponent className={styles.benefits__icon} />
                    </div>
                  </div>

                  <h3 className={styles.benefits__cardTitle}>
                    {benefit.title}
                  </h3>

                  <p className={styles.benefits__cardDescription}>
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
