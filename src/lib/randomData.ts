import "server-only";
import { unstable_cache } from "next/cache";
import type { RowDataPacket } from "mysql2/promise";
import { db } from "@/lib/db";

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

export interface AppSettings {
  refreshIntervalMinutes: number;
  rtpMin: number;
  rtpMax: number;
  backgroundFilename: string | null;
  logoFilename: string | null;
  runningText: string;
}

const DEFAULTS: AppSettings = {
  refreshIntervalMinutes: 10,
  rtpMin: 0,
  rtpMax: 100,
  backgroundFilename: null,
  logoFilename: null,
  runningText: "",
};

interface SettingRow extends RowDataPacket {
  refresh_interval_minutes: number;
  rtp_min: number;
  rtp_max: number;
  background_filename: string | null;
  logo_filename: string | null;
  running_text: string | null;
}

/**
 * Semua app settings — di-cache, di-invalidate via revalidateTag("app-setting").
 */
export const getAppSettings = unstable_cache(
  async (): Promise<AppSettings> => {
    const [rows] = await db.query<SettingRow[]>(
      "SELECT refresh_interval_minutes, rtp_min, rtp_max, background_filename, logo_filename, running_text FROM app_setting WHERE id = 1 LIMIT 1"
    );
    const r = rows[0];
    if (!r) return DEFAULTS;
    return {
      refreshIntervalMinutes: r.refresh_interval_minutes,
      rtpMin: r.rtp_min,
      rtpMax: r.rtp_max,
      backgroundFilename: r.background_filename,
      logoFilename: r.logo_filename,
      runningText: r.running_text ?? "",
    };
  },
  ["app-setting"],
  { tags: ["app-setting"] }
);

export async function getRefreshIntervalMinutes(): Promise<number> {
  return (await getAppSettings()).refreshIntervalMinutes;
}

/**
 * Index bucket waktu sekarang berdasarkan interval saat ini, di-anchor ke WIB.
 * Plus rtp range yang aktif — semua client query pakai window + range yang sama.
 */
export async function getCurrentBucket(): Promise<{
  bucket: number;
  intervalMinutes: number;
  windowStartMs: number;
  rtpMin: number;
  rtpMax: number;
}> {
  const settings = await getAppSettings();
  const intervalMs = settings.refreshIntervalMinutes * 60 * 1000;
  const wibNow = Date.now() + WIB_OFFSET_MS;
  const bucket = Math.floor(wibNow / intervalMs);
  const windowStartMs = bucket * intervalMs - WIB_OFFSET_MS;
  return {
    bucket,
    intervalMinutes: settings.refreshIntervalMinutes,
    windowStartMs,
    rtpMin: settings.rtpMin,
    rtpMax: settings.rtpMax,
  };
}
