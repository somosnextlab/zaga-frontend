/**
 * Exportaciones centralizadas para dynamic imports
 * Facilita el uso de componentes lazy en toda la aplicación
 */

// Páginas de autenticación
export { LazyLoginPage } from '../../auth/login/LazyLoginPage';
export { LazyRegisterPage } from '../../auth/register/LazyRegisterPage';
export { LazyVerifyEmailPage } from '../../auth/verify-email/LazyVerifyEmailPage';

// Dashboards
export { LazyUserDashboard } from '../../(private)/userDashboard/LazyUserDashboard';
export { LazyAdminDashboard } from '../../(admin)/adminDashboard/LazyAdminDashboard';

// Páginas específicas
export { LazyPrestamosPage } from '../../prestamos/LazyPrestamosPage';

// Componentes core
export {
  LazyLoanSimulator,
  LazyDashboardLayout,
  LazyQuickActions,
  LazyStatCard,
  LoanSimulatorWithSuspense,
  DashboardLayoutWithSuspense,
  QuickActionsWithSuspense,
  StatCardWithSuspense,
} from '../../components/core/LazyComponents';

// Componentes de autenticación
export {
  LazyAuthGuard,
  LazyConditionalAuthProvider,
  LazyBackendRegistrationHandler,
  AuthGuardWithSuspense,
  ConditionalAuthProviderWithSuspense,
  BackendRegistrationHandlerWithSuspense,
} from '../../components/auth/LazyAuthComponents';

// Hooks para dynamic imports
export { useDynamicImport, useLazyComponent } from '../hooks/useDynamicImport';

// Utilidades para lazy imports
export { createLazyComponent, createLazyPage, createLazyNamedComponent } from '../utils/lazyImport';

// Componentes de UI
export { PageLoading } from '../../components/ui/loading/PageLoading';
export { ComponentLoading } from '../../components/ui/loading/ComponentLoading';
export { ErrorBoundary } from '../../components/ui/error/ErrorBoundary';

// Configuración
export { BUNDLE_CHUNKS, PRELOAD_CONFIG, RETRY_CONFIG, TIMEOUT_CONFIG } from '../config/bundleSplitting';
