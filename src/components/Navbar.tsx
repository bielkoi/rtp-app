// src/components/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Terminal, Menu, X, Activity } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Menangani efek blur saat scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? "bg-black/80 backdrop-blur-xl border-blue-500/30 py-3" 
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Logo & Terminal Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-blue-600 p-2 rounded-lg group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <Terminal size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-white leading-none">
              RTP<span className="text-blue-500">TERMINAL</span>
            </span>
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mt-1">
              v3.0.0-stable
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-bold text-slate-300 hover:text-blue-400 transition-colors uppercase tracking-widest">
            Dashboard
          </Link>
          <Link href="#" className="text-sm font-bold text-slate-300 hover:text-blue-400 transition-colors uppercase tracking-widest flex items-center gap-2">
            <Activity size={14} className="text-green-500" />
            Live Analytics
          </Link>
          <button className="bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-500 text-white px-5 py-2 rounded-xl text-xs font-black uppercase transition-all shadow-lg active:scale-95">
            Connect Account
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black/95 border-b border-blue-500/30 p-6 flex flex-col gap-4 animate-in slide-in-from-top md:hidden font-mono">
          <Link href="/" className="text-lg font-bold text-white border-b border-white/5 pb-2">HOME</Link>
          <Link href="#" className="text-lg font-bold text-white border-b border-white/5 pb-2">PROVIDERS</Link>
          <Link href="#" className="text-lg font-bold text-white border-b border-white/5 pb-2">LIVE STATS</Link>
          <button className="mt-4 bg-blue-600 text-white py-3 rounded-xl font-black uppercase">LOGIN TERMINAL</button>
        </div>
      )}
    </nav>
  );
}