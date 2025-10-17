/**
 * @jest-environment jsdom
 */
import { sessionService } from '../sessionService';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock sessionStorage
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

Object.defineProperty(window, 'addEventListener', {
  value: jest.fn(),
  writable: true,
});

describe('SessionService - Basic Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    sessionStorageMock.getItem.mockReturnValue(null);
    document.cookie = '';
  });

  describe('Token Management', () => {
    test('01 - should set access token', () => {
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

    test('02 - should get access token when valid', () => {
      const token = 'test-access-token';
      const futureTime = Date.now() + 3600000; // 1 hora en el futuro

      // Mock localStorage para que devuelva el token y el tiempo de expiración
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'zaga_access_token') return token;
        if (key === 'zaga_session_expiry') return futureTime.toString();
        return null;
      });

      const result = sessionService.getAccessToken();

      expect(result).toBe(token);
    });

    test('03 - should return null when token is expired', () => {
      const token = 'test-access-token';
      const pastTime = Date.now() - 3600000; // 1 hora en el pasado

      // Mock localStorage para que devuelva el token y el tiempo de expiración pasado
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'zaga_access_token') return token;
        if (key === 'zaga_session_expiry') return pastTime.toString();
        return null;
      });

      const result = sessionService.getAccessToken();

      expect(result).toBeNull();
    });
  });

  describe('Refresh Token Management', () => {
    test('04 - should set refresh token in cookie', () => {
      const token = 'test-refresh-token';
      const expiresIn = 2592000; // 30 días

      sessionService.setRefreshToken(token, expiresIn);

      expect(document.cookie).toContain('zaga_refresh_token=test-refresh-token');
      expect(document.cookie).toContain('secure');
      expect(document.cookie).toContain('samesite=strict');
    });

    test('05 - should get refresh token from cookie', () => {
      document.cookie = 'zaga_refresh_token=test-refresh-token; path=/';

      const result = sessionService.getRefreshToken();

      expect(result).toBe('test-refresh-token');
    });
  });

  describe('User Data Management', () => {
    test('06 - should set user data', () => {
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

    test('07 - should get user data', () => {
      const userData = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'usuario',
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(userData));

      const result = sessionService.getUserData();

      expect(result).toEqual(userData);
    });
  });

  describe('Session Validation', () => {
    test('08 - should validate session when both tokens exist', () => {
      const futureTime = Date.now() + 3600000;

      localStorageMock.getItem
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce(futureTime.toString());

      document.cookie = 'zaga_refresh_token=refresh-token';

      const result = sessionService.isSessionValid();

      expect(result).toBe(true);
    });

    test('09 - should return false when access token is missing', () => {
      localStorageMock.getItem.mockReturnValue(null);
      document.cookie = 'zaga_refresh_token=refresh-token';

      const result = sessionService.isSessionValid();

      expect(result).toBe(false);
    });
  });

  describe('Session Cleanup', () => {
    test('10 - should clear all session data', () => {
      sessionService.clearSession();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('zaga_access_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('zaga_session_expiry');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('zaga_user_data');
      expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('zaga_access_token');
      expect(document.cookie).toContain('zaga_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC');
    });
  });
});
