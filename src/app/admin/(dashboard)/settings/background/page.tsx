import type { Metadata } from "next";
import { getAppSettings } from "@/lib/randomData";
import { updateBackground } from "@/app/actions/settings";
import SettingFileUpload from "@/components/admin/SettingFileUpload";

export const metadata: Metadata = { title: "Background — RTP Admin" };

const DEFAULT_BG = "/images/background/bg-default.webp";

export default async function BackgroundSettingPage() {
  const settings = await getAppSettings();
  const currentUrl = settings.backgroundFilename
    ? `/images/background/${settings.backgroundFilename}`
    : DEFAULT_BG;

  return (
    <SettingFileUpload
      title="Background"
      subtitle="Ganti latar belakang halaman publik. Akan terlihat di belakang panel utama."
      action={updateBackground}
      initialUrl={currentUrl}
      aspectClass="aspect-video"
      ratioLabel="16:9"
      recommendation="Resolusi 2048×1152 px (rasio 16:9). PNG/JPEG/WebP. Otomatis di-resize + dikompres ke WebP q82."
      acceptMimes="image/png,image/jpeg,image/webp"
      objectFit="cover"
    />
  );
}
