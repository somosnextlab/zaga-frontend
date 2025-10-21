'use client';

import { Suspense } from 'react';
import { PageLoading } from '../../components/ui/loading/PageLoading';
import { createLazyPage } from '../../lib/utils/lazyImport';

// Dynamic import para la página de verificación de email
const VerifyEmailPage = createLazyPage(() => import('./page'));

export const LazyVerifyEmailPage = () => {
  return (
    <Suspense fallback={<PageLoading message="Cargando página de verificación..." />}>
      <VerifyEmailPage />
    </Suspense>
  );
};

export default LazyVerifyEmailPage;
