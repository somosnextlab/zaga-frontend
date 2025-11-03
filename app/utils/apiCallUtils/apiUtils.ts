import { STATUS_SERVER_ERROR } from "../constants/statusResponse";
import { FetchParameters, FetchResult } from "./apiUtils.types";

/**
 * Realiza una petición fetch con headers de autorización de Supabase.
 * Para uso en componentes cliente.
 *
 * @param options - Parámetros de la petición
 * @returns Promise con el resultado de la petición
 */
export async function fetchWithHeader(
  options: FetchParameters
): Promise<FetchResult> {
  const { url, method = "GET", body, accessToken, headers = {} } = options;

  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };

  // Si se proporciona un token, usarlo
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
      // Para FormData, Blob, ArrayBuffer o string, usar directamente
      if (!(body instanceof FormData)) {
        delete requestHeaders["Content-Type"];
      }
      requestBody = body as BodyInit;
    } else if (typeof body === "object") {
      // Para objetos, convertir a JSON
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

    return {
      response,
      data: response.ok ? await parseResponse(response) : undefined,
      error: response.ok
        ? undefined
        : {
            message: `Request failed with status ${response.status}`,
            status: response.status,
          },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    if (process.env.NODE_ENV !== "test") {
      console.error("Error en fetchWithHeader:", errorMessage);
    }

    return {
      response: new Response(null, { status: STATUS_SERVER_ERROR }),
      error: {
        message: errorMessage,
        status: STATUS_SERVER_ERROR,
      },
    };
  }
}

/**
 * Parsea la respuesta según su content-type.
 */
async function parseResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return await response.json();
  }

  if (contentType.includes("text/")) {
    return await response.text();
  }

  return await response.blob();
}
