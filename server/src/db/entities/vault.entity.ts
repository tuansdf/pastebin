import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const VaultTable = sqliteTable(
  "vault",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    publicId: text("public_id", { mode: "text", length: 128 }).unique(),
    content: text("content", { mode: "text", length: 100000 }),
    masterPassword: text("master_password", { mode: "text", length: 128 }),
    expiresAt: integer("expires_at", { mode: "number" }),
  },
  (table) => ({
    expiresAtIdx: index("vault_expires_at_idx").on(table.expiresAt),
  }),
);
