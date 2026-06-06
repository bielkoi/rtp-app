"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  Upload,
  Save,
  Loader2,
  ImageIcon,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Images,
} from "lucide-react";
import { createSlide, deleteSlide, type SlideFormState } from "@/app/actions/slides";
import { ModalDelete } from "@/components/admin/ModalDelete";
import type { SlideRow } from "@/lib/slides";

interface Props {
  slides: SlideRow[];
}

export default function SliderManager({ slides }: Props) {
  const [state, formAction, pending] = useActionState<SlideFormState | undefined, FormData>(
    createSlide,
    undefined
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SlideRow | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Reset form ketika upload sukses
  useEffect(() => {
    if (state?.ok) {
      setPreview(null);
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="max-w-5xl space-y-8">
      <div className="border-l-4 border-red-600 pl-4">
        <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white">
          Slider
        </h1>
        <p className="text-sm italic text-zinc-400 mt-1">
          Kelola gambar slideshow di hero banner halaman publik.
        </p>
      </div>

      {/* Upload form */}
      <form ref={formRef} action={formAction} className="space-y-4">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex aspect-16/6 w-full cursor-pointer items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-red-600/30 bg-zinc-900/40 shadow-2xl transition-all hover:border-red-500/70"
        >
          {preview ? (
            <img
              src={preview}
              alt="Slide preview"
              className="h-full w-full object-contain opacity-90 transition-all duration-500 group-hover:scale-[1.02] group-hover:opacity-100"
            />
          ) : (
            <div className="flex flex-col items-center text-zinc-500">
              <ImageIcon size={40} />
              <p className="mt-3 px-4 text-center text-[10px] font-bold uppercase tracking-widest">
                Klik untuk memilih gambar slide
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            name="file"
            type="file"
            accept="image/png,image/jpeg,image/webp"
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
              Ratio 16:9
            </p>
          </div>
        </div>

        <div className="flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-red-600/20 bg-zinc-900/30 p-6 md:flex-row md:items-end">
          <div className="text-zinc-500">
            <p className="mb-1 text-xs font-bold uppercase tracking-tighter text-zinc-400">
              Rekomendasi
            </p>
            <p className="text-[11px] italic leading-relaxed">
              Resolusi 1600×900 px (rasio 16:9). PNG/JPEG/WebP. Otomatis di-resize + dikompres ke JPEG q85.
            </p>
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
                <Save size={14} /> Tambah Slide
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
            <p className="text-xs text-green-300">Slide berhasil ditambahkan.</p>
          </div>
        )}
      </form>

      {/* Existing slides */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-red-600/20 pb-3">
          <Images size={16} className="text-red-500" />
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">
            Daftar Slide
          </h2>
          <span className="text-[10px] font-bold text-zinc-500">
            {slides.length} item
          </span>
        </div>

        {slides.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-12 text-center">
            <p className="text-xs italic text-zinc-500">
              Belum ada slide. Tambahkan slide pertama lewat form di atas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 transition-all hover:border-red-600/40"
              >
                <div className="aspect-16/6 w-full overflow-hidden bg-black">
                  <img
                    src={`/images/slide/${slide.filename}`}
                    alt={`Slide ${slide.sort_order}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">
                      #{slide.sort_order}
                    </p>
                    <p className="truncate font-mono text-[11px] text-zinc-400">
                      {slide.filename}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(slide)}
                    className="rounded-xl bg-red-500/10 p-2 text-red-400 transition-all hover:bg-red-500 hover:text-white"
                    title="Hapus slide"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ModalDelete
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Slide?"
        subtitleLabel="FILE"
        subtitleValue={deleteTarget?.filename ?? ""}
        message="Slide akan dihapus permanen dan file gambarnya akan dihapus dari server. Tindakan ini tidak bisa dibatalkan."
        formAction={deleteSlide}
        hiddenFields={{ id: deleteTarget?.id ?? 0 }}
      />
    </div>
  );
}
