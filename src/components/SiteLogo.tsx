const DEFAULT_LOGO = "/images/logo/koigrup.png";

export default function SiteLogo({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <div className="flex justify-center">
      <img
        src={logoUrl ?? DEFAULT_LOGO}
        alt="Logo"
        className="h-16 md:h-20 w-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.35)]"
      />
    </div>
  );
}
