import type { Metadata } from "next";
import type { RowDataPacket } from "mysql2/promise";
import { db } from "@/lib/db";
import ProvidersTable, { type ProviderRowData } from "./providers-table";

export const metadata: Metadata = { title: "Providers — RTP Admin" };

interface DbProviderRow extends RowDataPacket {
  id: number;
  nama: string;
  logo: string;
  game_count: number;
  rating: number;
}

async function getProviders(): Promise<ProviderRowData[]> {
  const [rows] = await db.query<DbProviderRow[]>(
    `SELECT p.id, p.nama, p.logo, p.rating, COUNT(g.id) AS game_count
     FROM provider p
     LEFT JOIN game g ON g.id_provider = p.id
     GROUP BY p.id
     ORDER BY p.id`
  );
  return rows.map((r) => ({
    id: r.id,
    nama: r.nama,
    logo: r.logo,
    game_count: Number(r.game_count),
    rating: Number(r.rating),
  }));
}

export default async function ProvidersListPage() {
  const providers = await getProviders();
  return <ProvidersTable rows={providers} />;
}
