/**
 * @jest-environment jsdom
 */

import {
  supabaseClient,
  getAccessToken,
  getCurrentUser,
  getUserRole,
} from '../supabaseClient';

// Mock de @supabase/ssr
jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(),
}));

import { createBrowserClient } from '@supabase/ssr';
const mockCreateBrowserClient = createBrowserClient as jest.MockedFunction<
  typeof createBrowserClient
>;

describe('Supabase Client', () => {
  const mockSupabaseClient = {
    auth: {
      getSession: jest.fn(),
      getUser: jest.fn(),
    },
  };

  beforeEach(() => {
    mockCreateBrowserClient.mockReturnValue(mockSupabaseClient);
    jest.clearAllMocks();
  });

  test('01 - should create browser client with correct config', () => {
    supabaseClient();

    expect(mockCreateBrowserClient).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  });

  test('02 - should get access token from session', async () => {
    const mockToken = 'mock-access-token';
    const mockSession = {
      access_token: mockToken,
    };

    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
    });

    const token = await getAccessToken();

    expect(token).toBe(mockToken);
    expect(mockSupabaseClient.auth.getSession).toHaveBeenCalled();
  });

  test('03 - should return null when no session', async () => {
    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: null },
    });

    const token = await getAccessToken();

    expect(token).toBeNull();
  });

  test('04 - should get current user', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
    };

    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
    });

    const user = await getCurrentUser();

    expect(user).toEqual(mockUser);
    expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled();
  });

  test('05 - should get user role from user_metadata', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'admin@example.com',
      user_metadata: {
        role: 'admin',
      },
    };

    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
    });

    const role = await getUserRole();

    expect(role).toBe('admin');
  });

  test('06 - should return null when user has no role', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'user@example.com',
      user_metadata: {},
    };

    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
    });

    const role = await getUserRole();

    expect(role).toBeNull();
  });

  test('07 - should return null when no user', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: null },
    });

    const role = await getUserRole();

    expect(role).toBeNull();
  });
});
