/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ForgotPasswordForm } from "../forgot-password-form";
import { createClient } from "@/lib/supabase/client";
import { mockCredentials } from "@/__mocks__/test-data";

// Mock de Supabase client
jest.mock("@/lib/supabase/client", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/__mocks__/supabase-client");
});

describe("ForgotPasswordForm", () => {
  let mockResetPasswordForEmail: jest.Mock;
  let mockSupabaseClient: any;

  beforeEach(() => {
    mockResetPasswordForEmail = jest.fn();
    mockSupabaseClient = {
      auth: {
        resetPasswordForEmail: mockResetPasswordForEmail,
      },
    };
    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("01 - should render without crashing", () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByText("Restablecer tu contraseña")).toBeInTheDocument();
  });

  test("02 - should render email input field", () => {
    render(<ForgotPasswordForm />);
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
  });

  test("03 - should render submit button", () => {
    render(<ForgotPasswordForm />);
    const submitButton = screen.getByRole("button", {
      name: /enviar link de restablecimiento/i,
    });
    expect(submitButton).toBeInTheDocument();
  });

  test("04 - should update email input value when typing", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;

    await user.type(emailInput, mockCredentials.email);

    expect(emailInput.value).toBe(mockCredentials.email);
  });

  test("05 - should call resetPasswordForEmail on form submit", async () => {
    const user = userEvent.setup();
    mockResetPasswordForEmail.mockResolvedValue({ error: null });

    render(<ForgotPasswordForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", {
      name: /enviar link de restablecimiento/i,
    });

    await user.type(emailInput, mockCredentials.email);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
        mockCredentials.email,
        expect.objectContaining({
          redirectTo: expect.stringMatching(
            /http:\/\/localhost(?::3000)?\/auth\/update-password/
          ),
        })
      );
    });
  });

  test("06 - should display success message on successful submission", async () => {
    const user = userEvent.setup();
    mockResetPasswordForEmail.mockResolvedValue({ error: null });

    render(<ForgotPasswordForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", {
      name: /enviar link de restablecimiento/i,
    });

    await user.type(emailInput, mockCredentials.email);
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/revisa tu email/i)).toBeInTheDocument();
      expect(
        screen.getByText(/instrucciones para restablecer tu contraseña/i)
      ).toBeInTheDocument();
    });
  });

  test("07 - should display error message on failure", async () => {
    const user = userEvent.setup();
    const errorMessage = "Email not found";
    mockResetPasswordForEmail.mockResolvedValue({
      error: new Error(errorMessage),
    });

    render(<ForgotPasswordForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", {
      name: /enviar link de restablecimiento/i,
    });

    await user.type(emailInput, mockCredentials.email);
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test("08 - should disable submit button while loading", async () => {
    const user = userEvent.setup();
    mockResetPasswordForEmail.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: null }), 100)
        )
    );

    render(<ForgotPasswordForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", {
      name: /enviar link de restablecimiento/i,
    });

    await user.type(emailInput, mockCredentials.email);
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/enviando/i)).toBeInTheDocument();
    });
  });

  test("09 - should display link to login", () => {
    render(<ForgotPasswordForm />);
    const loginLink = screen.getByText(/iniciar sesión/i);
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest("a")).toHaveAttribute("href", "/auth/login");
  });
});
