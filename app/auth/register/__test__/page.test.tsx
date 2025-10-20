/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useAuthActions } from '@/lib/auth/hooks/useAuthActions';
import RegisterPage from '../page';

// Mock de Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock del hook de autenticación
jest.mock('@/lib/auth/hooks/useAuthActions');
const mockUseAuthActions = useAuthActions as jest.MockedFunction<
  typeof useAuthActions
>;

// Mock de la utilidad de autofill
jest.mock('@/lib/utils/autofillFix', () => ({
  initializeAutofillFix: jest.fn(),
  applyAutofillFix: jest.fn(),
}));

describe('RegisterPage', () => {
  const mockRegister = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    mockUseAuthActions.mockReturnValue({
      login: jest.fn(),
      register: mockRegister,
      logout: jest.fn(),
    });
    mockRegister.mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('01 - should render register form without crashing', () => {
    render(<RegisterPage />);

    expect(
      screen.getByRole('heading', { name: 'Crear Cuenta' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar Contraseña')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Crear Cuenta' })
    ).toBeInTheDocument();
  });

  test('02 - should handle form submission with matching passwords', async () => {
    render(<RegisterPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Contraseña');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Contraseña');
    const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' });

    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Password123!' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: 'test@gmail.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });
    });
  });

  test('03 - should show loading state during submission', async () => {
    mockRegister.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<RegisterPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Contraseña');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Contraseña');
    const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' });

    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Password123!' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Creando cuenta...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  test('04 - should display error message on registration failure', async () => {
    mockRegister.mockResolvedValue({
      success: false,
      error: 'El email ya está registrado',
    });

    render(<RegisterPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Contraseña');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Contraseña');
    const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' });

    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Password123!' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('El email ya está registrado')
      ).toBeInTheDocument();
    });
  });

  test('05 - should redirect to login on successful registration', async () => {
    mockRegister.mockResolvedValue({ success: true });

    render(<RegisterPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Contraseña');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Contraseña');
    const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' });

    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Password123!' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });
  });
});
