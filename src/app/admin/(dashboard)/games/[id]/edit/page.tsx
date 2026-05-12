import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { RowDataPacket } from "mysql2/promise";
import { ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import GameForm from "../../game-form";
import { updateGame, type GameFormState } from "@/app/actions/games";

export const metadata: Metadata = { title: "Edit Game — RTP Admin" };

interface GameRow extends RowDataPacket {
  id: number;
  nama: string;
  gambar: string;
  id_provider: number;
}

interface ProviderRow extends RowDataPacket {
  id: number;
  nama: string;
}

export default async function EditGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) notFound();

  const [[gameRows], [providers]] = await Promise.all([
    db.query<GameRow[]>("SELECT id, nama, gambar, id_provider FROM game WHERE id = ? LIMIT 1", [numId]),
    db.query<ProviderRow[]>("SELECT id, nama FROM provider ORDER BY nama"),
  ]);
  const game = gameRows[0];
  if (!game) notFound();

  const bound = updateGame.bind(null, game.id) as (
    state: GameFormState | undefined,
    formData: FormData
  ) => Promise<GameFormState>;

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
          Edit <span className="text-blue-500 truncate">{game.nama}</span>
        </h1>
        <p className="text-[10px] text-slate-500 font-mono tracking-widest">ID #{game.id}</p>
      </div>
      <GameForm
        action={bound}
        providers={providers}
        initial={{ nama: game.nama, gambar: game.gambar, id_provider: game.id_provider }}
        submitLabel="Save"
      />
    </div>
  );
}
