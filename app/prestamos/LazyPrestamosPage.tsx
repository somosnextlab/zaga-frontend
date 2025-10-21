'use client';

import { Suspense } from 'react';
import { PageLoading } from '../components/ui/loading/PageLoading';
import { createLazyPage } from '../lib/utils/lazyImport';

// Dynamic import para la página de préstamos
const PrestamosPage = createLazyPage(() => import('./page'));

export const LazyPrestamosPage = () => {
  return (
    <Suspense fallback={<PageLoading message="Cargando información de préstamos..." size="lg" />}>
      <PrestamosPage />
    </Suspense>
  );
};

export default LazyPrestamosPage;
