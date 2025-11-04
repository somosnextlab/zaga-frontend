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
import {
  createMockResponse,
  createMockSimpleResponse,
  mockUserData,
  mockTokens,
} from "@/__mocks__/test-data";

// Mock de fetchWithHeaderServer
jest.mock("@/app/utils/apiCallUtils/apiUtils.server", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/__mocks__/api-utils-server");
});

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
    const mockResponse = createMockResponse(
      {
        success: true,
        data: mockUserData,
      },
      STATUS_OK
    );

    mockFetchWithHeaderServer.mockResolvedValue(mockResponse);

    const request = new NextRequest("http://localhost:3000/api/auth", {
      headers: {
        authorization: `Bearer ${mockTokens.validToken}`,
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
      accessToken: mockTokens.validToken,
    });
  });

  test("02 - should extract token from Authorization header", async () => {
    const mockResponse = createMockSimpleResponse(STATUS_OK);

    mockFetchWithHeaderServer.mockResolvedValue(mockResponse);

    const request = new NextRequest("http://localhost:3000/api/auth", {
      headers: {
        authorization: `Bearer ${mockTokens.testToken}`,
      },
    });

    await GET(request);

    expect(mockFetchWithHeaderServer).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: mockTokens.testToken,
      })
    );
  });

  test("03 - should extract token from Authorization header with Bearer prefix", async () => {
    const mockResponse = createMockSimpleResponse(STATUS_OK);

    mockFetchWithHeaderServer.mockResolvedValue(mockResponse);

    const request = new NextRequest("http://localhost:3000/api/auth", {
      headers: {
        authorization: `Bearer ${mockTokens.bearerToken}`,
      },
    });

    await GET(request);

    expect(mockFetchWithHeaderServer).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: mockTokens.bearerToken,
      })
    );
  });

  test("04 - should use access_token header as fallback", async () => {
    const mockResponse = createMockSimpleResponse(STATUS_OK);

    mockFetchWithHeaderServer.mockResolvedValue(mockResponse);

    const request = new NextRequest("http://localhost:3000/api/auth", {
      headers: {
        access_token: mockTokens.fallbackToken,
      },
    });

    await GET(request);

    expect(mockFetchWithHeaderServer).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: mockTokens.fallbackToken,
      })
    );
  });

  test("05 - should handle request without token", async () => {
    const mockResponse = createMockSimpleResponse(STATUS_OK);

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
    const mockResponse = createMockSimpleResponse(errorStatus);

    mockFetchWithHeaderServer.mockResolvedValue(mockResponse);

    const request = new NextRequest("http://localhost:3000/api/auth", {
      headers: {
        authorization: `Bearer ${mockTokens.invalidToken}`,
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
        authorization: `Bearer ${mockTokens.validToken}`,
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(STATUS_SERVER_ERROR);
    expect(data.message).toBe("Server error");
  });

  test("08 - should return proper content-type header", async () => {
    const mockResponse = createMockSimpleResponse(STATUS_OK);

    mockFetchWithHeaderServer.mockResolvedValue(mockResponse);

    const request = new NextRequest("http://localhost:3000/api/auth", {
      headers: {
        authorization: `Bearer ${mockTokens.validToken}`,
      },
    });

    const response = await GET(request);

    expect(response.headers.get("content-type")).toBe("application/json");
  });

  test("09 - should handle case-insensitive Bearer prefix", async () => {
    const mockResponse = createMockSimpleResponse(STATUS_OK);

    mockFetchWithHeaderServer.mockResolvedValue(mockResponse);

    const request = new NextRequest("http://localhost:3000/api/auth", {
      headers: {
        authorization: `bearer ${mockTokens.lowercaseToken}`,
      },
    });

    await GET(request);

    expect(mockFetchWithHeaderServer).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: mockTokens.lowercaseToken,
      })
    );
  });

  test("10 - should handle Authorization header with multiple spaces", async () => {
    const mockResponse = createMockSimpleResponse(STATUS_OK);

    mockFetchWithHeaderServer.mockResolvedValue(mockResponse);

    const request = new NextRequest("http://localhost:3000/api/auth", {
      headers: {
        authorization: `Bearer   ${mockTokens.spacedToken}`,
      },
    });

    await GET(request);

    expect(mockFetchWithHeaderServer).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: mockTokens.spacedToken,
      })
    );
  });
});
