import { NextResponse } from "next/server";

export async function GET(request: Request) {
  void request;

  return new NextResponse(
    JSON.stringify({
      message: "Autenticación en mantenimiento",
    }),
    {
      status: 503,
      headers: { "content-type": "application/json" },
    }
  );
}
