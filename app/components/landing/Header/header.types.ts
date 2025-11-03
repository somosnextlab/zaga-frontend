/**
 * Props del componente Header
 */
export interface HeaderProps {
  /**
   * Clase CSS adicional para el header
   * @optional
   */
  className?: string;
}

/**
 * Configuración de los enlaces de navegación de la landing page
 */
export interface LandingNavigationItem {
  href: string;
  label: string;
}

/**
 * Configuración de los enlaces de navegación para usuarios autenticados
 */
export interface ProtectedNavigationItem {
  href: string;
  label: string;
}
