'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseDynamicImportOptions {
  loadingMessage?: string;
  errorMessage?: string;
  retryDelay?: number;
  maxRetries?: number;
}

interface DynamicImportState<T> {
  Component: React.ComponentType<T> | null;
  isLoading: boolean;
  error: Error | null;
  retryCount: number;
}

/**
 * Hook personalizado para manejar dynamic imports con retry automático
 * @param importFn - Función que retorna el dynamic import
 * @param options - Opciones de configuración
 * @returns Estado del dynamic import y función de retry
 */
export const useDynamicImport = <T = any>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  options: UseDynamicImportOptions = {}
) => {
  const {
    loadingMessage = 'Cargando...',
    errorMessage = 'Error al cargar el componente',
    retryDelay = 1000,
    maxRetries = 3,
  } = options;

  const [state, setState] = useState<DynamicImportState<T>>({
    Component: null,
    isLoading: true,
    error: null,
    retryCount: 0,
  });

  const loadComponent = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const module = await importFn();
      
      setState({
        Component: module.default,
        isLoading: false,
        error: null,
        retryCount: 0,
      });
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(errorMessage);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorObj,
        retryCount: prev.retryCount + 1,
      }));
    }
  }, [importFn, errorMessage]);

  const retry = useCallback(() => {
    if (state.retryCount < maxRetries) {
      setTimeout(() => {
        loadComponent();
      }, retryDelay);
    }
  }, [state.retryCount, maxRetries, retryDelay, loadComponent]);

  useEffect(() => {
    loadComponent();
  }, [loadComponent]);

  return {
    ...state,
    retry,
    canRetry: state.retryCount < maxRetries,
    loadingMessage,
  };
};

/**
 * Hook simplificado para dynamic imports básicos
 * @param importFn - Función que retorna el dynamic import
 * @returns Componente y estado de carga
 */
export const useLazyComponent = <T = any>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>
) => {
  const { Component, isLoading, error, retry, canRetry } = useDynamicImport(importFn);
  
  return {
    Component,
    isLoading,
    error,
    retry,
    canRetry,
  };
};
