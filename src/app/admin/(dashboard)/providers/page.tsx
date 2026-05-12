import type { Metadata } from "next";
import Link from "next/link";
import type { RowDataPacket } from "mysql2/promise";
import { db } from "@/lib/db";
import { deleteProvider } from "@/app/actions/providers";
import { Plus, Pencil } from "lucide-react";
import ConfirmDeleteButton from "./confirm-delete-button";

export const metadata: Metadata = { title: "Providers — RTP Admin" };

interface ProviderRow extends RowDataPacket {
  id: number;
  nama: string;
  logo: string;
  game_count: number;
}

async function getProviders() {
  const [rows] = await db.query<ProviderRow[]>(
    `SELECT p.id, p.nama, p.logo, COUNT(g.id) AS game_count
     FROM provider p
     LEFT JOIN game g ON g.id_provider = p.id
     GROUP BY p.id
     ORDER BY p.id`
  );
  return rows;
}

export default async function ProvidersListPage() {
  const providers = await getProviders();

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div className="border-l-4 border-blue-600 pl-4">
          <h1 className="text-xl font-black italic tracking-tighter text-white uppercase">
            Providers <span className="text-blue-500">({providers.length})</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono tracking-widest">CRUD PROVIDER</p>
        </div>
        <Link
          href="/admin/providers/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
        >
          <Plus size={14} /> New
        </Link>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/30 border-b border-slate-800">
            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              <th className="text-left px-4 py-3 w-12">ID</th>
              <th className="text-left px-4 py-3 w-16">Logo</th>
              <th className="text-left px-4 py-3">Nama</th>
              <th className="text-left px-4 py-3">Games</th>
              <th className="text-right px-4 py-3 w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => {
              const msg =
                p.game_count > 0
                  ? `Hapus provider "${p.nama}"? ${p.game_count} game terkait akan ikut terhapus.`
                  : `Hapus provider "${p.nama}"?`;
              return (
                <tr key={p.id} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/20">
                  <td className="px-4 py-3 font-mono text-slate-500">{p.id}</td>
                  <td className="px-4 py-3">
                    <img
                      src={`/images/provider/${p.logo}`}
                      alt={p.nama}
                      className="h-6 w-auto object-contain"
                    />
                  </td>
                  <td className="px-4 py-3 font-bold text-white">{p.nama}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono">{p.game_count}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/providers/${p.id}/edit`}
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil size={14} />
                      </Link>
                      <form action={deleteProvider}>
                        <input type="hidden" name="id" value={p.id} />
                        <ConfirmDeleteButton message={msg} />
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
            {providers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-500 text-sm">
                  Belum ada provider.{" "}
                  <Link href="/admin/providers/new" className="text-blue-400 hover:underline">
                    Tambah satu
                  </Link>
                  .
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
