/**
 * Props del componente LoanSimulator
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LoanSimulatorProps {
  // Por ahora no tiene props específicas, pero se puede extender en el futuro
}

/**
 * Parámetros del simulador
 */
export interface SimulatorParams {
  monto: number;
  plazo: number;
  pagoMensual: number;
}
