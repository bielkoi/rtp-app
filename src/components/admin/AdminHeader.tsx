"use client";

import { PanelLeftClose, PanelLeftOpen, UserCircle } from "lucide-react";

type Props = {
  username: string;
  isMinimized: boolean;
  onToggle: () => void;
};

export function AdminHeader({ username, isMinimized, onToggle }: Props) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-red-600/20 bg-zinc-950 px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggle}
          aria-label={isMinimized ? "Lebarkan sidebar" : "Persempit sidebar"}
          className="group flex h-10 w-10 items-center justify-center rounded-xl border border-red-600/20 bg-zinc-900/50 text-zinc-400 transition-all hover:border-red-600/60 hover:text-red-500"
        >
          {isMinimized ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
        <h1 className="text-sm font-black italic uppercase tracking-tighter text-white">
          Admin Panel
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <div className="text-xs font-bold text-white">{username}</div>
          <span className="mt-1 inline-block rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-red-400">
            Admin
          </span>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-red-500/30 bg-zinc-900/60 text-red-400">
          <UserCircle size={20} />
        </div>
      </div>
    </header>
  );
}
