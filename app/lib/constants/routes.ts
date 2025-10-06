export const ROUTES = {
  // Públicas
  HOME: '/',
  LOGIN: '/login',
  
  // Dashboards
  USER_DASHBOARD: '/(private)/userDashboard',
  ADMIN_DASHBOARD: '/(admin)/adminDashboard',
  
  // Auth
  SIGNOUT: '/auth/signout',
} as const;

export const PROTECTED_ROUTES = {
  PRIVATE: '/(private)',
  ADMIN: '/(admin)',
} as const;
