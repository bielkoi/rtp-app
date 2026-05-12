import "server-only";
import type { RowDataPacket } from "mysql2/promise";
import { db } from "@/lib/db";
import { Game } from "@/types";

interface GameRow extends RowDataPacket {
  name: string;
  image: string;
  provider: string;
}

interface ProviderRow extends RowDataPacket {
  nama: string;
}

const folderSlug = (providerName: string) =>
  providerName.toLowerCase().replace(/\s+/g, "_");

export async function getAllGames(): Promise<Game[]> {
  const [rows] = await db.query<GameRow[]>(
    `SELECT g.nama AS name, g.gambar AS image, p.nama AS provider
     FROM game g
     JOIN provider p ON p.id = g.id_provider
     ORDER BY p.id, g.id`
  );

  return rows.map((row) => {
    const rtp = Math.floor(Math.random() * (99 - 65 + 1)) + 65;
    return {
      name: row.name,
      image: row.image,
      provider: row.provider,
      imagePath: `/images/${folderSlug(row.provider)}/${row.image}`,
      rtp,
      status: rtp >= 95 ? "high" : rtp >= 80 ? "medium" : "low",
    };
  });
}

export async function getProviders(): Promise<string[]> {
  const [rows] = await db.query<ProviderRow[]>(
    `SELECT nama FROM provider ORDER BY id`
  );
  return rows.map((r) => r.nama);
}
