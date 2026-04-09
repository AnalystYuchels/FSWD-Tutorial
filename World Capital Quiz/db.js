import pg, { Connection } from "pg";

const { pool } = pg;

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejeectUnauthorized: false,
  },
});