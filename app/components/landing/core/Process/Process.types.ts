/* eslint-disable @typescript-eslint/no-empty-object-type */
import { LucideIcon } from 'lucide-react';

/**
 * Paso del proceso individual
 */
export interface ProcessStep {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Props del componente Process
 */
export interface ProcessProps {
  // Por ahora no tiene props específicas, pero se puede extender en el futuro
}
