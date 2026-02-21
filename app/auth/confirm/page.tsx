import { AuthMaintenanceNotice } from "@/app/components/auth/AuthMaintenanceNotice";

export default function ConfirmPage(): React.JSX.Element {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthMaintenanceNotice
          title="Verificación en mantenimiento"
          description="La verificación de cuenta está temporalmente deshabilitada mientras migramos la autenticación."
        />
      </div>
    </div>
  );
}
