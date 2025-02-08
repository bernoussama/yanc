import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export interface Env {
  DB: D1Database;
}

export const db = drizzle(process.env.DATABASE as unknown as D1Database, {
  schema,
  logger: true,
});
