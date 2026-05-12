import "server-only";
import mysql, { Pool } from "mysql2/promise";

const globalForDb = globalThis as unknown as { __dbPool?: Pool };

export const db: Pool =
  globalForDb.__dbPool ??
  mysql.createPool({
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "rtp_app",
    connectionLimit: 10,
    waitForConnections: true,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__dbPool = db;
}
