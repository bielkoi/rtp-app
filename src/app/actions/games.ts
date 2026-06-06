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
  GAMES_SUBDIR,
} from "@/lib/upload";

export interface GameFormState {
  error?: string;
}

const GAME_MIMES = ["image/png", "image/jpeg", "image/webp"];

interface GameImageRow extends RowDataPacket {
  gambar: string;
}

async function getCurrentGameImage(id: number): Promise<string | null> {
  const [rows] = await db.query<GameImageRow[]>(
    "SELECT gambar FROM game WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0]?.gambar ?? null;
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

  let gambar = gambarText;
  if (gambarFile && gambarFile.size > 0) {
    try {
      const saved = await saveUpload({
        file: gambarFile,
        subdir: GAMES_SUBDIR,
        baseName: slugBase(nama),
        preset: PRESETS.game,
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
  revalidatePath("/");
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

  let gambar = gambarText;
  let oldImage: string | null = null;
  if (gambarFile && gambarFile.size > 0) {
    oldImage = await getCurrentGameImage(id);
    try {
      const saved = await saveUpload({
        file: gambarFile,
        subdir: GAMES_SUBDIR,
        baseName: slugBase(nama),
        preset: PRESETS.game,
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

  if (oldImage && oldImage !== gambar) {
    await deleteUploadedFile(GAMES_SUBDIR, oldImage);
  }

  revalidatePath("/admin/games");
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin/games");
}

export async function deleteGame(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;
  const oldImage = await getCurrentGameImage(id);
  await db.query<ResultSetHeader>("DELETE FROM game WHERE id = ?", [id]);
  if (oldImage) {
    await deleteUploadedFile(GAMES_SUBDIR, oldImage);
  }
  revalidatePath("/admin/games");
  revalidatePath("/admin");
  revalidatePath("/");
}
