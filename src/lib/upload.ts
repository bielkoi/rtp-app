import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

const EXT_BY_MIME: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "image/gif": ".gif",
};

export function slugFolder(providerName: string) {
  return providerName.toLowerCase().trim().replace(/\s+/g, "_").replace(/&/g, "_n_");
}

export function slugBase(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
}

function safeJoinUnderPublic(...segments: string[]) {
  const target = path.resolve(PUBLIC_DIR, ...segments);
  const rel = path.relative(PUBLIC_DIR, target);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error("Resolved upload path escapes /public");
  }
  return target;
}

export interface SavedFile {
  filename: string;
  publicPath: string;
}

export async function saveUpload(opts: {
  file: File;
  subdir: string;
  baseName: string;
  allowedMimes?: string[];
}): Promise<SavedFile> {
  const { file, subdir, baseName, allowedMimes } = opts;

  if (file.size > MAX_SIZE) {
    throw new Error(`Ukuran file melebihi batas 2 MB.`);
  }
  const mime = file.type;
  const allowed = allowedMimes ?? Object.keys(EXT_BY_MIME);
  if (!allowed.includes(mime)) {
    throw new Error(`Tipe file tidak didukung: ${mime || "unknown"}`);
  }
  const ext = EXT_BY_MIME[mime];
  if (!ext) {
    throw new Error(`MIME tidak dikenal: ${mime}`);
  }

  const filename = `${slugBase(baseName)}${ext}`;
  const dir = safeJoinUnderPublic(subdir);
  const target = safeJoinUnderPublic(subdir, filename);

  await mkdir(dir, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(target, buf);

  return {
    filename,
    publicPath: "/" + path.posix.join(...subdir.split(path.sep), filename),
  };
}
