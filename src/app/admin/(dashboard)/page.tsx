import type { Metadata } from "next";
import Link from "next/link";
import type { RowDataPacket } from "mysql2/promise";
import { db } from "@/lib/db";
import { Boxes, Gamepad2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard — RTP Admin",
};

interface CountRow extends RowDataPacket {
  total: number;
}

async function getStats() {
  const [providerRows] = await db.query<CountRow[]>("SELECT COUNT(*) AS total FROM provider");
  const [gameRows] = await db.query<CountRow[]>("SELECT COUNT(*) AS total FROM game");
  return {
    providers: providerRows[0]?.total ?? 0,
    games: gameRows[0]?.total ?? 0,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <div className="mb-8 border-l-4 border-red-600 pl-4">
        <h1 className="text-xl font-black italic tracking-tighter text-white uppercase">
          Dashboard <span className="text-red-500">Overview</span>
        </h1>
        <p className="text-[10px] text-zinc-500 font-mono tracking-widest">
          REAL-TIME COUNTS FROM DATABASE
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        <StatCard
          href="/admin/providers"
          label="Providers"
          value={stats.providers}
          icon={<Boxes size={20} />}
        />
        <StatCard
          href="/admin/games"
          label="Games"
          value={stats.games}
          icon={<Gamepad2 size={20} />}
        />
      </div>
    </div>
  );
}

function StatCard({
  href,
  label,
  value,
  icon,
}: {
  href: string;
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group bg-zinc-900/50 border border-red-600/20 hover:border-red-600/60 rounded-2xl p-5 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="bg-red-600/10 text-red-500 p-2 rounded-lg">{icon}</div>
        <ArrowRight size={16} className="text-zinc-600 group-hover:text-red-500 transition-colors" />
      </div>
      <div className="text-3xl font-black italic tracking-tighter text-white mb-1">
        {value.toLocaleString()}
      </div>
      <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
        {label}
      </div>
    </Link>
  );
}
