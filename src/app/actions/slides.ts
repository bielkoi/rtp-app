"use server";

import { revalidatePath } from "next/cache";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import {
  saveUpload,
  deleteUploadedFile,
  PRESETS,
  SLIDE_SUBDIR,
} from "@/lib/upload";

export interface SlideFormState {
  error?: string;
  ok?: boolean;
}

const SLIDE_MIMES = ["image/png", "image/jpeg", "image/webp"];

interface SlideRow extends RowDataPacket {
  filename: string;
}

interface MaxOrderRow extends RowDataPacket {
  max_order: number | null;
}

export async function createSlide(
  _prev: SlideFormState | undefined,
  formData: FormData
): Promise<SlideFormState> {
  await requireAdmin();

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { error: "Pilih file gambar dahulu." };
  }

  let saved;
  try {
    saved = await saveUpload({
      file,
      subdir: SLIDE_SUBDIR,
      baseName: "slide",
      preset: PRESETS.slide,
      allowedMimes: SLIDE_MIMES,
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Upload gagal." };
  }

  // sort_order = current max + 1 (append ke akhir)
  const [orderRows] = await db.query<MaxOrderRow[]>(
    "SELECT MAX(sort_order) AS max_order FROM slide"
  );
  const nextOrder = (orderRows[0]?.max_order ?? 0) + 1;

  await db.query<ResultSetHeader>(
    "INSERT INTO slide (filename, sort_order) VALUES (?, ?)",
    [saved.filename, nextOrder]
  );

  revalidatePath("/admin/settings/slider");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteSlide(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;

  const [rows] = await db.query<SlideRow[]>(
    "SELECT filename FROM slide WHERE id = ? LIMIT 1",
    [id]
  );
  const filename = rows[0]?.filename;

  await db.query<ResultSetHeader>("DELETE FROM slide WHERE id = ?", [id]);

  if (filename) {
    await deleteUploadedFile(SLIDE_SUBDIR, filename);
  }

  revalidatePath("/admin/settings/slider");
  revalidatePath("/");
}
