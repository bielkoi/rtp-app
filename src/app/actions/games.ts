"use server";

import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { saveUpload, slugFolder, slugBase } from "@/lib/upload";

export interface GameFormState {
  error?: string;
}

const GAME_MIMES = ["image/png", "image/jpeg", "image/webp"];

interface ProviderNameRow extends RowDataPacket {
  nama: string;
}

async function providerFolder(id: number): Promise<string | null> {
  const [rows] = await db.query<ProviderNameRow[]>(
    "SELECT nama FROM provider WHERE id = ? LIMIT 1",
    [id]
  );
  const nama = rows[0]?.nama;
  return nama ? slugFolder(nama) : null;
}

function validate(nama: string, idProvider: number) {
  if (!nama || nama.length < 1 || nama.length > 255) {
    return "Nama game wajib diisi (1–255 karakter).";
  }
  if (!Number.isFinite(idProvider) || idProvider <= 0) {
    return "Provider wajib dipilih.";
  }
  return null;
}

export async function createGame(
  _prev: GameFormState | undefined,
  formData: FormData
): Promise<GameFormState> {
  await requireAdmin();

  const nama = String(formData.get("nama") ?? "").trim();
  const idProvider = Number(formData.get("id_provider"));
  const gambarText = String(formData.get("gambar") ?? "").trim();
  const gambarFile = formData.get("gambar_file") as File | null;

  const err = validate(nama, idProvider);
  if (err) return { error: err };

  const folder = await providerFolder(idProvider);
  if (!folder) return { error: "Provider tidak ditemukan." };

  let gambar = gambarText;
  if (gambarFile && gambarFile.size > 0) {
    try {
      const saved = await saveUpload({
        file: gambarFile,
        subdir: path.join("images", folder),
        baseName: slugBase(nama),
        allowedMimes: GAME_MIMES,
      });
      gambar = saved.filename;
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Upload gagal." };
    }
  }
  if (!gambar) return { error: "Gambar wajib: upload file atau isi nama file." };

  await db.query<ResultSetHeader>(
    "INSERT INTO game (id_provider, nama, gambar) VALUES (?, ?, ?)",
    [idProvider, nama, gambar]
  );

  revalidatePath("/admin/games");
  revalidatePath("/admin");
  redirect("/admin/games");
}

export async function updateGame(
  id: number,
  _prev: GameFormState | undefined,
  formData: FormData
): Promise<GameFormState> {
  await requireAdmin();

  const nama = String(formData.get("nama") ?? "").trim();
  const idProvider = Number(formData.get("id_provider"));
  const gambarText = String(formData.get("gambar") ?? "").trim();
  const gambarFile = formData.get("gambar_file") as File | null;

  const err = validate(nama, idProvider);
  if (err) return { error: err };

  const folder = await providerFolder(idProvider);
  if (!folder) return { error: "Provider tidak ditemukan." };

  let gambar = gambarText;
  if (gambarFile && gambarFile.size > 0) {
    try {
      const saved = await saveUpload({
        file: gambarFile,
        subdir: path.join("images", folder),
        baseName: slugBase(nama),
        allowedMimes: GAME_MIMES,
      });
      gambar = saved.filename;
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Upload gagal." };
    }
  }
  if (!gambar) return { error: "Gambar wajib." };

  await db.query<ResultSetHeader>(
    "UPDATE game SET id_provider = ?, nama = ?, gambar = ? WHERE id = ?",
    [idProvider, nama, gambar, id]
  );

  revalidatePath("/admin/games");
  revalidatePath("/admin");
  redirect("/admin/games");
}

export async function deleteGame(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;
  await db.query<ResultSetHeader>("DELETE FROM game WHERE id = ?", [id]);
  revalidatePath("/admin/games");
  revalidatePath("/admin");
}
