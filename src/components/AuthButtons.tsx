"use client";

import { LogIn, UserPlus } from "lucide-react";

export default function AuthButtons() {
  const notReady = () => {
    alert("Fitur user login belum aktif. Coming soon.");
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={notReady}
        className="group flex items-center justify-center gap-3 bg-linear-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 border border-red-400/50 rounded-xl py-4 transition-all shadow-[0_8px_20px_rgba(220,38,38,0.3)] active:scale-[0.98]"
      >
        <LogIn size={18} className="text-white" />
        <span className="text-white text-base md:text-lg font-black uppercase tracking-widest">
          Login
        </span>
      </button>

      <button
        type="button"
        onClick={notReady}
        className="group flex items-center justify-center gap-3 bg-linear-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 border border-red-400/50 rounded-xl py-4 transition-all shadow-[0_8px_20px_rgba(220,38,38,0.3)] active:scale-[0.98]"
      >
        <UserPlus size={18} className="text-white" />
        <span className="text-white text-base md:text-lg font-black uppercase tracking-widest">
          Daftar
        </span>
      </button>
    </div>
  );
}
