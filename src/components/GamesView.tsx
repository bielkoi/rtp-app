"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ProviderTabs, { HOT } from "@/components/ProviderTabs";
import RtpCard from "@/components/RtpCard";
import RtpInfoBanner from "@/components/RtpInfoBanner";
import { Game } from "@/types";
import type { ProviderInfo } from "@/lib/gameUtils";

const INITIAL_LIMIT = 24;
const LOAD_STEP = 12;
const HOT_LIMIT = 30;

interface GamesViewProps {
  games: Game[];
  providers: ProviderInfo[];
  providerRatings: Record<string, number>;
}

export default function GamesView({ games, providers, providerRatings }: GamesViewProps) {
  const [activeTab, setActiveTab] = useState("All Games");
  const [visibleCount, setVisibleCount] = useState(INITIAL_LIMIT);

  const filteredGames = useMemo(() => {
    if (activeTab === "All Games") return games;
    if (activeTab === HOT) {
      return [...games].sort((a, b) => b.rtp - a.rtp).slice(0, HOT_LIMIT);
    }
    return games.filter((g) => g.provider === activeTab);
  }, [activeTab, games]);

  const displayGames =
    activeTab === HOT ? filteredGames : filteredGames.slice(0, visibleCount);

  const handleTabChange = (provider: string) => {
    setActiveTab(provider);
    setVisibleCount(INITIAL_LIMIT);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LOAD_STEP);
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-sm font-black uppercase tracking-widest text-white border-l-4 border-red-600 pl-3 mb-3">
          Provider
        </h2>
        <ProviderTabs
          providers={providers}
          activeProvider={activeTab}
          onSelect={handleTabChange}
        />
      </div>

      <RtpInfoBanner providerName={activeTab} rating={providerRatings[activeTab] ?? 3.8} />

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        {displayGames.map((game, i) => (
          <RtpCard key={`${game.name}-${i}`} game={game} />
        ))}
      </motion.div>

      {activeTab !== HOT && visibleCount < filteredGames.length && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black px-8 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] active:scale-95"
          >
            MUAT LAGI
            <ChevronDown size={20} />
          </button>
        </div>
      )}
    </>
  );
}
