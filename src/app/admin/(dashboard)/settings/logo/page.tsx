import type { Metadata } from "next";
import { getAppSettings } from "@/lib/randomData";
import { updateLogo } from "@/app/actions/settings";
import SettingFileUpload from "@/components/admin/SettingFileUpload";

export const metadata: Metadata = { title: "Logo — RTP Admin" };

const DEFAULT_LOGO = "/images/logo/koigrup.png";

export default async function LogoSettingPage() {
  const settings = await getAppSettings();
  const currentUrl = settings.logoFilename
    ? `/images/logo/${settings.logoFilename}`
    : DEFAULT_LOGO;

  return (
    <SettingFileUpload
      title="Logo"
      subtitle="Logo brand di bagian atas halaman publik. Background transparan disarankan."
      action={updateLogo}
      initialUrl={currentUrl}
      aspectClass="aspect-3/1"
      ratioLabel="3:1"
      recommendation="Resolusi 600×200 px (rasio 3:1). PNG (transparan), JPEG, WebP, atau SVG. Max 2 MB."
      acceptMimes="image/png,image/jpeg,image/webp,image/svg+xml"
      objectFit="contain"
    />
  );
}
