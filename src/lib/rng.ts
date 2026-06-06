/**
 * Deterministic PRNG seeded by arbitrary keys.
 * Tiap parts dimixing via murmur3-style finalizer, lalu dipakai sebagai seed
 * mulberry32 — distribusi seragam dan chaotic untuk input yang mirip.
 */
export interface SeededRng {
  float(): number;
  int(min: number, max: number): number;
  pick<T>(arr: readonly T[]): T;
}

export function rngFor(...parts: (string | number)[]): SeededRng {
  const seed = mixKeys(parts);
  let state = seed >>> 0;

  const next = (): number => {
    state = (state + 0x6d2b79f5) | 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  return {
    float: next,
    int(min, max) {
      return Math.floor(next() * (max - min + 1)) + min;
    },
    pick(arr) {
      return arr[Math.floor(next() * arr.length)];
    },
  };
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

/**
 * Mix multiple key parts into one 32-bit seed using a murmur3-like finalizer.
 * Scatters bits aggressively → adjacent inputs (gameId 1 vs 2) produce
 * widely-separated seeds, sehingga RTP-nya tidak berdekatan.
 */
function mixKeys(parts: (string | number)[]): number {
  let h = 0x9e3779b9 | 0; // golden ratio constant
  for (const p of parts) {
    const v = typeof p === "number" ? p | 0 : hashString(p);
    h = (h ^ Math.imul(v, 0x9e3779b9)) | 0;
    h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
    h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
    h ^= h >>> 16;
  }
  return h >>> 0;
}
