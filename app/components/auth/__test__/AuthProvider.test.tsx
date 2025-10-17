/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuthContext } from '../AuthProvider';
import { useAuth } from '../../../lib/hooks/useAuth';

// Mock del hook useAuth
const mockUseAuth = {
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: false,
  needsBackendRegistration: false,
  needsProfileCompletion: false,
  isAdmin: false,
  isCliente: false,
  isUsuario: false,
  canAccessDashboard: false,
  login: jest.fn(),
  register: jest.fn(),
  registerInBackend: jest.fn(),
  createProfile: jest.fn(),
  signOut: jest.fn(),
  updateUserMetadata: jest.fn(),
};

jest.mock('../../../lib/hooks/useAuth', () => ({
  useAuth: jest.fn(() => mockUseAuth),
}));

// Componente de prueba que usa el contexto
const TestComponent = () => {
  const auth = useAuthContext();
  return (
    <div>
      <div data-testid="is-authenticated">
        {auth.isAuthenticated.toString()}
      </div>
      <div data-testid="role">{auth.role || 'null'}</div>
      <div data-testid="is-admin">{auth.isAdmin.toString()}</div>
      <div data-testid="is-cliente">{auth.isCliente.toString()}</div>
      <div data-testid="is-usuario">{auth.isUsuario.toString()}</div>
      <div data-testid="can-access-dashboard">
        {auth.canAccessDashboard.toString()}
      </div>
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('01 - should provide auth context to children', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('role')).toHaveTextContent('null');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('false');
    expect(screen.getByTestId('is-cliente')).toHaveTextContent('false');
    expect(screen.getByTestId('is-usuario')).toHaveTextContent('false');
    expect(screen.getByTestId('can-access-dashboard')).toHaveTextContent(
      'false'
    );
  });

  test('02 - should provide authenticated user context', () => {
    const authenticatedAuth = {
      ...mockUseAuth,
      user: { id: '123', email: 'test@example.com' },
      role: 'usuario',
      isAuthenticated: true,
      isUsuario: true,
      canAccessDashboard: true,
    };

    (useAuth as jest.Mock).mockReturnValue(authenticatedAuth);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('role')).toHaveTextContent('usuario');
    expect(screen.getByTestId('is-usuario')).toHaveTextContent('true');
    expect(screen.getByTestId('can-access-dashboard')).toHaveTextContent(
      'true'
    );
  });

  test('03 - should provide admin user context', () => {
    const adminAuth = {
      ...mockUseAuth,
      user: { id: '123', email: 'admin@example.com' },
      role: 'admin',
      isAuthenticated: true,
      isAdmin: true,
      canAccessDashboard: true,
    };

    (useAuth as jest.Mock).mockReturnValue(adminAuth);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('role')).toHaveTextContent('admin');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('true');
    expect(screen.getByTestId('can-access-dashboard')).toHaveTextContent(
      'true'
    );
  });

  test('04 - should provide cliente user context', () => {
    const clienteAuth = {
      ...mockUseAuth,
      user: { id: '123', email: 'cliente@example.com' },
      role: 'cliente',
      isAuthenticated: true,
      isCliente: true,
      canAccessDashboard: true,
    };

    (useAuth as jest.Mock).mockReturnValue(clienteAuth);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('role')).toHaveTextContent('cliente');
    expect(screen.getByTestId('is-cliente')).toHaveTextContent('true');
    expect(screen.getByTestId('can-access-dashboard')).toHaveTextContent(
      'true'
    );
  });

  test('05 - should provide loading state context', () => {
    const loadingAuth = {
      ...mockUseAuth,
      isLoading: true,
      isInitializing: true,
    };

    (useAuth as jest.Mock).mockReturnValue(loadingAuth);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('can-access-dashboard')).toHaveTextContent(
      'false'
    );
  });

  test('06 - should provide needs backend registration context', () => {
    const needsBackendAuth = {
      ...mockUseAuth,
      user: { id: '123', email: 'test@example.com' },
      role: 'usuario',
      isAuthenticated: true,
      needsBackendRegistration: true,
      isUsuario: true,
    };

    (useAuth as jest.Mock).mockReturnValue(needsBackendAuth);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('role')).toHaveTextContent('usuario');
    expect(screen.getByTestId('is-usuario')).toHaveTextContent('true');
  });

  test('07 - should provide needs profile completion context', () => {
    const needsProfileAuth = {
      ...mockUseAuth,
      user: { id: '123', email: 'test@example.com' },
      role: 'usuario',
      isAuthenticated: true,
      needsProfileCompletion: true,
      isUsuario: true,
    };

    (useAuth as jest.Mock).mockReturnValue(needsProfileAuth);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('role')).toHaveTextContent('usuario');
    expect(screen.getByTestId('is-usuario')).toHaveTextContent('true');
  });
});

describe('useAuthContext', () => {
  test('08 - should throw error when used outside AuthProvider', () => {
    // Suprimir el error de consola para este test
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuthContext must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });

  test('09 - should provide all auth methods', () => {
    const authWithMethods = {
      ...mockUseAuth,
      login: jest.fn(),
      register: jest.fn(),
      registerInBackend: jest.fn(),
      createProfile: jest.fn(),
      signOut: jest.fn(),
      updateUserMetadata: jest.fn(),
    };

    (useAuth as jest.Mock).mockReturnValue(authWithMethods);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Verificar que el contexto se renderiza sin errores
    expect(screen.getByTestId('is-authenticated')).toBeInTheDocument();
  });
});
