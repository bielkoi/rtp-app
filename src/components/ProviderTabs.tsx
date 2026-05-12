"use client";

import { motion } from "framer-motion";

interface ProviderTabsProps {
  providers: string[];
  activeProvider: string;
  onSelect: (provider: string) => void;
}

export default function ProviderTabs({ 
  providers, 
  activeProvider, 
  onSelect 
}: ProviderTabsProps) {
  
  const allOptions = ["All Games", ...providers];

  const getProviderLogo = (name: string) => {
    if (name === "All Games") return null;
    const formatted = name.toLowerCase()
      .trim()
      .replace(/\s+/g, '_')
      .replace(/&/g, '_n_');
    return `/images/provider/${formatted}.svg`;
  };

  return (
    <div className="w-full mb-6">
      {/* Container dengan Custom Scrollbar Style */}
      <div className="flex space-x-3 overflow-x-auto pb-4 px-4 
        scrollbar-thin 
        scrollbar-thumb-slate-800 
        scrollbar-track-transparent
        [&::-webkit-scrollbar]:h-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-slate-800
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-slate-700
        active:[&::-webkit-scrollbar-thumb]:bg-blue-600/50
        transition-colors"
      >
        <div className="flex space-x-3 min-w-max">
          {allOptions.map((provider) => {
            const isActive = activeProvider === provider;
            const logoPath = getProviderLogo(provider);
            
            return (
              <button
                key={provider}
                onClick={() => onSelect(provider)}
                className={`relative flex items-center gap-3 h-11 px-4 rounded-xl transition-all duration-300 border group ${
                  isActive 
                    ? "border-blue-500/50 bg-blue-600/5" 
                    : "bg-[#111827] border-slate-800 hover:bg-[#1f2937] hover:border-slate-700"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-600/10 rounded-xl -z-10 shadow-[inset_0_0_15px_rgba(37,99,235,0.1)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {logoPath && (
                  <div className="shrink-0">
                    <img 
                      src={logoPath} 
                      alt={provider}
                      className={`h-4 w-auto object-contain transition-all duration-300 ${
                        isActive ? "opacity-100 brightness-110" : "opacity-40 grayscale group-hover:grayscale-0"
                      }`}
                    />
                  </div>
                )}

                <span className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                  isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                }`}>
                  {provider}
                </span>

                {isActive && (
                  <motion.div 
                    layoutId="activeDot"
                    className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}