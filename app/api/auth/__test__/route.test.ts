/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { GET } from "../route";
import { fetchWithHeaderServer } from "@/app/utils/apiCallUtils/apiUtils.server";
import {
  STATUS_OK,
  STATUS_SERVER_ERROR,
} from "@/app/utils/constants/statusResponse";

// Mock de fetchWithHeaderServer
jest.mock("@/app/utils/apiCallUtils/apiUtils.server", () => ({
  fetchWithHeaderServer: jest.fn(),
}));

describe("API - /api/auth", () => {
  const mockFetchWithHeaderServer =
    fetchWithHeaderServer as jest.MockedFunction<typeof fetchWithHeaderServer>;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_BACKEND_URL = "http://localhost:8000";
    mockFetchWithHeaderServer.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("01 - should return user data with valid token", async () => {
    const mockResponse = new Response(
      JSON.stringify({
        success: true,
        data: {
          userId: "1",
          email: "test@example.com",
          role: "usuario",
          estado: "activo",
          persona: {
            id: "1",
            nombre: "Test",
            apellido: "User",
            telefono: "1234567890",
          },
        },
      }),
      { status: STATUS_OK, headers: { "content-type": "application/json" } }
    );

    mockFetchWithHeaderServer.mockResolvedValue(mockResponse);

    const request = new NextRequest("http://localhost:3000/api/auth", {
      headers: {
        authorization: "Bearer valid-token",
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(STATUS_OK);
    expect(data.success).toBe(true);
    expect(data.data.email).toBe("test@example.com");
    expect(mockFetchWithHeaderServer).toHaveBeenCalledWith({
      url: "http://localhost:8000/auth/me",
      method: "GET",
      accessToken: "valid-token",
    });
  });

  test("02 - should extract token from Authorization header", async () => {
    const mockResponse = new Response(
      JSON.stringify({ success: true, data: {} }),
      { status: STATUS_OK }
    );

    mockFetchWithHeaderServer.mockResolvedValue(mockResponse);

    const request = new NextRequest("http://localhost:3000/api/auth", {
      headers: {
        authorization: "Bearer test-token-123",
      },
    });

    await GET(request);

    expect(mockFetchWithHeaderServer).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: "test-token-123",
      })
    );
  });

  test("03 - should extract token from Authorization header with Bearer prefix", async () => {
    const mockResponse = new Response(
      JSON.stringify({ success: true, data: {} }),
      { status: STATUS_OK }
    );

    mockFetchWithHeaderServer.mockResolvedValue(mockResponse);

    const request = new NextRequest("http://localhost:3000/api/auth", {
      headers: {
        authorization: "Bearer token-with-bearer",
      },
    });

    await GET(request);

    expect(mockFetchWithHeaderServer).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: "token-with-bearer",
      })
    );
  });

  test("04 - should use access_token header as fallback", async () => {
    const mockResponse = new Response(
      JSON.stringify({ success: true, data: {} }),
      { status: STATUS_OK }
    );

    mockFetchWithHeaderServer.mockResolvedValue(mockResponse);

    const request = new NextRequest("http://localhost:3000/api/auth", {
      headers: {
        access_token: "fallback-token",
      },
    });

    await GET(request);

    expect(mockFetchWithHeaderServer).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: "fallback-token",
      })
    );
  });

  test("05 - should handle request without token", async () => {
    const mockResponse = new Response(JSON.stringify({ status: STATUS_OK }), {
      status: STATUS_OK,
    });

    mockFetchWithHeaderServer.mockResolvedValue(mockResponse);

    const request = new NextRequest("http://localhost:3000/api/auth");

    await GET(request);

    expect(mockFetchWithHeaderServer).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: undefined,
      })
    );
  });

  test("06 - should return error status when API returns non-200 status", async () => {
    const errorStatus = 401;
    const mockResponse = new Response(JSON.stringify({ status: errorStatus }), {
      status: errorStatus,
    });

    mockFetchWithHeaderServer.mockResolvedValue(mockResponse);

    const request = new NextRequest("http://localhost:3000/api/auth", {
      headers: {
        authorization: "Bearer invalid-token",
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(errorStatus);
    expect(data.status).toBe(errorStatus);
  });

  test("07 - should return 500 status on server error", async () => {
    mockFetchWithHeaderServer.mockRejectedValue(new Error("Network error"));

    const request = new NextRequest("http://localhost:3000/api/auth", {
      headers: {
        authorization: "Bearer token",
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(STATUS_SERVER_ERROR);
    expect(data.message).toBe("Server error");
  });

  test("08 - should return proper content-type header", async () => {
    const mockResponse = new Response(
      JSON.stringify({ success: true, data: {} }),
      { status: STATUS_OK }
    );

    mockFetchWithHeaderServer.mockResolvedValue(mockResponse);

    const request = new NextRequest("http://localhost:3000/api/auth", {
      headers: {
        authorization: "Bearer token",
      },
    });

    const response = await GET(request);

    expect(response.headers.get("content-type")).toBe("application/json");
  });

  test("09 - should handle case-insensitive Bearer prefix", async () => {
    const mockResponse = new Response(
      JSON.stringify({ success: true, data: {} }),
      { status: STATUS_OK }
    );

    mockFetchWithHeaderServer.mockResolvedValue(mockResponse);

    const request = new NextRequest("http://localhost:3000/api/auth", {
      headers: {
        authorization: "bearer lowercase-token",
      },
    });

    await GET(request);

    expect(mockFetchWithHeaderServer).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: "lowercase-token",
      })
    );
  });

  test("10 - should handle Authorization header with multiple spaces", async () => {
    const mockResponse = new Response(
      JSON.stringify({ success: true, data: {} }),
      { status: STATUS_OK }
    );

    mockFetchWithHeaderServer.mockResolvedValue(mockResponse);

    const request = new NextRequest("http://localhost:3000/api/auth", {
      headers: {
        authorization: "Bearer   spaced-token",
      },
    });

    await GET(request);

    expect(mockFetchWithHeaderServer).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: "spaced-token",
      })
    );
  });
});
