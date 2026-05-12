import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login — RTP Terminal",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0f1016] text-slate-200 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-block bg-blue-600 p-3 rounded-xl shadow-[0_0_25px_rgba(37,99,235,0.4)] mb-4">
            <span className="text-white text-2xl font-black tracking-tighter">RTP</span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">
            Admin <span className="text-blue-500">Terminal</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono tracking-widest mt-2">
            AUTHORIZED ACCESS ONLY
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
