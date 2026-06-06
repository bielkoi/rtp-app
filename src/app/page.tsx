import SiteLogo from "@/components/SiteLogo";
import Marquee from "@/components/Marquee";
import HeroBanner from "@/components/HeroBanner";
import AuthButtons from "@/components/AuthButtons";
import GamesView from "@/components/GamesView";
import SiteFooter from "@/components/SiteFooter";
import ScrollToTop from "@/components/ScrollToTop";
import { getAllGames, getProviders, getProviderRatings } from "@/lib/gameUtils";
import { getAppSettings } from "@/lib/randomData";
import { getSlides } from "@/lib/slides";

export default async function Home() {
  const [games, providers, providerRatings, settings, slides] = await Promise.all([
    getAllGames(),
    getProviders(),
    getProviderRatings(),
    getAppSettings(),
    getSlides(),
  ]);

  const logoUrl = settings.logoFilename
    ? `/images/logo/${settings.logoFilename}`
    : null;
  const marqueeItems = settings.runningText
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen text-slate-200">
      <div className="max-w-300 mx-auto px-4 md:px-6 py-8">
        <div className="bg-black/75 backdrop-blur-sm border border-slate-800 rounded-3xl p-4 md:p-6 shadow-2xl">
          <SiteLogo logoUrl={logoUrl} />
          <div className="mt-4">
            <Marquee items={marqueeItems} />
          </div>
          <div className="mt-4">
            <HeroBanner slides={slides} />
          </div>
          <div className="mt-4">
            <AuthButtons />
          </div>
          <div className="mt-8">
            <GamesView games={games} providers={providers} providerRatings={providerRatings} />
          </div>
          <SiteFooter />
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
}
