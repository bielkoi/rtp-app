"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const AUTO_ADVANCE_MS = 5000;

interface Slide {
  filename: string;
}

interface Props {
  slides: Slide[];
}

export default function HeroBanner({ slides }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  if (slides.length === 0) return null;

  const current = `/images/slide/${slides[index].filename}`;

  return (
    <div
      className="relative w-full aspect-16/6 md:aspect-16/5 bg-black rounded-2xl overflow-hidden border border-red-600 shadow-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img
            src={current}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-60"
          />
          <img
            src={current}
            alt=""
            className="relative w-full h-full object-contain"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-3 left-0 right-0 z-10 flex items-center justify-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-red-500" : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
