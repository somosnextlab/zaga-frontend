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

  // Autenticación deshabilitada: no se obtiene token del servidor automáticamente.
  // Si se pasa `accessToken`, se usa; si no, se hace la request sin Authorization.
  if (accessToken) {
    requestHeaders.Authorization = `Bearer ${accessToken}`;
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
    // Seguridad: evitar devolver detalles del error en la respuesta.
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: STATUS_SERVER_ERROR,
      headers: { "content-type": "application/json" },
    });
  }
}
