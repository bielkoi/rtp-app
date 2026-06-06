"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import {
  saveUpload,
  deleteUploadedFile,
  slugBase,
  PRESETS,
  PROVIDER_SUBDIR,
  GAMES_SUBDIR,
} from "@/lib/upload";

export interface ProviderFormState {
  error?: string;
}

const LOGO_MIMES = ["image/svg+xml", "image/png", "image/webp", "image/jpeg"];

function validate(nama: string, rating: number) {
  if (!nama || nama.length < 1 || nama.length > 100) {
    return "Nama provider wajib diisi (1–100 karakter).";
  }
  if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
    return "Rating harus antara 0.0 dan 5.0.";
  }
  return null;
}

function parseRating(formData: FormData): number {
  const raw = String(formData.get("rating") ?? "").trim();
  if (!raw) return 4.0;
  const n = Number(raw);
  return Number.isFinite(n) ? Math.round(n * 10) / 10 : NaN;
}

interface ProviderLogoRow extends RowDataPacket {
  logo: string;
}

interface GameImageRow extends RowDataPacket {
  gambar: string;
}

async function getCurrentLogo(id: number): Promise<string | null> {
  const [rows] = await db.query<ProviderLogoRow[]>(
    "SELECT logo FROM provider WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0]?.logo ?? null;
}

export async function createProvider(
  _prev: ProviderFormState | undefined,
  formData: FormData
): Promise<ProviderFormState> {
  await requireAdmin();

  const nama = String(formData.get("nama") ?? "").trim();
  const logoText = String(formData.get("logo") ?? "").trim();
  const logoFile = formData.get("logo_file") as File | null;
  const rating = parseRating(formData);

  const err = validate(nama, rating);
  if (err) return { error: err };

  let logo = logoText;
  if (logoFile && logoFile.size > 0) {
    try {
      const saved = await saveUpload({
        file: logoFile,
        subdir: PROVIDER_SUBDIR,
        baseName: slugBase(nama),
        preset: PRESETS.provider,
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
      "INSERT INTO provider (nama, logo, rating) VALUES (?, ?, ?)",
      [nama, logo, rating]
    );
  } catch (e: unknown) {
    if (typeof e === "object" && e && "code" in e && (e as { code?: string }).code === "ER_DUP_ENTRY") {
      return { error: "Nama provider sudah dipakai." };
    }
    throw e;
  }

  revalidatePath("/admin/providers");
  revalidatePath("/admin");
  revalidatePath("/");
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
  const rating = parseRating(formData);

  const err = validate(nama, rating);
  if (err) return { error: err };

  let logo = logoText;
  let oldLogo: string | null = null;
  if (logoFile && logoFile.size > 0) {
    oldLogo = await getCurrentLogo(id);
    try {
      const saved = await saveUpload({
        file: logoFile,
        subdir: PROVIDER_SUBDIR,
        baseName: slugBase(nama),
        preset: PRESETS.provider,
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
      "UPDATE provider SET nama = ?, logo = ?, rating = ? WHERE id = ?",
      [nama, logo, rating, id]
    );
  } catch (e: unknown) {
    if (typeof e === "object" && e && "code" in e && (e as { code?: string }).code === "ER_DUP_ENTRY") {
      return { error: "Nama provider sudah dipakai." };
    }
    throw e;
  }

  if (oldLogo && oldLogo !== logo) {
    await deleteUploadedFile(PROVIDER_SUBDIR, oldLogo);
  }

  revalidatePath("/admin/providers");
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin/providers");
}

export async function deleteProvider(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;

  // Kumpulkan semua filename (logo + games yang akan ke-cascade) SEBELUM delete.
  const oldLogo = await getCurrentLogo(id);
  const [gameRows] = await db.query<GameImageRow[]>(
    "SELECT gambar FROM game WHERE id_provider = ?",
    [id]
  );

  await db.query<ResultSetHeader>("DELETE FROM provider WHERE id = ?", [id]);

  // Cleanup file setelah DB delete sukses (FK CASCADE sudah hapus rows game).
  if (oldLogo) await deleteUploadedFile(PROVIDER_SUBDIR, oldLogo);
  await Promise.all(gameRows.map((g) => deleteUploadedFile(GAMES_SUBDIR, g.gambar)));

  revalidatePath("/admin/providers");
  revalidatePath("/admin");
  revalidatePath("/admin/games");
  revalidatePath("/");
}
