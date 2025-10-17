/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor, act } from '@testing-library/react';
import { BackendRegistrationHandler } from '../BackendRegistrationHandler';
import { useAuth } from '../../../lib/hooks/useAuth';

// Mock del hook useAuth
jest.mock('../../../lib/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('BackendRegistrationHandler', () => {
  const mockRegisterInBackend = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth.mockReturnValue({
      needsBackendRegistration: true,
      registerInBackend: mockRegisterInBackend,
      isLoading: false,
      // Otros valores del hook que no necesitamos para estos tests
      user: null,
      role: null,
      isAuthenticated: false,
      isInitializing: false,
      needsProfileCompletion: false,
      login: jest.fn(),
      register: jest.fn(),
      createProfile: jest.fn(),
      signOut: jest.fn(),
    });
  });

  test('01 - should call registerInBackend only once when needsBackendRegistration is true', async () => {
    mockRegisterInBackend.mockResolvedValue({ success: true });

    render(
      <BackendRegistrationHandler
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    // Esperar a que se ejecute el registro
    await waitFor(() => {
      expect(mockRegisterInBackend).toHaveBeenCalledTimes(1);
    });

    // Verificar que se llamó onSuccess
    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
  });

  test('02 - should not call registerInBackend multiple times on re-renders', async () => {
    mockRegisterInBackend.mockResolvedValue({ success: true });

    const { rerender } = render(
      <BackendRegistrationHandler
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    // Esperar a que se ejecute el registro
    await waitFor(() => {
      expect(mockRegisterInBackend).toHaveBeenCalledTimes(1);
    });

    // Hacer re-render múltiples veces
    rerender(
      <BackendRegistrationHandler
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    rerender(
      <BackendRegistrationHandler
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    // Verificar que solo se llamó una vez
    expect(mockRegisterInBackend).toHaveBeenCalledTimes(1);
  });

  test('03 - should handle registration error and show retry button', async () => {
    mockRegisterInBackend.mockResolvedValue({
      success: false,
      error: 'Registration failed',
    });

    render(
      <BackendRegistrationHandler
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    // Esperar a que se ejecute el registro
    await waitFor(() => {
      expect(mockRegisterInBackend).toHaveBeenCalledTimes(1);
    });

    // Verificar que se muestra el error
    expect(screen.getByText('Error de Configuración')).toBeInTheDocument();
    expect(screen.getByText('Registration failed')).toBeInTheDocument();
    expect(screen.getByText('Reintentar')).toBeInTheDocument();

    // Verificar que se llamó onError
    expect(mockOnError).toHaveBeenCalledWith('Registration failed');
  });

  test('04 - should allow retry after error', async () => {
    mockRegisterInBackend
      .mockResolvedValueOnce({ success: false, error: 'First attempt failed' })
      .mockResolvedValueOnce({ success: true });

    render(
      <BackendRegistrationHandler
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    // Esperar al primer intento fallido
    await waitFor(() => {
      expect(mockRegisterInBackend).toHaveBeenCalledTimes(1);
    });

    // Hacer clic en reintentar
    const retryButton = screen.getByText('Reintentar');
    await act(async () => {
      retryButton.click();
    });

    // Esperar al segundo intento exitoso
    await waitFor(() => {
      expect(mockRegisterInBackend).toHaveBeenCalledTimes(2);
    });

    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
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
      login: jest.fn(),
      register: jest.fn(),
      createProfile: jest.fn(),
      signOut: jest.fn(),
    });

    const { container } = render(
      <BackendRegistrationHandler
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    expect(container.firstChild).toBeNull();
    expect(mockRegisterInBackend).not.toHaveBeenCalled();
  });
});
