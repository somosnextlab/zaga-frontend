/**
 * @jest-environment jsdom
 */

import { AuthService } from '../authService';
import { apiPost, parseApiResponse } from '@/lib/api';
import { supabaseClient } from '@/app/lib/supabase/client';

// Obtener los mocks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockSupabase = supabaseClient() as any;
const mockApiPost = apiPost as jest.MockedFunction<typeof apiPost>;
const mockParseApiResponse = parseApiResponse as jest.MockedFunction<
  typeof parseApiResponse
>;

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('register', () => {
    test('01 - should register user successfully', async () => {
      const formData = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: { id: '123', email: 'test@example.com' } },
        error: null,
      });

      const result = await authService.register(formData);

      expect(result.success).toBe(true);
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: expect.stringContaining('/auth/verify-email'),
        },
      });
    });

    test('02 - should handle registration error', async () => {
      const formData = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: 'Email already registered' },
      });

      const result = await authService.register(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email already registered');
    });
  });

  describe('login', () => {
    test('03 - should login user successfully without backend registration', async () => {
      const formData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: '123',
        email: 'test@example.com',
        email_confirmed_at: '2023-01-01T00:00:00Z',
        user_metadata: { backend_registered: true },
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await authService.login(formData);

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
      expect(result.needsBackendRegistration).toBe(false);
    });

    test('04 - should handle unverified email', async () => {
      const formData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: '123',
        email: 'test@example.com',
        email_confirmed_at: null,
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await authService.login(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        'Por favor verifica tu email antes de continuar'
      );
    });

    test('05 - should register in backend when needed', async () => {
      const formData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: '123',
        email: 'test@example.com',
        email_confirmed_at: '2023-01-01T00:00:00Z',
        user_metadata: {},
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (mockApiPost as jest.Mock).mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({ success: true, message: 'Usuario registrado' }),
      });

      (mockParseApiResponse as jest.Mock).mockResolvedValue({
        success: true,
        message: 'Usuario registrado',
      });

      mockSupabase.auth.updateUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await authService.login(formData);

      expect(result.success).toBe(true);
      expect(mockApiPost).toHaveBeenCalledWith('/usuarios/registro-inicial');
      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
        data: { backend_registered: true },
      });
    });

    test('06 - should skip backend registration for admin users', async () => {
      const formData = {
        email: 'admin@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: '123',
        email: 'admin@example.com',
        email_confirmed_at: '2023-01-01T00:00:00Z',
        user_metadata: { role: 'admin', backend_registered: false },
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await authService.login(formData);

      expect(result.success).toBe(true);
      expect(mockApiPost).not.toHaveBeenCalled();
    });

    test('07 - should handle login error', async () => {
      const formData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials' },
      });

      const result = await authService.login(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });
  });

  describe('registerInBackend', () => {
    test('08 - should register user in backend successfully', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
      };

      (mockApiPost as jest.Mock).mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({ success: true, message: 'Usuario registrado' }),
      });

      (mockParseApiResponse as jest.Mock).mockResolvedValue({
        success: true,
        message: 'Usuario registrado',
      });

      const result = await authService.registerInBackend(mockUser);

      expect(result.success).toBe(true);
      expect(mockApiPost).toHaveBeenCalledWith('/usuarios/registro-inicial');
    });

    test('09 - should handle backend registration error', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
      };

      (mockApiPost as jest.Mock).mockRejectedValue(
        new Error('API Error 500: Internal Server Error')
      );

      const result = await authService.registerInBackend(mockUser);

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        'Error al registrar en el sistema: API Error 500: Internal Server Error'
      );
    });

    test('10 - should handle 409 conflict as success', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
      };

      // Mock una respuesta con status 409
      const mockResponse = {
        ok: false,
        status: 409,
        json: jest.fn().mockResolvedValue({ message: 'User already exists' }),
      };

      (mockApiPost as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.registerInBackend(mockUser);

      expect(result.success).toBe(true);
    });
  });

  describe('createProfile', () => {
    test('11 - should create profile successfully', async () => {
      const formData = {
        tipo_doc: 'DNI' as const,
        numero_doc: '12345678',
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'test@example.com',
        telefono: '+54911234567',
        fecha_nac: '1990-01-01',
      };

      (mockApiPost as jest.Mock).mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            message: 'Perfil creado',
            data: { persona_id: '456', cliente_id: '789' },
          }),
      });

      (mockParseApiResponse as jest.Mock).mockResolvedValue({
        success: true,
        message: 'Perfil creado',
        data: { persona_id: '456', cliente_id: '789' },
      });

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: '123' } },
        error: null,
      });

      mockSupabase.auth.updateUser.mockResolvedValue({
        data: { user: { id: '123' } },
        error: null,
      });

      const result = await authService.createProfile(formData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ persona_id: '456', cliente_id: '789' });
      expect(mockApiPost).toHaveBeenCalledWith(
        '/usuarios/crear-perfil',
        formData
      );
      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
        data: { profile_completed: true, role: 'cliente' },
      });
    });
  });

  describe('getCurrentUser', () => {
    test('12 - should get current user successfully', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        user_metadata: { role: 'usuario' },
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await authService.getCurrentUser();

      expect(result).toEqual(mockUser);
    });

    test('13 - should return null when no user', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('getAuthState', () => {
    test('14 - should get auth state for authenticated user', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        user_metadata: { role: 'usuario', backend_registered: true },
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await authService.getAuthState();

      expect(result.user).toEqual(mockUser);
      expect(result.role).toBe('usuario');
      expect(result.isAuthenticated).toBe(true);
      expect(result.needsBackendRegistration).toBe(false);
    });

    test('15 - should get auth state for unauthenticated user', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await authService.getAuthState();

      expect(result.user).toBeNull();
      expect(result.role).toBeNull();
      expect(result.isAuthenticated).toBe(false);
      expect(result.needsBackendRegistration).toBe(false);
    });

    test('16 - should detect needs backend registration', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        user_metadata: { role: 'usuario', backend_registered: false },
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await authService.getAuthState();

      expect(result.needsBackendRegistration).toBe(true);
    });

    test('17 - should skip backend registration for admin users', async () => {
      const mockUser = {
        id: '123',
        email: 'admin@example.com',
        user_metadata: { role: 'admin', backend_registered: false },
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await authService.getAuthState();

      expect(result.needsBackendRegistration).toBe(false);
    });
  });

  describe('signOut', () => {
    test('18 - should sign out successfully', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({
        error: null,
      });

      const result = await authService.signOut();

      expect(result.success).toBe(true);
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    });

    test('19 - should handle sign out error', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({
        error: { message: 'Sign out failed' },
      });

      const result = await authService.signOut();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Sign out failed');
    });
  });
});
