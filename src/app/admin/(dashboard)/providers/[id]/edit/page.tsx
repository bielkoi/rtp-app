import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { RowDataPacket } from "mysql2/promise";
import { ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import ProviderForm from "../../provider-form";
import { updateProvider, type ProviderFormState } from "@/app/actions/providers";

export const metadata: Metadata = { title: "Edit Provider — RTP Admin" };

interface ProviderRow extends RowDataPacket {
  id: number;
  nama: string;
  logo: string;
}

export default async function EditProviderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) notFound();

  const [rows] = await db.query<ProviderRow[]>(
    "SELECT id, nama, logo FROM provider WHERE id = ? LIMIT 1",
    [numId]
  );
  const provider = rows[0];
  if (!provider) notFound();

  const bound = updateProvider.bind(null, provider.id) as (
    state: ProviderFormState | undefined,
    formData: FormData
  ) => Promise<ProviderFormState>;

  return (
    <div>
      <Link
        href="/admin/providers"
        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white mb-4"
      >
        <ChevronLeft size={14} /> Providers
      </Link>
      <div className="mb-6 border-l-4 border-blue-600 pl-4">
        <h1 className="text-xl font-black italic tracking-tighter text-white uppercase">
          Edit <span className="text-blue-500">{provider.nama}</span>
        </h1>
        <p className="text-[10px] text-slate-500 font-mono tracking-widest">ID #{provider.id}</p>
      </div>
      <ProviderForm
        action={bound}
        initial={{ nama: provider.nama, logo: provider.logo }}
        submitLabel="Save"
      />
    </div>
  );
}
