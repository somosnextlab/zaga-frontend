/**
 * Configuración para bundle splitting y dynamic imports
 * Centraliza la configuración de chunks y optimizaciones
 */

// Configuración de chunks para diferentes features
export const BUNDLE_CHUNKS = {
  // Chunks de autenticación
  AUTH: 'auth',
  LOGIN: 'login',
  REGISTER: 'register',
  
  // Chunks de dashboards
  USER_DASHBOARD: 'user-dashboard',
  ADMIN_DASHBOARD: 'admin-dashboard',
  
  // Chunks de componentes
  CORE_COMPONENTS: 'core-components',
  UI_COMPONENTS: 'ui-components',
  AUTH_COMPONENTS: 'auth-components',
  
  // Chunks de páginas específicas
  PRESTAMOS: 'prestamos',
  PROFILE: 'profile',
  
  // Chunks de utilidades
  UTILS: 'utils',
  VALIDATION: 'validation',
} as const;

// Configuración de preloading para componentes críticos
export const PRELOAD_CONFIG = {
  // Componentes que se deben precargar
  critical: [
    'ConditionalAuthProvider',
    'Header',
    'Button',
  ],
  
  // Componentes que se pueden cargar bajo demanda
  lazy: [
    'LoanSimulator',
    'DashboardLayout',
    'QuickActions',
    'StatCard',
  ],
  
  // Páginas que se pueden cargar bajo demanda
  pages: [
    'LoginPage',
    'RegisterPage',
    'UserDashboard',
    'AdminDashboard',
  ],
} as const;

// Configuración de retry para dynamic imports
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2,
} as const;

// Configuración de timeout para dynamic imports
export const TIMEOUT_CONFIG = {
  default: 10000, // 10 segundos
  critical: 5000, // 5 segundos para componentes críticos
  lazy: 15000, // 15 segundos para componentes lazy
} as const;
