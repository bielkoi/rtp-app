"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Game } from "@/types";
import { Flame, Star, Clock, Play, Zap, X, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

export default function RtpCard({ game }: { game: Game }) {
  const [showPola, setShowPola] = useState(false);

  // 5-tier color: very high (≥81) → very low (≤20)
  const getRtpColor = (rtp: number) => {
    if (rtp >= 81) return "text-[#10b981]"; // very high — emerald
    if (rtp >= 61) return "text-[#22c55e]"; // high — green
    if (rtp >= 41) return "text-[#eab308]"; // medium — yellow
    if (rtp >= 21) return "text-[#f97316]"; // low — orange
    return "text-[#ef4444]";                // very low — red
  };

  const getBarColor = (rtp: number) => {
    if (rtp >= 81) return "bg-[#10b981]";
    if (rtp >= 61) return "bg-[#22c55e]";
    if (rtp >= 41) return "bg-[#eab308]";
    if (rtp >= 21) return "bg-[#f97316]";
    return "bg-[#ef4444]";
  };

  return (
    <div className="relative bg-black rounded-2xl p-4 border border-red-600 shadow-xl group overflow-hidden w-full transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-slate-950 hover:border-red-400 hover:shadow-2xl hover:shadow-red-900/50">
      
      {/* Overlay Pola Gacor */}
      <AnimatePresence>
        {showPola && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 z-30 bg-[#0f172a]/85 backdrop-blur-xl p-4 pb-3 flex flex-col"
          >
            {game.status === "very_low" ? (
              <>
                <div className="flex justify-between items-center mb-4 border-b border-red-500/40 pb-2">
                  <span className="text-[10px] font-black text-red-400 uppercase flex items-center gap-1.5 tracking-widest">
                    <AlertTriangle size={12} fill="currentColor" className="text-red-400" /> Peringatan
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPola(false)}
                    aria-label="Tutup overlay"
                    className="rounded-md text-slate-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grow flex flex-col items-center justify-center text-center px-2 gap-1.5 min-h-0">
                  <AlertTriangle size={26} className="text-red-500" />
                  <p className="text-[11px] font-black uppercase tracking-widest text-red-400 leading-tight">
                    Pola Tidak Tersedia!!
                  </p>
                  <p className="text-[10px] font-bold text-slate-300 leading-snug">
                    Tidak Disarankan Bermain<br />Game ini!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPola(false)}
                  className="mt-2 shrink-0 w-full bg-slate-800 hover:bg-slate-700 py-1.5 rounded-lg text-[9px] font-black uppercase text-slate-200 transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  Tutup
                </button>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                  <span className="text-[10px] font-black text-yellow-500 uppercase flex items-center gap-1.5 tracking-widest">
                    <Zap size={12} fill="currentColor" /> Pola Gacor
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPola(false)}
                    aria-label="Tutup overlay"
                    className="rounded-md text-slate-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grow flex flex-col justify-center gap-2.5 text-white">
                  {game.polaMain.map((pola, i) => (
                    <div key={`${pola.type}-${pola.total}-${i}`} className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-tight">
                        {pola.type} {pola.total}
                      </span>
                      <div
                        className={`flex items-center gap-1.5 ${
                          pola.turbo ? "text-[#22c55e]" : "text-[#ef4444]"
                        }`}
                      >
                        <span className="text-[10px] font-black uppercase">
                          {pola.turbo ? "On" : "Off"}
                        </span>
                        {pola.turbo ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    className="bg-green-500 py-1.5 rounded-lg text-[9px] font-black uppercase text-black hover:bg-green-400 transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
                  >
                    Main
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPola(false)}
                    className="bg-slate-800 hover:bg-slate-700 py-1.5 rounded-lg text-[9px] font-black uppercase text-slate-200 transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    Tutup
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Langsung dimulai tanpa spacer atas */}
      <div className="flex gap-4 items-start mb-5">
        {/* Gambar Rasio 3:2 */}
        <div className="w-[42%] shrink-0">
          <div className="relative w-full aspect-3/2 rounded-xl border border-slate-700 overflow-hidden bg-slate-800 group-hover:border-blue-500/50 transition-colors shadow-lg">
            <img
              src={game.imagePath}
              alt={game.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const img = e.currentTarget;
                if (img.dataset.fallback !== "true") {
                  img.dataset.fallback = "true";
                  img.src = "/images/placeholder-game.svg";
                }
              }}
            />

            {/* Status badge di Sudut Kiri Atas Gambar */}
            {game.rtp >= 81 ? (
              <div className="absolute top-0 left-0 bg-red-600/90 backdrop-blur-sm px-1.5 py-1 rounded-tl-xl rounded-br-xl border-r border-b border-white/10 z-10 flex items-center gap-1">
                <Flame size={12} fill="currentColor" className="text-white" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white leading-none">HOT</span>
              </div>
            ) : game.rtp >= 61 ? (
              <div className="absolute top-0 left-0 bg-green-600/90 backdrop-blur-sm px-1.5 py-1 rounded-tl-xl rounded-br-xl border-r border-b border-white/10 z-10 flex items-center gap-1">
                <Star size={12} fill="currentColor" className="text-white" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white leading-none">TOP</span>
              </div>
            ) : null}

            {/* Shining sweep effect untuk very_high */}
            {game.rtp >= 81 && (
              <div
                aria-hidden
                className="absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-white/60 to-transparent animate-shine pointer-events-none z-20"
              />
            )}
          </div>
        </div>

        {/* Info Area */}
        <div className="grow min-w-0 flex flex-col pt-0.5">
          <div className="flex justify-end mb-1">
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/60 truncate">
              {game.provider}
            </span>
          </div>
          <h3 className="text-white text-[13px] font-bold uppercase tracking-tight mb-1 leading-tight line-clamp-2">
            {game.name}
          </h3>
          
          <div className="flex items-baseline gap-0.5 mb-1.5">
            <span className={`text-2xl font-black italic tracking-tighter ${getRtpColor(game.rtp)}`}>
              {Math.floor(game.rtp)}
            </span>
            <span className={`text-xs font-bold italic ${getRtpColor(game.rtp)}`}>
              .{game.rtp.toFixed(2).split(".")[1]}%
            </span>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden relative shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${game.rtp}%` }}
              className={`h-full ${getBarColor(game.rtp)} shadow-[0_0_8px_rgba(34,197,94,0.3)]`}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 border-t border-slate-600 pt-4">
        <div className="flex items-center gap-1 bg-slate-900/80 py-1.5 px-2 rounded-lg border border-white/30">
          <Clock size={10} className="text-white/80" />
          <span className="text-[9px] font-bold font-mono text-slate-300 whitespace-nowrap">
            {game.jamGacor}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="bg-green-500 hover:bg-green-400 text-black px-3 py-2 rounded-lg flex items-center gap-1 transition-all shadow-md active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <Play size={10} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-tight">Main</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPola(true)}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-2 rounded-lg flex items-center gap-1 transition-all shadow-md active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <Zap size={10} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-tight">Pola</span>
          </button>
        </div>
      </div>
    </div>
  );
}