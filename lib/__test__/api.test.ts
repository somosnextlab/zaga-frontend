/**
 * @jest-environment node
 */

import { apiFetch, apiGet, apiPost, parseApiResponse } from '../api';

// Mock del módulo supabaseClient
jest.mock('../supabaseClient', () => ({
  getAccessToken: jest.fn(),
}));

import { getAccessToken } from '../supabaseClient';
const mockGetAccessToken = getAccessToken as jest.MockedFunction<
  typeof getAccessToken
>;

describe('API Wrapper', () => {
  beforeEach(() => {
    // Mock global fetch
    global.fetch = jest.fn();
    mockGetAccessToken.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('01 - should include authorization header when token is available', async () => {
    const mockToken = 'mock-jwt-token';
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    };

    mockGetAccessToken.mockResolvedValue(mockToken);
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await apiFetch('/test');

    expect(mockGetAccessToken).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken}`,
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  test('02 - should not include authorization header when token is null', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    };

    mockGetAccessToken.mockResolvedValue(null);
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await apiFetch('/test');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: expect.any(String),
        }),
      })
    );
  });

  test('03 - should redirect to login on 401 response', async () => {
    const mockResponse = { status: 401 };

    mockGetAccessToken.mockResolvedValue('mock-token');
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Mock window.location
    delete (window as unknown).location;
    (window as unknown).location = { href: '' };

    await expect(apiFetch('/test')).rejects.toThrow(
      'Unauthorized - redirecting to login'
    );
    expect(window.location.href).toBe('/auth/login');
  });

  test('04 - should parse API response correctly', async () => {
    const mockData = { success: true, data: 'test' };
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(mockData),
    };

    const result = await parseApiResponse(mockResponse);
    expect(result).toEqual(mockData);
  });

  test('05 - should throw error for non-ok response', async () => {
    const mockResponse = {
      ok: false,
      status: 400,
      text: () => Promise.resolve('Bad Request'),
    };

    await expect(parseApiResponse(mockResponse)).rejects.toThrow(
      'API Error 400: Bad Request'
    );
  });

  test('06 - should use correct HTTP methods for helper functions', async () => {
    const mockResponse = { ok: true, json: () => Promise.resolve({}) };
    mockGetAccessToken.mockResolvedValue('mock-token');
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await apiGet('/test');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'GET' })
    );

    await apiPost('/test', { data: 'test' });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ data: 'test' }),
      })
    );
  });
});
