import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getSession } from "@/lib/session";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login — RTP Terminal",
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <div className="relative min-h-screen font-sans">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="relative flex w-full max-w-225 overflow-hidden rounded-3xl border-2 border-red-500 bg-zinc-900/70 shadow-[0_0_30px_rgba(220,38,38,0.25)] backdrop-blur-xl">
          {/* Brand panel (desktop only) */}
          <div className="relative hidden w-[45%] flex-col items-center justify-center border-r border-red-600/20 bg-linear-to-br from-zinc-900 to-black p-12 md:flex">
            <div className="relative mb-8 flex h-32 w-32 items-center justify-center rounded-3xl border border-red-600/30 bg-zinc-900 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              <div className="flex h-[85%] w-[85%] items-center justify-center rounded-2xl bg-linear-to-tr from-red-700 via-red-500 to-red-400 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]">
                <span className="text-5xl font-black text-white">R</span>
              </div>
            </div>

            <div className="relative z-10 text-center">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.5em] text-red-600/60">
                Live Game Analytics
              </p>
              <h1 className="bg-linear-to-b from-red-400 via-red-500 to-red-600 bg-clip-text text-4xl font-black italic tracking-tighter text-transparent">
                RTP TERMINAL
              </h1>
            </div>

            <div className="absolute bottom-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
              <ShieldCheck size={14} className="text-red-700/60" />
              Next Engine
            </div>
          </div>

          {/* Form panel */}
          <div className="w-full p-8 md:w-[55%] md:p-12 lg:p-16">
            <div className="mb-10">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                Login
              </h2>
              <p className="mt-2 text-sm font-medium text-zinc-500">
                Selamat datang, silahkan isi username & password anda.
              </p>
            </div>

            <LoginForm />

            <p className="mt-12 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600">
              © {new Date().getFullYear()} RTP TERMINAL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
