import { withApiAuthRequired, getAccessToken } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

export const GET = withApiAuthRequired(async function POST(req) {
  const res = new NextResponse();
  const { accessToken } = await getAccessToken(req, res);

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/countries/update`;
  const response = await fetch(url, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      email: req.nextUrl.searchParams.get("email"),
      country: req.nextUrl.searchParams.get("country"),
    }),
  });
  const user = await response.json();
  return NextResponse.json(user, { status: 200 });
});
