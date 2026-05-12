import type { Metadata } from "next";
import Link from "next/link";
import type { RowDataPacket } from "mysql2/promise";
import { db } from "@/lib/db";
import { deleteGame } from "@/app/actions/games";
import { Plus, Pencil } from "lucide-react";
import ConfirmDeleteButton from "../providers/confirm-delete-button";
import { slugFolder } from "@/lib/upload";

export const metadata: Metadata = { title: "Games — RTP Admin" };

const PAGE_SIZE = 50;

interface GameRow extends RowDataPacket {
  id: number;
  nama: string;
  gambar: string;
  id_provider: number;
  provider_nama: string;
}

interface ProviderRow extends RowDataPacket {
  id: number;
  nama: string;
}

interface CountRow extends RowDataPacket {
  total: number;
}

async function getProviders() {
  const [rows] = await db.query<ProviderRow[]>("SELECT id, nama FROM provider ORDER BY nama");
  return rows;
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

  const [rows] = await db.query<GameRow[]>(
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
  const providerId = sp.provider ? Number(sp.provider) : null;
  const page = Math.max(1, Number(sp.page) || 1);
  const q = (sp.q ?? "").trim();

  const [providers, { rows: games, total }] = await Promise.all([
    getProviders(),
    getGames(Number.isFinite(providerId as number) ? providerId : null, page, q),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const buildHref = (params: Record<string, string | number | undefined>) => {
    const search = new URLSearchParams();
    if (providerId) search.set("provider", String(providerId));
    if (q) search.set("q", q);
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === "" || v === null) search.delete(k);
      else search.set(k, String(v));
    }
    const s = search.toString();
    return s ? `/admin/games?${s}` : "/admin/games";
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div className="border-l-4 border-blue-600 pl-4">
          <h1 className="text-xl font-black italic tracking-tighter text-white uppercase">
            Games <span className="text-blue-500">({total.toLocaleString()})</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono tracking-widest">CRUD GAME</p>
        </div>
        <Link
          href="/admin/games/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
        >
          <Plus size={14} /> New
        </Link>
      </div>

      <form className="mb-4 flex gap-2 flex-wrap" action="/admin/games" method="get">
        <select
          name="provider"
          defaultValue={providerId ?? ""}
          className="bg-[#111827] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
        >
          <option value="">All Providers</option>
          {providers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nama}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Cari nama game…"
          className="flex-1 min-w-[200px] bg-[#111827] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-colors"
        >
          Filter
        </button>
        {(providerId || q) && (
          <Link
            href="/admin/games"
            className="bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-colors"
          >
            Reset
          </Link>
        )}
      </form>

      <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/30 border-b border-slate-800">
            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              <th className="text-left px-4 py-3 w-12">ID</th>
              <th className="text-left px-4 py-3 w-16">Img</th>
              <th className="text-left px-4 py-3">Nama</th>
              <th className="text-left px-4 py-3">Provider</th>
              <th className="text-right px-4 py-3 w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {games.map((g) => (
              <tr key={g.id} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/20">
                <td className="px-4 py-3 font-mono text-slate-500">{g.id}</td>
                <td className="px-4 py-3">
                  <img
                    src={`/images/${slugFolder(g.provider_nama)}/${g.gambar}`}
                    alt={g.nama}
                    className="h-8 w-12 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-3 font-bold text-white truncate max-w-xs">{g.nama}</td>
                <td className="px-4 py-3 text-slate-400">{g.provider_nama}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/games/${g.id}/edit`}
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil size={14} />
                    </Link>
                    <form action={deleteGame}>
                      <input type="hidden" name="id" value={g.id} />
                      <ConfirmDeleteButton message={`Hapus game "${g.nama}"?`} />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {games.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-500 text-sm">
                  Tidak ada hasil.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-xs">
          <div className="font-mono text-slate-500">
            Page {page} / {totalPages}
          </div>
          <div className="flex items-center gap-2">
            {page > 1 && (
              <Link
                href={buildHref({ page: page - 1 })}
                className="bg-[#111827] border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white font-black uppercase tracking-widest px-3 py-2 rounded-lg transition-colors"
              >
                Prev
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={buildHref({ page: page + 1 })}
                className="bg-[#111827] border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white font-black uppercase tracking-widest px-3 py-2 rounded-lg transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
