/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LogoutButton } from "../LogoutButton";
import { UserProvider } from "@/app/context/UserContext/UserContextContext";
import { createClient } from "@/lib/supabase/client";
import { mockPush } from "@/__mocks__/next-navigation";

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
      <UserProvider>
        <LogoutButton />
      </UserProvider>
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
});
