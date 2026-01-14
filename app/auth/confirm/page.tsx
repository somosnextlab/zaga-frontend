"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { type EmailOtpType } from "@supabase/supabase-js";
import { useUserContext } from "@/app/context/UserContext/UserContextContext";
import { fetchWithHeader } from "@/app/utils/apiCallUtils/apiUtils";
import { LoginAuthResponse } from "@/app/types/login.types";
import { getDashboardRouteByRole } from "@/app/utils/roleUtils";
import { UserRoleEnum } from "@/app/types/user.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card/card";

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    actions: { setRole, reset },
  } = useUserContext();

  const redirectAfterVerification = useCallback(
    async (accessToken: string, next: string): Promise<void> => {
      const supabase = createClient();
      try {
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
          const errorText =
            apiError?.message || `Fallo /api/auth (${response.status})`;
          throw new Error(errorText);
        }

        const authResponse = data as LoginAuthResponse;
        const { role } = authResponse.data;
        const normalizedRole = role.toLowerCase().trim();

        if (normalizedRole !== UserRoleEnum.ADMIN) {
          await supabase.auth.signOut();
          reset();
          setStatus("error");
          setErrorMessage("Acceso restringido: solo administradores.");
          setTimeout(() => {
            router.push(
              "/auth/login?message=Acceso restringido: solo administradores."
            );
          }, 1500);
          return;
        }

        setRole(UserRoleEnum.ADMIN);
        setStatus("success");

        const nextIsAdminDashboard = next.startsWith("/adminDashboard");
        const target = nextIsAdminDashboard
          ? next
          : getDashboardRouteByRole(UserRoleEnum.ADMIN);
        router.push(target);
      } catch (error: unknown) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Ocurrió un error inesperado"
        );
      }
    },
    [reset, router, setRole]
  );

  useEffect(() => {
    const handleVerification = async () => {
      const code = searchParams.get("code");
      const token_hash = searchParams.get("token_hash");
      const type = searchParams.get("type") as EmailOtpType | null;
      const next = searchParams.get("next") ?? "/";

      const supabase = createClient();

      try {
        // Flujo PKCE: Intercambiar código por sesión
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(
            code
          );

          if (error) {
            // Si falla el intercambio (por ejemplo, no hay code_verifier),
            // redirigir a login con mensaje
            setStatus("error");
            setErrorMessage(
              "No se pudo completar la verificación automáticamente. Por favor, inicia sesión con tu email y contraseña."
            );
            // Redirigir a login después de 3 segundos
            setTimeout(() => {
              router.push(
                `/auth/login?message=Por favor, inicia sesión para completar la verificación`
              );
            }, 3000);
            return;
          }

          if (data.session) {
            // Verificaci?n exitosa: permitir acceso solo a admin
            await redirectAfterVerification(data.session.access_token, next);
            return;
          }
        }

        // Flujo OTP tradicional: Verificar con token_hash y type
        if (token_hash && type) {
          const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
          });

          if (error) {
            setStatus("error");
            setErrorMessage(error.message);
            return;
          }

          // Verificación exitosa, obtener sesión y registrar usuario
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData.session?.access_token) {
            await redirectAfterVerification(
              sessionData.session.access_token,
              next
            );
            return;
          }

          // Si no hay sesión, redirigir de todas formas
          setStatus("success");
          router.push(next);
          return;
        }

        // Si no hay código ni token_hash, verificar si hay sesión
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session?.access_token) {
          // Ya hay una sesi?n: permitir acceso solo a admin
          await redirectAfterVerification(
            sessionData.session.access_token,
            next
          );
          return;
        }
        setStatus("error");
        setErrorMessage("No se encontró código de verificación ni token");
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Ocurrió un error inesperado"
        );
      }
    };

    handleVerification();
  }, [searchParams, router, setRole, redirectAfterVerification]);

  if (status === "loading") {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Verificando tu cuenta...
              </CardTitle>
              <CardDescription>Por favor espera un momento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Error en la verificación
              </CardTitle>
              <CardDescription>
                No se pudo completar la verificación
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errorMessage && (
                <p className="text-sm text-muted-foreground mb-4">
                  {errorMessage}
                </p>
              )}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => router.push("/auth/login")}
                  className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Ir a iniciar sesión
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // status === "success" - se redirige automáticamente, pero mostramos un mensaje por si acaso
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Verificación exitosa</CardTitle>
            <CardDescription>Redirigiendo...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
