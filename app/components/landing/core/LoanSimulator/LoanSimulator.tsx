"use client";
import * as React from "react";
import "./LoanSimulator.module.scss";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Slider } from "@/app/components/ui/slider";

function formatMXN(n: number) {
  return n.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  });
}

export function LoanSimulator() {
  const [monto, setMonto] = React.useState(25000);
  const [plazo, setPlazo] = React.useState(12);
  const [isLoading] = React.useState(false);

  // Tasa anual del 12% (1% mensual)
  const tasaAnual = 0.12;
  const tasaMensual = tasaAnual / 12;

  // Cálculo de pago mensual usando la fórmula PMT
  const pagoMensual = React.useMemo(() => {
    if (plazo === 0) return 0;
    const factor = Math.pow(1 + tasaMensual, plazo);
    return (monto * tasaMensual * factor) / (factor - 1);
  }, [monto, plazo, tasaMensual]);

  const totalPagar = pagoMensual * plazo;

  const handleContinuar = async () => {
    console.log("continuar");
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white">
      <CardContent className="p-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-card-title text-[hsl(var(--color-zaga-black))] mb-2">
            Simulador de Préstamos
          </h3>
          <p className="text-body-sm text-[hsl(var(--color-zaga-silver))]">
            Calcula tu pago mensual en segundos
          </p>
        </div>

        {/* Slider de Monto */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-[hsl(var(--color-zaga-black))] mb-2">
              {formatMXN(monto)}
            </div>
            <p className="text-body-sm text-[hsl(var(--color-zaga-silver))]">
              Monto del préstamo
            </p>
          </div>
          <div className="px-4">
            <Slider
              value={[monto]}
              onValueChange={(v) => setMonto(v[0])}
              min={1000}
              max={50000}
              step={1000}
              className="[&_[data-slot=slider-track]]:bg-[hsl(var(--color-zaga-silver))]/20 [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-range]]:bg-[hsl(var(--color-zaga-green-gray))] [&_[role=slider]]:bg-[hsl(var(--color-zaga-green-gray))] [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-lg [&_[role=slider]]:w-5 [&_[role=slider]]:h-5"
            />
          </div>
          <div className="flex justify-between text-caption text-[hsl(var(--color-zaga-silver))] px-4">
            <span>{formatMXN(1000)}</span>
            <span>{formatMXN(50000)}</span>
          </div>
        </div>

        {/* Slider de Plazo */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[hsl(var(--color-zaga-black))] mb-1">
              {plazo} meses
            </div>
            <p className="text-body-sm text-[hsl(var(--color-zaga-silver))]">
              Plazo del préstamo
            </p>
          </div>
          <div className="px-4">
            <Slider
              value={[plazo]}
              onValueChange={(v) => setPlazo(v[0])}
              min={3}
              max={36}
              step={1}
              className="[&_[data-slot=slider-track]]:bg-[hsl(var(--color-zaga-silver))]/20 [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-range]]:bg-[hsl(var(--color-zaga-green-gray))] [&_[role=slider]]:bg-[hsl(var(--color-zaga-green-gray))] [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-lg [&_[role=slider]]:w-5 [&_[role=slider]]:h-5"
            />
          </div>
          <div className="flex justify-between text-caption text-[hsl(var(--color-zaga-silver))] px-4">
            <span>3 meses</span>
            <span>36 meses</span>
          </div>
        </div>

        {/* Resultados */}
        <div className="bg-gradient-to-r from-[hsl(var(--color-zaga-green-gray))]/10 to-[hsl(var(--color-zaga-green-gray))]/5 rounded-lg p-6 space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-[hsl(var(--color-zaga-green-gray))] mb-2">
              {formatMXN(pagoMensual)}
            </div>
            <p className="text-body-sm text-[hsl(var(--color-zaga-silver))]">
              Pago mensual estimado
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-caption text-[hsl(var(--color-zaga-silver))]">
                Tasa anual
              </p>
              <p className="text-body font-semibold text-[hsl(var(--color-zaga-black))]">
                {tasaAnual * 100}%
              </p>
            </div>
            <div>
              <p className="text-caption text-[hsl(var(--color-zaga-silver))]">
                Total a pagar
              </p>
              <p className="text-body font-semibold text-[hsl(var(--color-zaga-black))]">
                {formatMXN(totalPagar)}
              </p>
            </div>
          </div>
        </div>

        {/* Botón CTA */}
        <Button
          onClick={handleContinuar}
          disabled={isLoading}
          className="cursor-pointer w-full bg-[hsl(var(--color-zaga-green-gray))] hover:bg-[hsl(var(--color-zaga-green-hover))] text-white"
          size="lg"
        >
          {isLoading ? "Procesando..." : "Continuar con mi solicitud"}
        </Button>

        {/* Disclaimer */}
        <p className="text-caption text-[hsl(var(--color-zaga-silver))] text-center leading-relaxed">
          * Valores estimados. Sujeto a evaluación crediticia.
        </p>
      </CardContent>
    </Card>
  );
}
