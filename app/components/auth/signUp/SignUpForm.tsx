"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
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
import { RegisterUserDataType } from "./signUp.types";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [registerUserData, setRegisterUserData] =
    useState<RegisterUserDataType>({
      email: "",
      password: "",
      repeatPassword: "",
      error: null,
    });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setRegisterUserData({
      email: "",
      password: "",
      repeatPassword: "",
      error: null,
    });

    if (registerUserData.password !== registerUserData.repeatPassword) {
      setRegisterUserData({
        ...registerUserData,
        error: "Passwords do not match",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: registerUserData.email,
        password: registerUserData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/userDashboard`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setRegisterUserData({
        ...registerUserData,
        error: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Registrate</CardTitle>
          <CardDescription>Crea una nueva cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@gmail.com"
                  required
                  value={registerUserData.email}
                  onChange={(e) =>
                    setRegisterUserData({
                      ...registerUserData,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                </div>
                <PasswordInput
                  id="password"
                  required
                  value={registerUserData.password}
                  onChange={(e) =>
                    setRegisterUserData({
                      ...registerUserData,
                      password: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">Repetir contraseña</Label>
                </div>
                <PasswordInput
                  id="repeat-password"
                  required
                  value={registerUserData.repeatPassword}
                  onChange={(e) =>
                    setRegisterUserData({
                      ...registerUserData,
                      repeatPassword: e.target.value,
                    })
                  }
                />
              </div>
              {registerUserData.error && (
                <p className="text-sm text-red-500">{registerUserData.error}</p>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creando tu cuenta..." : "Registrarme"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Ya tienes una cuenta?{" "}
              <Link
                href="/auth/login"
                className="text-zaga-green-gray underline underline-offset-4"
              >
                Iniciar sesión
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
