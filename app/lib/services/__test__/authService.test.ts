/**
 * @jest-environment node
 */
import { AuthService } from '../authService';

// Mock de las dependencias
jest.mock('../../supabase/client', () => ({
  supabaseClient: () => ({
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      getUser: jest.fn(),
      signOut: jest.fn(),
      updateUser: jest.fn(),
      onAuthStateChange: jest.fn(),
      setSession: jest.fn(),
      verifyOtp: jest.fn(),
    },
  }),
}));

jest.mock('../../../../lib/api', () => ({
  apiPost: jest.fn(),
  parseApiResponse: jest.fn(),
}));

describe('AuthService - URL Configuration', () => {
  beforeEach(() => {
    // Limpiar variables de entorno
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('01 - should use NEXT_PUBLIC_SITE_URL when available', () => {
    // Configurar variable de entorno
    process.env.NEXT_PUBLIC_SITE_URL = 'https://zaga.com.ar';

    // Crear una nueva instancia para que tome la variable de entorno
    const newAuthService = new AuthService();
    
    // Acceder al método privado usando reflection
    const getBaseUrl = (newAuthService as unknown as { getBaseUrl: () => string }).getBaseUrl.bind(newAuthService);
    
    expect(getBaseUrl()).toBe('https://zaga.com.ar');
  });

  test('02 - should fallback to localhost when NEXT_PUBLIC_SITE_URL is not set', () => {
    // Asegurar que la variable no esté configurada
    delete process.env.NEXT_PUBLIC_SITE_URL;

    // Mock window para simular entorno de servidor
    const originalWindow = global.window;
    delete (global as unknown as { window: unknown }).window;

    const newAuthService = new AuthService();
    const getBaseUrl = (newAuthService as unknown as { getBaseUrl: () => string }).getBaseUrl.bind(newAuthService);
    
    expect(getBaseUrl()).toBe('http://localhost:3000');

    // Restaurar window
    global.window = originalWindow;
  });

  test('03 - should use window.location.origin in browser environment', () => {
    // Mock window para simular entorno de navegador
    const mockWindow = {
      location: {
        origin: 'https://test.example.com'
      }
    };
    
    // Guardar window original
    const originalWindow = global.window;
    (global as unknown as { window: unknown }).window = mockWindow;

    const newAuthService = new AuthService();
    const getBaseUrl = (newAuthService as unknown as { getBaseUrl: () => string }).getBaseUrl.bind(newAuthService);
    
    expect(getBaseUrl()).toBe('https://test.example.com');

    // Restaurar window original
    global.window = originalWindow;
  });

  test('04 - should prioritize NEXT_PUBLIC_SITE_URL over window.location.origin', () => {
    // Configurar variable de entorno
    process.env.NEXT_PUBLIC_SITE_URL = 'https://production.example.com';

    // Mock window para simular entorno de navegador
    const mockWindow = {
      location: {
        origin: 'https://test.example.com'
      }
    };
    
    // Guardar window original
    const originalWindow = global.window;
    (global as unknown as { window: unknown }).window = mockWindow;

    const newAuthService = new AuthService();
    const getBaseUrl = (newAuthService as unknown as { getBaseUrl: () => string }).getBaseUrl.bind(newAuthService);
    
    // Debe priorizar la variable de entorno
    expect(getBaseUrl()).toBe('https://production.example.com');

    // Restaurar window original
    global.window = originalWindow;
  });
});