import { ENV } from "@/.server/constants/env.constant";
import { drizzle } from "drizzle-orm/libsql";

export const db = drizzle({
  connection: {
    url: ENV.DB_URL,
  },
});
