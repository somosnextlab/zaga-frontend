/**
 * Información de la persona asociada al usuario
 */
export type Persona = {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
};

/**
 * Datos del usuario retornados por el endpoint /api/auth
 */
export type AuthUserData = {
  userId: string;
  email: string;
  role: string;
  estado: string;
  persona: Persona;
};

/**
 * Respuesta completa del endpoint /api/auth
 */
export type LoginAuthResponse = {
  success: boolean;
  data: AuthUserData;
};
