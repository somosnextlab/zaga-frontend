import { LucideIcon } from 'lucide-react';

/**
 * Enlace de redes sociales
 */
export interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
}

/**
 * Enlace de navegación
 */
export interface NavigationLink {
  name: string;
  href: string;
}

/**
 * Props del componente Footer
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FooterProps {
  // Por ahora no tiene props específicas, pero se puede extender en el futuro
}
