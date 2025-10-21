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
export const createLazyComponent = <T = unknown>(
  importFn: () => Promise<Record<string, unknown>>,
  exportName?: string
): ComponentType<T> => {
  return lazy(async () => {
    const importedModule = await importFn();
    
    // Si se especifica un export name, usarlo
    if (exportName) {
      return { default: importedModule[exportName] as ComponentType<T> };
    }
    
    // Si hay un default export, usarlo
    if (importedModule.default) {
      return { default: importedModule.default as ComponentType<T> };
    }
    
    // Si no hay default, usar el primer export disponible
    const firstExport = Object.values(importedModule)[0] as ComponentType<T>;
    if (firstExport) {
      return { default: firstExport };
    }
    
    throw new Error('No se pudo encontrar un componente válido para importar');
  });
};

/**
 * Helper específico para páginas (que siempre tienen default export)
 */
export const createLazyPage = <T = unknown>(
  importFn: () => Promise<{ default: ComponentType<T> }>
): ComponentType<T> => {
  return lazy(importFn);
};

/**
 * Helper específico para componentes con named exports
 */
export const createLazyNamedComponent = <T = unknown>(
  importFn: () => Promise<Record<string, unknown>>,
  exportName: string
): ComponentType<T> => {
  return createLazyComponent<T>(importFn, exportName);
};
