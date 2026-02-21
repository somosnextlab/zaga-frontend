/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TermsAcceptPage from "../accept/page";
import { CONSENTS_ACCEPT_ENDPOINT } from "../utils/constants";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { WHATSAPP_MESSAGE_ACCEPT } from "@/app/mocks/messageMocks";

jest.mock("next/headers", () => ({
  headers: jest.fn(async () => ({
    get: (): null => null,
  })),
}));

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

describe("/terms/accept (aceptación con token)", () => {
  let fetchMock: jest.MockedFunction<typeof fetch>;
  const originalBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_BACKEND_URL = "https://backend.test";
    fetchMock = jest.fn() as unknown as jest.MockedFunction<typeof fetch>;
    globalThis.fetch = fetchMock;
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_BACKEND_URL = originalBackendUrl;
    jest.clearAllMocks();
  });

  test("sin token: muestra error y no muestra botón de aceptar", async () => {
    const ui = await TermsAcceptPage({ searchParams: Promise.resolve({}) });
    render(ui);

    expect(
      screen.getByRole("heading", { name: /link inválido o incompleto/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: /acepto los términos y condiciones/i,
      })
    ).not.toBeInTheDocument();
  });

  test("con token: muestra TyC y botón de aceptar", async () => {
    fetchMock.mockResolvedValue(
      createMockResponse({
        ok: true,
        status: 200,
        json: {
          token: "abc",
          status: "PENDING",
          terms_version: "2026-01_v1",
          terms_url: null,
          terms_hash: null,
          expires_at: "2099-01-01T00:00:00.000Z",
          is_valid: true,
        },
      }),
    );

    const ui = await TermsAcceptPage({
      searchParams: Promise.resolve({ token: "abc" }),
    });
    render(ui);

    expect(
      screen.getByRole("heading", { name: /términos y condiciones/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /acepto los términos y condiciones/i })
    ).toBeInTheDocument();
  });

  test("al aceptar: envía POST con el token", async () => {
    fetchMock.mockImplementation(async (_url, options) => {
      const method = (options?.method ?? "GET").toUpperCase();

      if (method === "GET") {
        return createMockResponse({
          ok: true,
          status: 200,
          json: {
            token: "abc",
            status: "PENDING",
            terms_version: "2026-01_v1",
            terms_url: null,
            terms_hash: null,
            expires_at: "2099-01-01T00:00:00.000Z",
            is_valid: true,
          },
        });
      }

      if (method === "POST") {
        return createMockResponse({ ok: true, status: 200 });
      }

      return createMockResponse({ ok: false, status: 500 });
    });

    const user = userEvent.setup();
    const ui = await TermsAcceptPage({
      searchParams: Promise.resolve({ token: "abc" }),
    });
    render(ui);

    await user.click(
      screen.getByRole("button", { name: /acepto los términos y condiciones/i })
    );

    await waitFor(() => {
      expect(fetchMock.mock.calls.some(([, opt]) => opt?.method === "POST")).toBe(
        true,
      );
    });

    const postCall = fetchMock.mock.calls.find(([, opt]) => opt?.method === "POST");
    expect(postCall).toBeDefined();

    const [url, options] = postCall as [string, RequestInit];
    expect(url).toBe(CONSENTS_ACCEPT_ENDPOINT);
    expect(options.method).toBe("POST");
    expect(options.headers).toEqual(
      expect.objectContaining({
        Accept: "application/json",
        "Content-Type": "application/json",
      })
    );
    expect(options.body).toBe(JSON.stringify({ token: "abc" }));
  });

  test("error de red: muestra mensaje de error", async () => {
    fetchMock.mockImplementation(async (_url, options) => {
      const method = (options?.method ?? "GET").toUpperCase();

      if (method === "GET") {
        return createMockResponse({
          ok: true,
          status: 200,
          json: {
            token: "abc",
            status: "PENDING",
            terms_version: "2026-01_v1",
            terms_url: null,
            terms_hash: null,
            expires_at: "2099-01-01T00:00:00.000Z",
            is_valid: true,
          },
        });
      }

      throw new Error("Failed to fetch");
    });

    const user = userEvent.setup();
    const ui = await TermsAcceptPage({
      searchParams: Promise.resolve({ token: "abc" }),
    });
    render(ui);

    await user.click(
      screen.getByRole("button", { name: /acepto los términos y condiciones/i })
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/no pudimos registrar tu aceptación/i);
  });

  test("success: muestra confirmación y link a WhatsApp", async () => {
    fetchMock.mockImplementation(async (_url, options) => {
      const method = (options?.method ?? "GET").toUpperCase();

      if (method === "GET") {
        return createMockResponse({
          ok: true,
          status: 200,
          json: {
            token: "abc",
            status: "PENDING",
            terms_version: "2026-01_v1",
            terms_url: null,
            terms_hash: null,
            expires_at: "2099-01-01T00:00:00.000Z",
            is_valid: true,
          },
        });
      }

      return createMockResponse({ ok: true, status: 200 });
    });

    const user = userEvent.setup();
    const ui = await TermsAcceptPage({
      searchParams: Promise.resolve({ token: "abc" }),
    });
    render(ui);

    await user.click(
      screen.getByRole("button", { name: /acepto los términos y condiciones/i })
    );

    expect(
      await screen.findByRole("heading", {
        name: /¡listo! ya registramos tu aceptación/i,
      })
    ).toBeInTheDocument();

    const whatsappLink = screen.getByRole("link", {
      name: /continuar en whatsapp/i,
    });
    expect(whatsappLink).toHaveAttribute(
      "href",
      buildWhatsAppLink(WHATSAPP_MESSAGE_ACCEPT),
    );
  });
});

