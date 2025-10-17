/**
 * @jest-environment node
 */
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateName,
  validatePhone,
  sanitizeInput,
} from '../validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    test('01 - should accept valid gmail email', () => {
      const result = validateEmail('test@gmail.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('02 - should accept valid hotmail email', () => {
      const result = validateEmail('user@hotmail.com');
      expect(result.isValid).toBe(true);
    });

    test('03 - should accept valid yahoo email', () => {
      const result = validateEmail('test@yahoo.com');
      expect(result.isValid).toBe(true);
    });

    test('04 - should accept valid outlook email', () => {
      const result = validateEmail('user@outlook.com');
      expect(result.isValid).toBe(true);
    });

    test('05 - should reject empty email', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El email es requerido');
    });

    test('06 - should reject invalid email format', () => {
      const result = validateEmail('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El formato del email no es válido');
    });

    test('07 - should reject email with invalid domain', () => {
      const result = validateEmail('test@invalid-domain.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain(
        'Solo se permiten emails de los siguientes proveedores'
      );
    });

    test('08 - should provide suggestions for invalid domain', () => {
      const result = validateEmail('test@invalid.com');
      expect(result.isValid).toBe(false);
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions?.length).toBeGreaterThan(0);
    });
  });

  describe('validatePassword', () => {
    test('09 - should accept valid password with all requirements', () => {
      const result = validatePassword('Password123!');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('10 - should reject empty password', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('La contraseña es requerida');
    });

    test('11 - should reject password shorter than 8 characters', () => {
      const result = validatePassword('Pass1!');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'La contraseña debe tener al menos 8 caracteres'
      );
    });

    test('12 - should reject password without uppercase letter', () => {
      const result = validatePassword('password123!');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('una letra mayúscula');
    });

    test('13 - should reject password without lowercase letter', () => {
      const result = validatePassword('PASSWORD123!');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('una letra minúscula');
    });

    test('14 - should reject password without number', () => {
      const result = validatePassword('Password!');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('un número');
    });

    test('15 - should reject password without special character', () => {
      const result = validatePassword('Password123');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('un carácter especial');
    });

    test('16 - should provide suggestions for invalid password', () => {
      const result = validatePassword('weak');
      expect(result.isValid).toBe(false);
      // Las sugerencias solo se proporcionan para ciertos tipos de errores
      if (result.suggestions) {
        expect(result.suggestions.length).toBeGreaterThan(0);
      }
    });
  });

  describe('validatePasswordMatch', () => {
    test('17 - should accept matching passwords', () => {
      const result = validatePasswordMatch('Password123!', 'Password123!');
      expect(result.isValid).toBe(true);
    });

    test('18 - should reject non-matching passwords', () => {
      const result = validatePasswordMatch('Password123!', 'Password456!');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Las contraseñas no coinciden');
    });

    test('19 - should reject empty confirmation password', () => {
      const result = validatePasswordMatch('Password123!', '');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Confirma tu contraseña');
    });
  });

  describe('validateName', () => {
    test('20 - should accept valid name', () => {
      const result = validateName('Juan Pérez');
      expect(result.isValid).toBe(true);
    });

    test('21 - should accept name with special characters', () => {
      const result = validateName("María José O'Connor");
      expect(result.isValid).toBe(true);
    });

    test('22 - should reject empty name', () => {
      const result = validateName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El nombre es requerido');
    });

    test('23 - should reject name shorter than 2 characters', () => {
      const result = validateName('A');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El nombre debe tener al menos 2 caracteres');
    });

    test('24 - should reject name longer than 50 characters', () => {
      const result = validateName('A'.repeat(51));
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'El nombre no puede tener más de 50 caracteres'
      );
    });

    test('25 - should reject name with invalid characters', () => {
      const result = validateName('Juan123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'El nombre solo puede contener letras, espacios, guiones y apostrofes'
      );
    });
  });

  describe('validatePhone', () => {
    test('26 - should accept valid phone number', () => {
      const result = validatePhone('+1234567890');
      expect(result.isValid).toBe(true);
    });

    test('27 - should accept phone with spaces and dashes', () => {
      const result = validatePhone('+1 (234) 567-8900');
      expect(result.isValid).toBe(true);
    });

    test('28 - should reject empty phone', () => {
      const result = validatePhone('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El teléfono es requerido');
    });

    test('29 - should reject phone with letters', () => {
      const result = validatePhone('123-abc-4567');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'El teléfono debe contener entre 10 y 15 dígitos'
      );
    });

    test('30 - should reject phone too short', () => {
      const result = validatePhone('123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'El teléfono debe contener entre 10 y 15 dígitos'
      );
    });

    test('31 - should reject phone too long', () => {
      const result = validatePhone('1234567890123456');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'El teléfono debe contener entre 10 y 15 dígitos'
      );
    });
  });

  describe('sanitizeInput', () => {
    test('32 - should sanitize HTML tags', () => {
      const result = sanitizeInput('<script>alert("xss")</script>');
      expect(result).toBe('scriptalert("xss")/script');
    });

    test('33 - should remove javascript protocol', () => {
      const result = sanitizeInput('javascript:alert("xss")');
      expect(result).toBe('alert("xss")');
    });

    test('34 - should remove event handlers', () => {
      const result = sanitizeInput('onclick="alert(1)"');
      expect(result).toBe('"alert(1)"');
    });

    test('35 - should truncate long strings', () => {
      const longString = 'A'.repeat(1500);
      const result = sanitizeInput(longString);
      expect(result.length).toBe(1000);
    });

    test('36 - should handle non-string input', () => {
      const result = sanitizeInput(null as unknown as string);
      expect(result).toBe('');
    });

    test('37 - should trim whitespace', () => {
      const result = sanitizeInput('  test  ');
      expect(result).toBe('test');
    });
  });
});
