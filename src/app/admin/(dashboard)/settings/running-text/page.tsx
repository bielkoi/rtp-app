import type { Metadata } from "next";
import { getAppSettings } from "@/lib/randomData";
import { updateRunningText } from "@/app/actions/settings";
import RunningTextForm from "./running-text-form";

export const metadata: Metadata = { title: "Running Text — RTP Admin" };

export default async function RunningTextSettingPage() {
  const settings = await getAppSettings();

  return (
    <RunningTextForm
      action={updateRunningText}
      initialText={settings.runningText}
    />
  );
}
