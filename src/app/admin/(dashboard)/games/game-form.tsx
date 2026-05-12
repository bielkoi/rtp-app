"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { GameFormState } from "@/app/actions/games";

interface ProviderOption {
  id: number;
  nama: string;
}

interface Props {
  action: (state: GameFormState | undefined, formData: FormData) => Promise<GameFormState>;
  providers: ProviderOption[];
  initial?: { nama: string; gambar: string; id_provider: number };
  submitLabel: string;
}

export default function GameForm({ action, providers, initial, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="bg-[#111827] border border-slate-800 rounded-2xl p-6 max-w-xl">
      <div className="mb-4">
        <label htmlFor="id_provider" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
          Provider <span className="text-red-400">*</span>
        </label>
        <select
          id="id_provider"
          name="id_provider"
          required
          defaultValue={initial?.id_provider ?? ""}
          className="w-full bg-[#0f1016] border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="" disabled>
            — Pilih provider —
          </option>
          {providers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nama}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="nama" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
          Nama Game <span className="text-red-400">*</span>
        </label>
        <input
          id="nama"
          name="nama"
          type="text"
          required
          defaultValue={initial?.nama}
          placeholder="Contoh: Gates of Olympus"
          className="w-full bg-[#0f1016] border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="gambar" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
          Gambar (nama file)
        </label>
        <input
          id="gambar"
          name="gambar"
          type="text"
          defaultValue={initial?.gambar}
          placeholder="Contoh: gates_of_olympus.webp"
          className="w-full bg-[#0f1016] border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
        />
        <p className="text-[10px] text-slate-500 mt-1">Tersimpan di /public/images/&lt;slug_provider&gt;/.</p>
      </div>

      <div className="mb-4">
        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
          Upload gambar (opsional)
        </label>
        <input
          type="file"
          name="gambar_file"
          accept="image/png,image/webp,image/jpeg"
          className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-blue-600/10 file:text-blue-400 hover:file:bg-blue-600/20 file:cursor-pointer"
        />
        <p className="text-[10px] text-slate-500 mt-1">Maks 2 MB. Akan menimpa nama file di kolom gambar.</p>
      </div>

      {state?.error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono rounded-lg px-3 py-2">
          {state.error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link
          href="/admin/games"
          className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
