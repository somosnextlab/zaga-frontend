/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from "@testing-library/react";
import { useHeaderMode } from "../useHeaderMode";
import { usePathname } from "next/navigation";
import { useAuth } from "../useAuth";

// Mock de next/navigation
jest.mock("next/navigation", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/__mocks__/next-navigation");
});

// Mock de useAuth
jest.mock("../useAuth", () => ({
  useAuth: jest.fn(),
}));

describe("useHeaderMode", () => {
  const mockUsePathname = usePathname as jest.Mock;
  const mockUseAuth = useAuth as jest.Mock;

  beforeEach(() => {
    mockUsePathname.mockClear();
    mockUseAuth.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("01 - should return landing mode for root path", () => {
    mockUsePathname.mockReturnValue("/");
    mockUseAuth.mockReturnValue({ user: null });

    const { result } = renderHook(() => useHeaderMode());

    expect(result.current.mode).toBe("landing");
    expect(result.current.showLandingNavigation).toBe(true);
    expect(result.current.showProtectedNavigation).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
  });

  test("02 - should return auth mode for auth pages", () => {
    mockUsePathname.mockReturnValue("/auth/login");
    mockUseAuth.mockReturnValue({ user: null });

    const { result } = renderHook(() => useHeaderMode());

    expect(result.current.mode).toBe("auth");
    expect(result.current.showLandingNavigation).toBe(false);
    expect(result.current.showProtectedNavigation).toBe(false);
  });

  test("03 - should return protected mode for userDashboard", () => {
    mockUsePathname.mockReturnValue("/userDashboard");
    mockUseAuth.mockReturnValue({
      user: { role: "authenticated" },
    });

    const { result } = renderHook(() => useHeaderMode());

    expect(result.current.mode).toBe("protected");
    expect(result.current.showLandingNavigation).toBe(false);
    expect(result.current.showProtectedNavigation).toBe(true);
  });

  test("04 - should return protected mode for adminDashboard", () => {
    mockUsePathname.mockReturnValue("/adminDashboard");
    mockUseAuth.mockReturnValue({
      user: { role: "authenticated" },
    });

    const { result } = renderHook(() => useHeaderMode());

    expect(result.current.mode).toBe("protected");
    expect(result.current.showLandingNavigation).toBe(false);
    expect(result.current.showProtectedNavigation).toBe(true);
  });

  test("05 - should return isAuthenticated true when user role is authenticated", () => {
    mockUsePathname.mockReturnValue("/userDashboard");
    mockUseAuth.mockReturnValue({
      user: { role: "authenticated" },
    });

    const { result } = renderHook(() => useHeaderMode());

    expect(result.current.isAuthenticated).toBe(true);
  });

  test("06 - should return isAuthenticated false when user is null", () => {
    mockUsePathname.mockReturnValue("/");
    mockUseAuth.mockReturnValue({ user: null });

    const { result } = renderHook(() => useHeaderMode());

    expect(result.current.isAuthenticated).toBe(false);
  });

  test("07 - should return isAuthenticated false when user role is not authenticated", () => {
    mockUsePathname.mockReturnValue("/");
    mockUseAuth.mockReturnValue({
      user: { role: "guest" },
    });

    const { result } = renderHook(() => useHeaderMode());

    expect(result.current.isAuthenticated).toBe(false);
  });

  test("08 - should not show landing navigation when authenticated on landing page", () => {
    mockUsePathname.mockReturnValue("/");
    mockUseAuth.mockReturnValue({
      user: { role: "authenticated" },
    });

    const { result } = renderHook(() => useHeaderMode());

    expect(result.current.showLandingNavigation).toBe(false);
  });

  test("09 - should not show protected navigation when not authenticated on protected page", () => {
    mockUsePathname.mockReturnValue("/userDashboard");
    mockUseAuth.mockReturnValue({ user: null });

    const { result } = renderHook(() => useHeaderMode());

    expect(result.current.showProtectedNavigation).toBe(false);
  });
});

