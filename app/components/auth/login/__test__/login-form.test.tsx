
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../LoginForm";
import { UserProvider } from "@/app/context/UserContext/UserContextContext";
import { createClient } from "@/lib/supabase/client";
import { fetchWithHeader } from "@/app/utils/apiCallUtils/apiUtils";
import { mockPush } from "@/__mocks__/next-navigation";
import {
  mockCredentials,
  mockSession,
  mockUserData,
  createMockFetchResponse,
} from "@/__mocks__/test-data";

// Mock de Supabase client
jest.mock("@/lib/supabase/client", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/__mocks__/supabase-client");
});

// Mock de API utils
jest.mock("@/app/utils/apiCallUtils/apiUtils", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/__mocks__/api-utils");
});

// Mock de next/navigation
jest.mock("next/navigation", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/__mocks__/next-navigation");
});

describe("LoginForm", () => {
  let mockSignInWithPassword: jest.Mock;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockSupabaseClient: any;

  beforeEach(() => {
    mockSignInWithPassword = jest.fn();
    mockSupabaseClient = {
      auth: {
        signInWithPassword: mockSignInWithPassword,
      },
    };
    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);
    (fetchWithHeader as jest.Mock).mockClear();
    mockPush.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProvider = () => {
    return render(
      <UserProvider>
        <LoginForm />
      </UserProvider>
    );
  };

  test("01 - should render without crashing", () => {
    renderWithProvider();
    expect(screen.getByText(/inicio de sesion/i)).toBeInTheDocument();
  });

  test("02 - should render email input field", () => {
    renderWithProvider();
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
  });

  test("03 - should render password input field", () => {
    renderWithProvider();
    const passwordInput = document.getElementById("password");
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("04 - should render submit button", () => {
    renderWithProvider();
    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });
    expect(submitButton).toBeInTheDocument();
  });

  test("05 - should update email input value when typing", async () => {
    const user = userEvent.setup();
    renderWithProvider();
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;

    await user.type(emailInput, mockCredentials.email);

    expect(emailInput.value).toBe(mockCredentials.email);
  });

  test("06 - should update password input value when typing", async () => {
    const user = userEvent.setup();
    renderWithProvider();
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;

    await user.type(passwordInput, mockCredentials.password);

    expect(passwordInput.value).toBe(mockCredentials.password);
  });

  test("07 - should call signInWithPassword on form submit with correct credentials", async () => {
    const user = userEvent.setup();

    mockSignInWithPassword.mockResolvedValue({
      data: mockSession,
      error: null,
    });

    (fetchWithHeader as jest.Mock).mockResolvedValue(
      createMockFetchResponse(mockUserData)
    );

    renderWithProvider();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    await user.type(emailInput, mockCredentials.email);
    await user.type(passwordInput, mockCredentials.password);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: mockCredentials.email,
        password: mockCredentials.password,
      });
    });
  });

  test("08 - should display error message on authentication failure", async () => {
    const user = userEvent.setup();
    const errorMessage = "Invalid credentials";
    mockSignInWithPassword.mockResolvedValue({
      data: null,
      error: new Error(errorMessage),
    });

    renderWithProvider();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    await user.type(emailInput, mockCredentials.email);
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    await waitFor(() => {
      // El componente captura el error y muestra el mensaje de error
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test("09 - should disable submit button while loading", async () => {
    const user = userEvent.setup();
    mockSignInWithPassword.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ data: null, error: null }), 100)
        )
    );

    renderWithProvider();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    await user.type(emailInput, mockCredentials.email);
    await user.type(passwordInput, mockCredentials.password);
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/iniciando sesión/i)).toBeInTheDocument();
    });
  });

  test("10 - should display link to forgot password", () => {
    renderWithProvider();
    const forgotPasswordLink = screen.getByText(/olvidaste tu contraseña/i);
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink.closest("a")).toHaveAttribute(
      "href",
      "/auth/forgot-password"
    );
  });

  test("11 - should display link to sign up", () => {
    renderWithProvider();
    const signUpLink = screen.getByText(/Regístrate/i);
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink.closest("a")).toHaveAttribute("href", "/auth/sign-up");
  });
});
