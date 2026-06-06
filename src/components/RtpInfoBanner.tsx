"use client";

import { useEffect, useState } from "react";
import { Calendar, ThumbsUp, Star } from "lucide-react";

function PartialStar({ fillPercent }: { fillPercent: number }) {
  return (
    <div className="relative inline-block leading-none">
      <Star size={14} className="text-slate-700" />
      <div
        className="absolute top-0 left-0 overflow-hidden"
        style={{ width: `${fillPercent}%` }}
      >
        <Star size={14} className="text-yellow-400 fill-yellow-400" />
      </div>
    </div>
  );
}

export default function RtpInfoBanner({
  providerName,
  rating,
}: {
  providerName: string;
  rating: number;
}) {
  const [dateStr, setDateStr] = useState("—");

  useEffect(() => {
    setDateStr(
      new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      }).format(new Date())
    );
  }, []);

  return (
    <div className="relative bg-black border border-red-600 rounded-2xl px-5 py-4 overflow-hidden mb-6 shadow-lg">
      <div className="absolute inset-0 bg-linear-to-r from-red-900/50 via-red-600/15 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-red-400 text-[11px] font-bold mb-2">
          <Calendar size={14} />
          <span>Update RTP: {dateStr}</span>
        </div>

        <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tight text-white mb-2 leading-tight">
          {providerName} Slot Live RTP
        </h2>

        <div className="flex items-center gap-2.5">
          <ThumbsUp size={14} className="text-red-400" />
          <span className="text-[11px] font-bold text-slate-200">SUKA({rating.toFixed(1)})</span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => {
              const fillPercent = Math.max(0, Math.min(1, rating - (i - 1))) * 100;
              return <PartialStar key={i} fillPercent={fillPercent} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
