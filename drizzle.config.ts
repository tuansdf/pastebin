import { ENV } from "@/.server/env.constant";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/server/entities/*.entity.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: ENV.DB_URL || "",
  },
});
