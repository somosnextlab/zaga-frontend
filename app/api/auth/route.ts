import { NextResponse } from "next/server";
import { STATUS_OK } from "@/app/utils/constants/statusResponse";
import { fetchWithHeaderServer } from "@/app/utils/apiCallUtils/apiUtils.server";
import { LoginAuthResponse } from "@/app/types/login.types";

export async function GET(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = `${baseUrl}/auth/me`;

  try {
    // Extraer token del request: preferir Authorization header ya formado,
    // fallback a header personalizado access_token
    const incomingAuthorization = request.headers.get("authorization");
    const accessTokenHeader = request.headers.get("access_token");
    const accessToken =
      incomingAuthorization?.replace(/^Bearer\s+/i, "") ||
      accessTokenHeader ||
      undefined;

    const response = await fetchWithHeaderServer({
      url,
      method: "GET",
      accessToken,
    });

    if (response.status === STATUS_OK) {
      const data: LoginAuthResponse = await response.json();
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
