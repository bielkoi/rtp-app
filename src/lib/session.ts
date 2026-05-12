import "server-only";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "rtp_admin_session";
const SESSION_TTL_DAYS = 7;

export interface SessionPayload extends JWTPayload {
  uid: number;
  username: string;
}

const encodedKey = new TextEncoder().encode(process.env.JWT_SECRET ?? "");

export async function encrypt(payload: Pick<SessionPayload, "uid" | "username">) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_DAYS}d`)
    .sign(encodedKey);
}

export async function decrypt(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(uid: number, username: string) {
  const token = await encrypt({ uid, username });
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  return decrypt(jar.get(COOKIE_NAME)?.value);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
