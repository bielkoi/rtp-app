"use client";

import { useActionState, useState } from "react";
import { Type, Save, Loader2, AlertCircle, CheckCircle2, Star, Minus } from "lucide-react";
import type { SettingsFormState } from "@/app/actions/settings";

interface Props {
  action: (state: SettingsFormState | undefined, formData: FormData) => Promise<SettingsFormState>;
  initialText: string;
}

export default function RunningTextForm({ action, initialText }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [text, setText] = useState(initialText);

  // Preview: split by newline, filter non-empty
  const previewItems = text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <form action={formAction} className="max-w-4xl space-y-6">
      <div className="border-l-4 border-red-600 pl-4">
        <h1 className="flex items-center gap-3 text-xl md:text-2xl font-black uppercase tracking-tighter text-white">
          <Type className="text-red-500" /> Running Text
        </h1>
        <p className="text-sm italic text-zinc-400 mt-1">
          Teks berjalan di pita atas halaman publik. Satu baris = satu item marquee.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="running_text"
          className="px-1 text-[10px] font-black uppercase tracking-widest text-zinc-500"
        >
          Teks (satu item per baris)
        </label>
        <textarea
          id="running_text"
          name="running_text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="PALING GAMPANG MENANG DI INDONESIA&#10;HARAP SELALU CHECK REKENING AKTIF&#10;MINIMAL DEPO 5RIBU"
          className="w-full resize-none rounded-2xl border border-red-600/20 bg-black/40 p-4 text-sm text-zinc-200 outline-none transition-all focus:border-red-500/50"
        />
        <p className="px-1 text-[10px] text-zinc-600">
          Tip: pisahkan dengan enter. Masing-masing baris akan tampil sebagai item dalam marquee.
        </p>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
          Preview
        </p>
        <div className="bg-black border border-red-600 rounded-xl overflow-hidden">
          <div className="flex w-max whitespace-nowrap py-2">
            {previewItems.length === 0 ? (
              <span className="px-6 text-xs text-zinc-600 italic">(belum diisi)</span>
            ) : (
              [...previewItems, ...previewItems].map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center mx-6 text-white text-xs md:text-sm font-black uppercase tracking-widest"
                >
                  <Star size={12} className="text-red-400 mr-2" fill="currentColor" />
                  {item}
                  <Minus size={14} className="text-red-400 ml-6 rotate-90" />
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-b from-red-500 to-red-700 px-8 py-3.5 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-red-900/30 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
      >
        {pending ? (
          <>
            <Loader2 className="animate-spin" size={16} /> Saving…
          </>
        ) : (
          <>
            <Save size={14} /> Terapkan Running Text
          </>
        )}
      </button>

      {state?.error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <p className="text-xs text-red-300">{state.error}</p>
        </div>
      )}

      {state?.ok && (
        <div className="flex items-start gap-2 rounded-xl border border-green-500/40 bg-green-500/10 p-3">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
          <p className="text-xs text-green-300">Running text berhasil diperbarui.</p>
        </div>
      )}
    </form>
  );
}
