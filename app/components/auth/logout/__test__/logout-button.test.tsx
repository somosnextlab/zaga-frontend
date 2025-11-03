/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LogoutButton } from "../logout-button";
import { UserContextProvider } from "@/app/context/UserContext/UserContextContext";
import { createClient } from "@/lib/supabase/client";

// Mock de Supabase client
jest.mock("@/lib/supabase/client", () => ({
  createClient: jest.fn(),
}));

// Mock de useRouter
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

describe("LogoutButton", () => {
  let mockSignOut: jest.Mock;
  let mockSupabaseClient: any;

  beforeEach(() => {
    mockSignOut = jest.fn().mockResolvedValue({ error: null });
    mockSupabaseClient = {
      auth: {
        signOut: mockSignOut,
      },
    };
    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);
    mockPush.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProvider = () => {
    return render(
      <UserContextProvider>
        <LogoutButton />
      </UserContextProvider>
    );
  };

  test("01 - should render without crashing", () => {
    renderWithProvider();
    const button = screen.getByRole("button", { name: /logout/i });
    expect(button).toBeInTheDocument();
  });

  test("02 - should render logout button text", () => {
    renderWithProvider();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("03 - should call signOut when button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProvider();
    const button = screen.getByRole("button", { name: /logout/i });

    await user.click(button);

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  test("04 - should redirect to login page after logout", async () => {
    const user = userEvent.setup();
    renderWithProvider();
    const button = screen.getByRole("button", { name: /logout/i });

    await user.click(button);

    // Esperar a que la promesa se resuelva
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockPush).toHaveBeenCalledWith("/auth/login");
  });

  test("05 - should reset user context after logout", async () => {
    const user = userEvent.setup();
    renderWithProvider();
    const button = screen.getByRole("button", { name: /logout/i });

    await user.click(button);

    // Esperar a que la promesa se resuelva
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verificar que se llama signOut y se redirige
    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/auth/login");
  });
});
