/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react';
import { BackendRegistrationHandler } from '../BackendRegistrationHandler';
import { useAuth } from '@/app/lib/hooks/useAuth';

// Mock del hook useAuth
jest.mock('@/app/lib/hooks/useAuth');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('BackendRegistrationHandler - Simple Tests', () => {
  const mockRegisterInBackend = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      needsBackendRegistration: true,
      registerInBackend: mockRegisterInBackend,
      isLoading: false,
      user: null,
      role: null,
      isAuthenticated: false,
      isInitializing: false,
      needsProfileCompletion: false,
      isAdmin: false,
      isCliente: false,
      isUsuario: false,
      canAccessDashboard: false,
      login: jest.fn(),
      register: jest.fn(),
      createProfile: jest.fn(),
      signOut: jest.fn(),
      updateUserMetadata: jest.fn(),
    });
  });

  test('01 - should render loading state initially', () => {
    mockRegisterInBackend.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <BackendRegistrationHandler
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    expect(screen.getByText('Configurando tu cuenta...')).toBeInTheDocument();
    expect(
      screen.getByText('Estamos configurando tu cuenta en el sistema')
    ).toBeInTheDocument();
  });

  test('02 - should call registerInBackend on mount', async () => {
    mockRegisterInBackend.mockResolvedValue({ success: true });

    render(
      <BackendRegistrationHandler
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    await waitFor(() => {
      expect(mockRegisterInBackend).toHaveBeenCalledTimes(1);
    });
  });

  test('03 - should call onSuccess when registration succeeds', async () => {
    mockRegisterInBackend.mockResolvedValue({ success: true });

    render(
      <BackendRegistrationHandler
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });
  });

  test('04 - should show retry state when registration fails', async () => {
    const errorMessage = 'Error del servidor. Por favor, inténtalo más tarde.';
    mockRegisterInBackend.mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    render(
      <BackendRegistrationHandler
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    // Esperar a que se muestre el estado de reintento
    await waitFor(() => {
      expect(screen.getByText('Reintentando... (1/3)')).toBeInTheDocument();
    });

    // El onError se llama después de agotar todos los reintentos, no inmediatamente
    // Por ahora solo verificamos que se muestre el estado de reintento
    expect(
      screen.getByText(
        'Estamos reintentando configurar tu cuenta automáticamente'
      )
    ).toBeInTheDocument();
  });

  test('05 - should not render when needsBackendRegistration is false', () => {
    mockUseAuth.mockReturnValue({
      needsBackendRegistration: false,
      registerInBackend: mockRegisterInBackend,
      isLoading: false,
      user: null,
      role: null,
      isAuthenticated: false,
      isInitializing: false,
      needsProfileCompletion: false,
      isAdmin: false,
      isCliente: false,
      isUsuario: false,
      canAccessDashboard: false,
      login: jest.fn(),
      register: jest.fn(),
      createProfile: jest.fn(),
      signOut: jest.fn(),
      updateUserMetadata: jest.fn(),
    });

    const { container } = render(
      <BackendRegistrationHandler
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test('06 - should handle network errors with retry', async () => {
    mockRegisterInBackend
      .mockRejectedValueOnce(new Error('fetch failed'))
      .mockResolvedValueOnce({ success: true });

    render(
      <BackendRegistrationHandler
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    // Primera llamada falla con error de red
    await waitFor(() => {
      expect(mockRegisterInBackend).toHaveBeenCalledTimes(1);
    });

    // Debe mostrar estado de reintento
    await waitFor(() => {
      expect(screen.getByText('Reintentando... (1/3)')).toBeInTheDocument();
    });
  });
});
