"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  Gamepad2,
  Settings,
  Wallpaper,
  Image as ImageIcon,
  Type,
  Images,
  LogOut,
} from "lucide-react";
import { logout } from "@/app/actions/auth";

const SECTIONS = [
  {
    title: "Menu Utama",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
      { name: "Providers", icon: Boxes, href: "/admin/providers" },
      { name: "Games", icon: Gamepad2, href: "/admin/games" },
    ],
  },
  {
    title: "Konfigurasi Situs",
    items: [
      { name: "App Settings", icon: Settings, href: "/admin/settings" },
      { name: "Background", icon: Wallpaper, href: "/admin/settings/background" },
      { name: "Logo", icon: ImageIcon, href: "/admin/settings/logo" },
      { name: "Slider", icon: Images, href: "/admin/settings/slider" },
      { name: "Running Text", icon: Type, href: "/admin/settings/running-text" },
    ],
  },
] as const;

type Props = {
  isMinimized: boolean;
};

export function AdminSidebar({ isMinimized }: Props) {
  const pathname = usePathname();

  const isActiveFor = (href: string) => {
    // Exact match untuk root + /admin/settings (yang punya child route terpisah)
    if (href === "/admin" || href === "/admin/settings") return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside
      className={`sticky top-0 z-100 flex h-screen flex-col border-r border-red-600/30 bg-zinc-950 transition-[width] duration-300 ease-in-out ${
        isMinimized ? "w-20" : "w-64"
      }`}
    >
      <div className={`flex items-center justify-center p-6 ${isMinimized ? "h-20" : "h-24"}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-tr from-red-700 via-red-500 to-red-400">
          <span className="text-lg font-black text-white">R</span>
        </div>
        {!isMinimized && (
          <div className="ml-3 flex flex-col">
            <span className="truncate text-sm font-black italic tracking-tighter text-white">
              RTP TERMINAL
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-600">
              Admin Control
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-8 overflow-y-auto px-4">
        {SECTIONS.map((section) => (
          <div key={section.title} className="space-y-3">
            {!isMinimized && (
              <h2 className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-red-600/80">
                {section.title}
              </h2>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActiveFor(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={isMinimized ? item.name : undefined}
                    className={`group relative flex items-center rounded-xl py-3 transition-all duration-300 ${
                      isMinimized ? "justify-center" : "gap-3 px-4"
                    } ${
                      active
                        ? "bg-linear-to-r from-red-600/20 to-transparent text-red-500"
                        : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 h-5 w-1 rounded-r-full bg-linear-to-b from-red-400 to-red-700 shadow-[0_0_10px_#dc2626]" />
                    )}
                    <item.icon
                      size={20}
                      className={active ? "drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]" : ""}
                    />
                    {!isMinimized && (
                      <span className="truncate text-sm font-semibold uppercase tracking-wide">
                        {item.name}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className={`border-t border-red-600/20 p-4 ${isMinimized ? "flex justify-center" : ""}`}>
        <form action={logout}>
          <button
            type="submit"
            title={isMinimized ? "Logout" : undefined}
            className={`group flex items-center rounded-xl text-red-400 transition-all hover:bg-red-500/10 active:scale-95 ${
              isMinimized ? "h-12 w-12 justify-center" : "w-full gap-3 px-4 py-3"
            }`}
          >
            <LogOut size={20} className="transition-transform group-hover:translate-x-1" />
            {!isMinimized && (
              <span className="text-xs font-bold uppercase tracking-widest">Logout</span>
            )}
          </button>
        </form>
      </div>
    </aside>
  );
}
