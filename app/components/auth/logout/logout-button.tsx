"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/app/components/ui/Button/Button";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/app/context/UserContext/UserContextContext";

export function LogoutButton() {
  const router = useRouter();
  const {
    actions: { reset },
  } = useUserContext();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // Resetear el contexto de usuario
    reset();
    router.push("/auth/login");
  };

  return <Button onClick={logout}>Logout</Button>;
}
