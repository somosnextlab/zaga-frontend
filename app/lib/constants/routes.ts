export const ROUTES = {
  // Públicas
  HOME: '/',
  LOGIN: '/auth/login',

  // Dashboards
  USER_DASHBOARD: '/userDashboard',
  ADMIN_DASHBOARD: '/adminDashboard',

  // Auth
  SIGNOUT: '/auth/signout',
} as const;

export const PROTECTED_ROUTES = {
  PRIVATE: '/(private)',
  ADMIN: '/(admin)',
} as const;
