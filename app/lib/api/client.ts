import { getAccessToken } from '../supabase/client';

// ==================== CONFIGURACIÓN ====================

/**
 * URL base del backend
 */
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

/**
 * Headers por defecto para las peticiones
 */
const DEFAULT_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
};

/**
 * Códigos de estado HTTP comunes
 */
const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// ==================== TIPOS ====================
// Los tipos se importan desde types.ts para evitar duplicación
import type { ApiRequestOptions, ApiResponse } from './types';

// ==================== FUNCIONES HELPER ====================

/**
 * Construye la URL completa para la petición
 * @param path - Ruta de la API
 * @returns URL completa
 */
const buildApiUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_URL}${cleanPath}`;
};

/**
 * Prepara los headers para la petición
 * @param token - Token de autorización
 * @param customHeaders - Headers personalizados
 * @returns Headers preparados
 */
const prepareHeaders = (
  token: string | null,
  customHeaders?: Record<string, string>
): Record<string, string> => {
  const headers = { ...DEFAULT_HEADERS, ...customHeaders };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Maneja errores de autorización
 * @param status - Código de estado HTTP
 */
const handleAuthError = (status: number): void => {
  if (status === HTTP_STATUS.UNAUTHORIZED) {
    if (typeof window !== 'undefined') {
      const baseUrl = window.location.origin;
      window.location.href = `${baseUrl}/auth/login`;
    }
    throw new Error('Unauthorized - redirecting to login');
  }
};

/**
 * Wrapper principal para fetch que incluye automáticamente el token de autorización
 * @param path - Ruta de la API
 * @param options - Opciones de la petición
 * @returns Promise con la respuesta
 */
export const apiFetch = async (
  path: string,
  options: ApiRequestOptions = {}
): Promise<Response> => {
  try {
    const { skipAuth = false, timeout = 10000, ...fetchOptions } = options;

    // Obtener el token de acceso si no se omite la autenticación
    const token = skipAuth ? null : await getAccessToken();

    // Construir la URL completa
    const url = buildApiUrl(path);

    // Preparar headers
    const headers = prepareHeaders(
      token,
      fetchOptions.headers as Record<string, string>
    );

    // Configurar timeout si se especifica
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Realizar la petición
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Manejar errores de autorización
      handleAuthError(response.status);

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
};

// ==================== MÉTODOS HTTP ESPECÍFICOS ====================

/**
 * Wrapper específico para GET requests
 * @param path - Ruta de la API
 * @param options - Opciones adicionales
 * @returns Promise con la respuesta
 */
export const apiGet = async (
  path: string,
  options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
): Promise<Response> => {
  return apiFetch(path, { ...options, method: 'GET' });
};

/**
 * Wrapper específico para POST requests
 * @param path - Ruta de la API
 * @param data - Datos a enviar
 * @param options - Opciones adicionales
 * @returns Promise con la respuesta
 */
export const apiPost = async (
  path: string,
  data?: unknown,
  options: Omit<ApiRequestOptions, 'method'> = {}
): Promise<Response> => {
  const requestOptions: ApiRequestOptions = {
    ...options,
    method: 'POST',
  };

  // Solo agregar body si hay datos
  if (data !== undefined) {
    requestOptions.body = JSON.stringify(data);
  }

  return apiFetch(path, requestOptions);
};

/**
 * Wrapper específico para PUT requests
 * @param path - Ruta de la API
 * @param data - Datos a enviar
 * @param options - Opciones adicionales
 * @returns Promise con la respuesta
 */
export const apiPut = async (
  path: string,
  data?: unknown,
  options: Omit<ApiRequestOptions, 'method'> = {}
): Promise<Response> => {
  const requestOptions: ApiRequestOptions = {
    ...options,
    method: 'PUT',
  };

  if (data !== undefined) {
    requestOptions.body = JSON.stringify(data);
  }

  return apiFetch(path, requestOptions);
};

/**
 * Wrapper específico para DELETE requests
 * @param path - Ruta de la API
 * @param options - Opciones adicionales
 * @returns Promise con la respuesta
 */
export const apiDelete = async (
  path: string,
  options: Omit<ApiRequestOptions, 'method' | 'body'> = {}
): Promise<Response> => {
  return apiFetch(path, { ...options, method: 'DELETE' });
};

// ==================== UTILIDADES DE RESPUESTA ====================

/**
 * Helper para parsear respuestas JSON con manejo de errores
 * @param response - Respuesta de la API
 * @returns Promise con los datos parseados
 */
export const parseApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return response.json();
};

/**
 * Helper para crear una respuesta de API estructurada
 * @param response - Respuesta de la API
 * @returns Respuesta estructurada
 */
export const createApiResponse = async <T>(
  response: Response
): Promise<ApiResponse<T>> => {
  const data = await response.json();

  return {
    data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  };
};

/**
 * Helper para manejar errores de API de forma consistente
 * @param error - Error capturado
 * @returns Error estructurado
 */
export const handleApiError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  return new Error('Error desconocido en la API');
};
