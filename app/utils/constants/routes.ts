export const ROUTES = {
  // Públicas
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  VERIFY_EMAIL: "/auth/verify-email",

  /**
   * Rutas protegidas por grupo de rutas de Next.js
   * Los grupos (admin) y (private) no afectan la URL final
   */
  USER_DASHBOARD: "/userDashboard",
  ADMIN_DASHBOARD: "/adminDashboard",

  // Auth
  SIGNOUT: "/auth/signout",
} as const;

/**
 * Enum para los identificadores de los items de navegación de la landing page
 */
export enum LandingNavigationItem {
  BENEFICIOS = "BENEFICIOS",
  COMO_FUNCIONA = "COMO_FUNCIONA",
  FAQ = "FAQ",
}

/**
 * Mapeo de los enums de navegación a sus valores (href y label)
 */
export const LANDING_NAVIGATION_ITEMS_MAP: Record<
  LandingNavigationItem,
  { href: string; label: string }
> = {
  [LandingNavigationItem.BENEFICIOS]: {
    href: "#beneficios",
    label: "Beneficios",
  },
  [LandingNavigationItem.COMO_FUNCIONA]: {
    href: "#como-funciona",
    label: "Cómo funciona",
  },
  [LandingNavigationItem.FAQ]: {
    href: "#faq",
    label: "Preguntas",
  },
};

/**
 * Array de items de navegación para la landing page en el orden deseado
 */
export const LANDING_NAVIGATION_ITEMS = [
  LANDING_NAVIGATION_ITEMS_MAP[LandingNavigationItem.BENEFICIOS],
  LANDING_NAVIGATION_ITEMS_MAP[LandingNavigationItem.COMO_FUNCIONA],
  LANDING_NAVIGATION_ITEMS_MAP[LandingNavigationItem.FAQ],
] as const;
