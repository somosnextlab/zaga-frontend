export const userRoleEnum = {
  ADMIN: 'admin',
  CLIENTE: 'cliente',
  USUARIO: 'usuario',
} as const;

export type UserRole = (typeof userRoleEnum)[keyof typeof userRoleEnum];
