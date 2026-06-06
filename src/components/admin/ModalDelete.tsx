"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface ModalDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitleLabel?: string;
  subtitleValue: string;
  message: string;
  confirmLabel?: string;
  /** Server action — terima FormData. */
  formAction: (formData: FormData) => void | Promise<void>;
  /** Hidden inputs untuk action (mis. { id: 5 }). */
  hiddenFields: Record<string, string | number>;
}

export function ModalDelete({
  isOpen,
  onClose,
  title,
  subtitleLabel = "NAMA",
  subtitleValue,
  message,
  confirmLabel = "Ya, Hapus Permanen",
  formAction,
  hiddenFields,
}: ModalDeleteProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-3xl border border-red-500/30 bg-zinc-950 shadow-2xl"
          >
            <div className="flex flex-col items-center px-8 pt-8 pb-4">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter text-white text-center">
                {title}
              </h3>
              <p className="mt-1 text-[10px] font-bold uppercase text-zinc-500">
                {subtitleLabel}: <span className="text-zinc-300">{subtitleValue}</span>
              </p>
            </div>

            <div className="px-8 py-3 text-center">
              <p className="text-[11px] font-medium leading-relaxed text-zinc-400">
                {message}
              </p>
            </div>

            <form action={formAction} className="flex flex-col gap-3 p-6 pt-3">
              {Object.entries(hiddenFields).map(([key, val]) => (
                <input key={key} type="hidden" name={key} value={String(val)} />
              ))}
              <ConfirmRow confirmLabel={confirmLabel} onClose={onClose} />
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Submit button + cancel, plus auto-close saat pending kembali false (after success). */
function ConfirmRow({
  confirmLabel,
  onClose,
}: {
  confirmLabel: string;
  onClose: () => void;
}) {
  const { pending } = useFormStatus();
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending) {
      onClose();
    }
    wasPending.current = pending;
  }, [pending, onClose]);

  return (
    <>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-red-500/30 transition-all hover:bg-red-500 disabled:opacity-50"
      >
        {pending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
        {confirmLabel}
      </button>
      <button
        type="button"
        onClick={onClose}
        disabled={pending}
        className="rounded-2xl bg-white/5 py-3.5 text-[11px] font-black uppercase tracking-widest text-zinc-400 transition-all hover:bg-white/10 disabled:opacity-50"
      >
        Batalkan
      </button>
    </>
  );
}
