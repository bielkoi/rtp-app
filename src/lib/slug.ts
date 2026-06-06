/**
 * Pure slug utilities — aman dipakai di server & client.
 * Tidak boleh import Node-only API di sini.
 */

export function slugFolder(providerName: string): string {
  return providerName.toLowerCase().trim().replace(/\s+/g, "_").replace(/&/g, "_n_");
}

export function slugBase(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
}
