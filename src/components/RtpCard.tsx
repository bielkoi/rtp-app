"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Game } from "@/types";
import { Flame, Clock, Play, Zap, X, CheckCircle2, XCircle } from "lucide-react";

export default function RtpCard({ game }: { game: Game }) {
  const [showPola, setShowPola] = useState(false);

  const getProviderLogo = (providerName: string) => {
    const formattedName = providerName.toLowerCase()
      .trim()
      .replace(/\s+/g, '_')
      .replace(/&/g, '_n_'); 
    
    return `/images/provider/${formattedName}.svg`;
  };

  const getRtpColor = (rtp: number) => {
    if (rtp >= 90) return "text-[#22c55e]"; 
    if (rtp >= 75) return "text-[#eab308]"; 
    return "text-[#ef4444]"; 
  };

  const getBarColor = (rtp: number) => {
    if (rtp >= 90) return "bg-[#22c55e]";
    if (rtp >= 75) return "bg-[#eab308]";
    return "bg-[#ef4444]";
  };

  return (
    <div className="relative bg-[#111827] rounded-[1.5rem] p-4 border border-slate-800 shadow-xl group overflow-hidden transition-all hover:bg-[#1f2937] hover:border-blue-500/30 w-full">
      
      {/* Overlay Pola Gacor */}
      <AnimatePresence>
        {showPola && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute inset-0 z-30 bg-[#0f172a]/95 backdrop-blur-md p-5 flex flex-col"
          >
            <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
              <span className="text-[10px] font-black text-yellow-500 uppercase flex items-center gap-1.5 tracking-widest">
                <Zap size={12} fill="currentColor" /> Pola Gacor
              </span>
              <button onClick={() => setShowPola(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-grow flex flex-col justify-center gap-3 text-white">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-tight">Manual 9</span>
                <div className="flex items-center gap-1.5 text-[#ef4444]">
                  <span className="text-[10px] font-black uppercase">Off</span>
                  <XCircle size={14} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-tight">Manual 5</span>
                <div className="flex items-center gap-1.5 text-[#22c55e]">
                  <span className="text-[10px] font-black uppercase">On</span>
                  <CheckCircle2 size={14} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-tight">Auto 10</span>
                <div className="flex items-center gap-1.5 text-[#22c55e]">
                  <span className="text-[10px] font-black uppercase">On</span>
                  <CheckCircle2 size={14} />
                </div>
              </div>
            </div>

            <button className="mt-4 w-full bg-green-500 py-2.5 rounded-xl text-[10px] font-black uppercase text-black hover:bg-green-400 transition-all shadow-lg active:scale-95">
              Main Sekarang
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Langsung dimulai tanpa spacer atas */}
      <div className="flex gap-4 items-start mb-5">
        {/* Gambar Rasio 3:2 */}
        <div className="w-[42%] shrink-0">
          <div className="relative w-full aspect-[3/2] rounded-xl border border-slate-700 overflow-hidden bg-slate-800 group-hover:border-blue-500/50 transition-colors shadow-lg">
            <img 
              src={game.imagePath} 
              alt={game.name} 
              className="w-full h-full object-cover" 
            />

            {/* Status Hot di Sudut Kiri Atas Gambar */}
            {game.rtp >= 80 && (
              <div className="absolute top-0 left-0 bg-yellow-500/90 backdrop-blur-sm p-1 rounded-tl-xl rounded-br-xl border-r border-b border-white/10 z-10">
                <Flame size={12} fill="currentColor" className="text-black" />
              </div>
            )}
            
            {/* Logo Provider di Sudut Kanan Bawah Gambar */}
            <div className="absolute bottom-0 right-0 bg-black/90 backdrop-blur-sm p-1.5 rounded-tl-xl rounded-br-xl border-l border-t border-white/5 z-10 w-10 h-8 flex items-center justify-center">
              <img 
                src={getProviderLogo(game.provider)} 
                alt={game.provider} 
                className="w-auto h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>

        {/* Info Area */}
        <div className="flex-grow min-w-0 flex flex-col pt-0.5">
          <h3 className="text-white text-[13px] font-bold uppercase tracking-tight mb-1 leading-tight line-clamp-2">
            {game.name}
          </h3>
          
          <div className="flex items-baseline gap-0.5 mb-1.5">
            <span className={`text-2xl font-black italic tracking-tighter ${getRtpColor(game.rtp)}`}>
              {game.rtp}
            </span>
            <span className={`text-xs font-bold italic ${getRtpColor(game.rtp)}`}>
              .4%
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
      <div className="flex items-center justify-between gap-2 border-t border-slate-800/50 pt-4">
        <div className="flex items-center gap-1 bg-slate-900/80 py-1.5 px-2 rounded-lg border border-white/5">
          <Clock size={10} className="text-blue-500" />
          <span className="text-[9px] font-bold font-mono text-slate-300 whitespace-nowrap">
            17:24 - 17:48
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button className="bg-[#a3ff12] hover:bg-[#bef264] text-black px-3 py-2 rounded-lg flex items-center gap-1 transition-all shadow-md active:scale-95">
            <Play size={10} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-tight">Main</span>
          </button>
          
          <button 
            onClick={() => setShowPola(true)}
            className="bg-[#facc15] hover:bg-[#eab308] text-black px-3 py-2 rounded-lg flex items-center gap-1 transition-all shadow-md active:scale-95"
          >
            <Zap size={10} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-tight">Pola</span>
          </button>
        </div>
      </div>
    </div>
  );
}