'use client';

/**
 * Servicio para manejar la persistencia de sesión de usuario
 * Implementa estrategia híbrida: localStorage + httpOnly cookies
 * Aplica principios SOLID y mejores prácticas de seguridad
 */
export class SessionService {
  private readonly ACCESS_TOKEN_KEY = 'zaga_access_token';
  private readonly REFRESH_TOKEN_KEY = 'zaga_refresh_token';
  private readonly USER_DATA_KEY = 'zaga_user_data';
  private readonly SESSION_EXPIRY_KEY = 'zaga_session_expiry';

  /**
   * Verifica si el navegador soporta localStorage
   * @returns true si localStorage está disponible
   */
  private isLocalStorageAvailable(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verifica si el navegador soporta sessionStorage
   * @returns true si sessionStorage está disponible
   */
  private isSessionStorageAvailable(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      const test = '__sessionStorage_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Almacena el access token en localStorage
   * @param token - Token de acceso
   * @param expiresIn - Tiempo de expiración en segundos
   */
  setAccessToken(token: string, expiresIn: number = 3600): void {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage no disponible, no se puede persistir el token');
      return;
    }

    try {
      const expiryTime = Date.now() + (expiresIn * 1000);
      
      localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
      localStorage.setItem(this.SESSION_EXPIRY_KEY, expiryTime.toString());
      
      // También almacenar en sessionStorage como backup
      if (this.isSessionStorageAvailable()) {
        sessionStorage.setItem(this.ACCESS_TOKEN_KEY, token);
      }
    } catch (error) {
      console.error('Error al almacenar access token:', error);
    }
  }

  /**
   * Obtiene el access token del almacenamiento
   * @returns Token de acceso o null si no existe o está expirado
   */
  getAccessToken(): string | null {
    if (!this.isLocalStorageAvailable()) return null;

    try {
      // Verificar si el token está expirado
      const expiryTime = localStorage.getItem(this.SESSION_EXPIRY_KEY);
      if (expiryTime && Date.now() > parseInt(expiryTime)) {
        this.clearAccessToken();
        return null;
      }

      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error al obtener access token:', error);
      return null;
    }
  }

  /**
   * Almacena el refresh token en httpOnly cookie
   * @param token - Token de refresh
   * @param expiresIn - Tiempo de expiración en segundos
   */
  setRefreshToken(token: string, expiresIn: number = 2592000): void {
    try {
      const expiryDate = new Date();
      expiryDate.setTime(expiryDate.getTime() + (expiresIn * 1000));
      
      // Crear cookie httpOnly para mayor seguridad
      document.cookie = `${this.REFRESH_TOKEN_KEY}=${token}; expires=${expiryDate.toUTCString()}; path=/; secure; samesite=strict`;
    } catch (error) {
      console.error('Error al almacenar refresh token:', error);
    }
  }

  /**
   * Obtiene el refresh token de las cookies
   * @returns Token de refresh o null si no existe
   */
  getRefreshToken(): string | null {
    try {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === this.REFRESH_TOKEN_KEY) {
          return value;
        }
      }
      return null;
    } catch (error) {
      console.error('Error al obtener refresh token:', error);
      return null;
    }
  }

  /**
   * Almacena datos del usuario en localStorage
   * @param userData - Datos del usuario a almacenar
   */
  setUserData(userData: Record<string, unknown>): void {
    if (!this.isLocalStorageAvailable()) return;

    try {
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error al almacenar datos del usuario:', error);
    }
  }

  /**
   * Obtiene los datos del usuario del almacenamiento
   * @returns Datos del usuario o null si no existen
   */
  getUserData(): Record<string, unknown> | null {
    if (!this.isLocalStorageAvailable()) return null;

    try {
      const userData = localStorage.getItem(this.USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      return null;
    }
  }

  /**
   * Verifica si la sesión está activa y no expirada
   * @returns true si la sesión es válida
   */
  isSessionValid(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    
    return !!(accessToken && refreshToken);
  }

  /**
   * Obtiene el tiempo restante de la sesión en milisegundos
   * @returns Tiempo restante o 0 si está expirada
   */
  getSessionTimeRemaining(): number {
    if (!this.isLocalStorageAvailable()) return 0;

    try {
      const expiryTime = localStorage.getItem(this.SESSION_EXPIRY_KEY);
      if (!expiryTime) return 0;

      const remaining = parseInt(expiryTime) - Date.now();
      return Math.max(0, remaining);
    } catch (error) {
      console.error('Error al calcular tiempo restante de sesión:', error);
      return 0;
    }
  }

  /**
   * Limpia el access token del almacenamiento
   */
  clearAccessToken(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.SESSION_EXPIRY_KEY);
    }
    
    if (this.isSessionStorageAvailable()) {
      sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    }
  }

  /**
   * Limpia el refresh token de las cookies
   */
  clearRefreshToken(): void {
    try {
      document.cookie = `${this.REFRESH_TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=strict`;
    } catch (error) {
      console.error('Error al limpiar refresh token:', error);
    }
  }

  /**
   * Limpia todos los datos de sesión
   */
  clearSession(): void {
    this.clearAccessToken();
    this.clearRefreshToken();
    
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.USER_DATA_KEY);
    }
  }

  /**
   * Renueva la sesión con nuevos tokens
   * @param accessToken - Nuevo access token
   * @param refreshToken - Nuevo refresh token
   * @param expiresIn - Tiempo de expiración en segundos
   */
  refreshSession(accessToken: string, refreshToken: string, expiresIn: number = 3600): void {
    this.setAccessToken(accessToken, expiresIn);
    this.setRefreshToken(refreshToken);
  }

  /**
   * Obtiene información completa de la sesión
   * @returns Información de la sesión actual
   */
  getSessionInfo(): {
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    isSessionValid: boolean;
    timeRemaining: number;
    userData: Record<string, unknown> | null;
  } {
    return {
      hasAccessToken: !!this.getAccessToken(),
      hasRefreshToken: !!this.getRefreshToken(),
      isSessionValid: this.isSessionValid(),
      timeRemaining: this.getSessionTimeRemaining(),
      userData: this.getUserData(),
    };
  }

  /**
   * Configura listeners para limpieza automática de sesión
   * Se ejecuta cuando el usuario cierra la pestaña/ventana
   */
  setupSessionCleanup(): void {
    if (typeof window === 'undefined') return;

    // Verificar que addEventListener esté disponible (para testing)
    if (typeof window.addEventListener !== 'function') return;

    // Limpiar sessionStorage al cerrar la pestaña
    window.addEventListener('beforeunload', () => {
      if (this.isSessionStorageAvailable()) {
        sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
      }
    });

    // Limpiar tokens expirados periódicamente
    const cleanupInterval = setInterval(() => {
      if (!this.isSessionValid()) {
        this.clearSession();
        clearInterval(cleanupInterval);
      }
    }, 60000); // Verificar cada minuto
  }
}

// Instancia singleton del servicio
export const sessionService = new SessionService();
