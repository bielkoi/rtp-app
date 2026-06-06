export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-10 border-t border-slate-800 pt-5 pb-2">
      <p className="text-center text-[10px] font-mono uppercase tracking-widest text-slate-500">
        © {year} KOIGRUP · RTP SLOT · [BIEL]
      </p>
    </footer>
  );
}
