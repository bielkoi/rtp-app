import mysql from "mysql2/promise";
import { mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const UPLOAD_DIR = path.join(PUBLIC_DIR, "uploads");

function slugFolder(name) {
  return name.toLowerCase().trim().replace(/\s+/g, "_").replace(/&/g, "_n_");
}

async function main() {
  await mkdir(UPLOAD_DIR, { recursive: true });

  const conn = await mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "rtp_app",
  });

  // 1. Provider logos
  const [providers] = await conn.execute("SELECT id, nama, logo FROM provider");
  let pOk = 0, pMiss = 0;
  for (const p of providers) {
    const src = path.join(PUBLIC_DIR, "images", "provider", p.logo);
    const dst = path.join(UPLOAD_DIR, p.logo);
    if (existsSync(src)) {
      await copyFile(src, dst);
      pOk++;
    } else if (existsSync(dst)) {
      // already moved
      pOk++;
    } else {
      console.warn(`[logo missing] ${src}`);
      pMiss++;
    }
  }
  console.log(`Provider logos: ${pOk} copied/exists, ${pMiss} missing`);

  // 2. Game images — copy with slug prefix
  const [games] = await conn.execute(`
    SELECT g.id, g.gambar, p.nama AS provider_nama
    FROM game g JOIN provider p ON p.id = g.id_provider
  `);

  let gOk = 0, gMiss = 0, gSkip = 0;
  const updates = []; // collect new filenames for batch UPDATE
  for (const g of games) {
    const slug = slugFolder(g.provider_nama);
    // Skip kalau gambar sudah punya prefix slug (idempotent)
    if (g.gambar.startsWith(slug + "_")) {
      gSkip++;
      continue;
    }
    const src = path.join(PUBLIC_DIR, "images", "games", slug, g.gambar);
    const newName = `${slug}_${g.gambar}`;
    const dst = path.join(UPLOAD_DIR, newName);
    if (existsSync(src)) {
      await copyFile(src, dst);
      gOk++;
      updates.push({ id: g.id, newName });
    } else if (existsSync(dst)) {
      gOk++;
      updates.push({ id: g.id, newName });
    } else {
      gMiss++;
    }
  }
  console.log(`Game images: ${gOk} copied/exists, ${gMiss} missing, ${gSkip} already migrated`);

  // 3. Batch UPDATE game.gambar pakai CASE WHEN. Untuk 4455 row, kirim batch.
  if (updates.length > 0) {
    const BATCH = 500;
    for (let i = 0; i < updates.length; i += BATCH) {
      const batch = updates.slice(i, i + BATCH);
      // bangun: UPDATE game SET gambar = CASE id WHEN x THEN 'name' ... END WHERE id IN (...)
      const whens = batch.map((u) => `WHEN ${u.id} THEN ${conn.escape(u.newName)}`).join(" ");
      const ids = batch.map((u) => u.id).join(",");
      await conn.query(
        `UPDATE game SET gambar = CASE id ${whens} END WHERE id IN (${ids})`
      );
    }
    console.log(`DB updated: ${updates.length} rows`);
  }

  await conn.end();
  console.log("Migration done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
