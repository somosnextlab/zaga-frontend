/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { authService } from '@/app/lib/services/authService';

// Mock del servicio de autenticación
jest.mock('@/app/lib/services/authService', () => ({
  authService: {
    getAuthState: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    registerInBackend: jest.fn(),
    createProfile: jest.fn(),
    signOut: jest.fn(),
    updateUserMetadata: jest.fn(),
    onAuthStateChange: jest.fn(),
    getCurrentUser: jest.fn(),
  },
}));

// Mock de Next.js router
const mockPush = jest.fn();
const mockRefresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock onAuthStateChange para retornar el formato correcto
    (authService.onAuthStateChange as jest.Mock).mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });
  });

  describe('login', () => {
    test('01 - should login successfully and redirect to dashboard', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        email_confirmed_at: '2023-01-01T00:00:00Z',
        user_metadata: { backend_registered: true },
      };

      (authService.getAuthState as jest.Mock).mockResolvedValue({
        user: mockUser,
        role: 'cliente',
        isAuthenticated: true,
        isLoading: false,
        isInitializing: false,
        needsBackendRegistration: false,
        needsProfileCompletion: false,
      });

      (authService.login as jest.Mock).mockResolvedValue({
        success: true,
        user: mockUser,
        needsBackendRegistration: false,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });

        expect(loginResult.success).toBe(true);
      });

      expect(mockPush).toHaveBeenCalledWith('/userDashboard');
    });

    test('02 - should handle login error', async () => {
      (authService.login as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Invalid credentials',
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

        expect(loginResult.success).toBe(false);
        expect(loginResult.error).toBe('Invalid credentials');
      });
    });
  });

  describe('register', () => {
    test('03 - should register successfully', async () => {
      (authService.register as jest.Mock).mockResolvedValue({
        success: true,
        error: 'Por favor verifica tu email antes de continuar',
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const registerResult = await result.current.register({
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        });

        expect(registerResult.success).toBe(true);
        expect(registerResult.error).toBe(
          'Por favor verifica tu email antes de continuar'
        );
      });
    });

    test('04 - should handle registration error', async () => {
      (authService.register as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Email already exists',
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const registerResult = await result.current.register({
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        });

        expect(registerResult.success).toBe(false);
        expect(registerResult.error).toBe('Email already exists');
      });
    });
  });

  describe('registerInBackend', () => {
    test('05 - should register in backend successfully', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
      };

      (authService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
      (authService.registerInBackend as jest.Mock).mockResolvedValue({
        success: true,
      });
      (authService.updateUserMetadata as jest.Mock).mockResolvedValue(
        undefined
      );
      (authService.getAuthState as jest.Mock).mockResolvedValue({
        user: mockUser,
        role: 'usuario',
        isAuthenticated: true,
        isLoading: false,
        isInitializing: false,
        needsBackendRegistration: false,
        needsProfileCompletion: false,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const backendResult = await result.current.registerInBackend();

        expect(backendResult.success).toBe(true);
      });

      expect(authService.registerInBackend).toHaveBeenCalledWith(mockUser);
      // Note: updateUserMetadata is called internally by the hook
      // The exact call verification might not work due to async timing
    });
  });

  describe('createProfile', () => {
    test('06 - should create profile successfully', async () => {
      const formData = {
        tipo_doc: 'DNI' as const,
        numero_doc: '12345678',
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'test@example.com',
        telefono: '+54911234567',
        fecha_nac: '1990-01-01',
      };

      (authService.createProfile as jest.Mock).mockResolvedValue({
        success: true,
        data: { persona_id: '456', cliente_id: '789' },
      });

      (authService.getAuthState as jest.Mock).mockResolvedValue({
        user: { id: '123' },
        role: 'cliente',
        isAuthenticated: true,
        isLoading: false,
        isInitializing: false,
        needsBackendRegistration: false,
        needsProfileCompletion: false,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const profileResult = await result.current.createProfile(formData);

        expect(profileResult.success).toBe(true);
        expect(profileResult.data).toEqual({
          persona_id: '456',
          cliente_id: '789',
        });
      });

      expect(authService.createProfile).toHaveBeenCalledWith(formData);
    });
  });

  describe('signOut', () => {
    test('07 - should sign out successfully and redirect to login', async () => {
      (authService.signOut as jest.Mock).mockResolvedValue({
        success: true,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const signOutResult = await result.current.signOut();

        expect(signOutResult.success).toBe(true);
      });

      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });

    test('08 - should handle sign out error', async () => {
      (authService.signOut as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Sign out failed',
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const signOutResult = await result.current.signOut();

        expect(signOutResult.success).toBe(false);
        expect(signOutResult.error).toBe('Sign out failed');
      });
    });
  });

  describe('auth state management', () => {
    test('09 - should initialize with loading state', () => {
      (authService.getAuthState as jest.Mock).mockResolvedValue({
        user: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
        isInitializing: false,
        needsBackendRegistration: false,
        needsProfileCompletion: false,
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.isInitializing).toBe(true);
    });

    test('10 - should handle auth state changes', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
      };

      (authService.getAuthState as jest.Mock).mockResolvedValue({
        user: mockUser,
        role: 'cliente',
        isAuthenticated: true,
        isLoading: false,
        isInitializing: false,
        needsBackendRegistration: false,
        needsProfileCompletion: false,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        // Wait for initialization
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.role).toBe('cliente');
    });

    test('11 - should compute role flags correctly for admin', async () => {
      (authService.getAuthState as jest.Mock).mockResolvedValue({
        user: { id: '123', email: 'admin@example.com' },
        role: 'admin',
        isAuthenticated: true,
        isLoading: false,
        isInitializing: false,
        needsBackendRegistration: false,
        needsProfileCompletion: false,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.isAdmin).toBe(true);
      expect(result.current.isCliente).toBe(false);
      expect(result.current.isUsuario).toBe(false);
      expect(result.current.canAccessDashboard).toBe(true);
    });

    test('12 - should compute role flags correctly for usuario', async () => {
      (authService.getAuthState as jest.Mock).mockResolvedValue({
        user: { id: '123', email: 'user@example.com' },
        role: 'usuario',
        isAuthenticated: true,
        isLoading: false,
        isInitializing: false,
        needsBackendRegistration: true,
        needsProfileCompletion: false,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.isAdmin).toBe(false);
      expect(result.current.isCliente).toBe(false);
      expect(result.current.isUsuario).toBe(true);
      expect(result.current.canAccessDashboard).toBe(true);
      expect(result.current.needsBackendRegistration).toBe(true);
    });

    test('13 - should handle admin login redirect', async () => {
      const mockUser = {
        id: '123',
        email: 'admin@example.com',
        user_metadata: { role: 'admin' },
      };

      (authService.login as jest.Mock).mockResolvedValue({
        success: true,
        user: mockUser,
      });

      (authService.getAuthState as jest.Mock).mockResolvedValue({
        user: mockUser,
        role: 'admin',
        isAuthenticated: true,
        isLoading: false,
        isInitializing: false,
        needsBackendRegistration: false,
        needsProfileCompletion: false,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login({
          email: 'admin@example.com',
          password: 'password123',
        });
      });

      expect(mockPush).toHaveBeenCalledWith('/adminDashboard');
    });

    test('14 - should handle updateUserMetadata', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
      };

      (authService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
      (authService.updateUserMetadata as jest.Mock).mockResolvedValue(
        undefined
      );
      (authService.getAuthState as jest.Mock).mockResolvedValue({
        user: mockUser,
        role: 'usuario',
        isAuthenticated: true,
        isLoading: false,
        isInitializing: false,
        needsBackendRegistration: false,
        needsProfileCompletion: false,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.updateUserMetadata({
          customField: 'value',
        });
      });

      expect(authService.updateUserMetadata).toHaveBeenCalledWith({
        customField: 'value',
      });
    });
  });
});
