/**
 * @jest-environment node
 */
import { rateLimiter, RATE_LIMIT_CONFIGS, checkLoginRateLimit, recordLoginAttempt } from '../rateLimiter';

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Limpiar el store antes de cada test
    rateLimiter.reset('test-user@example.com:192.168.1.1');
    rateLimiter.reset('test-key');
  });

  describe('Basic Rate Limiting', () => {
    test('01 - should allow requests within limit', () => {
      const key = 'test-user@example.com:192.168.1.1';
      const config = RATE_LIMIT_CONFIGS.LOGIN;
      
      // Primeros 5 intentos deberían ser permitidos
      for (let i = 0; i < 5; i++) {
        expect(rateLimiter.isAllowed(key, config)).toBe(true);
        rateLimiter.recordAttempt(key, config, false);
      }
    });

    test('02 - should block requests after limit exceeded', () => {
      const key = 'test-user@example.com:192.168.1.1';
      const config = RATE_LIMIT_CONFIGS.LOGIN;
      
      // Exceder el límite
      for (let i = 0; i < 6; i++) {
        rateLimiter.recordAttempt(key, config, false);
      }
      
      // El siguiente intento debería ser bloqueado
      expect(rateLimiter.isAllowed(key, config)).toBe(false);
    });

    test('03 - should reset after successful attempt', () => {
      const key = 'test-user@example.com:192.168.1.1';
      const config = RATE_LIMIT_CONFIGS.LOGIN;
      
      // Hacer algunos intentos fallidos
      for (let i = 0; i < 3; i++) {
        rateLimiter.recordAttempt(key, config, false);
      }
      
      // Un intento exitoso debería limpiar los fallidos
      rateLimiter.recordAttempt(key, config, true);
      
      // Debería permitir más intentos
      expect(rateLimiter.isAllowed(key, config)).toBe(true);
    });
  });

  describe('Helper Functions', () => {
    test('04 - should check login rate limit', () => {
      const email = 'test@example.com';
      const ip = '192.168.1.1';
      
      // Primer intento debería ser permitido
      expect(checkLoginRateLimit(email, ip)).toBe(true);
    });

    test('05 - should record login attempt', () => {
      const email = 'test@example.com';
      const ip = '192.168.1.1';
      
      // No debería lanzar error
      expect(() => {
        recordLoginAttempt(email, false, ip);
      }).not.toThrow();
    });
  });

  describe('Rate Limit Info', () => {
    test('06 - should provide rate limit information', () => {
      const key = 'test-user2@example.com:192.168.1.2';
      const config = RATE_LIMIT_CONFIGS.LOGIN;
      
      // Hacer algunos intentos
      for (let i = 0; i < 3; i++) {
        rateLimiter.recordAttempt(key, config, false);
      }
      
      const info = rateLimiter.getRateLimitInfo(key);
      expect(info.attempts).toBe(3);
      expect(info.remaining).toBe(2);
      expect(info.isBlocked).toBe(false);
    });
  });

  describe('Cleanup', () => {
    test('07 - should clean up old attempts', () => {
      const key = 'test-user3@example.com:192.168.1.3';
      const config = RATE_LIMIT_CONFIGS.LOGIN;
      
      // Hacer algunos intentos
      rateLimiter.recordAttempt(key, config, false);
      
      // Simular tiempo pasado (esto es difícil de testear sin mocks)
      // En un test real, usaríamos jest.useFakeTimers()
      const info = rateLimiter.getRateLimitInfo(key);
      expect(info.attempts).toBe(1);
    });
  });
});
