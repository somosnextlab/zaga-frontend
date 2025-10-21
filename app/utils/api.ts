/**
 * API Client para Zaga Frontend
 * Maneja todas las llamadas HTTP al backend
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

/**
 * Configuración por defecto para las peticiones
 */
const defaultConfig: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
};

/**
 * Maneja errores de respuesta HTTP
 */
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
};

/**
 * Realiza una petición GET
 */
export const apiGet = async <T = unknown>(
  endpoint: string,
  config: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultConfig,
    ...config,
    method: 'GET',
  });
  return handleResponse(response);
};

/**
 * Realiza una petición POST
 */
export const apiPost = async <T = unknown>(
  endpoint: string,
  data: unknown = {},
  config: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultConfig,
    ...config,
    method: 'POST',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

/**
 * Realiza una petición PUT
 */
export const apiPut = async <T = unknown>(
  endpoint: string,
  data: unknown = {},
  config: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultConfig,
    ...config,
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

/**
 * Realiza una petición DELETE
 */
export const apiDelete = async <T = unknown>(
  endpoint: string,
  config: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultConfig,
    ...config,
    method: 'DELETE',
  });
  return handleResponse(response);
};

/**
 * Parsea la respuesta de la API
 */
export const parseApiResponse = <T = unknown>(response: unknown): T => {
  const apiResponse = response as {
    success?: boolean;
    data?: T;
    error?: string;
  };
  if (apiResponse.success) {
    return apiResponse.data as T;
  }
  throw new Error(apiResponse.error || 'Error en la respuesta de la API');
};
