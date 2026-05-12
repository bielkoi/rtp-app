import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "@/app/actions/auth";
import { LayoutDashboard, Boxes, Gamepad2, LogOut, Terminal } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen bg-[#0f1016] text-slate-200 flex">
      <aside className="w-60 shrink-0 bg-[#111827] border-r border-slate-800 flex flex-col">
        <div className="p-5 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <Terminal size={18} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-black tracking-tighter text-white leading-none">
                RTP<span className="text-blue-500">ADMIN</span>
              </div>
              <div className="text-[9px] font-mono text-slate-500 tracking-widest mt-1">
                CONSOLE
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          <NavLink href="/admin" icon={<LayoutDashboard size={16} />} label="Dashboard" />
          <NavLink href="/admin/providers" icon={<Boxes size={16} />} label="Providers" />
          <NavLink href="/admin/games" icon={<Gamepad2 size={16} />} label="Games" />
        </nav>

        <div className="p-3 border-t border-slate-800">
          <div className="px-3 py-2 text-[10px] font-mono text-slate-500 truncate">
            Signed in as <span className="text-slate-300">{session.username}</span>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={14} />
              Logout
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-x-auto">
        <div className="px-8 py-8 max-w-[1400px] mx-auto">{children}</div>
      </main>
    </div>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
    >
      {icon}
      <span className="font-bold uppercase text-[11px] tracking-widest">{label}</span>
    </Link>
  );
}
