/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TermsAcceptPage from "../accept/page";
import { CONSENTS_ACCEPT_ENDPOINT } from "../utils/constants";
import { useSearchParams } from "next/navigation";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { WHATSAPP_MESSAGE_ACCEPT } from "@/app/mocks/messageMocks";

jest.mock("next/navigation", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/__mocks__/next-navigation");
});

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
  const mockUseSearchParams = useSearchParams as unknown as jest.Mock;
  let fetchMock: jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    // Default: sin token
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    fetchMock = jest.fn() as unknown as jest.MockedFunction<typeof fetch>;
    globalThis.fetch = fetchMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test.skip("sin token: muestra error y no muestra botón de aceptar", () => {
    render(<TermsAcceptPage />);

    expect(
      screen.getByRole("heading", { name: /link inválido o incompleto/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: /acepto los términos y condiciones/i,
      })
    ).not.toBeInTheDocument();
  });

  test.skip("con token: muestra TyC y botón de aceptar", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("token=abc"));

    render(<TermsAcceptPage />);

    expect(
      screen.getByRole("heading", { name: /términos y condiciones/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /acepto los términos y condiciones/i })
    ).toBeInTheDocument();
  });

  test.skip("al aceptar: envía POST con el token", async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("token=abc"));

    fetchMock.mockResolvedValue(
      createMockResponse({
        ok: true,
        status: 200,
      }),
    );

    const user = userEvent.setup();
    render(<TermsAcceptPage />);

    await user.click(
      screen.getByRole("button", { name: /acepto los términos y condiciones/i })
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    const [url, options] = fetchMock.mock.calls[0] as [
      string,
      RequestInit
    ];

    const backendBase = (process.env.NEXT_PUBLIC_BACKEND_URL ?? "").replace(/\/+$/, "");
    expect(backendBase.length).toBeGreaterThan(0);
    expect(url).toBe(`${backendBase}/consents/accept`);
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

  test.skip("error de red: muestra mensaje amigable (no técnico)", async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("token=abc"));

    fetchMock.mockRejectedValue(new Error("Failed to fetch"));

    const user = userEvent.setup();
    render(<TermsAcceptPage />);

    await user.click(
      screen.getByRole("button", { name: /acepto los términos y condiciones/i })
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/no pudimos conectarnos/i);
    expect(alert).not.toHaveTextContent(/failed to fetch/i);
  });

  test.skip("success: muestra confirmación y link a WhatsApp", async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("token=abc"));

    fetchMock.mockResolvedValue(
      createMockResponse({
        ok: true,
        status: 200,
      }),
    );

    const user = userEvent.setup();
    render(<TermsAcceptPage />);

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

