"use client";

import { motion } from "framer-motion";
import { LayoutGrid, Flame } from "lucide-react";

interface ProviderInfo {
  nama: string;
  logo: string;
}

interface ProviderTabsProps {
  providers: ProviderInfo[];
  activeProvider: string;
  onSelect: (provider: string) => void;
}

const ALL = "All Games";
export const HOT = "HOT";

interface TabOption {
  nama: string;
  logo: string | null;
}

export default function ProviderTabs({
  providers,
  activeProvider,
  onSelect,
}: ProviderTabsProps) {
  const options: TabOption[] = [
    { nama: ALL, logo: null },
    { nama: HOT, logo: null },
    ...providers.map((p) => ({ nama: p.nama, logo: p.logo })),
  ];

  return (
    <div className="w-full mb-6">
      <div
        className="flex gap-2.5 overflow-x-auto pb-3 px-1
          [&::-webkit-scrollbar]:h-1
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-slate-800
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-slate-700"
      >
        <div className="flex gap-2.5 min-w-max">
          {options.map(({ nama, logo }) => {
            const isActive = activeProvider === nama;

            return (
              <button
                key={nama}
                onClick={() => onSelect(nama)}
                className={`relative flex items-center gap-2.5 h-12 pl-3 pr-4 rounded-2xl border transition-all duration-200 group active:scale-[0.98] ${
                  isActive
                    ? "border-red-500/70 bg-red-600/10 shadow-[0_0_20px_rgba(220,38,38,0.25)]"
                    : "border-slate-800 bg-slate-900/70 hover:bg-slate-800/80 hover:border-slate-700 hover:-translate-y-0.5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-linear-to-b from-red-600/15 to-red-900/10 rounded-2xl -z-10"
                    transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
                  />
                )}

                <div className="shrink-0 w-7 h-7 flex items-center justify-center">
                  {logo ? (
                    <img
                      src={`/images/provider/${logo}`}
                      alt={nama}
                      className={`max-h-5 w-auto object-contain transition-opacity duration-200 ${
                        isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                      }`}
                    />
                  ) : nama === HOT ? (
                    <Flame
                      size={16}
                      fill="currentColor"
                      className={isActive ? "text-red-300" : "text-red-500 group-hover:text-red-300"}
                    />
                  ) : (
                    <LayoutGrid
                      size={16}
                      className={isActive ? "text-red-300" : "text-slate-400 group-hover:text-slate-200"}
                    />
                  )}
                </div>

                <span
                  className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${
                    isActive ? "text-red-200" : "text-slate-400 group-hover:text-slate-100"
                  }`}
                >
                  {nama}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
