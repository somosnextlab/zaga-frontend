"use client";

import Link from "next/link";
import { ROUTES } from "@/app/utils/constants/routes";
import { Button } from "@/app/components/ui/Button/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card/card";

export type AuthMaintenanceNoticeProps = {
  title?: string;
  description?: string;
};

export function AuthMaintenanceNotice({
  title = "Funcionalidad en mantenimiento",
  description = "El inicio de sesión y el panel administrativo están temporalmente deshabilitados mientras trabajamos en mejoras.",
}: AuthMaintenanceNoticeProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Si necesitás continuar, volvé al inicio o contactá al equipo.
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild>
          <Link href={ROUTES.HOME}>Volver al inicio</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

