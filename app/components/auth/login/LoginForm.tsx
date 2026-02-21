"use client";

import { cn } from "@/lib/utils";
import { AuthMaintenanceNotice } from "@/app/components/auth/AuthMaintenanceNotice";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <AuthMaintenanceNotice
        title="Inicio de sesión en mantenimiento"
        description="El inicio de sesión está temporalmente deshabilitado mientras migramos la autenticación."
      />
    </div>
  );
}
