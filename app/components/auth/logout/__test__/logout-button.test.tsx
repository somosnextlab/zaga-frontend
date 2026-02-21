import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LogoutButton } from "../LogoutButton";
import { UserProvider } from "@/app/context/UserContext/UserContextContext";
import { mockPush } from "@/__mocks__/next-navigation";

// Mock de next/navigation
jest.mock("next/navigation", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/__mocks__/next-navigation");
});

describe("LogoutButton", () => {
  beforeEach(() => {
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

    expect(mockPush).toHaveBeenCalledWith("/auth/login");
  });
});
