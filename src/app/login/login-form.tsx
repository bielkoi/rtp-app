"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  User,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { login, type LoginState } from "@/app/actions/auth";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <p className="text-[11px] text-red-200">{state.error}</p>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="username" className="ml-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          Username
        </label>
        <div className="group relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-600 transition-colors group-focus-within:text-red-600">
            <User size={18} />
          </span>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            autoComplete="username"
            required
            className="w-full rounded-xl border border-red-600/30 bg-black/40 py-4 pl-12 pr-4 text-sm text-white outline-none transition-all placeholder:text-zinc-700 focus:border-red-600/50 focus:bg-black/60 focus:ring-2 focus:ring-red-600/20"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="ml-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          Sandi Keamanan
        </label>
        <div className="group relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-600 transition-colors group-focus-within:text-red-600">
            <KeyRound size={18} />
          </span>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            className="w-full rounded-xl border border-red-600/30 bg-black/40 py-4 pl-12 pr-12 text-sm text-white outline-none transition-all placeholder:text-zinc-700 focus:border-red-600/50 focus:bg-black/60 focus:ring-2 focus:ring-red-600/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-600 transition-colors hover:text-white"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-linear-to-b from-red-500 to-red-700 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white shadow-lg shadow-red-500/30 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:hover:brightness-100"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Mengautentikasi…</span>
          </>
        ) : (
          "Masuk ke Dashboard"
        )}
      </button>

      <Link
        href="/"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-500 bg-black/40 py-3.5 text-[11px] font-black uppercase tracking-[0.3em] text-red-500 transition-all hover:bg-red-500/10 hover:border-red-400 active:scale-[0.98]"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </Link>
    </form>
  );
}
