import { NextResponse } from "next/server";

export const GET = async function GET() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/no-auth`;
  const response = await fetch(url);
  const user = await response.json();
  return NextResponse.json(user, { status: 200 });
};
