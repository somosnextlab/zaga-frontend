/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { POST } from '../route';

// Mock de Supabase
const mockSignOut = jest.fn();
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => ({
    auth: {
      signOut: mockSignOut,
    },
  })),
}));

// Mock de cookies
const mockCookies = {
  getAll: jest.fn(() => []),
  set: jest.fn(),
};
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => mockCookies),
}));

describe('API - Signout', () => {
  beforeEach(() => {
    mockSignOut.mockClear();
    mockCookies.getAll.mockClear();
    mockCookies.set.mockClear();
  });

  test('01 - should sign out user successfully', async () => {
    mockSignOut.mockResolvedValue({ error: null });

    const request = new NextRequest('http://localhost:3000/auth/signout', {
      method: 'POST',
    });

    const response = await POST(request);

    expect(response.status).toBe(302);
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  test('02 - should redirect to home page after logout', async () => {
    mockSignOut.mockResolvedValue({ error: null });

    const request = new NextRequest('http://localhost:3000/auth/signout', {
      method: 'POST',
    });

    const response = await POST(request);
    const location = response.headers.get('location');

    expect(response.status).toBe(302);
    expect(location).toContain('/');
  });

  test('03 - should handle logout errors gracefully', async () => {
    mockSignOut.mockRejectedValue(new Error('Logout failed'));

    const request = new NextRequest('http://localhost:3000/auth/signout', {
      method: 'POST',
    });

    const response = await POST(request);
    const location = response.headers.get('location');

    expect(response.status).toBe(302);
    expect(location).toContain('/auth/login');
  });

  test('04 - should use correct origin for redirect', async () => {
    mockSignOut.mockResolvedValue({ error: null });

    // Simular entorno de producción
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const request = new NextRequest('http://localhost:3000/auth/signout', {
      method: 'POST',
    });

    const response = await POST(request);
    const location = response.headers.get('location');

    expect(response.status).toBe(302);
    expect(location).toContain('https://zaga.com.ar');

    // Restaurar entorno original
    process.env.NODE_ENV = originalEnv;
  });
});
