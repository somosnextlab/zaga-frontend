import { reducer } from "../UserContextReducer";
import { UserAction } from "../../UserContextContext.types";
import { initialState } from "../../UserContextUtils";

describe("UserContextReducer", () => {
  test("01 - should return initial state for unknown action", () => {
    const state = { ...initialState };
    const action = { type: "UNKNOWN_ACTION" as UserAction };
    const result = reducer(state, action);
    expect(result).toEqual(state);
  });

  test("02 - should set role when SET_ROLE action is dispatched", () => {
    const state = { ...initialState };
    const action = {
      type: UserAction.SET_ROLE,
      payload: "admin" as const,
    };
    const result = reducer(state, action);
    expect(result.role).toBe("admin");
    expect(result.loading).toBe(false);
  });

  test("03 - should set loading when SET_LOADING action is dispatched", () => {
    const state = { ...initialState };
    const action = {
      type: UserAction.SET_LOADING,
      payload: true,
    };
    const result = reducer(state, action);
    expect(result.loading).toBe(true);
    expect(result.role).toBeNull();
  });

  test("04 - should reset state when RESET action is dispatched", () => {
    const state = {
      role: "admin",
      loading: true,
    };
    const action = {
      type: UserAction.RESET,
    };
    const result = reducer(state, action);
    expect(result).toEqual(initialState);
    expect(result.role).toBeNull();
    expect(result.loading).toBe(false);
  });

  test("05 - should handle multiple actions in sequence", () => {
    let state = { ...initialState };

    // Set role
    state = reducer(state, {
      type: UserAction.SET_ROLE,
      payload: "usuario",
    });
    expect(state.role).toBe("usuario");

    // Set loading
    state = reducer(state, {
      type: UserAction.SET_LOADING,
      payload: true,
    });
    expect(state.loading).toBe(true);
    expect(state.role).toBe("usuario");

    // Reset
    state = reducer(state, {
      type: UserAction.RESET,
    });
    expect(state).toEqual(initialState);
  });

  test("06 - should update role multiple times", () => {
    let state = { ...initialState };

    state = reducer(state, {
      type: UserAction.SET_ROLE,
      payload: "usuario",
    });
    expect(state.role).toBe("usuario");

    state = reducer(state, {
      type: UserAction.SET_ROLE,
      payload: "admin",
    });
    expect(state.role).toBe("admin");
  });

  test("07 - should toggle loading state", () => {
    let state = { ...initialState };

    state = reducer(state, {
      type: UserAction.SET_LOADING,
      payload: true,
    });
    expect(state.loading).toBe(true);

    state = reducer(state, {
      type: UserAction.SET_LOADING,
      payload: false,
    });
    expect(state.loading).toBe(false);
  });
});

