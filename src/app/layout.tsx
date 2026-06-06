import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getAppSettings } from "@/lib/randomData";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RTP Terminal — Live Game Analytics",
  description: "Live RTP analytics across slot providers.",
  icons: {
    icon: [{ url: "/images/favicon/koi-favicon.png", type: "image/png" }],
    apple: "/images/favicon/koi-favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getAppSettings();
  const bgUrl = settings.backgroundFilename
    ? `/images/background/${settings.backgroundFilename}`
    : "/images/background/bg-default.webp";

  return (
    <html
      lang="en"
      className={`${jakartaSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{ ["--bg-url" as string]: `url("${bgUrl}")` }}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
