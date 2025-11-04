export const UserRoleEnum = {
  ADMIN: "admin",
  CLIENTE: "cliente",
  USUARIO: "usuario",
} as const;

export type UserRole = (typeof UserRoleEnum)[keyof typeof UserRoleEnum];
