/**
 * @jest-environment node
 */
import {
  checkLoginRateLimit,
  recordLoginAttempt,
  reset,
  clearRateLimitStore,
} from '../rateLimiter';

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Limpiar el store antes de cada test
    clearRateLimitStore();
  });

  describe('Basic Rate Limiting', () => {
    test('01 - should allow requests within limit', () => {
      const key = 'test-user@example.com:192.168.1.1';

      // Primeros 5 intentos deberían ser permitidos
      for (let i = 0; i < 5; i++) {
        expect(checkLoginRateLimit(key)).toBe(true);
        recordLoginAttempt(key, false);
      }
    });

    test('02 - should block requests after limit exceeded', () => {
      const key = 'test-user@example.com:192.168.1.1';

      // Exceder el límite
      for (let i = 0; i < 6; i++) {
        recordLoginAttempt(key, false);
      }

      // El siguiente intento debería ser bloqueado
      expect(checkLoginRateLimit(key)).toBe(false);
    });

    test('03 - should reset after successful attempt', () => {
      const key = 'test-user@example.com:192.168.1.1';

      // Exceder el límite
      for (let i = 0; i < 6; i++) {
        recordLoginAttempt(key, false);
      }

      // Un intento exitoso debería resetear el contador
      recordLoginAttempt(key, true);
      expect(checkLoginRateLimit(key)).toBe(true);
    });
  });

  describe('Helper Functions', () => {
    test('04 - should check login rate limit', () => {
      const key = 'test-key';
      expect(checkLoginRateLimit(key)).toBe(true);
    });

    test('05 - should record login attempt', () => {
      const key = 'test-key';
      recordLoginAttempt(key, false);
      expect(checkLoginRateLimit(key)).toBe(true);
    });
  });

  describe('Reset Function', () => {
    test('06 - should reset specific key', () => {
      const key = 'test-key';
      
      // Exceder el límite
      for (let i = 0; i < 6; i++) {
        recordLoginAttempt(key, false);
      }
      
      expect(checkLoginRateLimit(key)).toBe(false);
      
      // Resetear
      reset(key);
      expect(checkLoginRateLimit(key)).toBe(true);
    });
  });
});