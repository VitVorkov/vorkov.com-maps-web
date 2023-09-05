import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = `${
    process.env.NEXT_PUBLIC_BACKEND_URL
  }/users?name=${req.nextUrl.searchParams.get("name")}`;

  const response = await fetch(url, { cache: "no-store" });
  const data = await response.json();
  return NextResponse.json(data);
}
