import { initialState } from "../UserContextUtils";

describe("UserContextUtils", () => {
  describe("initialState", () => {
    test("01 - should have null role", () => {
      expect(initialState.role).toBeNull();
    });

    test("02 - should have false loading", () => {
      expect(initialState.loading).toBe(false);
    });

    test("03 - should match expected structure", () => {
      expect(initialState).toEqual({
        role: null,
        loading: false,
      });
    });
  });
});

