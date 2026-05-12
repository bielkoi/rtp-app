"use client";

import { Trash2 } from "lucide-react";

export default function ConfirmDeleteButton({ message }: { message: string }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
      aria-label="Hapus"
    >
      <Trash2 size={14} />
    </button>
  );
}
