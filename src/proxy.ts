import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "rtp_admin_session";
const encodedKey = new TextEncoder().encode(process.env.JWT_SECRET ?? "");

async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, encodedKey, { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const valid = await isValidSession(token);

  if (!valid) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
