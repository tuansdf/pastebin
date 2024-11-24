import { ENV } from "@/constants/env.constant.js";
import { drizzle } from "drizzle-orm/libsql";

export const db = drizzle(ENV.DB_URL);
