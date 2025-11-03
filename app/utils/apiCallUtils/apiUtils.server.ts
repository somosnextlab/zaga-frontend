import { createClient } from "@/lib/supabase/server";
import { STATUS_SERVER_ERROR } from "../constants/statusResponse";
import { FetchParameters } from "./apiUtils.types";

/**
 * Realiza una petición fetch con headers de autorización de Supabase.
 * Para uso en route handlers de Next.js (retorna Response directamente).
 * Obtiene el token automáticamente del servidor si no se proporciona.
 * Permite manejo manual de la respuesta en el route handler.
 *
 * @param options - Parámetros de la petición
 * @returns Promise con Response (no parseada)
 */
export async function fetchWithHeaderServer(
  options: FetchParameters
): Promise<Response> {
  const { url, method = "GET", body, accessToken, headers = {} } = options;

  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };

  // Obtener token de Supabase si no se proporciona uno
  let token = accessToken;
  if (!token) {
    try {
      const supabase = await createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        token = session.access_token;
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "test") {
        console.error("Error al obtener sesión de Supabase:", error);
      }
    }
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  // Preparar el body según su tipo
  let requestBody: BodyInit | undefined;
  if (body) {
    if (
      body instanceof FormData ||
      body instanceof Blob ||
      body instanceof ArrayBuffer ||
      typeof body === "string"
    ) {
      if (!(body instanceof FormData)) {
        delete requestHeaders["Content-Type"];
      }
      requestBody = body as BodyInit;
    } else if (typeof body === "object") {
      requestHeaders["Content-Type"] = "application/json";
      requestBody = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: requestBody,
    });

    // Devolver la Response directamente para manejo manual
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    if (process.env.NODE_ENV !== "test") {
      console.error("Error en fetchWithHeaderServer:", errorMessage);
    }

    // Retornar una Response de error
    return new Response(
      JSON.stringify({ message: "Server error", error: errorMessage }),
      {
        status: STATUS_SERVER_ERROR,
        headers: { "content-type": "application/json" },
      }
    );
  }
}
