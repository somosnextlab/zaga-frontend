/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { AuthGuard } from '../AuthGuard';
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

// Mock de Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock del BackendRegistrationHandler
jest.mock('../BackendRegistrationHandler', () => ({
  BackendRegistrationHandler: ({
    onSuccess,
    onError,
  }: {
    onSuccess: () => void;
    onError: (error: string) => void;
  }) => (
    <div data-testid="backend-registration-handler">
      <button onClick={() => onSuccess()}>Success</button>
      <button onClick={() => onError('Test error')}>Error</button>
    </div>
  ),
}));

const TestChildren = () => (
  <div data-testid="protected-content">Protected Content</div>
);

describe('AuthGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('public routes', () => {
    test('01 - should render children when requireAuth is false', () => {
      (useAuth as jest.Mock).mockReturnValue({
        ...mockUseAuth,
        isInitializing: false,
      });

      render(
        <AuthGuard requireAuth={false}>
          <TestChildren />
        </AuthGuard>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  describe('loading states', () => {
    test('02 - should show loading spinner when initializing', () => {
      (useAuth as jest.Mock).mockReturnValue({
        ...mockUseAuth,
        isInitializing: true,
        isLoading: false,
      });

      render(
        <AuthGuard>
          <TestChildren />
        </AuthGuard>
      );

      expect(screen.getByText('Cargando...')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    test('03 - should show loading spinner when loading', () => {
      (useAuth as jest.Mock).mockReturnValue({
        ...mockUseAuth,
        isInitializing: false,
        isLoading: true,
      });

      render(
        <AuthGuard>
          <TestChildren />
        </AuthGuard>
      );

      expect(screen.getByText('Cargando...')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('unauthenticated users', () => {
    test('04 - should redirect to login when not authenticated', () => {
      (useAuth as jest.Mock).mockReturnValue({
        ...mockUseAuth,
        isInitializing: false,
        isLoading: false,
        isAuthenticated: false,
      });

      render(
        <AuthGuard>
          <TestChildren />
        </AuthGuard>
      );

      expect(mockPush).toHaveBeenCalledWith('/auth/login');
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('role-based access', () => {
    test('05 - should redirect admin to admin dashboard when wrong role required', () => {
      (useAuth as jest.Mock).mockReturnValue({
        ...mockUseAuth,
        isInitializing: false,
        isLoading: false,
        isAuthenticated: true,
        role: 'admin',
        isAdmin: true,
      });

      render(
        <AuthGuard requireRole="usuario">
          <TestChildren />
        </AuthGuard>
      );

      expect(mockPush).toHaveBeenCalledWith('/adminDashboard');
    });

    test('06 - should redirect usuario to user dashboard when admin role required', () => {
      (useAuth as jest.Mock).mockReturnValue({
        ...mockUseAuth,
        isInitializing: false,
        isLoading: false,
        isAuthenticated: true,
        role: 'usuario',
        isUsuario: true,
      });

      render(
        <AuthGuard requireRole="admin">
          <TestChildren />
        </AuthGuard>
      );

      expect(mockPush).toHaveBeenCalledWith('/userDashboard');
    });

    test('07 - should allow access when correct role is provided', () => {
      (useAuth as jest.Mock).mockReturnValue({
        ...mockUseAuth,
        isInitializing: false,
        isLoading: false,
        isAuthenticated: true,
        role: 'usuario',
        isUsuario: true,
      });

      render(
        <AuthGuard requireRole="usuario">
          <TestChildren />
        </AuthGuard>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  describe('backend registration', () => {
    test('08 - should show backend registration handler when needed', () => {
      (useAuth as jest.Mock).mockReturnValue({
        ...mockUseAuth,
        isInitializing: false,
        isLoading: false,
        isAuthenticated: true,
        role: 'usuario',
        needsBackendRegistration: true,
      });

      render(
        <AuthGuard>
          <TestChildren />
        </AuthGuard>
      );

      expect(
        screen.getByTestId('backend-registration-handler')
      ).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    test('09 - should render children when backend registration not needed', () => {
      (useAuth as jest.Mock).mockReturnValue({
        ...mockUseAuth,
        isInitializing: false,
        isLoading: false,
        isAuthenticated: true,
        role: 'usuario',
        needsBackendRegistration: false,
        needsProfileCompletion: false,
      });

      render(
        <AuthGuard>
          <TestChildren />
        </AuthGuard>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  describe('profile completion', () => {
    test('10 - should allow access when profile completion needed', () => {
      (useAuth as jest.Mock).mockReturnValue({
        ...mockUseAuth,
        isInitializing: false,
        isLoading: false,
        isAuthenticated: true,
        role: 'usuario',
        needsBackendRegistration: false,
        needsProfileCompletion: true,
      });

      render(
        <AuthGuard>
          <TestChildren />
        </AuthGuard>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  describe('successful authentication', () => {
    test('11 - should render children for authenticated user', () => {
      (useAuth as jest.Mock).mockReturnValue({
        ...mockUseAuth,
        isInitializing: false,
        isLoading: false,
        isAuthenticated: true,
        role: 'cliente',
        needsBackendRegistration: false,
        needsProfileCompletion: false,
      });

      render(
        <AuthGuard>
          <TestChildren />
        </AuthGuard>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    test('12 - should render children for admin user', () => {
      (useAuth as jest.Mock).mockReturnValue({
        ...mockUseAuth,
        isInitializing: false,
        isLoading: false,
        isAuthenticated: true,
        role: 'admin',
        isAdmin: true,
        needsBackendRegistration: false,
        needsProfileCompletion: false,
      });

      render(
        <AuthGuard>
          <TestChildren />
        </AuthGuard>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });
});
