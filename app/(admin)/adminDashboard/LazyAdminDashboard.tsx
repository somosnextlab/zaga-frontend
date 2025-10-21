'use client';

import { Suspense } from 'react';
import { PageLoading } from '../../components/ui/loading/PageLoading';
import { createLazyPage } from '../../lib/utils/lazyImport';

// Dynamic import para el dashboard de administrador
const AdminDashboard = createLazyPage(() => import('./page'));

export const LazyAdminDashboard = () => {
  return (
    <Suspense fallback={<PageLoading message="Cargando panel de administración..." size="lg" />}>
      <AdminDashboard />
    </Suspense>
  );
};

export default LazyAdminDashboard;
