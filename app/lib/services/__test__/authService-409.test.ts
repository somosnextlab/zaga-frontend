/**
 * @jest-environment node
 */
import { AuthService } from '../authService';

// Mock de las dependencias
jest.mock('../../supabase/client', () => ({
  supabaseClient: () => ({
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      getUser: jest.fn(),
      signOut: jest.fn(),
      updateUser: jest.fn(),
      onAuthStateChange: jest.fn(),
      setSession: jest.fn(),
      verifyOtp: jest.fn(),
    },
  }),
}));

jest.mock('../../../../lib/api', () => ({
  apiPost: jest.fn(),
  parseApiResponse: jest.fn(),
}));

describe('AuthService - Error 409 Handling', () => {
  let authService: AuthService;
  let mockApiPost: jest.Mock;
  let mockUpdateUserMetadata: jest.Mock;

  beforeEach(async () => {
    authService = new AuthService();
    const { apiPost } = await import('../../../../lib/api');
    mockApiPost = apiPost as jest.Mock;
    mockUpdateUserMetadata = jest.spyOn(
      authService as unknown as { updateUserMetadata: jest.Mock },
      'updateUserMetadata'
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('01 - should handle 409 error and mark user as registered', async () => {
    // Mock response 409 (usuario ya registrado)
    const mockResponse = {
      status: 409,
      ok: false,
    };
    mockApiPost.mockResolvedValue(mockResponse);

    // Mock user
    const mockUser = {
      id: 'test-user-id',
      user_metadata: {},
    } as const;

    // Ejecutar registerInBackend
    const result = await authService.registerInBackend(mockUser);

    // Verificar que se marcó como registrado
    expect(mockUpdateUserMetadata).toHaveBeenCalledWith({
      backend_registered: true,
    });
    expect(result).toEqual({ success: true });
  });

  test('02 - should not call updateUserMetadata for successful registration', async () => {
    // Mock response exitosa
    const mockResponse = {
      status: 200,
      ok: true,
    };
    mockApiPost.mockResolvedValue(mockResponse);

    const { parseApiResponse } = await import('../../../../lib/api');
    parseApiResponse.mockResolvedValue({ success: true });

    // Mock user
    const mockUser = {
      id: 'test-user-id',
      user_metadata: {},
    } as const;

    // Ejecutar registerInBackend
    const result = await authService.registerInBackend(mockUser);

    // Verificar que NO se llamó updateUserMetadata (se maneja en handleBackendRegistration)
    expect(mockUpdateUserMetadata).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  test('03 - should handle other errors without marking as registered', async () => {
    // Mock response de error con método text()
    const mockResponse = {
      status: 500,
      ok: false,
      text: jest.fn().mockResolvedValue('Internal Server Error'),
    };
    mockApiPost.mockResolvedValue(mockResponse);

    // Mock user
    const mockUser = {
      id: 'test-user-id',
      user_metadata: {},
    } as const;

    // Ejecutar registerInBackend
    const result = await authService.registerInBackend(mockUser);

    // Verificar que NO se marcó como registrado
    expect(mockUpdateUserMetadata).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
  });

  test('04 - should prevent loop when user is already registered', async () => {
    // Mock user que ya tiene backend_registered: true
    const mockUser = {
      id: 'test-user-id',
      user_metadata: { backend_registered: true },
    };

    // Ejecutar handleBackendRegistration
    const result = await (
      authService as unknown as {
        handleBackendRegistration: (user: unknown) => Promise<unknown>;
      }
    ).handleBackendRegistration(mockUser);

    // Verificar que no se intentó registrar en backend
    expect(mockApiPost).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });
});
