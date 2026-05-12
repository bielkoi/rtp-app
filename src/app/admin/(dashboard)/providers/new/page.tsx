import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ProviderForm from "../provider-form";
import { createProvider } from "@/app/actions/providers";

export const metadata: Metadata = { title: "New Provider — RTP Admin" };

export default function NewProviderPage() {
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
          New <span className="text-blue-500">Provider</span>
        </h1>
      </div>
      <ProviderForm action={createProvider} submitLabel="Create" />
    </div>
  );
}
