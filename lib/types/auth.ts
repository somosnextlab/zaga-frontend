export type UserRole = 'admin' | 'cliente';

export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    role?: UserRole;
    email_verified?: boolean;
  };
}

export interface AuthUser {
  user: User | null;
  role: UserRole | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}
