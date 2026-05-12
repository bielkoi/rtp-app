import Navbar from "@/components/Navbar";
import GamesView from "@/components/GamesView";
import { getAllGames, getProviders } from "@/lib/gameUtils";

export default async function Home() {
  const [games, providers] = await Promise.all([getAllGames(), getProviders()]);

  return (
    <div className="min-h-screen bg-[#0f1016] text-slate-200">
      <Navbar />

      <main className="pt-24 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
        <GamesView games={games} providers={providers} />
      </main>
    </div>
  );
}
