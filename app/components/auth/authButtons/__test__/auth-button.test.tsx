/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen } from "@testing-library/react";
import { AuthButton } from "../AuthButton";
import { useAuth } from "@/app/hooks/useAuth";
import { UserProvider } from "@/app/context/UserContext/UserContextContext";
import { mockSimpleUser } from "@/__mocks__/test-data";

// Mock de useAuth
jest.mock("@/app/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

// Mock de LogoutButton
jest.mock("@/app/components/auth/logout/LogoutButton", () => ({
  LogoutButton: () => <button>Logout</button>,
}));

// Mock de next/navigation
jest.mock("next/navigation", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/__mocks__/next-navigation");
});

describe("AuthButton", () => {
  const mockUseAuth = useAuth as jest.Mock;

  beforeEach(() => {
    mockUseAuth.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProvider = () => {
    return render(
      <UserProvider>
        <AuthButton />
      </UserProvider>
    );
  };

  test("01 - should render without crashing", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    renderWithProvider();
    expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
  });

  test("02 - should render login and signup buttons when user is not authenticated", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    renderWithProvider();
    expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
    expect(screen.getByText(/registrarme/i)).toBeInTheDocument();
  });

  test("03 - should render disabled buttons when loading", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });
    renderWithProvider();
    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  test("04 - should render user email and logout button when user is authenticated", () => {
    mockUseAuth.mockReturnValue({ user: mockSimpleUser, loading: false });
    renderWithProvider();
    expect(screen.getByText(new RegExp(`Hola, ${mockSimpleUser.email}!`, "i"))).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  test("05 - should render login link with correct href", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    renderWithProvider();
    const loginLink = screen.getByText(/iniciar sesión/i).closest("a");
    expect(loginLink).toHaveAttribute("href", "/auth/login");
  });

  test("06 - should render signup link with correct href", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    renderWithProvider();
    const signupLink = screen.getByText(/registrarme/i).closest("a");
    expect(signupLink).toHaveAttribute("href", "/auth/sign-up");
  });
});

