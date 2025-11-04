/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen } from "@testing-library/react";
import { Header } from "../Header";
import { useHeaderMode } from "@/app/hooks/useHeaderMode";
import { UserProvider } from "@/app/context/UserContext/UserContextContext";

// Mock de useHeaderMode
jest.mock("@/app/hooks/useHeaderMode", () => ({
  useHeaderMode: jest.fn(),
}));

// Mock de next/navigation
jest.mock("next/navigation", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/__mocks__/next-navigation");
});

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

describe("Header", () => {
  const mockUseHeaderMode = useHeaderMode as jest.Mock;

  beforeEach(() => {
    mockUseHeaderMode.mockReturnValue({
      mode: "landing",
      showLandingNavigation: true,
      showProtectedNavigation: false,
      isAuthenticated: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProvider = () => {
    return render(
      <UserProvider>
        <Header />
      </UserProvider>
    );
  };

  test("01 - should render without crashing", () => {
    renderWithProvider();
    expect(
      screen.getByRole("banner") || screen.getByRole("navigation")
    ).toBeInTheDocument();
  });

  test("02 - should render logo", () => {
    renderWithProvider();
    // Verificar que existe un enlace o imagen con el logo
    const logo =
      screen.queryByText(/zaga/i) ||
      screen.queryByRole("link", { name: /zaga/i });
    expect(logo).toBeTruthy();
  });

  test("03 - should render theme switcher", () => {
    renderWithProvider();
    // El ThemeSwitcher renderiza un botón
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  test("04 - should render auth buttons when not authenticated", () => {
    mockUseHeaderMode.mockReturnValue({
      mode: "landing",
      showLandingNavigation: true,
      showProtectedNavigation: false,
      isAuthenticated: false,
    });
    renderWithProvider();
    // Verificar que se renderizan los botones de autenticación
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
