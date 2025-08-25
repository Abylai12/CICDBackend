import knex from "knex";
import knexConfig from "../../knexfile";
import dotenv from "dotenv";

dotenv.config();

console.log("node env", process.env.NODE_ENV);

const environment = process.env.NODE_ENV || "development";
const config = knexConfig[environment];

console.log("config", config);

if (!config) {
  throw new Error(
    `Knex configuration for environment "${environment}" is not defined.`
  );
}

const db = knex(config);

export default db;
