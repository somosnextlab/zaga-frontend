import {
  acceptConsent,
  getTokenFromSearchParams,
  tryGetErrorMessage,
} from "../utils/functions";
import { buildBackendUrl, getBackendBaseUrl } from "../utils/backend";

type MockResponseInit = {
  ok: boolean;
  status: number;
  headers?: Record<string, string>;
  json?: unknown;
  text?: string;
};

function createMockResponse(init: MockResponseInit): Response {
  const headersLower: Record<string, string> = Object.fromEntries(
    Object.entries(init.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v]),
  );

  return {
    ok: init.ok,
    status: init.status,
    headers: {
      get(name: string): string | null {
        return headersLower[name.toLowerCase()] ?? null;
      },
    } as unknown as Headers,
    async json(): Promise<unknown> {
      return init.json;
    },
    async text(): Promise<string> {
      return init.text ?? "";
    },
  } as unknown as Response;
}

describe("terms utils", () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_BACKEND_URL;
  });

  test("getTokenFromSearchParams debería trimear el token", () => {
    const params = new URLSearchParams("token=%20%20abc%20%20");
    const token = getTokenFromSearchParams(params as unknown as never);
    expect(token).toBe("abc");
  });

  test("tryGetErrorMessage debería leer message desde JSON", async () => {
    const response = createMockResponse({
      ok: false,
      status: 400,
      headers: { "content-type": "application/json" },
      json: { message: "Bad token" },
    });
    await expect(tryGetErrorMessage(response)).resolves.toBe("Bad token");
  });

  test("acceptConsent debería lanzar error con fallback en no-ok", async () => {
    const fetchMock = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit?]>();
    fetchMock.mockResolvedValue(
      createMockResponse({
        ok: false,
        status: 500,
      }),
    );
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(acceptConsent("https://api.example.com", "abc")).rejects.toThrow(
      /no pudimos registrar tu aceptación/i
    );
  });

  test("getBackendBaseUrl debería trimear y remover trailing slash", () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = "  https://backend.example.com/  ";
    expect(getBackendBaseUrl()).toBe("https://backend.example.com");
  });

  test("buildBackendUrl debería construir sin doble slash", () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = "https://backend.example.com/";
    expect(buildBackendUrl("/consents/accept")).toBe(
      "https://backend.example.com/consents/accept",
    );
    expect(buildBackendUrl("consents/accept")).toBe(
      "https://backend.example.com/consents/accept",
    );
  });
});

