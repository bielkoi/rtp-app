"use client";

import { useActionState, useRef, useState } from "react";
import { Upload, Save, Loader2, ImageIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import type { SettingsFormState } from "@/app/actions/settings";

interface Props {
  title: string;
  subtitle: string;
  action: (state: SettingsFormState | undefined, formData: FormData) => Promise<SettingsFormState>;
  initialUrl: string | null;
  aspectClass: string; // Tailwind: mis. "aspect-video", "aspect-3/1"
  ratioLabel: string;
  recommendation: string;
  acceptMimes?: string;
  objectFit?: "cover" | "contain";
}

export default function SettingFileUpload({
  title,
  subtitle,
  action,
  initialUrl,
  aspectClass,
  ratioLabel,
  recommendation,
  acceptMimes = "image/png,image/jpeg,image/webp",
  objectFit = "cover",
}: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [preview, setPreview] = useState<string | null>(initialUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form action={formAction} className="max-w-4xl space-y-6">
      <div className="border-l-4 border-red-600 pl-4">
        <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white">
          {title}
        </h1>
        <p className="text-sm italic text-zinc-400 mt-1">{subtitle}</p>
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex ${aspectClass} w-full cursor-pointer items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-red-600/30 bg-zinc-900/40 shadow-2xl transition-all hover:border-red-500/70`}
      >
        {preview ? (
          <img
            src={preview}
            alt={`${title} preview`}
            className={`h-full w-full ${objectFit === "contain" ? "object-contain p-6" : "object-cover"} opacity-90 transition-all duration-500 group-hover:scale-[1.02] group-hover:opacity-100`}
          />
        ) : (
          <div className="flex flex-col items-center text-zinc-500">
            <ImageIcon size={40} />
            <p className="mt-3 px-4 text-center text-[10px] font-bold uppercase tracking-widest">
              Klik untuk memilih gambar {title.toLowerCase()}
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          name="file"
          type="file"
          accept={acceptMimes}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setPreview(URL.createObjectURL(f));
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-[10px] font-black tracking-[0.2em] text-white">
            <Upload size={14} />
            {preview ? "GANTI GAMBAR" : "PILIH GAMBAR"}
          </div>
        </div>

        <div className="absolute bottom-3 right-3 rounded-lg border border-red-600/30 bg-black/70 px-2.5 py-0.5 backdrop-blur-md">
          <p className="text-[10px] font-bold uppercase tracking-tighter text-red-400">
            Ratio {ratioLabel}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-red-600/20 bg-zinc-900/30 p-6 md:flex-row md:items-end">
        <div className="text-zinc-500">
          <p className="mb-1 text-xs font-bold uppercase tracking-tighter text-zinc-400">
            Rekomendasi
          </p>
          <p className="text-[11px] italic leading-relaxed">{recommendation}</p>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="flex min-w-60 items-center justify-center gap-2 rounded-xl bg-linear-to-b from-red-500 to-red-700 py-3.5 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-red-900/30 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
        >
          {pending ? (
            <>
              <Loader2 className="animate-spin" size={16} /> Saving…
            </>
          ) : (
            <>
              <Save size={14} /> Simpan {title}
            </>
          )}
        </button>
      </div>

      {state?.error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <p className="text-xs text-red-300">{state.error}</p>
        </div>
      )}

      {state?.ok && (
        <div className="flex items-start gap-2 rounded-xl border border-green-500/40 bg-green-500/10 p-3">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
          <p className="text-xs text-green-300">{title} berhasil diperbarui.</p>
        </div>
      )}
    </form>
  );
}
