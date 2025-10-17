/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

// Mock del ConditionalAuthProvider
jest.mock('../ConditionalAuthProvider', () => ({
  ConditionalAuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuthContext: jest.fn(),
}));

// Mock de usePathname
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

// Mock del MobileMenu
jest.mock('../../MobileMenu', () => ({
  MobileMenu: ({ user, role }: { user: unknown; role: string | null }) => (
    <div data-testid="mobile-menu">
      Mobile Menu - User: {user ? 'logged' : 'not logged'}, Role: {role || 'none'}
    </div>
  ),
}));

describe('Header', () => {
  const mockUseAuthContext = jest.mocked(jest.requireMock('../ConditionalAuthProvider').useAuthContext);
  const mockUsePathname = jest.mocked(jest.requireMock('next/navigation').usePathname);
  
  const mockAuthContext = {
    user: null,
    role: null,
    signOut: jest.fn(),
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
    updateUserMetadata: jest.fn(),
    refreshSession: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthContext.mockReturnValue(mockAuthContext);
    mockUsePathname.mockReturnValue('/');
  });

  test('01 - should render without crashing', () => {
    render(<Header />);
    expect(screen.getByText('Zaga')).toBeInTheDocument();
  });

  test('02 - should show login and register buttons when user is not authenticated', () => {
    render(<Header />);
    
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
    expect(screen.getByText('Crear cuenta')).toBeInTheDocument();
    expect(screen.queryByText('Ir a dashboard')).not.toBeInTheDocument();
  });

  test('03 - should show dashboard button and hide auth buttons when user is authenticated as admin', () => {
    const adminContext = {
      ...mockAuthContext,
      user: { id: '1', email: 'admin@test.com' },
      role: 'admin',
      isAuthenticated: true,
    };

    mockUseAuthContext.mockReturnValue(adminContext);

    render(<Header />);
    
    expect(screen.getByText('Ir a dashboard')).toBeInTheDocument();
    expect(screen.getByText('Rol: admin')).toBeInTheDocument();
    expect(screen.getByText('Salir')).toBeInTheDocument();
    expect(screen.queryByText('Iniciar sesión')).not.toBeInTheDocument();
    expect(screen.queryByText('Crear cuenta')).not.toBeInTheDocument();
  });

  test('04 - should show dashboard button and hide auth buttons when user is authenticated as user', () => {
    const userContext = {
      ...mockAuthContext,
      user: { id: '1', email: 'user@test.com' },
      role: 'usuario',
      isAuthenticated: true,
    };

    mockUseAuthContext.mockReturnValue(userContext);

    render(<Header />);
    
    expect(screen.getByText('Ir a dashboard')).toBeInTheDocument();
    expect(screen.getByText('Rol: usuario')).toBeInTheDocument();
    expect(screen.getByText('Salir')).toBeInTheDocument();
    expect(screen.queryByText('Iniciar sesión')).not.toBeInTheDocument();
    expect(screen.queryByText('Crear cuenta')).not.toBeInTheDocument();
  });

  test('05 - should render mobile menu with correct props', () => {
    const userContext = {
      ...mockAuthContext,
      user: { id: '1', email: 'user@test.com' },
      role: 'admin',
      isAuthenticated: true,
    };

    mockUseAuthContext.mockReturnValue(userContext);

    render(<Header />);
    
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    expect(screen.getByText('Mobile Menu - User: logged, Role: admin')).toBeInTheDocument();
  });

  test('06 - should have correct dashboard link for admin role', () => {
    const adminContext = {
      ...mockAuthContext,
      user: { id: '1', email: 'admin@test.com' },
      role: 'admin',
      isAuthenticated: true,
    };

    mockUseAuthContext.mockReturnValue(adminContext);

    render(<Header />);
    
    const dashboardLink = screen.getByText('Ir a dashboard');
    expect(dashboardLink).toHaveAttribute('href', '/adminDashboard');
  });

  test('07 - should have correct dashboard link for user role', () => {
    const userContext = {
      ...mockAuthContext,
      user: { id: '1', email: 'user@test.com' },
      role: 'usuario',
      isAuthenticated: true,
    };

    mockUseAuthContext.mockReturnValue(userContext);

    render(<Header />);
    
    const dashboardLink = screen.getByText('Ir a dashboard');
    expect(dashboardLink).toHaveAttribute('href', '/userDashboard');
  });

  test('08 - should not show dashboard button when in dashboard page', () => {
    const adminContext = {
      ...mockAuthContext,
      user: { id: '1', email: 'admin@test.com' },
      role: 'admin',
      isAuthenticated: true,
    };

    mockUseAuthContext.mockReturnValue(adminContext);
    mockUsePathname.mockReturnValue('/adminDashboard');

    render(<Header />);
    
    expect(screen.queryByText('Ir a dashboard')).not.toBeInTheDocument();
    expect(screen.getByText('Rol: admin')).toBeInTheDocument();
    expect(screen.getByText('Salir')).toBeInTheDocument();
  });

  test('09 - should not show dashboard button when in user dashboard page', () => {
    const userContext = {
      ...mockAuthContext,
      user: { id: '1', email: 'user@test.com' },
      role: 'usuario',
      isAuthenticated: true,
    };

    mockUseAuthContext.mockReturnValue(userContext);
    mockUsePathname.mockReturnValue('/userDashboard');

    render(<Header />);
    
    expect(screen.queryByText('Ir a dashboard')).not.toBeInTheDocument();
    expect(screen.getByText('Rol: usuario')).toBeInTheDocument();
    expect(screen.getByText('Salir')).toBeInTheDocument();
  });

  test('10 - should show dashboard button only on landing page', () => {
    const adminContext = {
      ...mockAuthContext,
      user: { id: '1', email: 'admin@test.com' },
      role: 'admin',
      isAuthenticated: true,
    };

    mockUseAuthContext.mockReturnValue(adminContext);
    
    // Test en landing page
    mockUsePathname.mockReturnValue('/');
    const { rerender } = render(<Header />);
    expect(screen.getByText('Ir a dashboard')).toBeInTheDocument();
    
    // Test en otra página
    mockUsePathname.mockReturnValue('/auth/login');
    rerender(<Header />);
    expect(screen.queryByText('Ir a dashboard')).not.toBeInTheDocument();
  });
});
