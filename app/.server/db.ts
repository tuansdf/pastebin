import { ENV } from "@/.server/env.constant";
import { drizzle } from "drizzle-orm/better-sqlite3";

export const db = drizzle(ENV.DB_URL);
