"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import {
  Plus,
  SquarePen,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Filter,
  RotateCcw,
} from "lucide-react";
import { deleteGame } from "@/app/actions/games";
import { ModalDelete } from "@/components/admin/ModalDelete";

export interface GameRowData {
  id: number;
  nama: string;
  gambar: string;
  id_provider: number;
  provider_nama: string;
}

export interface ProviderOption {
  id: number;
  nama: string;
}

const columnHelper = createColumnHelper<GameRowData>();

interface Props {
  rows: GameRowData[];
  providers: ProviderOption[];
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
  filterProvider: number | null;
  filterQ: string;
}

export default function GamesTable({
  rows,
  providers,
  total,
  page,
  totalPages,
  pageSize,
  filterProvider,
  filterQ,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deleteTarget, setDeleteTarget] = useState<GameRowData | null>(null);

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => <span className="font-mono text-zinc-600">#{info.getValue()}</span>,
      }),
      columnHelper.accessor("gambar", {
        header: "IMG",
        cell: (info) => (
          <img
            src={`/images/games/${info.getValue()}`}
            alt={info.row.original.nama}
            className="h-8 w-12 rounded object-cover"
            onError={(e) => {
              const img = e.currentTarget;
              if (img.dataset.fallback !== "true") {
                img.dataset.fallback = "true";
                img.src = "/images/placeholder-game.svg";
              }
            }}
          />
        ),
      }),
      columnHelper.accessor("nama", {
        header: "NAMA",
        cell: (info) => (
          <span className="font-bold uppercase text-zinc-200 line-clamp-1">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("provider_nama", {
        header: "PROVIDER",
        cell: (info) => <span className="text-zinc-400">{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: "actions",
        header: "AKSI",
        cell: ({ row }) => {
          const g = row.original;
          return (
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/games/${g.id}/edit`}
                className="rounded-xl bg-red-500/10 p-2 text-red-400 transition-all hover:bg-red-500 hover:text-white"
                title="Edit"
              >
                <SquarePen size={14} />
              </Link>
              <button
                type="button"
                onClick={() => setDeleteTarget(g)}
                className="rounded-xl bg-red-500/10 p-2 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                title="Hapus"
                aria-label="Hapus"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    state: { pagination: { pageIndex: page - 1, pageSize } },
  });

  function buildHref(overrides: Record<string, string | number | null>) {
    const sp = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(overrides)) {
      if (v === null || v === "" || v === undefined) sp.delete(k);
      else sp.set(k, String(v));
    }
    const s = sp.toString();
    return s ? `/admin/games?${s}` : "/admin/games";
  }

  function goPage(p: number) {
    router.push(buildHref({ page: p }));
  }

  function onFilterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const provider = String(fd.get("provider") ?? "");
    const q = String(fd.get("q") ?? "").trim();
    router.push(
      buildHref({
        provider: provider || null,
        q: q || null,
        page: null, // reset to page 1
      })
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between border-b border-red-600/20 pb-5">
        <div>
          <h1 className="flex items-center gap-3 text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">
            <Gamepad2 className="text-red-500" /> Games
          </h1>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500">
            Kelola daftar game · {total.toLocaleString()} total
          </p>
        </div>
        <Link
          href="/admin/games/new"
          className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-red-500"
        >
          <Plus size={14} /> Tambah
        </Link>
      </div>

      <form
        onSubmit={onFilterSubmit}
        className="flex flex-wrap items-center gap-2 rounded-2xl border border-red-600/20 bg-zinc-950 p-3"
      >
        <select
          name="provider"
          defaultValue={filterProvider ?? ""}
          className="rounded-lg border border-red-600/20 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-red-500/50 focus:outline-none"
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
          defaultValue={filterQ}
          placeholder="Cari nama game…"
          className="flex-1 min-w-[200px] rounded-lg border border-red-600/20 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-red-500/50 focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-red-400 transition-all hover:bg-red-500 hover:text-white"
        >
          <Filter size={12} /> Filter
        </button>
        {(filterProvider || filterQ) && (
          <Link
            href="/admin/games"
            className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <RotateCcw size={12} /> Reset
          </Link>
        )}
      </form>

      <div className="overflow-hidden rounded-2xl border border-red-600/20 bg-zinc-950 shadow-xl">
        <div className="min-h-100 overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 text-left">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="bg-white/2">
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="whitespace-nowrap border-b border-red-600/20 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-red-400"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="text-[11px]">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-20 text-center text-[10px] uppercase italic text-zinc-600"
                  >
                    Tidak ada hasil
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-white/2">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="border-b border-red-600/20 px-4 py-3"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-red-600/20 bg-zinc-950 p-3">
        <span className="px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          Page {page} / {totalPages || 1} · {total.toLocaleString()} game
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => goPage(page - 1)}
            disabled={page <= 1}
            className="rounded-lg bg-white/5 p-1.5 text-zinc-400 transition-colors hover:bg-white/10 disabled:opacity-20"
            aria-label="Previous page"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="rounded-md bg-red-500/10 px-3 py-1 text-[9px] font-black text-red-400">
            {page}
          </span>
          <button
            type="button"
            onClick={() => goPage(page + 1)}
            disabled={page >= totalPages}
            className="rounded-lg bg-white/5 p-1.5 text-zinc-400 transition-colors hover:bg-white/10 disabled:opacity-20"
            aria-label="Next page"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <ModalDelete
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Game?"
        subtitleLabel="GAME"
        subtitleValue={deleteTarget?.nama ?? ""}
        message="Tindakan ini tidak dapat dibatalkan. Game beserta gambarnya akan dihapus permanen dari sistem."
        formAction={deleteGame}
        hiddenFields={{ id: deleteTarget?.id ?? 0 }}
      />
    </div>
  );
}
