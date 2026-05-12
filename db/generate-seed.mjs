import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(join(here, "..", "src", "data", "game.json"), "utf8"));

const sqlEscape = (s) => "'" + String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
const slug = (name) =>
  name.toLowerCase().trim().replace(/\s+/g, "_").replace(/&/g, "_n_");

const lines = [];
lines.push("USE rtp_app;");
lines.push("SET NAMES utf8mb4;");
lines.push("SET FOREIGN_KEY_CHECKS = 0;");
lines.push("TRUNCATE TABLE game;");
lines.push("TRUNCATE TABLE provider;");
lines.push("SET FOREIGN_KEY_CHECKS = 1;");
lines.push("");

const providers = Object.keys(data);
lines.push("INSERT INTO provider (id, nama, logo) VALUES");
lines.push(
  providers
    .map((p, i) => `  (${i + 1}, ${sqlEscape(p)}, ${sqlEscape(slug(p) + ".svg")})`)
    .join(",\n") + ";"
);
lines.push("");

const gameRows = [];
providers.forEach((p, i) => {
  const pid = i + 1;
  for (const g of data[p]) {
    gameRows.push(`  (${pid}, ${sqlEscape(g.name)}, ${sqlEscape(g.image)})`);
  }
});

const CHUNK = 500;
for (let i = 0; i < gameRows.length; i += CHUNK) {
  lines.push("INSERT INTO game (id_provider, nama, gambar) VALUES");
  lines.push(gameRows.slice(i, i + CHUNK).join(",\n") + ";");
  lines.push("");
}

writeFileSync(join(here, "seed.sql"), lines.join("\n"), "utf8");
console.log(`wrote seed.sql: ${providers.length} providers, ${gameRows.length} games`);
