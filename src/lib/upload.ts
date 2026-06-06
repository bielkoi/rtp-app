import "server-only";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export { slugFolder, slugBase } from "@/lib/slug";
import { slugBase } from "@/lib/slug";

const PUBLIC_DIR = path.join(process.cwd(), "public");
export const PROVIDER_SUBDIR = path.join("images", "provider");
export const GAMES_SUBDIR = path.join("images", "games");
export const BACKGROUND_SUBDIR = path.join("images", "background");
export const LOGO_SUBDIR = path.join("images", "logo");
export const SLIDE_SUBDIR = path.join("images", "slide");

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

const EXT_BY_MIME: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "image/gif": ".gif",
};

export interface ImagePreset {
  width: number;
  height: number;
  format?: "jpeg" | "png" | "webp";
  quality?: number;
}

export const PRESETS = {
  provider: { width: 600, height: 300 } satisfies ImagePreset,
  game: { width: 800, height: 533, format: "jpeg", quality: 85 } satisfies ImagePreset,
  background: { width: 2048, height: 1152, format: "webp", quality: 82 } satisfies ImagePreset,
  logo: { width: 600, height: 200 } satisfies ImagePreset,
  slide: { width: 1600, height: 900, format: "jpeg", quality: 85 } satisfies ImagePreset,
};

function safeJoinUnderPublic(...segments: string[]) {
  const target = path.resolve(PUBLIC_DIR, ...segments);
  const rel = path.relative(PUBLIC_DIR, target);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error("Resolved upload path escapes /public");
  }
  return target;
}

export async function resizeImage(input: Buffer, preset: ImagePreset): Promise<Buffer> {
  const pipeline = sharp(input).resize({
    width: preset.width,
    height: preset.height,
    fit: "inside",
    withoutEnlargement: true,
  });

  const quality = preset.quality ?? 82;
  if (preset.format === "jpeg") return pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
  if (preset.format === "webp") return pipeline.webp({ quality }).toBuffer();
  if (preset.format === "png") return pipeline.png({ compressionLevel: 9 }).toBuffer();
  return pipeline.toBuffer();
}

export function extensionFor(preset: ImagePreset, fallback: string): string {
  if (preset.format === "jpeg") return "jpg";
  if (preset.format === "webp") return "webp";
  if (preset.format === "png") return "png";
  return fallback;
}

export interface SavedFile {
  filename: string;
  publicPath: string;
}

/**
 * Save upload ke `public/<subdir>/`. Subdir harus PROVIDER_SUBDIR atau GAMES_SUBDIR.
 * Filename `${Date.now()}_${slug}.${ext}` — uniqueness via timestamp.
 */
export async function saveUpload(opts: {
  file: File;
  subdir: string;
  baseName: string;
  preset?: ImagePreset;
  allowedMimes?: string[];
}): Promise<SavedFile> {
  const { file, subdir, baseName, preset, allowedMimes } = opts;

  if (file.size > MAX_SIZE) {
    throw new Error("Ukuran file melebihi batas 2 MB.");
  }
  const mime = file.type;
  const allowed = allowedMimes ?? Object.keys(EXT_BY_MIME);
  if (!allowed.includes(mime)) {
    throw new Error(`Tipe file tidak didukung: ${mime || "unknown"}`);
  }
  const fallbackExt = EXT_BY_MIME[mime];
  if (!fallbackExt) {
    throw new Error(`MIME tidak dikenal: ${mime}`);
  }

  const rawBuffer = Buffer.from(await file.arrayBuffer());

  let outputBuffer: Buffer = rawBuffer;
  let ext = fallbackExt.replace(/^\./, "");
  if (preset && mime !== "image/svg+xml") {
    outputBuffer = await resizeImage(rawBuffer, preset);
    ext = extensionFor(preset, ext);
  }

  const filename = `${Date.now()}_${slugBase(baseName)}.${ext}`;
  const dir = safeJoinUnderPublic(subdir);
  const target = safeJoinUnderPublic(subdir, filename);

  await mkdir(dir, { recursive: true });
  await writeFile(target, outputBuffer);

  return {
    filename,
    publicPath: "/" + path.posix.join(...subdir.split(path.sep), filename),
  };
}

/**
 * Hapus file di `public/<subdir>/`. Path-traversal di-block.
 */
export async function deleteUploadedFile(
  subdir: string,
  filename: string | null | undefined
): Promise<void> {
  if (!filename) return;
  const clean = String(filename).trim();
  if (!clean || clean.includes("..") || clean.includes("/") || clean.includes("\\")) {
    return;
  }
  try {
    const target = safeJoinUnderPublic(subdir, clean);
    await unlink(target);
  } catch {
    // file may not exist — safe to ignore
  }
}
