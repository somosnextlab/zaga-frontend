import { STATUS_OK } from "@/app/utils/constants/statusResponse";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = `${baseUrl}/auth/me`;

  try {
    // Preferir Authorization ya formada; fallback a header personalizado access_token
    const incomingAuthorization = request.headers.get("authorization");
    const accessToken = request.headers.get("access_token");
    const authorizationHeader =
      incomingAuthorization || (accessToken ? `Bearer ${accessToken}` : "");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        ...(authorizationHeader ? { Authorization: authorizationHeader } : {}),
      },
    });
    if (response.status === STATUS_OK) {
      const data = await response.json();
      return new NextResponse(JSON.stringify(data), {
        status: response.status,
        headers: { "content-type": "application/json" },
      });
    }
    return new NextResponse(JSON.stringify({ status: response.status }), {
      status: response.status,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Server error", error }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
}
