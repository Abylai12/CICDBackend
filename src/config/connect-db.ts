import postgres from "postgres";
import dotenv from "dotenv";
import db from "./knex";

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

if (!PGHOST || !PGDATABASE || !PGUSER || !PGPASSWORD) {
  throw new Error("Database environment variables are not set properly.");
}

export const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
});

export const connectDB = async () => {
  try {
    const result = await db.migrate.latest();
    console.log("Knex migrations ran successfully");
    console.log("Connection successful:", result);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};
