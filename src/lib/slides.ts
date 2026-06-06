import "server-only";
import type { RowDataPacket } from "mysql2/promise";
import { db } from "@/lib/db";

export interface SlideRow {
  id: number;
  filename: string;
  sort_order: number;
}

interface DbSlideRow extends RowDataPacket, SlideRow {}

export async function getSlides(): Promise<SlideRow[]> {
  const [rows] = await db.query<DbSlideRow[]>(
    "SELECT id, filename, sort_order FROM slide ORDER BY sort_order, id"
  );
  return rows.map((r) => ({
    id: r.id,
    filename: r.filename,
    sort_order: r.sort_order,
  }));
}
