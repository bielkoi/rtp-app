import type { Metadata } from "next";
import Link from "next/link";
import type { RowDataPacket } from "mysql2/promise";
import { ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import GameForm from "../game-form";
import { createGame } from "@/app/actions/games";

export const metadata: Metadata = { title: "New Game — RTP Admin" };

interface ProviderRow extends RowDataPacket {
  id: number;
  nama: string;
}

export default async function NewGamePage() {
  const [providers] = await db.query<ProviderRow[]>(
    "SELECT id, nama FROM provider ORDER BY nama"
  );

  return (
    <div>
      <Link
        href="/admin/games"
        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white mb-4"
      >
        <ChevronLeft size={14} /> Games
      </Link>
      <div className="mb-6 border-l-4 border-blue-600 pl-4">
        <h1 className="text-xl font-black italic tracking-tighter text-white uppercase">
          New <span className="text-blue-500">Game</span>
        </h1>
      </div>
      <GameForm action={createGame} providers={providers} submitLabel="Create" />
    </div>
  );
}
