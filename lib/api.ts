import { getAccessToken } from './supabaseClient';

/**
 * URL base del backend
 */
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

/**
 * Wrapper para fetch que incluye automáticamente el token de autorización
 */
export const apiFetch = async (
  path: string,
  init: RequestInit = {}
): Promise<Response> => {
  try {
    // Obtener el token de acceso actual
    const token = await getAccessToken();

    // Construir la URL completa
    const url = `${BACKEND_URL}${path}`;

    // Preparar headers con autorización
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(init.headers as Record<string, string>),
    };

    // Agregar token de autorización si está disponible
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Realizar la petición
    const response = await fetch(url, {
      ...init,
      headers,
    });

    // Si la respuesta es 401, redirigir al login
    if (response.status === 401) {
      // Redirigir al login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      throw new Error('Unauthorized - redirecting to login');
    }

    return response;
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
};

/**
 * Wrapper específico para GET requests
 */
export const apiGet = async (path: string): Promise<Response> => {
  return apiFetch(path, { method: 'GET' });
};

/**
 * Wrapper específico para POST requests
 */
export const apiPost = async (
  path: string,
  data?: unknown
): Promise<Response> => {
  return apiFetch(path, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * Wrapper específico para PUT requests
 */
export const apiPut = async (
  path: string,
  data?: unknown
): Promise<Response> => {
  return apiFetch(path, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * Wrapper específico para DELETE requests
 */
export const apiDelete = async (path: string): Promise<Response> => {
  return apiFetch(path, { method: 'DELETE' });
};

/**
 * Helper para parsear respuestas JSON con manejo de errores
 */
export const parseApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return response.json();
};
