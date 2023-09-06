import { NextRequest, NextResponse } from "next/server";

export const GET = async function GET(req: NextRequest) {
  const res = new NextResponse();

  const url = `${
    process.env.NEXT_PUBLIC_BACKEND_URL
  }/users/no-auth?email=${req.nextUrl.searchParams.get("email")}`;
  const response = await fetch(url, {
    cache: "no-store",
  });
  const user = await response.json();
  return NextResponse.json(user, { status: 200 });
};
