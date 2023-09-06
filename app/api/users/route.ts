import { withApiAuthRequired, getAccessToken } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

export const GET = withApiAuthRequired(async function GET(req) {
  const res = new NextResponse();
  const { accessToken } = await getAccessToken(req, res);

  const url = `${
    process.env.NEXT_PUBLIC_BACKEND_URL
  }/users?email=${req.nextUrl.searchParams.get("email")}`;
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const user = await response.json();
  return NextResponse.json(user, { status: 200 });
});
