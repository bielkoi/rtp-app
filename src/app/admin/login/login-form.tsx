"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/actions/auth";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="mb-4">
        <label htmlFor="username" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className="w-full bg-[#0f1016] border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full bg-[#0f1016] border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {state?.error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono rounded-lg px-3 py-2">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-xs py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-[0.98]"
      >
        {pending ? "Logging in…" : "Login"}
      </button>
    </form>
  );
}
