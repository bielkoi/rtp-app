"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { ImagePlus, Upload, Loader2, Save, AlertCircle } from "lucide-react";
import type { ProviderFormState } from "@/app/actions/providers";

interface Props {
  action: (state: ProviderFormState | undefined, formData: FormData) => Promise<ProviderFormState>;
  initial?: { nama: string; logo: string; rating: number };
  submitLabel: string;
}

export default function ProviderForm({ action, initial, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [preview, setPreview] = useState<string | null>(
    initial?.logo ? `/images/provider/${initial.logo}` : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      action={formAction}
      className="grid max-w-4xl gap-6 rounded-2xl border border-red-600/20 bg-zinc-950 p-6 shadow-xl md:grid-cols-[18rem_1fr]"
    >
      {/* Hidden field — kalau initial.logo ada dan user tidak upload baru, kirim nama file lama */}
      {initial?.logo && (
        <input type="hidden" name="logo" defaultValue={initial.logo} />
      )}

      <div
        onClick={() => fileInputRef.current?.click()}
        className="group relative flex aspect-2/1 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-red-600/30 bg-zinc-900/40 shadow-2xl transition-all hover:border-red-500/70"
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-contain opacity-90 transition-all duration-500 group-hover:scale-[1.02] group-hover:opacity-100"
          />
        ) : (
          <div className="flex flex-col items-center text-zinc-500">
            <ImagePlus size={36} />
            <p className="mt-3 px-4 text-center text-[10px] font-bold uppercase tracking-widest">
              Klik untuk pilih logo
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          name="logo_file"
          type="file"
          accept="image/svg+xml,image/png,image/webp,image/jpeg"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setPreview(URL.createObjectURL(f));
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-[10px] font-black tracking-[0.2em] text-white">
            <Upload size={12} />
            {preview ? "GANTI LOGO" : "PILIH LOGO"}
          </div>
        </div>

        <div className="absolute bottom-2 right-2 rounded-md border border-red-600/30 bg-black/70 px-2 py-0.5 backdrop-blur-md">
          <p className="text-[9px] font-bold uppercase tracking-tighter text-red-400">Ratio 2:1</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="nama"
            className="block text-[10px] font-black uppercase tracking-widest text-zinc-500"
          >
            Nama Provider <span className="text-red-400">*</span>
          </label>
          <input
            id="nama"
            name="nama"
            type="text"
            required
            defaultValue={initial?.nama}
            placeholder="Contoh: Pragmatic Play"
            className="w-full rounded-xl border border-red-600/30 bg-black/40 px-4 py-2.5 text-sm text-white outline-none transition-all placeholder:text-zinc-700 focus:border-red-500/60 focus:bg-black/60 focus:ring-2 focus:ring-red-500/20"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="rating"
            className="block text-[10px] font-black uppercase tracking-widest text-zinc-500"
          >
            Rating <span className="text-red-400">*</span>
          </label>
          <input
            id="rating"
            name="rating"
            type="number"
            required
            min={0}
            max={5}
            step={0.1}
            defaultValue={initial?.rating ?? 4.0}
            className="w-full rounded-xl border border-red-600/30 bg-black/40 px-4 py-2.5 text-sm text-white outline-none transition-all placeholder:text-zinc-700 focus:border-red-500/60 focus:bg-black/60 focus:ring-2 focus:ring-red-500/20"
          />
          <p className="text-[10px] text-zinc-500">
            Range 0.0–5.0 (step 0.1). Tampil sebagai bintang di RtpInfoBanner publik.
          </p>
        </div>

        <div className="text-zinc-500 border-t border-zinc-800 pt-4 mt-2">
          <p className="mb-1 text-xs font-bold uppercase tracking-tighter text-zinc-400">
            Rekomendasi:
          </p>
          <p className="text-[11px] italic leading-relaxed">
            Rasio horizontal (mis. 600×300 px), background transparan untuk PNG/SVG agar logo<br />
            tampil rapi di tab provider dan banner.
          </p>
        </div>

        {state?.error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            <p className="text-xs text-red-300">{state.error}</p>
          </div>
        )}

        <div className="mt-auto flex flex-col items-stretch justify-end gap-3 border-t border-zinc-800 pt-4 sm:flex-row sm:items-center">
          <Link
            href="/admin/providers"
            className="rounded-xl bg-white/5 px-6 py-3.5 text-center text-[11px] font-black uppercase tracking-widest text-zinc-400 transition-all hover:bg-white/10"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="flex min-w-52 items-center justify-center gap-2 rounded-xl bg-linear-to-b from-red-500 to-red-700 py-3.5 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-red-900/30 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
          >
            {pending ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Saving…
              </>
            ) : (
              <>
                <Save size={14} /> {submitLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
