import "server-only";
import type { RowDataPacket } from "mysql2/promise";
import { db } from "@/lib/db";
import { Game } from "@/types";
import { rngFor } from "@/lib/rng";
import { getCurrentBucket } from "@/lib/randomData";

interface GameRow extends RowDataPacket {
  id: number;
  name: string;
  image: string;
  provider: string;
}

interface ProviderRow extends RowDataPacket {
  nama: string;
  logo: string;
}

export interface ProviderInfo {
  nama: string;
  logo: string;
}

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

const POLA_TYPES = ["Manual", "Auto", "Spin"] as const;
const POLA_TOTAL_MIN = 5;
const POLA_TOTAL_MAX = 30;
const POLA_COUNT = 3;

export async function getAllGames(): Promise<Game[]> {
  const [bucketInfo, [rows]] = await Promise.all([
    getCurrentBucket(),
    db.query<GameRow[]>(
      `SELECT g.id, g.nama AS name, g.gambar AS image, p.nama AS provider
       FROM game g
       JOIN provider p ON p.id = g.id_provider
       ORDER BY p.id, g.id`
    ),
  ]);

  const { bucket, intervalMinutes, windowStartMs, rtpMin, rtpMax } = bucketInfo;
  // Ensure jam gacor start is always ≥ "now" even at the end of the bucket window.
  const minOffsetMin = Math.max(10, intervalMinutes + 5);

  return rows.map((row) => {
    // Float internal (presisi tinggi) supaya sort untuk HOT tab menghasilkan urutan unik;
    // display di RtpCard akan di-Math.round jadi integer.
    const rtp = rngFor("rtp", bucket, row.id).float() * (rtpMax - rtpMin) + rtpMin;

    const gacorRng = rngFor("gacor", bucket, row.id);
    const offsetMin = gacorRng.int(minOffsetMin, 180);
    const durationMin = gacorRng.int(15, 45);
    const startUtc = windowStartMs + offsetMin * 60_000;
    const endUtc = startUtc + durationMin * 60_000;

    const polaRng = rngFor("pola", bucket, row.id);
    const polaMain: Game["polaMain"] = [];
    const seen = new Set<string>();
    let attempts = 0;
    while (polaMain.length < POLA_COUNT && attempts < 30) {
      attempts++;
      const type = POLA_TYPES[polaRng.int(0, POLA_TYPES.length - 1)];
      const total = polaRng.int(POLA_TOTAL_MIN, POLA_TOTAL_MAX);
      const key = `${type}-${total}`;
      if (seen.has(key)) continue;
      seen.add(key);
      polaMain.push({
        type,
        total,
        turbo: polaRng.float() < 0.6, // 60% On
      });
    }

    const playing = playingForTier(rngFor("playing", bucket, row.id), rtp);

    return {
      name: row.name,
      image: row.image,
      provider: row.provider,
      imagePath: `/images/games/${row.image}`,
      rtp,
      status: statusFromRtp(rtp),
      jamGacor: `${formatWIB(startUtc)} - ${formatWIB(endUtc)}`,
      polaMain,
      playing,
    };
  });
}

/**
 * Jumlah player aktif per game — bias by RTP tier.
 * Game gacor → ramai. Game dingin → sepi (sering 0).
 */
function playingForTier(rng: ReturnType<typeof rngFor>, rtp: number): number {
  if (rtp >= 81) return rng.int(60, 100);
  if (rtp >= 61) return rng.int(30, 80);
  if (rtp >= 41) return rng.int(15, 60);
  if (rtp >= 21) return rng.int(5, 30);
  return rng.int(0, 15);
}

function formatWIB(utcMs: number): string {
  const d = new Date(utcMs + WIB_OFFSET_MS);
  const h = String(d.getUTCHours()).padStart(2, "0");
  const m = String(d.getUTCMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function statusFromRtp(rtp: number): Game["status"] {
  if (rtp >= 81) return "very_high";
  if (rtp >= 61) return "high";
  if (rtp >= 41) return "medium";
  if (rtp >= 21) return "low";
  return "very_low";
}

export async function getProviders(): Promise<ProviderInfo[]> {
  const [rows] = await db.query<ProviderRow[]>(
    `SELECT nama, logo FROM provider ORDER BY id`
  );
  return rows.map((r) => ({ nama: r.nama, logo: r.logo }));
}

interface ProviderRatingRow extends RowDataPacket {
  nama: string;
  rating: number;
}

export async function getProviderRatings(): Promise<Record<string, number>> {
  const [rows] = await db.query<ProviderRatingRow[]>(
    `SELECT nama, rating FROM provider ORDER BY id`
  );
  const map: Record<string, number> = {};
  let sum = 0;
  for (const r of rows) {
    const rating = Number(r.rating);
    map[r.nama] = rating;
    sum += rating;
  }
  // "All Games" → rata-rata semua provider, dibulatkan ke 1 desimal
  if (rows.length > 0) {
    const avg = Math.round((sum / rows.length) * 10) / 10;
    map["All Games"] = avg;
    // "HOT" → asumsi rating tinggi karena ini "cream of the crop"
    map["HOT"] = Math.min(5, Math.round((avg + 0.5) * 10) / 10);
  }
  return map;
}
