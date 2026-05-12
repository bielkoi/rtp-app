"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import ProviderTabs from "@/components/ProviderTabs";
import RtpCard from "@/components/RtpCard";
import { Game } from "@/types";

const INITIAL_LIMIT = 24;
const LOAD_STEP = 12;

interface GamesViewProps {
  games: Game[];
  providers: string[];
}

export default function GamesView({ games, providers }: GamesViewProps) {
  const [activeTab, setActiveTab] = useState("All Games");
  const [visibleCount, setVisibleCount] = useState(INITIAL_LIMIT);

  const filteredGames = useMemo(() => {
    if (activeTab === "All Games") return games;
    return games.filter((g) => g.provider === activeTab);
  }, [activeTab, games]);

  const displayGames = filteredGames.slice(0, visibleCount);

  const handleTabChange = (provider: string) => {
    setActiveTab(provider);
    setVisibleCount(INITIAL_LIMIT);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LOAD_STEP);
  };

  return (
    <>
      <div className="mb-8 border-l-4 border-blue-600 pl-4">
        <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">
          Live Game <span className="text-blue-500">Analytics</span>
        </h2>
        <p className="text-[10px] text-slate-500 font-mono tracking-widest">
          SHOWING {displayGames.length} OF {filteredGames.length} GAMES
        </p>
      </div>

      <div className="mb-8">
        <ProviderTabs
          providers={providers}
          activeProvider={activeTab}
          onSelect={handleTabChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayGames.map((game, i) => (
          <RtpCard key={`${game.name}-${i}`} game={game} />
        ))}
      </div>

      {visibleCount < filteredGames.length && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-95"
          >
            LOAD MORE GAMES
            <ChevronDown size={20} />
          </button>
        </div>
      )}
    </>
  );
}
