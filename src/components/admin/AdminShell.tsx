"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function AdminShell({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  const [minimized, setMinimized] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-200">
      <AdminSidebar isMinimized={minimized} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader
          username={username}
          isMinimized={minimized}
          onToggle={() => setMinimized((v) => !v)}
        />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
