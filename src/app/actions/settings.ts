"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import {
  saveUpload,
  deleteUploadedFile,
  PRESETS,
  BACKGROUND_SUBDIR,
  LOGO_SUBDIR,
} from "@/lib/upload";

export interface SettingsFormState {
  error?: string;
  ok?: boolean;
}

const MIN_INTERVAL = 1;
const MAX_INTERVAL = 60;
const RTP_LOW = 0;
const RTP_HIGH = 100;

const IMAGE_MIMES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

interface FilenameRow extends RowDataPacket {
  background_filename: string | null;
  logo_filename: string | null;
}

async function getCurrentFilenames(): Promise<FilenameRow | null> {
  const [rows] = await db.query<FilenameRow[]>(
    "SELECT background_filename, logo_filename FROM app_setting WHERE id = 1 LIMIT 1"
  );
  return rows[0] ?? null;
}

function invalidate() {
  revalidateTag("app-setting", "max");
  revalidatePath("/");
}

// ─── Behavior settings (interval + RTP range) ────────────────────────────────

export async function updateAppSettings(
  _prev: SettingsFormState | undefined,
  formData: FormData
): Promise<SettingsFormState> {
  await requireAdmin();

  const interval = Number(formData.get("refresh_interval_minutes"));
  const rtpMin = Number(formData.get("rtp_min"));
  const rtpMax = Number(formData.get("rtp_max"));

  if (!Number.isInteger(interval) || interval < MIN_INTERVAL || interval > MAX_INTERVAL) {
    return { error: `Interval harus bilangan bulat antara ${MIN_INTERVAL} dan ${MAX_INTERVAL} menit.` };
  }
  if (!Number.isInteger(rtpMin) || rtpMin < RTP_LOW || rtpMin > RTP_HIGH) {
    return { error: `RTP min harus bilangan bulat antara ${RTP_LOW} dan ${RTP_HIGH}.` };
  }
  if (!Number.isInteger(rtpMax) || rtpMax < RTP_LOW || rtpMax > RTP_HIGH) {
    return { error: `RTP max harus bilangan bulat antara ${RTP_LOW} dan ${RTP_HIGH}.` };
  }
  if (rtpMin >= rtpMax) {
    return { error: "RTP min harus lebih kecil dari RTP max." };
  }

  await db.query<ResultSetHeader>(
    "UPDATE app_setting SET refresh_interval_minutes = ?, rtp_min = ?, rtp_max = ? WHERE id = 1",
    [interval, rtpMin, rtpMax]
  );

  invalidate();
  revalidatePath("/admin/settings");
  return { ok: true };
}

// ─── Branding: Background ────────────────────────────────────────────────────

export async function updateBackground(
  _prev: SettingsFormState | undefined,
  formData: FormData
): Promise<SettingsFormState> {
  await requireAdmin();

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { error: "Pilih file gambar dahulu." };
  }

  const current = await getCurrentFilenames();
  let saved;
  try {
    saved = await saveUpload({
      file,
      subdir: BACKGROUND_SUBDIR,
      baseName: "background",
      preset: PRESETS.background,
      allowedMimes: IMAGE_MIMES,
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Upload gagal." };
  }

  await db.query<ResultSetHeader>(
    "UPDATE app_setting SET background_filename = ? WHERE id = 1",
    [saved.filename]
  );

  // Cleanup file lama (kalau bukan default seed file)
  if (current?.background_filename && current.background_filename !== saved.filename) {
    await deleteUploadedFile(BACKGROUND_SUBDIR, current.background_filename);
  }

  invalidate();
  revalidatePath("/admin/settings/background");
  return { ok: true };
}

// ─── Branding: Logo ──────────────────────────────────────────────────────────

export async function updateLogo(
  _prev: SettingsFormState | undefined,
  formData: FormData
): Promise<SettingsFormState> {
  await requireAdmin();

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { error: "Pilih file gambar dahulu." };
  }

  const current = await getCurrentFilenames();
  let saved;
  try {
    saved = await saveUpload({
      file,
      subdir: LOGO_SUBDIR,
      baseName: "logo",
      preset: PRESETS.logo,
      allowedMimes: IMAGE_MIMES,
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Upload gagal." };
  }

  await db.query<ResultSetHeader>(
    "UPDATE app_setting SET logo_filename = ? WHERE id = 1",
    [saved.filename]
  );

  if (current?.logo_filename && current.logo_filename !== saved.filename) {
    await deleteUploadedFile(LOGO_SUBDIR, current.logo_filename);
  }

  invalidate();
  revalidatePath("/admin/settings/logo");
  return { ok: true };
}

// ─── Branding: Running Text ──────────────────────────────────────────────────

export async function updateRunningText(
  _prev: SettingsFormState | undefined,
  formData: FormData
): Promise<SettingsFormState> {
  await requireAdmin();

  const text = String(formData.get("running_text") ?? "").trim();
  if (text.length > 5000) {
    return { error: "Running text maksimal 5000 karakter." };
  }

  await db.query<ResultSetHeader>(
    "UPDATE app_setting SET running_text = ? WHERE id = 1",
    [text]
  );

  invalidate();
  revalidatePath("/admin/settings/running-text");
  return { ok: true };
}
