"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { ProviderFormState } from "@/app/actions/providers";

interface Props {
  action: (state: ProviderFormState | undefined, formData: FormData) => Promise<ProviderFormState>;
  initial?: { nama: string; logo: string };
  submitLabel: string;
}

export default function ProviderForm({ action, initial, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="bg-[#111827] border border-slate-800 rounded-2xl p-6 max-w-xl">
      <Field label="Nama" name="nama" required defaultValue={initial?.nama} placeholder="Contoh: Pragmatic Play" />

      <Field
        label="Logo (nama file)"
        name="logo"
        defaultValue={initial?.logo}
        placeholder="Contoh: pragmatic_play.svg"
        hint="Disimpan di /public/images/provider/. Boleh kosong jika upload file di bawah."
      />

      <div className="mb-4">
        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
          Upload logo (opsional)
        </label>
        <input
          type="file"
          name="logo_file"
          accept="image/svg+xml,image/png,image/webp,image/jpeg"
          className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-blue-600/10 file:text-blue-400 hover:file:bg-blue-600/20 file:cursor-pointer"
        />
        <p className="text-[10px] text-slate-500 mt-1">Maks 2 MB. Akan menimpa nama file di kolom logo.</p>
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
          href="/admin/providers"
          className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full bg-[#0f1016] border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
      />
      {hint && <p className="text-[10px] text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}
