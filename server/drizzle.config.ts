import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/entities/*.entity.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_URL || "",
  },
});
