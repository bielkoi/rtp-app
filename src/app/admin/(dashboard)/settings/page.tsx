import type { Metadata } from "next";
import { getAppSettings } from "@/lib/randomData";
import SettingsForm from "./settings-form";

export const metadata: Metadata = { title: "Settings — RTP Admin" };

export default async function SettingsPage() {
  const settings = await getAppSettings();

  return (
    <div>
      <div className="mb-6 border-l-4 border-red-600 pl-4">
        <h1 className="text-xl font-black italic tracking-tighter text-white uppercase">
          App <span className="text-red-500">Settings</span>
        </h1>
        <p className="text-[10px] text-zinc-500 font-mono tracking-widest">
          CONFIG GLOBAL
        </p>
      </div>

      <SettingsForm initial={settings} />
    </div>
  );
}
