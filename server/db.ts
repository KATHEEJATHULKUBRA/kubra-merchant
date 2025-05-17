// import { Pool, neonConfig } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-serverless';
// import ws from "ws";
// import * as schema from "@shared/schema";

// neonConfig.webSocketConstructor = ws;

// if (!process.env.DATABASE_URL) {
//   throw new Error(
//     "DATABASE_URL must be set. Did you forget to provision a database?",
//   );
// }

// export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// export const db = drizzle({ client: pool, schema });

import { drizzle, PostgresJsDatabase } from 'drizzle-orm/neon-http';
import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import * as schema from '@shared/schema';
import 'dotenv/config';

// ✅ Extend globalThis with proper types
declare global {
  var _neonSql: NeonQueryFunction<any> | undefined;
  var _drizzleDb: PostgresJsDatabase<typeof schema> | undefined;
}
export { }; // important to make this file a module

// ✅ Ensure DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

// ✅ Use or initialize singleton Neon SQL client
const sql = globalThis._neonSql ?? neon(process.env.DATABASE_URL);
globalThis._neonSql = sql;

// ✅ Use or initialize singleton Drizzle DB instance
const db = globalThis._drizzleDb ?? drizzle(sql, { schema });
globalThis._drizzleDb = db;

export { db };
