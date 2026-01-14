"use client";

import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import { useUserContext } from "@/app/context/UserContext/UserContextContext";
import { ROUTES } from "@/app/utils/constants/routes";
import { UserRoleEnum } from "@/app/types/user.types";

/**
 * Props del componente AuthButton.
 * - `asListItem`: útil para renderizar dentro de una lista (`<ul>`), como en el Footer.
 */
export interface AuthButtonProps {
  className?: string;
  asListItem?: boolean;
}

/**
 * Link discreto para acceso de administración.
 *
 * Reglas:
 * - No autenticado → link a login.
 * - Autenticado + rol ADMIN → link al dashboard admin.
 * - Autenticado + rol no-admin (o rol no disponible) → no se muestra.
 */
export function AuthButton({ className, asListItem = false }: AuthButtonProps) {
  const { user, loading } = useAuth();
  const {
    state: { role },
  } = useUserContext();

  if (loading) {
    return null;
  }

  const normalizedRole = role?.toLowerCase().trim() ?? null;

  const href = !user
    ? ROUTES.LOGIN
    : normalizedRole === UserRoleEnum.ADMIN
      ? ROUTES.ADMIN_DASHBOARD
      : null;

  if (!href) return null;

  const link = (
    <Link href={href} className={className} aria-label="admin">
      Admin
    </Link>
  );

  return asListItem ? <li>{link}</li> : link;
}
