import type { Metadata } from "next";
import type { RowDataPacket } from "mysql2/promise";
import { db } from "@/lib/db";
import GamesTable, { type GameRowData, type ProviderOption } from "./games-table";

export const metadata: Metadata = { title: "Games — RTP Admin" };

const PAGE_SIZE = 50;

interface DbGameRow extends RowDataPacket, GameRowData {}
interface DbProviderRow extends RowDataPacket, ProviderOption {}
interface CountRow extends RowDataPacket {
  total: number;
}

async function getProviders(): Promise<ProviderOption[]> {
  const [rows] = await db.query<DbProviderRow[]>("SELECT id, nama FROM provider ORDER BY nama");
  return rows.map((r) => ({ id: r.id, nama: r.nama }));
}

async function getGames(providerId: number | null, page: number, q: string) {
  const offset = (page - 1) * PAGE_SIZE;
  const where: string[] = [];
  const params: (string | number)[] = [];

  if (providerId) {
    where.push("g.id_provider = ?");
    params.push(providerId);
  }
  if (q) {
    where.push("g.nama LIKE ?");
    params.push(`%${q}%`);
  }
  const whereSql = where.length ? "WHERE " + where.join(" AND ") : "";

  const [rows] = await db.query<DbGameRow[]>(
    `SELECT g.id, g.nama, g.gambar, g.id_provider, p.nama AS provider_nama
     FROM game g
     JOIN provider p ON p.id = g.id_provider
     ${whereSql}
     ORDER BY g.id DESC
     LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
    params
  );

  const [countRows] = await db.query<CountRow[]>(
    `SELECT COUNT(*) AS total FROM game g ${whereSql}`,
    params
  );

  return { rows, total: countRows[0]?.total ?? 0 };
}

export default async function GamesListPage({
  searchParams,
}: {
  searchParams: Promise<{ provider?: string; page?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const providerIdNum = sp.provider ? Number(sp.provider) : NaN;
  const providerId = Number.isFinite(providerIdNum) ? providerIdNum : null;
  const page = Math.max(1, Number(sp.page) || 1);
  const q = (sp.q ?? "").trim();

  const [providers, { rows, total }] = await Promise.all([
    getProviders(),
    getGames(providerId, page, q),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <GamesTable
      rows={rows.map((r) => ({
        id: r.id,
        nama: r.nama,
        gambar: r.gambar,
        id_provider: r.id_provider,
        provider_nama: r.provider_nama,
      }))}
      providers={providers}
      total={total}
      page={page}
      totalPages={totalPages}
      pageSize={PAGE_SIZE}
      filterProvider={providerId}
      filterQ={q}
    />
  );
}
