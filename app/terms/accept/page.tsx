import * as React from "react";
import { headers } from "next/headers";
import { buildBackendUrl } from "../utils/backend";
import TermsAcceptClient from "./TermsAcceptClient";

type ConsentByTokenResponse = {
  token: string;
  status: "PENDING" | "ACCEPTED";
  terms_version: string;
  terms_url: string | null;
  terms_hash: string | null;
  expires_at: string;
  is_valid: boolean;
};

async function fetchConsentByToken(token: string): Promise<ConsentByTokenResponse> {
  const endpoint = buildBackendUrl(`/consents/token/${token}`);

  // Si NEXT_PUBLIC_BACKEND_URL no está, buildBackendUrl devuelve path relativo
  // y esto no va a funcionar desde el server -> devolvemos error controlado.
  if (endpoint.startsWith("/")) {
    throw new Error("Falta NEXT_PUBLIC_BACKEND_URL para validar el link.");
  }

  // Forward de headers útiles (no imprescindible, pero ayuda en algunos setups)
  const h = await headers();
  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
      // opcional: forward user-agent para logs/depuración
      "user-agent": h.get("user-agent") ?? "",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = "Token inválido o vencido.";
    try {
      const data = await res.json();
      if (typeof data?.message === "string") msg = data.message;
    } catch { }
    throw new Error(msg);
  }

  return (await res.json()) as ConsentByTokenResponse;
}

export default async function TermsAcceptPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}): Promise<React.JSX.Element> {
  const { token } = await searchParams;

  if (!token || token.trim().length === 0) {
    return <TermsAcceptClient token={null} consent={null} />;
  }

  try {
    const consent = await fetchConsentByToken(token.trim());
    return <TermsAcceptClient token={token.trim()} consent={consent} />;
  } catch {
    return <TermsAcceptClient token={token.trim()} consent={null} />;
  }
}