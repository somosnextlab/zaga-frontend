import { getDashboardRouteByRole } from "../roleUtils";
import { ROUTES } from "../constants/routes";

describe("roleUtils", () => {
  describe("getDashboardRouteByRole", () => {
    test("01 - should return admin dashboard route for admin role", () => {
      const result = getDashboardRouteByRole("admin");
      expect(result).toBe(ROUTES.ADMIN_DASHBOARD);
    });

    test("02 - should return admin dashboard route for ADMIN role (case insensitive)", () => {
      const result = getDashboardRouteByRole("ADMIN");
      expect(result).toBe(ROUTES.ADMIN_DASHBOARD);
    });

    test("03 - should return admin dashboard route for Admin role (mixed case)", () => {
      const result = getDashboardRouteByRole("Admin");
      expect(result).toBe(ROUTES.ADMIN_DASHBOARD);
    });

    test("04 - should return user dashboard route for usuario role", () => {
      const result = getDashboardRouteByRole("usuario");
      expect(result).toBe(ROUTES.USER_DASHBOARD);
    });

    test("05 - should return user dashboard route for Usuario role (case insensitive)", () => {
      const result = getDashboardRouteByRole("USUARIO");
      expect(result).toBe(ROUTES.USER_DASHBOARD);
    });

    test("06 - should return user dashboard route for cliente role", () => {
      const result = getDashboardRouteByRole("cliente");
      expect(result).toBe(ROUTES.USER_DASHBOARD);
    });

    test("07 - should return user dashboard route for Cliente role (case insensitive)", () => {
      const result = getDashboardRouteByRole("CLIENTE");
      expect(result).toBe(ROUTES.USER_DASHBOARD);
    });

    test("08 - should return home route for unknown role", () => {
      const result = getDashboardRouteByRole("unknown");
      expect(result).toBe(ROUTES.HOME);
    });

    test("09 - should return home route for empty string", () => {
      const result = getDashboardRouteByRole("");
      expect(result).toBe(ROUTES.HOME);
    });

    test("10 - should trim whitespace from role", () => {
      const result = getDashboardRouteByRole("  admin  ");
      expect(result).toBe(ROUTES.ADMIN_DASHBOARD);
    });

    test("11 - should handle role with only whitespace", () => {
      const result = getDashboardRouteByRole("   ");
      expect(result).toBe(ROUTES.HOME);
    });
  });
});
