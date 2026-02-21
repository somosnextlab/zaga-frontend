import type { ReadonlyURLSearchParams } from "next/navigation";
import type { ConsentAcceptBody } from "../types/terms.types";

export function getTokenFromSearchParams(
  searchParams: ReadonlyURLSearchParams
): string | null {
  const rawToken = searchParams.get("token");
  const token = rawToken?.trim() ?? "";
  return token.length > 0 ? token : null;
}

export async function tryGetErrorMessage(
  response: Response
): Promise<string | null> {
  try {
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const data: unknown = await response.json();
      if (
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof (data as { message?: unknown }).message === "string"
      ) {
        return (data as { message: string }).message;
      }
      return null;
    }

    if (contentType.includes("text/")) {
      const text = await response.text();
      return text.trim().length > 0 ? text.trim() : null;
    }

    return null;
  } catch {
    return null;
  }
}

export async function acceptConsent(
  endpoint: string,
  token: string
): Promise<void> {
  const body: ConsentAcceptBody = { token };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const apiMessage = await tryGetErrorMessage(response);
    const fallback = `No pudimos registrar tu aceptación (HTTP ${response.status}).`;
    throw new Error(apiMessage ?? fallback);
  }
}

export type ConsentByTokenResponse = {
  token: string;
  status: "PENDING" | "ACCEPTED";
  terms_version: string;
  terms_url: string | null;
  terms_hash: string | null;
  expires_at: string;
  is_valid: boolean;
};

export async function getConsentByToken(
  endpoint: string
): Promise<ConsentByTokenResponse> {
  const response = await fetch(endpoint, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    const apiMessage = await tryGetErrorMessage(response);
    const fallback = `No pudimos validar el link (HTTP ${response.status}).`;
    throw new Error(apiMessage ?? fallback);
  }

  const data = (await response.json()) as unknown;

  // Validación mínima de forma, sin librerías externas
  if (
    typeof data !== "object" ||
    data === null ||
    !("token" in data) ||
    !("status" in data) ||
    !("terms_version" in data) ||
    !("expires_at" in data) ||
    !("is_valid" in data)
  ) {
    throw new Error("Respuesta inválida del servidor.");
  }

  return data as ConsentByTokenResponse;
}