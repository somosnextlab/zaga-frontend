"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { fetchWithHeader } from "@/app/utils/apiCallUtils/apiUtils";
import { LoginAuthResponse } from "@/app/types/login.types";
import { getDashboardRouteByRole } from "@/app/utils/roleUtils";
import { useUserContext } from "@/app/context/UserContext/UserContextContext";
import { UserRoleEnum } from "@/app/types/user.types";
import { Button } from "@/app/components/ui/Button/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card/card";
import { Input } from "@/app/components/ui/Input/input";
import { PasswordInput } from "@/app/components/ui/InputPassword/password-input";
import { Label } from "@/app/components/ui/Label/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginUserDataType } from "./login.types";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [loginUserData, setLoginUserData] = useState<LoginUserDataType>({
    email: "",
    password: "",
    error: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const {
    actions: { setRole, reset },
  } = useUserContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setLoginUserData({
      email: "",
      password: "",
      error: null,
    });

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: loginUserData.email,
          password: loginUserData.password,
        });
      if (authError) throw authError;
      const accessToken = authData.session.access_token;

      const {
        data,
        error: apiError,
        response,
      } = await fetchWithHeader({
        url: "/api/auth",
        method: "GET",
        accessToken,
      });

      if (apiError || !data) {
        const errorMessage =
          apiError?.message || `Fallo /api/auth (${response.status})`;
        throw new Error(errorMessage);
      }

      const authResponse = data as LoginAuthResponse;
      const { role } = authResponse.data;

      const normalizedRole = role.toLowerCase().trim();
      if (normalizedRole !== UserRoleEnum.ADMIN) {
        // Seguridad: no dejar sesión activa si no es admin
        await supabase.auth.signOut();
        reset();
        setLoginUserData((prev) => ({
          ...prev,
          error: "Acceso restringido: solo administradores.",
        }));
        return;
      }

      setRole(UserRoleEnum.ADMIN);

      // Redirigir al dashboard correspondiente según el rol
      const dashboardRoute = getDashboardRouteByRole(UserRoleEnum.ADMIN);
      router.push(dashboardRoute);
    } catch (error: unknown) {
      setLoginUserData((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Ocurrió un error",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Inicio de sesion</CardTitle>
          <CardDescription>
            Ingresa tu email para iniciar sesion en tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@gmail.com"
                  required
                  value={loginUserData.email}
                  onChange={(e) =>
                    setLoginUserData({
                      ...loginUserData,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Olvidaste tu contraseña?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  required
                  value={loginUserData.password}
                  onChange={(e) =>
                    setLoginUserData({
                      ...loginUserData,
                      password: e.target.value,
                    })
                  }
                />
              </div>
              {loginUserData.error && (
                <p className="text-sm text-red-500">{loginUserData.error}</p>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
