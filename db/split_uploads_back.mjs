/**
 * Pindahkan file dari public/uploads/ ke struktur baru:
 * - provider logos → public/images/provider/
 * - game images   → public/images/games/
 *
 * Sumber kebenaran: DB column provider.logo + game.gambar. File yang tidak
 * direferensikan DB di-skip (orphan, biarkan di uploads/ untuk dicek manual).
 */
import mysql from "mysql2/promise";
import { mkdir, rename, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const UPLOAD_DIR = path.join(PUBLIC_DIR, "uploads");
const PROVIDER_DIR = path.join(PUBLIC_DIR, "images", "provider");
const GAMES_DIR = path.join(PUBLIC_DIR, "images", "games");

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function moveIfExists(filename, destDir, label, counters) {
  const src = path.join(UPLOAD_DIR, filename);
  const dst = path.join(destDir, filename);
  if (await exists(src)) {
    await rename(src, dst);
    counters.ok++;
  } else if (await exists(dst)) {
    counters.alreadyMoved++;
  } else {
    counters.missing++;
    console.warn(`[${label} missing] ${filename}`);
  }
}

async function main() {
  await mkdir(PROVIDER_DIR, { recursive: true });
  await mkdir(GAMES_DIR, { recursive: true });

  const conn = await mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "rtp_app",
  });

  // 1. Provider logos
  const [providers] = await conn.execute("SELECT id, logo FROM provider");
  const pCount = { ok: 0, alreadyMoved: 0, missing: 0 };
  for (const p of providers) {
    await moveIfExists(p.logo, PROVIDER_DIR, "logo", pCount);
  }
  console.log(`Provider: ${pCount.ok} moved, ${pCount.alreadyMoved} already, ${pCount.missing} missing`);

  // 2. Game images
  const [games] = await conn.execute("SELECT id, gambar FROM game");
  const gCount = { ok: 0, alreadyMoved: 0, missing: 0 };
  for (const g of games) {
    await moveIfExists(g.gambar, GAMES_DIR, "game", gCount);
  }
  console.log(`Game: ${gCount.ok} moved, ${gCount.alreadyMoved} already, ${gCount.missing} missing`);

  await conn.end();
  console.log("Split done. Check public/uploads/ for any orphan files before deleting.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
