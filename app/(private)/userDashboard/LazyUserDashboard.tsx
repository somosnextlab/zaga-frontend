'use client';

import { Suspense } from 'react';
import { PageLoading } from '../../components/ui/loading/PageLoading';
import { createLazyPage } from '../../lib/utils/lazyImport';

// Dynamic import para el dashboard de usuario
const UserDashboard = createLazyPage(() => import('./page'));

export const LazyUserDashboard = () => {
  return (
    <Suspense fallback={<PageLoading message="Cargando tu dashboard..." size="lg" />}>
      <UserDashboard />
    </Suspense>
  );
};

export default LazyUserDashboard;
