/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UpdatePasswordForm } from "../UpdatePasswordForm";
import { createClient } from "@/lib/supabase/client";
import { mockPush } from "@/__mocks__/next-navigation";
import { mockNewPassword } from "@/__mocks__/test-data";

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

describe("UpdatePasswordForm", () => {
  let mockUpdateUser: jest.Mock;
  let mockSupabaseClient: any;

  beforeEach(() => {
    mockUpdateUser = jest.fn();
    mockSupabaseClient = {
      auth: {
        updateUser: mockUpdateUser,
      },
    };
    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);
    mockPush.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("01 - should render without crashing", () => {
    render(<UpdatePasswordForm />);
    expect(screen.getByText(/restablecer tu contraseña/i)).toBeInTheDocument();
  });

  test("02 - should render password input field", () => {
    render(<UpdatePasswordForm />);
    const passwordInput = document.getElementById("password");
    expect(passwordInput).toBeInTheDocument();
  });

  test("03 - should render submit button", () => {
    render(<UpdatePasswordForm />);
    const submitButton = screen.getByRole("button", {
      name: /guardar nueva contraseña/i,
    });
    expect(submitButton).toBeInTheDocument();
  });

  test("04 - should update password input value when typing", async () => {
    const user = userEvent.setup();
    render(<UpdatePasswordForm />);
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;

    await user.type(passwordInput, mockNewPassword);

    expect(passwordInput.value).toBe(mockNewPassword);
  });

  test("05 - should call updateUser on form submit", async () => {
    const user = userEvent.setup();
    mockUpdateUser.mockResolvedValue({ error: null });

    render(<UpdatePasswordForm />);
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", {
      name: /guardar nueva contraseña/i,
    });

    await user.type(passwordInput, mockNewPassword);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({
        password: mockNewPassword,
      });
    });
  });

  test("06 - should redirect to userDashboard on successful update", async () => {
    const user = userEvent.setup();
    mockUpdateUser.mockResolvedValue({ error: null });

    render(<UpdatePasswordForm />);
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", {
      name: /guardar nueva contraseña/i,
    });

    await user.type(passwordInput, mockNewPassword);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/userDashboard");
    });
  });

  test("07 - should display error message on failure", async () => {
    const user = userEvent.setup();
    const errorMessage = "Password update failed";
    mockUpdateUser.mockResolvedValue({
      error: new Error(errorMessage),
    });

    render(<UpdatePasswordForm />);
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", {
      name: /guardar nueva contraseña/i,
    });

    await user.type(passwordInput, mockNewPassword);
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test("08 - should disable submit button while loading", async () => {
    const user = userEvent.setup();
    mockUpdateUser.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: null }), 100)
        )
    );

    render(<UpdatePasswordForm />);
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", {
      name: /guardar nueva contraseña/i,
    });

    await user.type(passwordInput, mockNewPassword);
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/guardando/i)).toBeInTheDocument();
    });
  });
});

