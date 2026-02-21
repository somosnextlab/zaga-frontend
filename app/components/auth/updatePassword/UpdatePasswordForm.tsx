"use client";

import { cn } from "@/lib/utils";
import { AuthMaintenanceNotice } from "@/app/components/auth/AuthMaintenanceNotice";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <AuthMaintenanceNotice
        title="Actualización de contraseña en mantenimiento"
        description="La actualización de contraseña está temporalmente deshabilitada mientras migramos la autenticación."
      />
    </div>
  );
}
