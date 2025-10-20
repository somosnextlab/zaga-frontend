/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { GET } from '../route';

// Mock de fetch global
const mockFetch = jest.fn();

describe('API - Usuarios Rol Usuarios', () => {
  beforeEach(() => {
    global.fetch = mockFetch as jest.MockedFunction<typeof fetch>;
    process.env.NEXT_PUBLIC_BACKEND_URL =
      'https://zaga-backend-production.up.railway.app';
  });

  afterEach(() => {
    mockFetch.mockClear();
  });

  test('01 - should return user role successfully', async () => {
    // Mock de respuesta exitosa del backend
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        role: 'cliente',
      }),
    });

    const request = new NextRequest(
      'http://localhost:3001/api/usuarios/rol-usuario',
      {
        headers: {
          authorization: 'Bearer valid-token',
        },
      }
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: true,
      role: 'cliente',
    });
    expect(mockFetch).toHaveBeenCalledWith(
      'https://zaga-backend-production.up.railway.app/usuarios/rol-usuario',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer valid-token',
          'Content-Type': 'application/json',
        },
      }
    );
  });

  test('02 - should return 401 when no authorization header', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/usuarios/rol-usuario'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({
      error: 'Token de autorización requerido',
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test('03 - should return 401 when authorization header is invalid', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/usuarios/rol-usuario',
      {
        headers: {
          authorization: 'Invalid token',
        },
      }
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({
      error: 'Token de autorización requerido',
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test('04 - should return 401 when backend returns 401', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    });

    const request = new NextRequest(
      'http://localhost:3000/api/usuarios/rol-usuario',
      {
        headers: {
          authorization: 'Bearer invalid-token',
        },
      }
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({
      error: 'Token de autorización inválido',
    });
  });

  test('05 - should return 404 when user not found', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const request = new NextRequest(
      'http://localhost:3000/api/usuarios/rol-usuario',
      {
        headers: {
          authorization: 'Bearer valid-token',
        },
      }
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({
      error: 'Usuario no encontrado',
    });
  });

  test('06 - should return 500 when backend returns invalid response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: false,
        // role missing
      }),
    });

    const request = new NextRequest(
      'http://localhost:3000/api/usuarios/rol-usuario',
      {
        headers: {
          authorization: 'Bearer valid-token',
        },
      }
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      error: 'Respuesta inválida del servidor',
    });
  });

  test('07 - should return 503 when backend is unreachable', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('fetch failed'));

    const request = new NextRequest(
      'http://localhost:3000/api/usuarios/rol-usuario',
      {
        headers: {
          authorization: 'Bearer valid-token',
        },
      }
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data).toEqual({
      error: 'Error de conexión con el servidor backend',
    });
  });

  test('08 - should return 500 when backend returns server error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const request = new NextRequest(
      'http://localhost:3000/api/usuarios/rol-usuario',
      {
        headers: {
          authorization: 'Bearer valid-token',
        },
      }
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      error: 'Error del servidor backend',
    });
  });

  test('09 - should handle different user roles', async () => {
    const roles = ['admin', 'cliente', 'usuario'];

    for (const role of roles) {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          role: role,
        }),
      });

      const request = new NextRequest(
        'http://localhost:3000/api/usuarios/rol-usuario',
        {
          headers: {
            authorization: 'Bearer valid-token',
          },
        }
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        role: role,
      });
    }
  });

  test('10 - should use default backend URL when not set', async () => {
    delete process.env.BACKEND_API_URL;

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        role: 'cliente',
      }),
    });

    const request = new NextRequest(
      'http://localhost:3000/api/usuarios/rol-usuario',
      {
        headers: {
          authorization: 'Bearer valid-token',
        },
      }
    );

    await GET(request);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://zaga-backend-production.up.railway.app/usuarios/rol-usuario',
      expect.any(Object)
    );
  });
});
