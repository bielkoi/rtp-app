import { Star, Minus } from "lucide-react";

const DEFAULT_ITEMS = [
  "PALING GAMPANG MENANG DI INDONESIA",
  "HARAP SELALU CHECK REKENING AKTIF DEPOSIT KAMI",
  "MINIMAL DEPO 5RIBU DAN MINIMAL WD 25RIBU",
  "PROMO BONUS NEW MEMBER 100%",
  "LIVE CHAT 24 JAM NONSTOP",
];

export default function Marquee({ items }: { items?: string[] }) {
  const list = items && items.length > 0 ? items : DEFAULT_ITEMS;
  const track = [...list, ...list];

  return (
    <div className="bg-black border border-red-600 rounded-xl overflow-hidden">
      <div className="flex w-max animate-marquee whitespace-nowrap py-2">
        {track.map((text, i) => (
          <span
            key={i}
            className="inline-flex items-center mx-6 text-white text-xs md:text-sm font-black uppercase tracking-widest"
          >
            <Star size={12} className="text-red-400 mr-2" fill="currentColor" />
            {text}
            <Minus size={14} className="text-red-400 ml-6 rotate-90" />
          </span>
        ))}
      </div>
    </div>
  );
}
