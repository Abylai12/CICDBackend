import { Knex } from "knex";
import dotenv from "dotenv";
dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || "your_user",
      password: process.env.DB_PASSWORD || "your_password",
      database: process.env.DB_NAME || "your_dbname",
    },
    pool: { min: 2, max: 10 },
    migrations: {
      directory: "./src/migrations",
      extension: "ts",
      tableName: "knex_migrations",
    },
  },

  staging: {
    client: "pg",
    connection:
      process.env.DATABASE_URL ||
      "postgresql://your_user:your_password@localhost:5432/your_dbname",
    pool: { min: 2, max: 10 },
    migrations: {
      directory: "./migrations",
      extension: "ts",
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || "your_user",
      password: process.env.DB_PASSWORD || "your_password",
      database: process.env.DB_NAME || "your_dbname",
    },
    pool: { min: 2, max: 10 },
    migrations: {
      directory: "./dist/src/migrations",
      extension: "js",
      loadExtensions: [".js"],
      tableName: "knex_migrations",
    },
  },
};

export default config;
