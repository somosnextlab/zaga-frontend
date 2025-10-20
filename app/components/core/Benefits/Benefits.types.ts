import { LucideIcon } from 'lucide-react';

/**
 * Beneficio individual
 */
export interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Props del componente Benefits
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BenefitsProps {
  // Por ahora no tiene props específicas, pero se puede extender en el futuro
}
