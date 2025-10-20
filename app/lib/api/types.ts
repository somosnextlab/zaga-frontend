/**
 * Opciones para peticiones API
 */
export interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
  timeout?: number;
}

/**
 * Respuesta de la API con información adicional
 */
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

/**
 * Códigos de estado HTTP comunes
 */
export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
