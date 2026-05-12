"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2/promise";
import { db } from "@/lib/db";
import { createSession, destroySession } from "@/lib/session";

export interface LoginState {
  error?: string;
}

interface AdminRow extends RowDataPacket {
  id: number;
  username: string;
  password_hash: string;
}

export async function login(_prev: LoginState | undefined, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Username dan password wajib diisi." };
  }

  const [rows] = await db.query<AdminRow[]>(
    "SELECT id, username, password_hash FROM admin_user WHERE username = ? LIMIT 1",
    [username]
  );
  const user = rows[0];
  if (!user) {
    return { error: "Username atau password salah." };
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return { error: "Username atau password salah." };
  }

  await createSession(user.id, user.username);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
