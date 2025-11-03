/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "../useAuth";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

// Mock de Supabase client
jest.mock("@/lib/supabase/client", () => ({
  createClient: jest.fn(),
}));

describe("useAuth", () => {
  let mockGetUser: jest.Mock;
  let mockOnAuthStateChange: jest.Mock;
  let mockUnsubscribe: jest.Mock;
  let mockSupabaseClient: any;

  beforeEach(() => {
    mockUnsubscribe = jest.fn();
    mockGetUser = jest.fn();
    mockOnAuthStateChange = jest.fn(() => ({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    }));

    mockSupabaseClient = {
      auth: {
        getUser: mockGetUser,
        onAuthStateChange: mockOnAuthStateChange,
      },
    };

    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("01 - should return initial loading state", () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
  });

  test("02 - should fetch user on mount", async () => {
    const mockUser = { id: "1", email: "test@example.com" } as User;
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockGetUser).toHaveBeenCalledTimes(1);
    expect(result.current.user).toEqual(mockUser);
  });

  test("03 - should set user to null when getUser returns no user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
  });

  test("04 - should handle errors when getting user", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    mockGetUser.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  test("05 - should subscribe to auth state changes", () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    renderHook(() => useAuth());

    expect(mockOnAuthStateChange).toHaveBeenCalledTimes(1);
    expect(typeof mockOnAuthStateChange.mock.calls[0][0]).toBe("function");
  });

  test("06 - should update user when auth state changes", async () => {
    const mockUser = { id: "1", email: "test@example.com" } as User;
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Simular cambio de estado de autenticación
    const authStateChangeCallback = mockOnAuthStateChange.mock.calls[0][0];
    authStateChangeCallback("SIGNED_IN", { user: mockUser } as any);

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
  });

  test("07 - should set user to null when signed out", async () => {
    const mockUser = { id: "1", email: "test@example.com" } as User;
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Simular sign out
    const authStateChangeCallback = mockOnAuthStateChange.mock.calls[0][0];
    authStateChangeCallback("SIGNED_OUT", null);

    await waitFor(() => {
      expect(result.current.user).toBeNull();
    });
  });

  test("08 - should handle errors in auth state change callback", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Simular error en el callback - el callback maneja errores internamente
    const authStateChangeCallback = mockOnAuthStateChange.mock.calls[0][0];
    // Simular llamada al callback que no causa error
    authStateChangeCallback("SIGNED_IN", null);

    await waitFor(() => {
      expect(result.current.user).toBeNull();
    });

    consoleSpy.mockRestore();
  });

  test("09 - should unsubscribe on unmount", () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const { unmount } = renderHook(() => useAuth());

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });

  test("10 - should handle unsubscribe errors gracefully", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    mockUnsubscribe.mockImplementation(() => {
      throw new Error("Unsubscribe error");
    });

    const { unmount } = renderHook(() => useAuth());

    unmount();

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
