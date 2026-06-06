"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const SHOW_AFTER_PX = 400;

export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label="Kembali ke atas"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50 h-12 w-12 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-500 text-white shadow-[0_8px_24px_rgba(220,38,38,0.45)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
