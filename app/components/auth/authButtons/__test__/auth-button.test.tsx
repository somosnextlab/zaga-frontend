import React from "react";
import { render, screen } from "@testing-library/react";
import { AuthButton } from "../AuthButton";
import { useAuth } from "@/app/hooks/useAuth";
import { mockSimpleUser } from "@/__mocks__/test-data";
import { useUserContext } from "@/app/context/UserContext/UserContextContext";

// Mock de useAuth
jest.mock("@/app/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/app/context/UserContext/UserContextContext", () => ({
  useUserContext: jest.fn(),
}));

// Mock de next/navigation
jest.mock("next/navigation", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/__mocks__/next-navigation");
});

describe("AuthButton", () => {
  const mockUseAuth = useAuth as jest.Mock;
  const mockUseUserContext = useUserContext as jest.Mock;

  beforeEach(() => {
    mockUseAuth.mockClear();
    mockUseUserContext.mockReturnValue({
      state: { role: null, loading: false },
      actions: {},
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("01 - should render without crashing", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    render(<AuthButton />);
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
  });

  test("02 - should render login link when user is not authenticated", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    render(<AuthButton />);
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
  });

  test("03 - should not render when loading", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });
    render(<AuthButton />);
    expect(screen.queryByText(/admin/i)).not.toBeInTheDocument();
  });

  test("04 - should render admin dashboard link when user is authenticated and is admin", () => {
    mockUseAuth.mockReturnValue({ user: mockSimpleUser, loading: false });
    mockUseUserContext.mockReturnValue({
      state: { role: "admin", loading: false },
      actions: {},
    });
    render(<AuthButton />);
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
  });

  test("05 - should render login link with correct href", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    render(<AuthButton />);
    const loginLink = screen.getByText(/admin/i).closest("a");
    expect(loginLink).toHaveAttribute("href", "/auth/login");
  });

  test("06 - should render dashboard link with correct href for admin", () => {
    mockUseAuth.mockReturnValue({ user: mockSimpleUser, loading: false });
    mockUseUserContext.mockReturnValue({
      state: { role: "admin", loading: false },
      actions: {},
    });
    render(<AuthButton />);
    const dashboardLink = screen.getByText(/admin/i).closest("a");
    expect(dashboardLink).toHaveAttribute("href", "/adminDashboard");
  });

  test("07 - should not render when user is authenticated but not admin", () => {
    mockUseAuth.mockReturnValue({ user: mockSimpleUser, loading: false });
    mockUseUserContext.mockReturnValue({
      state: { role: "usuario", loading: false },
      actions: {},
    });
    render(<AuthButton />);
    expect(screen.queryByText(/admin/i)).not.toBeInTheDocument();
  });
});
