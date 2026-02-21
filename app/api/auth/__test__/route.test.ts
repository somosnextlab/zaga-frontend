/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { GET } from "../route";

describe("API - /api/auth", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_BACKEND_URL = "http://localhost:8000";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("01 - should return 503 when auth is in maintenance", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.message).toBe("Autenticación en mantenimiento");
    expect(response.headers.get("content-type")).toBe("application/json");
  });
});
