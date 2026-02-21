import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "../useAuth";

describe("useAuth", () => {
  test("01 - should return initial loading state", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBeNull();
  });

  test("02 - should resolve loading to false", async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.user).toBeNull();
  });

  test("03 - should keep user null (auth disabled)", async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
  });
});
