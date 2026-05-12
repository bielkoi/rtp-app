import "server-only";
import { redirect } from "next/navigation";
import { getSession, type SessionPayload } from "@/lib/session";

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
