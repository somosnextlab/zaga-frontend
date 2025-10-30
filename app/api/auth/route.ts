import { STATUS_OK } from "@/app/utils/constants/statusResponse";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = `${baseUrl}/auth/me`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${request.headers.get("access_token")}`,
      },
    });
    if (response.status === STATUS_OK) {
      const data = await response.json();
      console.log(data)
      return new NextResponse(JSON.stringify(data), {
        status: response.status,
      });
    }
    return new NextResponse(JSON.stringify(response), {
      status: response.status,
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
