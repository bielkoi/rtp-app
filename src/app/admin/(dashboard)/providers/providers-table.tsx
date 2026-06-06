"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { Plus, SquarePen, Trash2, ChevronLeft, ChevronRight, Boxes, Star } from "lucide-react";
import { deleteProvider } from "@/app/actions/providers";
import { ModalDelete } from "@/components/admin/ModalDelete";

export interface ProviderRowData {
  id: number;
  nama: string;
  logo: string;
  game_count: number;
  rating: number;
}

const columnHelper = createColumnHelper<ProviderRowData>();

export default function ProvidersTable({ rows }: { rows: ProviderRowData[] }) {
  const [deleteTarget, setDeleteTarget] = useState<ProviderRowData | null>(null);

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => <span className="font-mono text-zinc-600">#{info.getValue()}</span>,
      }),
      columnHelper.accessor("logo", {
        header: "LOGO",
        cell: (info) => (
          <img
            src={`/images/provider/${info.getValue()}`}
            alt={info.row.original.nama}
            className="h-6 w-auto object-contain"
          />
        ),
      }),
      columnHelper.accessor("nama", {
        header: "NAMA",
        cell: (info) => (
          <span className="font-bold uppercase text-zinc-200">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("game_count", {
        header: "GAMES",
        cell: (info) => <span className="font-mono text-zinc-400">{info.getValue()}</span>,
      }),
      columnHelper.accessor("rating", {
        header: "RATING",
        cell: (info) => (
          <span className="inline-flex items-center gap-1 font-mono text-yellow-400">
            <Star size={12} fill="currentColor" />
            {info.getValue().toFixed(1)}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "AKSI",
        cell: ({ row }) => {
          const p = row.original;
          return (
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/providers/${p.id}/edit`}
                className="rounded-xl bg-red-500/10 p-2 text-red-400 transition-all hover:bg-red-500 hover:text-white"
                title="Edit"
              >
                <SquarePen size={14} />
              </Link>
              <button
                type="button"
                onClick={() => setDeleteTarget(p)}
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
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between border-b border-red-600/20 pb-5">
        <div>
          <h1 className="flex items-center gap-3 text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">
            <Boxes className="text-red-500" /> Providers
          </h1>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500">
            Kelola daftar provider
          </p>
        </div>
        <Link
          href="/admin/providers/new"
          className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-red-500"
        >
          <Plus size={14} /> Tambah
        </Link>
      </div>

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
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-20 text-center text-[10px] uppercase italic text-zinc-600">
                    Belum ada provider
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
          {rows.length} Provider
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-lg bg-white/5 p-1.5 text-zinc-400 transition-colors hover:bg-white/10 disabled:opacity-20"
            aria-label="Previous page"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="rounded-md bg-red-500/10 px-3 py-1 text-[9px] font-black text-red-400">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
          </span>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
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
        title="Hapus Provider?"
        subtitleLabel="PROVIDER"
        subtitleValue={deleteTarget?.nama ?? ""}
        message={
          (deleteTarget?.game_count ?? 0) > 0
            ? `Tindakan ini tidak dapat dibatalkan. ${deleteTarget?.game_count} game terkait akan ikut terhapus permanen beserta gambarnya.`
            : "Tindakan ini tidak dapat dibatalkan. Provider dan logo akan dihapus permanen dari sistem."
        }
        formAction={deleteProvider}
        hiddenFields={{ id: deleteTarget?.id ?? 0 }}
      />
    </div>
  );
}
