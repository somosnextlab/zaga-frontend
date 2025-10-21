'use client';

import { Suspense } from 'react';
import { ComponentLoading } from '../ui/loading/ComponentLoading';
import { createLazyNamedComponent } from '../../lib/utils/lazyImport';

// Dynamic imports para componentes pesados del core
export const LazyLoanSimulator = createLazyNamedComponent(() => import('./LoanSimulator/LoanSimulator'), 'LoanSimulator');
export const LazyDashboardLayout = createLazyNamedComponent(() => import('./DashboardLayout/DashboardLayout'), 'DashboardLayout');
export const LazyQuickActions = createLazyNamedComponent(() => import('./QuickActions/QuickActions'), 'QuickActions');
export const LazyStatCard = createLazyNamedComponent(() => import('./StatCard/StatCard'), 'StatCard');

// Wrappers con Suspense para cada componente
export const LoanSimulatorWithSuspense = () => (
  <Suspense fallback={<ComponentLoading size="md" />}>
    <LazyLoanSimulator />
  </Suspense>
);

export const DashboardLayoutWithSuspense = () => (
  <Suspense fallback={<ComponentLoading size="lg" />}>
    <LazyDashboardLayout />
  </Suspense>
);

export const QuickActionsWithSuspense = () => (
  <Suspense fallback={<ComponentLoading size="sm" />}>
    <LazyQuickActions />
  </Suspense>
);

export const StatCardWithSuspense = () => (
  <Suspense fallback={<ComponentLoading size="xs" />}>
    <LazyStatCard />
  </Suspense>
);
