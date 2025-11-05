/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignUpForm } from "../SignUpForm";
import { createClient } from "@/lib/supabase/client";
import { mockPush } from "@/__mocks__/next-navigation";
import { mockCredentials } from "@/__mocks__/test-data";

// Mock de Supabase client
jest.mock("@/lib/supabase/client", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/__mocks__/supabase-client");
});

// Mock de next/navigation
jest.mock("next/navigation", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/__mocks__/next-navigation");
});

describe("SignUpForm", () => {
  let mockSignUp: jest.Mock;
  let mockSupabaseClient: any;

  beforeEach(() => {
    mockSignUp = jest.fn();
    mockSupabaseClient = {
      auth: {
        signUp: mockSignUp,
      },
    };
    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);
    mockPush.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("01 - should render without crashing", () => {
    render(<SignUpForm />);
    expect(screen.getByText(/registrarme/i)).toBeInTheDocument();
  });

  test("02 - should render email input field", () => {
    render(<SignUpForm />);
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
  });

  test("03 - should render password input field", () => {
    render(<SignUpForm />);
    const passwordInput = document.getElementById("password");
    expect(passwordInput).toBeInTheDocument();
  });

  test("04 - should render repeat password input field", () => {
    render(<SignUpForm />);
    const repeatPasswordInput = document.getElementById("repeat-password");
    expect(repeatPasswordInput).toBeInTheDocument();
  });

  test("05 - should render submit button", () => {
    render(<SignUpForm />);
    const submitButton = screen.getByRole("button", {
      name: /registrarme/i,
    });
    expect(submitButton).toBeInTheDocument();
  });

  test("06 - should update email input value when typing", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;

    await user.type(emailInput, mockCredentials.email);

    expect(emailInput.value).toBe(mockCredentials.email);
  });

  test("07 - should update password input value when typing", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;

    await user.type(passwordInput, mockCredentials.password);

    expect(passwordInput.value).toBe(mockCredentials.password);
  });

  test("08 - should display error when passwords do not match", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;
    const repeatPasswordInput = document.getElementById(
      "repeat-password"
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", {
      name: /registrarme/i,
    });

    // Llenar el email también porque es requerido
    await user.type(emailInput, mockCredentials.email);
    await user.type(passwordInput, mockCredentials.password);
    await user.type(repeatPasswordInput, "differentpassword");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test("09 - should call signUp on form submit with correct credentials", async () => {
    const user = userEvent.setup();
    mockSignUp.mockResolvedValue({ data: { user: null }, error: null });

    render(<SignUpForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;
    const repeatPasswordInput = document.getElementById(
      "repeat-password"
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", {
      name: /registrarme/i,
    });

    await user.type(emailInput, mockCredentials.email);
    await user.type(passwordInput, mockCredentials.password);
    await user.type(repeatPasswordInput, mockCredentials.password);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: mockCredentials.email,
        password: mockCredentials.password,
        options: expect.objectContaining({
          emailRedirectTo: expect.stringMatching(/http:\/\/localhost(?::3000)?\/userDashboard/),
        }),
      });
    });
  });

  test("10 - should redirect to sign-up-success on successful signup", async () => {
    const user = userEvent.setup();
    mockSignUp.mockResolvedValue({ data: { user: null }, error: null });

    render(<SignUpForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;
    const repeatPasswordInput = document.getElementById(
      "repeat-password"
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", {
      name: /registrarme/i,
    });

    await user.type(emailInput, mockCredentials.email);
    await user.type(passwordInput, mockCredentials.password);
    await user.type(repeatPasswordInput, mockCredentials.password);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/auth/sign-up-success");
    });
  });

  test("11 - should display error message on signup failure", async () => {
    const user = userEvent.setup();
    const errorMessage = "Email already registered";
    mockSignUp.mockResolvedValue({
      data: null,
      error: new Error(errorMessage),
    });

    render(<SignUpForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;
    const repeatPasswordInput = document.getElementById(
      "repeat-password"
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", {
      name: /registrarme/i,
    });

    await user.type(emailInput, mockCredentials.email);
    await user.type(passwordInput, mockCredentials.password);
    await user.type(repeatPasswordInput, mockCredentials.password);
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test("12 - should disable submit button while loading", async () => {
    const user = userEvent.setup();
    mockSignUp.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ data: null, error: null }), 100)
        )
    );

    render(<SignUpForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;
    const repeatPasswordInput = document.getElementById(
      "repeat-password"
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", {
      name: /registrarme/i,
    });

    await user.type(emailInput, mockCredentials.email);
    await user.type(passwordInput, mockCredentials.password);
    await user.type(repeatPasswordInput, mockCredentials.password);
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/creando tu cuenta/i)).toBeInTheDocument();
    });
  });

  test("13 - should display link to login", () => {
    render(<SignUpForm />);
    const loginLink = screen.getByText(/iniciar sesión/i);
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest("a")).toHaveAttribute("href", "/auth/login");
  });
});

