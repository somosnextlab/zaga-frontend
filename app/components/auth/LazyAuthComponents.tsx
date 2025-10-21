'use client';

import { Suspense } from 'react';
import { ComponentLoading } from '../ui/loading/ComponentLoading';
import { createLazyNamedComponent } from '../../lib/utils/lazyImport';

// Dynamic imports para componentes de autenticación
export const LazyAuthGuard = createLazyNamedComponent(
  () => import('./AuthGuard/AuthGuard'),
  'AuthGuard'
);
export const LazyConditionalAuthProvider = createLazyNamedComponent<{
  children: React.ReactNode;
}>(
  () => import('./ConditionalAuthProvider/ConditionalAuthProvider'),
  'ConditionalAuthProvider'
);
export const LazyBackendRegistrationHandler = createLazyNamedComponent(
  () => import('./BackendRegistrationHandler/BackendRegistrationHandler'),
  'BackendRegistrationHandler'
);

// Wrappers con Suspense para cada componente
export const AuthGuardWithSuspense = () => (
  <Suspense fallback={<ComponentLoading size="sm" />}>
    <LazyAuthGuard />
  </Suspense>
);

export const ConditionalAuthProviderWithSuspense = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <Suspense fallback={<ComponentLoading size="md" />}>
    <LazyConditionalAuthProvider>{children}</LazyConditionalAuthProvider>
  </Suspense>
);

export const BackendRegistrationHandlerWithSuspense = () => (
  <Suspense fallback={<ComponentLoading size="sm" />}>
    <LazyBackendRegistrationHandler />
  </Suspense>
);
