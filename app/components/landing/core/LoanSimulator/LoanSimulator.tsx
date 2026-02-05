"use client";
import * as React from "react";
import { Button } from "@/app/components/ui/Button/Button";
import { Card, CardContent } from "@/app/components/ui/Card/card";
import { Slider } from "@/app/components/ui/Slider/slider";
import { WhatsAppCta } from "@/src/components/WhatsAppCta";
import styles from "./loanSimulator.module.scss";
import { WHATSAPP_MESSAGE } from "@/app/mocks/messageMocks";

function formatARS(n: number) {
  return n.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

export function LoanSimulator() {
  const [monto, setMonto] = React.useState<number>(250_000);
  const [semanas, setSemanas] = React.useState<number>(12);
  const isLoading = false;

  const cuotaSemanalSinInteres = React.useMemo(() => {
    if (semanas <= 0) return 0;
    return monto / semanas;
  }, [monto, semanas]);

  return (
    <Card className={styles.loanSimulator}>
      <CardContent className={styles.loanSimulator__content}>
        {/* Header */}
        <div className={styles.loanSimulator__header}>
          <h3 className={styles.loanSimulator__title}>
            Simulador de Préstamos
          </h3>
          <p className={styles.loanSimulator__subtitle}>
            Estimá tu cuota semanal en segundos
          </p>
        </div>

        {/* Slider de Monto */}
        <div className={styles.loanSimulator__section}>
          <div className={styles.loanSimulator__sectionHeader}>
            <p className={styles.loanSimulator__amountValue}>
              {formatARS(monto)}
            </p>
            <p className={styles.loanSimulator__label}>
              Monto a solicitar
            </p>
          </div>
          <div className={styles.loanSimulator__sliderWrap}>
            <Slider
              value={[monto]}
              onValueChange={(v) => setMonto(v[0] ?? monto)}
              min={100000}
              max={500000}
              step={10000}
              className={styles.loanSimulator__slider}
            />
          </div>
          <div className={styles.loanSimulator__minMax}>
            <span>{formatARS(100000)}</span>
            <span>{formatARS(500000)}</span>
          </div>
        </div>

        {/* Slider de Plazo */}
        <div className={styles.loanSimulator__section}>
          <div className={styles.loanSimulator__sectionHeader}>
            <p className={styles.loanSimulator__termValue}>
              {semanas} semanas
            </p>
            <p className={styles.loanSimulator__label}>
              Plazo de devolución (semanal)
            </p>
          </div>
          <div className={styles.loanSimulator__sliderWrap}>
            <Slider
              value={[semanas]}
              onValueChange={(v) => setSemanas(v[0] ?? semanas)}
              min={4}
              max={24}
              step={1}
              className={styles.loanSimulator__slider}
            />
          </div>
          <div className={styles.loanSimulator__minMax}>
            <span>4 semanas</span>
            <span>24 semanas</span>
          </div>
          <p className={styles.loanSimulator__helper}>
            ¿Necesitás otro plazo? Se acuerda con un asesor por WhatsApp.
          </p>
        </div>

        {/* Resultados */}
        <div className={styles.loanSimulator__results}>
          <div className={styles.loanSimulator__resultHeader}>
            <p className={styles.loanSimulator__resultValue}>
              {formatARS(cuotaSemanalSinInteres)}
            </p>
            <p className={styles.loanSimulator__resultLabel}>
              Cuota semanal estimada (sin intereses)
            </p>
          </div>

          <div className={styles.loanSimulator__resultGrid}>
            <div>
              <p className={styles.loanSimulator__resultItemLabel}>
                Frecuencia
              </p>
              <p className={styles.loanSimulator__resultItemValue}>
                Semanal
              </p>
            </div>
            <div>
              <p className={styles.loanSimulator__resultItemLabel}>
                Total estimado (sin intereses)
              </p>
              <p className={styles.loanSimulator__resultItemValue}>
                {formatARS(monto)}
              </p>
            </div>
          </div>
        </div>

        {/* Botón CTA */}
        <Button
          asChild
          disabled={isLoading}
          className={styles.loanSimulator__cta}
          size="lg"
        >
          <WhatsAppCta
            label={isLoading ? "Procesando..." : "Continuar con mi solicitud"}
            message={WHATSAPP_MESSAGE}
          />
        </Button>

        {/* Disclaimer */}
        <p className={styles.loanSimulator__disclaimer}>
          * Estimación sin considerar intereses ni comisiones. La tasa, comisiones
          y condiciones finales se confirman por WhatsApp antes de contratar.
        </p>
      </CardContent>
    </Card>
  );
}
