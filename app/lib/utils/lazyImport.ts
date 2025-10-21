/**
 * Utilidad para crear dynamic imports robustos
 * Maneja tanto named exports como default exports
 */

import { ComponentType, lazy } from 'react';

/**
 * Crea un dynamic import que maneja tanto named exports como default exports
 * @param importFn - Función que retorna el dynamic import
 * @param exportName - Nombre del export (opcional, usa 'default' si no se especifica)
 * @returns Componente lazy
 */
export const createLazyComponent = <T = any>(
  importFn: () => Promise<any>,
  exportName?: string
): ComponentType<T> => {
  return lazy(async () => {
    const module = await importFn();
    
    // Si se especifica un export name, usarlo
    if (exportName) {
      return { default: module[exportName] };
    }
    
    // Si hay un default export, usarlo
    if (module.default) {
      return { default: module.default };
    }
    
    // Si no hay default, usar el primer export disponible
    const firstExport = Object.values(module)[0] as ComponentType<T>;
    if (firstExport) {
      return { default: firstExport };
    }
    
    throw new Error('No se pudo encontrar un componente válido para importar');
  });
};

/**
 * Helper específico para páginas (que siempre tienen default export)
 */
export const createLazyPage = <T = any>(
  importFn: () => Promise<{ default: ComponentType<T> }>
): ComponentType<T> => {
  return lazy(importFn);
};

/**
 * Helper específico para componentes con named exports
 */
export const createLazyNamedComponent = <T = any>(
  importFn: () => Promise<any>,
  exportName: string
): ComponentType<T> => {
  return createLazyComponent(importFn, exportName);
};
