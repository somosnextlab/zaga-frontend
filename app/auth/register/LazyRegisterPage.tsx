'use client';

import { Suspense } from 'react';
import { PageLoading } from '../../components/ui/loading/PageLoading';
import { createLazyPage } from '../../lib/utils/lazyImport';

// Dynamic import para la página de registro
const RegisterPage = createLazyPage(() => import('./page'));

export const LazyRegisterPage = () => {
  return (
    <Suspense fallback={<PageLoading message="Cargando página de registro..." />}>
      <RegisterPage />
    </Suspense>
  );
};

export default LazyRegisterPage;
