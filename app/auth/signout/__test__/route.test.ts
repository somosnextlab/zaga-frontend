/**
 * @jest-environment node
 */

// Mock de Supabase
const mockSignOut = jest.fn().mockResolvedValue({ error: null });
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

// import { NextRequest } from 'next/server';
import { POST } from '../route';

describe('API - Signout', () => {
  beforeEach(() => {
    mockSignOut.mockClear();
    mockCookies.getAll.mockClear();
    mockCookies.set.mockClear();
  });

  test('01 - should sign out user successfully', async () => {
    mockSignOut.mockResolvedValue({ error: null });
    const response = await POST();

    expect(response.status).toBe(307);
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  test('02 - should redirect to home page after logout', async () => {
    mockSignOut.mockResolvedValue({ error: null });
    const response = await POST();
    const location = response.headers.get('location');

    expect(response.status).toBe(307);
    expect(location).toContain('/');
  });

  test('03 - should handle logout errors gracefully', async () => {
    mockSignOut.mockRejectedValue(new Error('Logout failed'));

    const response = await POST();
    const location = response.headers.get('location');

    expect(response.status).toBe(307);
    expect(location).toContain('/auth/login');
  });

  test('04 - should use correct origin for redirect', async () => {
    mockSignOut.mockResolvedValue({ error: null });

    // Simular entorno de producción
    const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    process.env.NEXT_PUBLIC_SITE_URL = 'https://zaga.com.ar';

    const response = await POST();
    const location = response.headers.get('location');

    expect(response.status).toBe(307);
    expect(location).toContain('https://zaga.com.ar');

    // Restaurar entorno original
    process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
  });
});
