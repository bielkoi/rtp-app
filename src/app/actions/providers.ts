"use server";

import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ResultSetHeader } from "mysql2/promise";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { saveUpload, slugFolder, slugBase } from "@/lib/upload";

export interface ProviderFormState {
  error?: string;
}

const LOGO_MIMES = ["image/svg+xml", "image/png", "image/webp", "image/jpeg"];

function validate(nama: string) {
  if (!nama || nama.length < 1 || nama.length > 100) {
    return "Nama provider wajib diisi (1–100 karakter).";
  }
  return null;
}

export async function createProvider(
  _prev: ProviderFormState | undefined,
  formData: FormData
): Promise<ProviderFormState> {
  await requireAdmin();

  const nama = String(formData.get("nama") ?? "").trim();
  const logoText = String(formData.get("logo") ?? "").trim();
  const logoFile = formData.get("logo_file") as File | null;

  const err = validate(nama);
  if (err) return { error: err };

  let logo = logoText;
  if (logoFile && logoFile.size > 0) {
    try {
      const saved = await saveUpload({
        file: logoFile,
        subdir: path.join("images", "provider"),
        baseName: slugFolder(nama) || slugBase(nama),
        allowedMimes: LOGO_MIMES,
      });
      logo = saved.filename;
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Upload gagal." };
    }
  }
  if (!logo) {
    return { error: "Logo wajib: upload file atau isi nama file." };
  }

  try {
    await db.query<ResultSetHeader>(
      "INSERT INTO provider (nama, logo) VALUES (?, ?)",
      [nama, logo]
    );
  } catch (e: unknown) {
    if (typeof e === "object" && e && "code" in e && (e as { code?: string }).code === "ER_DUP_ENTRY") {
      return { error: "Nama provider sudah dipakai." };
    }
    throw e;
  }

  revalidatePath("/admin/providers");
  revalidatePath("/admin");
  redirect("/admin/providers");
}

export async function updateProvider(
  id: number,
  _prev: ProviderFormState | undefined,
  formData: FormData
): Promise<ProviderFormState> {
  await requireAdmin();

  const nama = String(formData.get("nama") ?? "").trim();
  const logoText = String(formData.get("logo") ?? "").trim();
  const logoFile = formData.get("logo_file") as File | null;

  const err = validate(nama);
  if (err) return { error: err };

  let logo = logoText;
  if (logoFile && logoFile.size > 0) {
    try {
      const saved = await saveUpload({
        file: logoFile,
        subdir: path.join("images", "provider"),
        baseName: slugFolder(nama) || slugBase(nama),
        allowedMimes: LOGO_MIMES,
      });
      logo = saved.filename;
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Upload gagal." };
    }
  }
  if (!logo) {
    return { error: "Logo wajib." };
  }

  try {
    await db.query<ResultSetHeader>(
      "UPDATE provider SET nama = ?, logo = ? WHERE id = ?",
      [nama, logo, id]
    );
  } catch (e: unknown) {
    if (typeof e === "object" && e && "code" in e && (e as { code?: string }).code === "ER_DUP_ENTRY") {
      return { error: "Nama provider sudah dipakai." };
    }
    throw e;
  }

  revalidatePath("/admin/providers");
  revalidatePath("/admin");
  redirect("/admin/providers");
}

export async function deleteProvider(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;
  await db.query<ResultSetHeader>("DELETE FROM provider WHERE id = ?", [id]);
  revalidatePath("/admin/providers");
  revalidatePath("/admin");
  revalidatePath("/admin/games");
}
