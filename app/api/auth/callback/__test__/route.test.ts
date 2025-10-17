/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { GET, POST } from '../route';

// Mock de cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    getAll: jest.fn(() => []),
    set: jest.fn(),
  })),
}));

// Mock de Supabase
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => ({
    auth: {
      exchangeCodeForSession: jest.fn(),
      getUser: jest.fn(),
    },
  })),
}));

describe('API - Auth Callback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('01 - should redirect to verify-email with verified=true when code is valid', async () => {
    const mockSupabase = {
      auth: {
        exchangeCodeForSession: jest.fn().mockResolvedValue({ error: null }),
        getUser: jest.fn().mockResolvedValue({
          data: {
            user: {
              id: '123',
              email_confirmed_at: '2023-01-01T00:00:00Z',
            },
          },
        }),
      },
    };

    const { createServerClient } = await import('@supabase/ssr');
    (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

    const request = new NextRequest(
      'http://localhost:3000/api/auth/callback?code=test-code'
    );
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'http://localhost:3000/auth/verify-email?verified=true'
    );
  });

  test('02 - should redirect to verify-email with error when code exchange fails', async () => {
    const mockSupabase = {
      auth: {
        exchangeCodeForSession: jest.fn().mockResolvedValue({
          error: { message: 'Invalid code' },
        }),
      },
    };

    const { createServerClient } = await import('@supabase/ssr');
    (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

    const request = new NextRequest(
      'http://localhost:3000/api/auth/callback?code=invalid-code'
    );
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'http://localhost:3000/auth/verify-email?error=verification_failed'
    );
  });

  test('03 - should redirect to verify-email with error when no code provided', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/callback');
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'http://localhost:3000/auth/verify-email?error=verification_failed'
    );
  });

  test('04 - should handle POST requests by redirecting to GET', async () => {
    const mockSupabase = {
      auth: {
        exchangeCodeForSession: jest.fn().mockResolvedValue({ error: null }),
        getUser: jest.fn().mockResolvedValue({
          data: {
            user: {
              id: '123',
              email_confirmed_at: '2023-01-01T00:00:00Z',
            },
          },
        }),
      },
    };

    const { createServerClient } = await import('@supabase/ssr');
    (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

    const request = new NextRequest(
      'http://localhost:3000/api/auth/callback?code=test-code',
      {
        method: 'POST',
      }
    );
    const response = await POST(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'http://localhost:3000/auth/verify-email?verified=true'
    );
  });

  test('05 - should handle errors gracefully', async () => {
    const { createServerClient } = await import('@supabase/ssr');
    (createServerClient as jest.Mock).mockImplementation(() => {
      throw new Error('Supabase connection failed');
    });

    const request = new NextRequest(
      'http://localhost:3000/api/auth/callback?code=test-code'
    );
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'http://localhost:3000/auth/verify-email?error=verification_failed'
    );
  });
});
