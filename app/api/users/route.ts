import { withApiAuthRequired, getAccessToken } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

export const GET = withApiAuthRequired(async function GET(req) {
  const res = new NextResponse();
  const { accessToken } = await getAccessToken(req, res);

  const url = "https://jsonplaceholder.typicode.com/users";
  const response = await fetch(url);
  const responseJson = await response.json();
  return NextResponse.json(responseJson, { status: 200 });
});
