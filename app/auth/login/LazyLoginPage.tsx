'use client';

import { Suspense } from 'react';
import { PageLoading } from '../../components/ui/loading/PageLoading';
import { createLazyPage } from '../../lib/utils/lazyImport';

// Dynamic import para la página de login
const LoginPage = createLazyPage(() => import('./page'));

export const LazyLoginPage = () => {
  return (
    <Suspense fallback={<PageLoading message="Cargando página de inicio de sesión..." />}>
      <LoginPage />
    </Suspense>
  );
};

export default LazyLoginPage;
