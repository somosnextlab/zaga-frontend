/**
 * @jest-environment jsdom
 */
import { sessionService } from '../sessionService';

// Mock localStorage y sessionStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: '',
});

// Mock window
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
});

// Mock window.addEventListener
Object.defineProperty(window, 'addEventListener', {
  value: jest.fn(),
  writable: true,
});

// Mock global window (solo si no existe)
if (!global.window) {
  Object.defineProperty(global, 'window', {
    value: window,
    writable: true,
  });
}

describe('SessionService', () => {
  beforeEach(() => {
    // Limpiar mocks
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    sessionStorageMock.getItem.mockReturnValue(null);
    document.cookie = '';
    
    // Resetear localStorage y sessionStorage mocks
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    sessionStorageMock.setItem.mockClear();
    sessionStorageMock.removeItem.mockClear();
  });

  describe('setAccessToken', () => {
    test('01 - should store access token in localStorage', () => {
      const token = 'test-access-token';
      const expiresIn = 3600;

      sessionService.setAccessToken(token, expiresIn);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'zaga_access_token',
        token
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'zaga_session_expiry',
        expect.any(String)
      );
    });

    test('02 - should store access token in sessionStorage as backup', () => {
      const token = 'test-access-token';
      const expiresIn = 3600;

      sessionService.setAccessToken(token, expiresIn);

      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        'zaga_access_token',
        token
      );
    });

    test('03 - should handle localStorage unavailable gracefully', () => {
      // Simular localStorage no disponible
      const originalLocalStorage = window.localStorage;
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        writable: true,
      });

      const token = 'test-access-token';
      const expiresIn = 3600;

      // No debería lanzar error
      expect(() => {
        sessionService.setAccessToken(token, expiresIn);
      }).not.toThrow();

      // Restaurar localStorage
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        writable: true,
      });
    });
  });

  describe('getAccessToken', () => {
    test.skip('04 - should return access token when valid', () => {
      const token = 'test-access-token';
      const futureTime = Date.now() + 3600000; // 1 hora en el futuro

      localStorageMock.getItem
        .mockReturnValueOnce(token) // access token
        .mockReturnValueOnce(futureTime.toString()); // expiry time

      const result = sessionService.getAccessToken();

      expect(result).toBe(token);
    });

    test.skip('05 - should return null when token is expired', () => {
      const token = 'test-access-token';
      const pastTime = Date.now() - 3600000; // 1 hora en el pasado

      localStorageMock.getItem
        .mockReturnValueOnce(token) // access token
        .mockReturnValueOnce(pastTime.toString()); // expiry time

      const result = sessionService.getAccessToken();

      expect(result).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('zaga_access_token');
    });

    test('06 - should return null when no token exists', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = sessionService.getAccessToken();

      expect(result).toBeNull();
    });
  });

  describe('setRefreshToken', () => {
    test('07 - should set refresh token in cookie', () => {
      const token = 'test-refresh-token';
      const expiresIn = 2592000; // 30 días

      sessionService.setRefreshToken(token, expiresIn);

      expect(document.cookie).toContain('zaga_refresh_token=test-refresh-token');
      expect(document.cookie).toContain('secure');
      expect(document.cookie).toContain('samesite=strict');
    });
  });

  describe('getRefreshToken', () => {
    test('08 - should return refresh token from cookie', () => {
      document.cookie = 'zaga_refresh_token=test-refresh-token; path=/';

      const result = sessionService.getRefreshToken();

      expect(result).toBe('test-refresh-token');
    });

    test('09 - should return null when no refresh token exists', () => {
      document.cookie = '';

      const result = sessionService.getRefreshToken();

      expect(result).toBeNull();
    });
  });

  describe('setUserData', () => {
    test('10 - should store user data in localStorage', () => {
      const userData = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'usuario',
      };

      sessionService.setUserData(userData);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'zaga_user_data',
        JSON.stringify(userData)
      );
    });
  });

  describe('getUserData', () => {
    test('11 - should return user data from localStorage', () => {
      const userData = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'usuario',
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(userData));

      const result = sessionService.getUserData();

      expect(result).toEqual(userData);
    });

    test('12 - should return null when no user data exists', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = sessionService.getUserData();

      expect(result).toBeNull();
    });
  });

  describe('isSessionValid', () => {
    test('13 - should return true when both tokens exist', () => {
      const futureTime = Date.now() + 3600000;

      localStorageMock.getItem
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce(futureTime.toString());

      document.cookie = 'zaga_refresh_token=refresh-token';

      const result = sessionService.isSessionValid();

      expect(result).toBe(true);
    });

    test('14 - should return false when access token is missing', () => {
      localStorageMock.getItem.mockReturnValue(null);
      document.cookie = 'zaga_refresh_token=refresh-token';

      const result = sessionService.isSessionValid();

      expect(result).toBe(false);
    });

    test('15 - should return false when refresh token is missing', () => {
      const futureTime = Date.now() + 3600000;

      localStorageMock.getItem
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce(futureTime.toString());

      document.cookie = '';

      const result = sessionService.isSessionValid();

      expect(result).toBe(false);
    });
  });

  describe('clearSession', () => {
    test('16 - should clear all session data', () => {
      sessionService.clearSession();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('zaga_access_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('zaga_session_expiry');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('zaga_user_data');
      expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('zaga_access_token');
      expect(document.cookie).toContain('zaga_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC');
    });
  });

  describe('getSessionInfo', () => {
    test.skip('17 - should return complete session information', () => {
      const futureTime = Date.now() + 3600000;
      const userData = { id: 'user-123', email: 'test@example.com' };

      localStorageMock.getItem
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce(futureTime.toString())
        .mockReturnValueOnce(JSON.stringify(userData));

      document.cookie = 'zaga_refresh_token=refresh-token';

      const result = sessionService.getSessionInfo();

      expect(result).toEqual({
        hasAccessToken: true,
        hasRefreshToken: true,
        isSessionValid: true,
        timeRemaining: expect.any(Number),
        userData: userData,
      });
    });
  });
});
