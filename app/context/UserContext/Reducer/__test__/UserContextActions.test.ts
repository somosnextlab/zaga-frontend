import { setRoleAction, setLoadingAction, resetAction } from "../UserContextActions";
import { UserAction } from "../../UserContextContext.types";

describe("UserContextActions", () => {
  let mockDispatch: jest.Mock;

  beforeEach(() => {
    mockDispatch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("setRoleAction", () => {
    test("01 - should dispatch SET_ROLE action with payload", () => {
      setRoleAction(mockDispatch, "admin");

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: UserAction.SET_ROLE,
        payload: "admin",
      });
    });

    test("02 - should dispatch with different role", () => {
      setRoleAction(mockDispatch, "usuario");

      expect(mockDispatch).toHaveBeenCalledWith({
        type: UserAction.SET_ROLE,
        payload: "usuario",
      });
    });
  });

  describe("setLoadingAction", () => {
    test("01 - should dispatch SET_LOADING action with true", () => {
      setLoadingAction(mockDispatch, true);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: UserAction.SET_LOADING,
        payload: true,
      });
    });

    test("02 - should dispatch SET_LOADING action with false", () => {
      setLoadingAction(mockDispatch, false);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: UserAction.SET_LOADING,
        payload: false,
      });
    });
  });

  describe("resetAction", () => {
    test("01 - should dispatch RESET action", () => {
      resetAction(mockDispatch);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: UserAction.RESET,
      });
    });

    test("02 - should not include payload", () => {
      resetAction(mockDispatch);

      const call = mockDispatch.mock.calls[0][0];
      expect(call).not.toHaveProperty("payload");
    });
  });
});

