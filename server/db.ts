import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// For development, use a mock database if DATABASE_URL is not set
if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not set, using mock database for development");
  // Create a mock database object
  export const db = {
    select: () => ({ from: () => ({ where: () => [] }) }),
    insert: () => ({ values: () => ({ returning: () => [] }) }),
    update: () => ({ set: () => ({ where: () => [] }) }),
    delete: () => ({ where: () => [] }),
  } as any;
  export const pool = null;
} else {
  export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  export const db = drizzle({ client: pool, schema });
}