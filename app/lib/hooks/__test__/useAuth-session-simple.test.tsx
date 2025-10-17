/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { authService } from '../../services/authService';

// Mock del router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock de authService
jest.mock('../../services/authService', () => ({
  authService: {
    validateAndRefreshSession: jest.fn(),
    getAuthState: jest.fn(),
    onAuthStateChange: jest.fn(),
    refreshSession: jest.fn(),
  },
}));

// Mock de errorHandler
jest.mock('../../utils/errorHandler', () => ({
  errorHandler: {
    logError: jest.fn(),
    getUserMessage: jest.fn(() => 'Error de prueba'),
  },
  createAuthError: jest.fn(() => new Error('Error de prueba')),
}));

describe('useAuth - Session Persistence (Simplified)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    
    // Configurar mocks por defecto
    (authService.onAuthStateChange as jest.Mock).mockReturnValue({
      data: {
        subscription: {
          unsubscribe: jest.fn(),
        },
      },
    });
  });

  describe('Session Initialization', () => {
    test('01 - should initialize with valid session', async () => {
      const mockAuthState = {
        user: { id: 'user-123', email: 'test@example.com' },
        role: 'usuario',
        isAuthenticated: true,
        isLoading: false,
        isInitializing: false,
        needsBackendRegistration: false,
        needsProfileCompletion: false,
      };

      (authService.validateAndRefreshSession as jest.Mock).mockResolvedValue({
        isValid: true,
        needsRefresh: false,
      });

      (authService.getAuthState as jest.Mock).mockResolvedValue(mockAuthState);

      const { result } = renderHook(() => useAuth());

      // Esperar a que se complete la inicialización
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockAuthState.user);
      expect(result.current.role).toBe('usuario');
    });

    test('02 - should handle invalid session during initialization', async () => {
      (authService.validateAndRefreshSession as jest.Mock).mockResolvedValue({
        isValid: false,
        needsRefresh: false,
      });

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

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  describe('Session Refresh', () => {
    test('03 - should provide refreshSession method', () => {
      const { result } = renderHook(() => useAuth());

      expect(typeof result.current.refreshSession).toBe('function');
    });

    test('04 - should handle successful session refresh', async () => {
      const mockAuthState = {
        user: { id: 'user-123', email: 'test@example.com' },
        role: 'usuario',
        isAuthenticated: true,
        isLoading: false,
        isInitializing: false,
        needsBackendRegistration: false,
        needsProfileCompletion: false,
      };

      (authService.refreshSession as jest.Mock).mockResolvedValue({
        success: true,
      });

      (authService.getAuthState as jest.Mock).mockResolvedValue(mockAuthState);

      const { result } = renderHook(() => useAuth());

      let refreshResult;
      await act(async () => {
        refreshResult = await result.current.refreshSession();
      });

      expect(refreshResult.success).toBe(true);
      expect(authService.refreshSession).toHaveBeenCalled();
    });

    test('05 - should handle failed session refresh', async () => {
      (authService.refreshSession as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Token expirado',
      });

      const { result } = renderHook(() => useAuth());

      let refreshResult;
      await act(async () => {
        refreshResult = await result.current.refreshSession();
      });

      expect(refreshResult.success).toBe(false);
      expect(refreshResult.error).toBe('Token expirado');
    });
  });

  describe('Session State Management', () => {
    test('06 - should update state when session changes', async () => {
      const mockAuthState = {
        user: { id: 'user-123', email: 'test@example.com' },
        role: 'usuario',
        isAuthenticated: true,
        isLoading: false,
        isInitializing: false,
        needsBackendRegistration: false,
        needsProfileCompletion: false,
      };

      (authService.validateAndRefreshSession as jest.Mock).mockResolvedValue({
        isValid: true,
        needsRefresh: false,
      });

      (authService.getAuthState as jest.Mock).mockResolvedValue(mockAuthState);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockAuthState.user);
    });

    test('07 - should clear state when user signs out', async () => {
      (authService.validateAndRefreshSession as jest.Mock).mockResolvedValue({
        isValid: false,
        needsRefresh: false,
      });

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

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });
});
